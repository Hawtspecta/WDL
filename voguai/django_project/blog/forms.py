from django import forms
from django.contrib.auth.models import User
from .models import Post, Comment, Newsletter, Tag


class PostForm(forms.ModelForm):
    """Form for creating and editing blog posts"""
    
    tags = forms.ModelMultipleChoiceField(
        queryset=Tag.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
        help_text="Select tags that describe your post"
    )
    
    new_tags = forms.CharField(
        max_length=200,
        required=False,
        help_text="Enter new tags separated by commas",
        widget=forms.TextInput(attrs={
            'placeholder': 'e.g., fashion, trends, summer'
        })
    )
    
    class Meta:
        model = Post
        fields = [
            'title', 'slug', 'content', 'excerpt', 'category', 
            'image', 'status', 'featured', 'read_time'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter post title'
            }),
            'slug': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'URL-friendly version of title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 15,
                'placeholder': 'Write your post content here...'
            }),
            'excerpt': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Brief description of your post (max 300 characters)'
            }),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
            'featured': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'read_time': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 60
            })
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['category'].queryset = self.fields['category'].queryset.order_by('name')
        
        # Make slug field optional (it will be auto-generated)
        self.fields['slug'].required = False
        
        # Add help text for status field
        self.fields['status'].help_text = 'Draft: Not visible to public. Published: Visible to everyone.'
        
        # Add CSS classes to all fields
        for field_name, field in self.fields.items():
            if field_name not in ['tags', 'featured']:
                field.widget.attrs.update({'class': 'form-control'})
    
    def clean_slug(self):
        slug = self.cleaned_data.get('slug')
        title = self.cleaned_data.get('title')
        
        # Auto-generate slug from title if not provided
        if not slug and title:
            from django.utils.text import slugify
            slug = slugify(title)
        
        # Check for unique slug (exclude current post if editing)
        if slug:
            queryset = Post.objects.filter(slug=slug)
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            
            if queryset.exists():
                raise forms.ValidationError(
                    'A post with this slug already exists. Please choose a different slug.'
                )
        
        return slug
    
    def clean_read_time(self):
        read_time = self.cleaned_data.get('read_time')
        if read_time and read_time < 1:
            raise forms.ValidationError('Read time must be at least 1 minute.')
        if read_time and read_time > 60:
            raise forms.ValidationError('Read time cannot exceed 60 minutes.')
        return read_time
    
    def save(self, commit=True):
        post = super().save(commit=False)
        
        # Auto-generate excerpt if not provided
        if not post.excerpt and post.content:
            post.excerpt = post.content[:300] + '...' if len(post.content) > 300 else post.content
        
        if commit:
            post.save()
            
            # Handle tags
            post.tags.clear()
            
            # Add selected tags
            if self.cleaned_data.get('tags'):
                post.tags.add(*self.cleaned_data['tags'])
            
            # Create and add new tags
            new_tags = self.cleaned_data.get('new_tags', '')
            if new_tags:
                tag_names = [tag.strip() for tag in new_tags.split(',') if tag.strip()]
                for tag_name in tag_names:
                    tag, created = Tag.objects.get_or_create(
                        name=tag_name,
                        defaults={'slug': tag_name.lower().replace(' ', '-')}
                    )
                    post.tags.add(tag)
        
        return post


class CommentForm(forms.ModelForm):
    """Form for adding comments to blog posts"""
    
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Share your thoughts on this post...'
            })
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['content'].label = 'Your Comment'
    
    def clean_content(self):
        content = self.cleaned_data.get('content')
        if not content or not content.strip():
            raise forms.ValidationError('Comment cannot be empty.')
        if len(content) < 10:
            raise forms.ValidationError('Comment must be at least 10 characters long.')
        if len(content) > 1000:
            raise forms.ValidationError('Comment cannot exceed 1000 characters.')
        return content.strip()


class NewsletterForm(forms.ModelForm):
    """Form for newsletter subscription"""
    
    class Meta:
        model = Newsletter
        fields = ['email', 'name']
        widgets = {
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your email address'
            }),
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your name (optional)'
            })
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].required = False
        self.fields['name'].help_text = 'Optional: Help us personalize your newsletter experience'
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            # Check if email already exists
            if Newsletter.objects.filter(email=email).exists():
                newsletter = Newsletter.objects.get(email=email)
                if newsletter.is_active:
                    raise forms.ValidationError(
                        'This email is already subscribed to our newsletter.'
                    )
                else:
                    # Reactivate inactive subscription
                    newsletter.is_active = True
                    newsletter.save()
        return email
    
    def clean_name(self):
        name = self.cleaned_data.get('name')
        if name and len(name) < 2:
            raise forms.ValidationError('Name must be at least 2 characters long.')
        return name.strip() if name else ''


class PostSearchForm(forms.Form):
    """Form for searching blog posts"""
    
    query = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search posts...'
        })
    )
    
    category = forms.ModelChoiceField(
        queryset=Tag.objects.none(),
        required=False,
        empty_label="All Categories",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    
    tag = forms.ModelChoiceField(
        queryset=Tag.objects.none(),
        required=False,
        empty_label="All Tags",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from .models import Category
        
        self.fields['category'].queryset = Category.objects.all().order_by('name')
        self.fields['tag'].queryset = Tag.objects.all().order_by('name')


class UserRegistrationForm(forms.ModelForm):
    """Custom user registration form"""
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter password'
        })
    )
    
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm password'
        })
    )
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email'
        })
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Choose a username'
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'First name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Last name'
            })
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].help_text = 'Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('This username is already taken.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('This email is already registered.')
        return email
    
    def clean_password_confirm(self):
        password = self.cleaned_data.get('password')
        password_confirm = self.cleaned_data.get('password_confirm')
        
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Passwords do not match.')
        
        if password and len(password) < 8:
            raise forms.ValidationError('Password must be at least 8 characters long.')
        
        return password_confirm
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user


class ContactForm(forms.Form):
    """Contact form for getting in touch"""
    
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your name'
        })
    )
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your email'
        })
    )
    
    subject = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Subject'
        })
    )
    
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 5,
            'placeholder': 'Your message'
        })
    )
    
    def clean_name(self):
        name = self.cleaned_data.get('name')
        if len(name) < 2:
            raise forms.ValidationError('Name must be at least 2 characters long.')
        return name.strip()
    
    def clean_message(self):
        message = self.cleaned_data.get('message')
        if len(message) < 10:
            raise forms.ValidationError('Message must be at least 10 characters long.')
        return message.strip()
