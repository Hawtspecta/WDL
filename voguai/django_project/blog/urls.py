from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    # Blog post views
    path('', views.PostListView.as_view(), name='post_list'),
    path('post/<slug:slug>/', views.PostDetailView.as_view(), name='post_detail'),
    path('post/create/', views.PostCreateView.as_view(), name='post_create'),
    path('post/<slug:slug>/edit/', views.PostUpdateView.as_view(), name='post_update'),
    path('post/<slug:slug>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
    
    # Category views
    path('category/<slug:slug>/', views.CategoryPostListView.as_view(), name='category_posts'),
    
    # User-specific views
    path('my-posts/', views.my_posts, name='my_posts'),
    path('my-bookmarks/', views.my_bookmarks, name='my_bookmarks'),
    
    # Comment views
    path('post/<slug:slug>/comment/', views.add_comment, name='add_comment'),
    
    # Bookmark functionality
    path('post/<slug:slug>/bookmark/', views.toggle_bookmark, name='toggle_bookmark'),
    
    # Search
    path('search/', views.search_posts, name='search'),
    
    # Newsletter
    path('newsletter/subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
    
    # API endpoints for AJAX
    path('api/categories/', views.get_categories, name='get_categories'),
    path('api/tags/', views.get_tags, name='get_tags'),
]
