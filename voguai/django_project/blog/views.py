from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views.generic.edit import FormMixin
from django.urls import reverse_lazy, reverse
from django.http import JsonResponse, HttpResponseRedirect
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from .models import Post, Category, Comment, Tag, PostTag, Newsletter, Bookmark
from .forms import PostForm, CommentForm, NewsletterForm


class PostListView(ListView):
    """List view for blog posts"""
    model = Post
    template_name = 'blog/list.html'
    context_object_name = 'posts'
    paginate_by = 6
    
    def get_queryset(self):
        queryset = Post.objects.filter(
            status='published',
            is_published=True
        ).select_related('author', 'category')
        
        # Filter by category if specified
        category_slug = self.kwargs.get('slug')
        if category_slug:
            category = get_object_or_404(Category, slug=category_slug)
            queryset = queryset.filter(category=category)
            self.category = category
        else:
            self.category = None
        
        # Search functionality
        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(content__icontains=search_query) |
                Q(excerpt__icontains=search_query)
            )
        
        # Filter by tag if specified
        tag_slug = self.request.GET.get('tag')
        if tag_slug:
            tag = get_object_or_404(Tag, slug=tag_slug)
            queryset = queryset.filter(tags__slug=tag_slug)
            self.tag = tag
        else:
            self.tag = None
        
        return queryset.order_by('-featured', '-published_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all().annotate(
            post_count=Count('posts', filter=Q(posts__status='published', posts__is_published=True))
        )
        context['tags'] = Tag.objects.all().annotate(
            post_count=Count('posttag', filter=Q(posttag__post__status='published', posttag__post__is_published=True))
        )
        context['featured_posts'] = Post.objects.filter(
            status='published',
            is_published=True,
            featured=True
        ).select_related('author', 'category')[:3]
        
        if hasattr(self, 'category'):
            context['current_category'] = self.category
        if hasattr(self, 'tag'):
            context['current_tag'] = self.tag
        
        # Add search query to context
        search_query = self.request.GET.get('search')
        if search_query:
            context['search_query'] = search_query
        
        return context


class PostDetailView(FormMixin, DetailView):
    """Detail view for individual blog post"""
    model = Post
    template_name = 'blog/detail.html'
    context_object_name = 'post'
    form_class = CommentForm
    
    def get_object(self):
        obj = super().get_object()
        # Increment view count
        obj.increment_views()
        return obj
    
    def get_queryset(self):
        return Post.objects.filter(
            status='published',
            is_published=True
        ).select_related('author', 'category').prefetch_related('comments')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        context['comments'] = self.object.comments.filter(
            is_approved=True,
            parent=None
        ).select_related('author').prefetch_related('replies')
        context['related_posts'] = Post.objects.filter(
            category=self.object.category,
            status='published',
            is_published=True
        ).exclude(id=self.object.id)[:3]
        
        # Check if post is bookmarked by current user
        if self.request.user.is_authenticated:
            context['is_bookmarked'] = Bookmark.objects.filter(
                user=self.request.user,
                post=self.object
            ).exists()
        
        return context
    
    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
    
    def form_valid(self, form):
        comment = form.save(commit=False)
        comment.post = self.object
        comment.author = self.request.user
        comment.save()
        messages.success(self.request, 'Your comment has been added and is awaiting approval.')
        return redirect('blog:post_detail', slug=self.object.slug)


class PostCreateView(LoginRequiredMixin, CreateView):
    """Create view for new blog posts"""
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, 'Your post has been created successfully!')
        return super().form_valid(form)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Create New Post'
        context['action'] = 'Create'
        return context


class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    """Update view for existing blog posts"""
    model = Post
    form_class = PostForm
    template_name = 'blog/post_form.html'
    
    def form_valid(self, form):
        form.instance.updated_at = timezone.now()
        messages.success(self.request, 'Your post has been updated successfully!')
        return super().form_valid(form)
    
    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author or self.request.user.is_superuser
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Update Post'
        context['action'] = 'Update'
        return context


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    """Delete view for blog posts"""
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = reverse_lazy('blog:post_list')
    
    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author or self.request.user.is_superuser
    
    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Your post has been deleted successfully.')
        return super().delete(request, *args, **kwargs)


class CategoryPostListView(PostListView):
    """List view for posts in a specific category"""
    
    def get_queryset(self):
        category = get_object_or_404(Category, slug=self.kwargs['slug'])
        return Post.objects.filter(
            category=category,
            status='published',
            is_published=True
        ).select_related('author', 'category')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = get_object_or_404(Category, slug=self.kwargs['slug'])
        return context


@login_required
def toggle_bookmark(request, slug):
    """Toggle bookmark status for a post"""
    post = get_object_or_404(Post, slug=slug)
    bookmark, created = Bookmark.objects.get_or_create(
        user=request.user,
        post=post
    )
    
    if not created:
        bookmark.delete()
        is_bookmarked = False
        message = 'Post removed from bookmarks'
    else:
        is_bookmarked = True
        message = 'Post added to bookmarks'
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'is_bookmarked': is_bookmarked,
            'message': message
        })
    
    messages.success(request, message)
    return redirect('blog:post_detail', slug=slug)


@login_required
def my_posts(request):
    """View for logged-in user's posts"""
    posts = Post.objects.filter(
        author=request.user
    ).select_related('category').order_by('-created_at')
    
    paginator = Paginator(posts, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'blog/my_posts.html', {
        'page_obj': page_obj,
        'posts': page_obj,
        'title': 'My Posts',
        'total_posts': posts.count(),
        'published_posts': posts.filter(status='published').count(),
        'draft_posts': posts.filter(status='draft').count(),
        'is_paginated': page_obj.has_other_pages()
    })


@login_required
def my_bookmarks(request):
    """View for logged-in user's bookmarks"""
    bookmarks = Bookmark.objects.filter(
        user=request.user
    ).select_related('post', 'post__author', 'post__category').order_by('-created_at')
    
    paginator = Paginator(bookmarks, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'blog/my_bookmarks.html', {
        'page_obj': page_obj,
        'bookmarks': page_obj,
        'title': 'My Bookmarks',
        'total_bookmarks': bookmarks.count(),
        'recent_bookmarks': bookmarks.filter(created_at__gte=timezone.now() - timedelta(days=7)).count(),
        'is_paginated': page_obj.has_other_pages(),
        'categories': Category.objects.filter(post__bookmark__user=request.user).annotate(count=Count('post__bookmark'))
    })


def newsletter_subscribe(request):
    """Handle newsletter subscription"""
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            name = form.cleaned_data.get('name', '')
            
            newsletter, created = Newsletter.objects.get_or_create(
                email=email,
                defaults={'name': name}
            )
            
            if created:
                messages.success(request, 'Thank you for subscribing to our newsletter!')
            else:
                if not newsletter.is_active:
                    newsletter.is_active = True
                    newsletter.save()
                    messages.success(request, 'Your subscription has been reactivated!')
                else:
                    messages.info(request, 'You are already subscribed to our newsletter.')
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Subscription successful!'
                })
            
            return redirect(request.META.get('HTTP_REFERER', reverse('blog:post_list')))
    else:
        form = NewsletterForm()
    
    return render(request, 'blog/newsletter.html', {'form': form})


def search_posts(request):
    """Search posts"""
    query = request.GET.get('q', '')
    
    if query:
        posts = Post.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(excerpt__icontains=query),
            status='published',
            is_published=True
        ).select_related('author', 'category')
    else:
        posts = Post.objects.none()
    
    paginator = Paginator(posts, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'blog/search_results.html', {
        'posts': page_obj,
        'page_obj': page_obj,
        'query': query,
        'title': f'Search Results for "{query}"'
    })


@login_required
def add_comment(request, slug):
    """Add comment to a post"""
    post = get_object_or_404(Post, slug=slug)
    
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.author = request.user
            
            # Handle reply to existing comment
            parent_id = request.POST.get('parent_id')
            if parent_id:
                parent_comment = get_object_or_404(Comment, id=parent_id)
                comment.parent = parent_comment
            
            comment.save()
            messages.success(request, 'Your comment has been added successfully!')
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Comment added successfully!',
                    'comment_id': comment.id
                })
            
            return redirect('blog:post_detail', slug=slug)
    else:
        form = CommentForm()
    
    return render(request, 'blog/add_comment.html', {
        'form': form,
        'post': post
    })


# API Views for AJAX requests
def get_categories(request):
    """Get all categories as JSON"""
    categories = Category.objects.all().annotate(
        post_count=Count('posts', filter=Q(posts__status='published', posts__is_published=True))
    )
    data = [
        {
            'id': cat.id,
            'name': cat.name,
            'slug': cat.slug,
            'post_count': cat.post_count
        }
        for cat in categories
    ]
    return JsonResponse({'categories': data})


def get_tags(request):
    """Get all tags as JSON"""
    tags = Tag.objects.all().annotate(
        post_count=Count('posttag', filter=Q(posttag__post__status='published', posttag__post__is_published=True))
    )
    data = [
        {
            'id': tag.id,
            'name': tag.name,
            'slug': tag.slug,
            'post_count': tag.post_count
        }
        for tag in tags
    ]
    return JsonResponse({'tags': data})
