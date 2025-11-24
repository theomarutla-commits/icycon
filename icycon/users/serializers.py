from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import OrganizationMembership

User = get_user_model()

class OrganizationMembershipSerializer(serializers.ModelSerializer):
    member_username = serializers.CharField(source='member.username', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    organization_name = serializers.CharField(source='organization.organization_name', read_only=True)

    class Meta:
        model = OrganizationMembership
        fields = (
            'id', 'member', 'member_username', 'member_email',
            'organization', 'organization_name', 'role', 'joined_at'
        )
        read_only_fields = ('joined_at',)

class UserProfileSerializer(serializers.ModelSerializer):
    organization_memberships = OrganizationMembershipSerializer(source='memberships', many=True, read_only=True)
    organization_members = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 
            'full_name', 'organization_name', 'region', 'plan', 
            'brand_tone', 'organization_role', 'organization_created_at',
            'organization_memberships', 'organization_members', 'is_staff'
        ]
        read_only_fields = ['id', 'username', 'is_staff', 'organization_created_at']

    def get_organization_members(self, obj):
        if not obj.organization_name:
            return []
        return OrganizationMembershipSerializer(
            obj.member_memberships.all(),
            many=True
        ).data

    def get_full_name(self, obj):
        return obj.get_full_name()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match.")
        return data