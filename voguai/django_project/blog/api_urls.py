from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'posts', api_views.PostViewSet)
router.register(r'categories', api_views.CategoryViewSet)
router.register(r'tags', api_views.TagViewSet)
router.register(r'comments', api_views.CommentViewSet)

# Wire up our API using automatic URL routing
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('token/', api_views.ObtainTokenView.as_view(), name='token_obtain_pair'),
]
