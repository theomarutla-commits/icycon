from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Tenant, TenantUser, Integration
try:
    # Import notification helper (optional; failures shouldn't break tenant creation)
    from email_engine.services.notifications import send_account_created_notifications
except Exception:
    send_account_created_notifications = None

class TenantCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Tenant
        fields = ['name', 'region', 'brand_tone', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'brand_tone': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')

        # Create the tenant
        tenant = Tenant.objects.create(**validated_data)

        # Create the user
        User = get_user_model()
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Create the tenant user relationship with owner role
        TenantUser.objects.create(
            user=user,
            tenant=tenant,
            role='owner'
        )

        # Trigger notification emails (best-effort)
        try:
            if send_account_created_notifications:
                send_account_created_notifications(tenant, user)
        except Exception:
            # Don't prevent tenant creation if notification fails
            pass

        return tenant

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUser
        fields = '__all__'

class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = '__all__'
