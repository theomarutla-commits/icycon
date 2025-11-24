from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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
