from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from .models import Tenant, TenantUser, Integration
from .serializers import (
    TenantSerializer,
    TenantUserSerializer,
    IntegrationSerializer,
    TenantCreateSerializer,
)


class TenantCreateAPIView(generics.CreateAPIView):
    """Public endpoint for creating a tenant and an associated owner user.

    This endpoint is intended for non-admin self-signup flows.
    """
    serializer_class = TenantCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()
        # Return the created tenant data (use TenantSerializer to include model fields)
        out = TenantSerializer(tenant, context={"request": request}).data
        return Response(out, status=status.HTTP_201_CREATED)


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]


class TenantUserViewSet(viewsets.ModelViewSet):
    queryset = TenantUser.objects.select_related('tenant', 'user')
    serializer_class = TenantUserSerializer
    permission_classes = [permissions.IsAuthenticated]


class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]
