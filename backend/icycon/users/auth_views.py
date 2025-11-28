from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from tenants.models import Tenant, TenantUser
from .auth_serializers import SignupSerializer, LoginSerializer


class SignupView(generics.CreateAPIView):
    """
    User signup endpoint.
    
    POST /api/auth/signup
    {
        "email": "user@example.com",
        "username": "username",
        "password": "password",
        "password_confirm": "password"
    }
    
    Returns:
    {
        "email": "user@example.com",
        "username": "username",
        "token": "token-string"
    }
    """
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Ensure the user has a default tenant/workspace
        tenant = Tenant.objects.create(
            name=f"{user.username}'s Workspace" if user.username else "Workspace",
            region="US",
            plan="free",
        )
        TenantUser.objects.create(user=user, tenant=tenant, role="owner")

        # Send a welcome email; if misconfigured, surface the error so it can be fixed.
        subject = f"Welcome to {getattr(settings, 'SITE_NAME', 'Icycon')}!"
        body = (
            f"Hi {user.username},\n\n"
            f"Welcome to {getattr(settings, 'SITE_NAME', 'Icycon')}! "
            "Your account has been created successfully.\n\n"
            "You can now log in and start exploring the platform.\n"
        )
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
        return user


class LoginView(generics.GenericAPIView):
    """
    User login endpoint.
    
    POST /api/auth/login
    {
        "email": "user@example.com",
        "password": "password"
    }
    
    Returns:
    {
        "token": "token-string",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "username": "username",
            "first_name": "First",
            "last_name": "Last"
        }
    }
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
