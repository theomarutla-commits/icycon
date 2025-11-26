from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'social-accounts', views.SocialAccountViewSet, basename='social-account')
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'engagements', views.EngagementViewSet, basename='engagement')
router.register(r'conversations', views.ConversationViewSet, basename='conversation')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # UI Endpoints - Social channels for org promotion
    path('channels/', views.social_channels_view, name='channels'),
    
    # UI Endpoints - Posts/Content management
    path('posts/', views.social_posts_view, name='posts_list'),
    path('posts/create/', views.create_post_view, name='create_post'),
    
    # UI Endpoints - Conversations/Messaging for communication
    path('conversations/', views.conversations_view, name='conversations'),
    path('conversations/<int:conversation_id>/', views.conversation_detail_view, name='conversation_detail'),
    path('conversations/<int:conversation_id>/send/', views.send_message_view, name='send_message'),
]