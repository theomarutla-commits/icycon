from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.reverse import reverse
from icycon.api_views import FEATURES_INDEX

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for user registration/signup."""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    features = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'features']

    def validate(self, data):
        """Validate that passwords match."""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        """Create a new user with the given credentials."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        return user

    def get_features(self, obj):
        request = self.context.get('request')
        base = request.build_absolute_uri("/") if request else ""
        return [
            {
                "key": item["key"],
                "name": item["name"],
                "description": item["description"],
                "endpoint": base.rstrip("/") + item["path"],
            }
            for item in FEATURES_INDEX
        ]


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    features_url = serializers.SerializerMethodField(read_only=True)
    features = serializers.SerializerMethodField(read_only=True)

    def validate(self, data):
        """Authenticate the user."""
        email = data.get('email') or ''
        password = data.get('password') or ''

        # Get user by email; fall back gracefully if multiple or missing
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({'email': 'Invalid email or password.'})

        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Invalid email or password.'})

        data['user'] = user
        return data

    def get_user(self, obj):
        """Return user info."""
        user = obj.get('user')
        if user:
            avatar_url = user.avatar.url if getattr(user, 'avatar', None) else None
            return {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'avatar': avatar_url,
            }
        return None

    def get_features_url(self, obj):
        """Expose the endpoint that lists all available features/data."""
        request = self.context.get('request')
        try:
            return reverse('feature-index', request=request)
        except Exception:
            return '/api/features/'

    def get_features(self, obj):
        request = self.context.get('request')
        base = request.build_absolute_uri("/") if request else ""
        return [
            {
                "key": item["key"],
                "name": item["name"],
                "description": item["description"],
                "endpoint": base.rstrip("/") + item["path"],
            }
            for item in FEATURES_INDEX
        ]
