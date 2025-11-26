from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .auth_views import SignupView, LoginView

router = DefaultRouter()
router.register(r'profile', views.UserProfileViewSet, basename='profile')
router.register(r'memberships', views.OrganizationMembershipViewSet, basename='membership')

urlpatterns = [
    # Authentication API endpoints
    path('api/auth/signup', SignupView.as_view(), name='signup'),
    path('api/auth/login', LoginView.as_view(), name='login'),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/profile/dashboard', views.profile_dashboard, name='profile_dashboard'),
    path('api/organization/', views.organization_index, name='organization_index'),
    path('api/organization/members/', views.organization_members_list, name='organization_members_global'),
    path('api/organization/settings/', views.organization_settings_global, name='organization_settings_global'),
    path('api/organization/<int:org_id>/', views.organization_detail, name='organization_detail'),
    path('api/organization/<int:org_id>/members/', views.organization_members, name='organization_members'),
    path('api/organization/<int:org_id>/settings/', views.organization_settings, name='organization_settings'),
]
