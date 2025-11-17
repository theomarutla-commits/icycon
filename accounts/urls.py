from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('social/dashboard/', views.social_dashboard, name='social_dashboard'),
    path('api/social-profiles/', views.social_profiles_api, name='social_profiles_api'),
    path('api/social-posts/', views.social_posts_api, name='social_posts_api'),
    path('profile/', views.profile_view, name='profile'),
]
