from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TenantViewSet,
    TenantUserViewSet,
    IntegrationViewSet,
    TenantCreateAPIView,
)

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'tenant-users', TenantUserViewSet)
router.register(r'integrations', IntegrationViewSet)

urlpatterns = [
    path('create/', TenantCreateAPIView.as_view(), name='tenant-create'), 
    path('', include(router.urls)),
]
