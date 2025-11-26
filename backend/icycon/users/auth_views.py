from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
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
        # Send a simple welcome email; failures are logged but do not block signup
        try:
            subject = f"Welcome to {getattr(settings, 'SITE_NAME', 'Icycon')}!"
            body = (
                f"Hi {user.username},\n\n"
                f"Welcome to {getattr(settings, 'SITE_NAME', 'Icycon')}! "
                "Your account has been created successfully.\n\n"
                "You can now log in and start exploring the API.\n"
            )
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)
        except Exception:
            # Don't interrupt signup if email sending fails
            pass
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
