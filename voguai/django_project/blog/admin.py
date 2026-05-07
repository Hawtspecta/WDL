from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Category, Post, Comment, Tag, PostTag, Newsletter, BlogAnalytics, Bookmark


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Number of Posts'


class PostTagInline(admin.TabularInline):
    model = PostTag
    extra = 1
    verbose_name = 'Tag'
    verbose_name_plural = 'Tags'


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'is_published', 'featured', 'views', 'created_at']
    list_filter = ['status', 'is_published', 'featured', 'category', 'created_at', 'author']
    search_fields = ['title', 'content', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'published_at', 'views']
    filter_horizontal = []
    inlines = [PostTagInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'author', 'category')
        }),
        ('Content', {
            'fields': ('content', 'excerpt', 'image')
        }),
        ('Publication', {
            'fields': ('status', 'is_published', 'featured', 'published_at')
        }),
        ('Metadata', {
            'fields': ('read_time', 'views'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['make_published', 'make_draft', 'toggle_featured']
    
    def make_published(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='published', is_published=True, published_at=timezone.now())
        self.message_user(request, f'{updated} posts marked as published.')
    make_published.short_description = 'Mark selected posts as published'
    
    def make_draft(self, request, queryset):
        updated = queryset.update(status='draft', is_published=False)
        self.message_user(request, f'{updated} posts marked as draft.')
    make_draft.short_description = 'Mark selected posts as draft'
    
    def toggle_featured(self, request, queryset):
        for post in queryset:
            post.featured = not post.featured
            post.save()
        self.message_user(request, 'Featured status toggled for selected posts.')
    toggle_featured.short_description = 'Toggle featured status'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('author', 'category')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'content_preview', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at', 'post']
    search_fields = ['content', 'author__username', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_comments', 'disapprove_comments']
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comments approved.')
    approve_comments.short_description = 'Approve selected comments'
    
    def disapprove_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} comments disapproved.')
    disapprove_comments.short_description = 'Disapprove selected comments'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('post', 'author')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    def post_count(self, obj):
        count = PostTag.objects.filter(tag=obj).count()
        url = reverse('admin:blog_post_changelist') + f'?tag__id__exact={obj.id}'
        return format_html('<a href="{}">{}</a>', url, count)
    post_count.short_description = 'Number of Posts'


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['email', 'name']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['activate_subscribers', 'deactivate_subscribers']
    
    def activate_subscribers(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} subscribers activated.')
    activate_subscribers.short_description = 'Activate selected subscribers'
    
    def deactivate_subscribers(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} subscribers deactivated.')
    deactivate_subscribers.short_description = 'Deactivate selected subscribers'


@admin.register(BlogAnalytics)
class BlogAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['post', 'date', 'views', 'unique_visitors', 'shares', 'comments_count']
    list_filter = ['date', 'post__category']
    search_fields = ['post__title']
    readonly_fields = ['post', 'date']
    date_hierarchy = 'date'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('post')


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at', 'post__category']
    search_fields = ['user__username', 'post__title']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'post')


# Customize admin site header and title
admin.site.site_header = "VogueAI Blog Administration"
admin.site.site_title = "VogueAI Admin"
admin.site.index_title = "Welcome to VogueAI Blog Administration"
