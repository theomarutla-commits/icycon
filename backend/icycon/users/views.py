from django.contrib.auth import update_session_auth_hash, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserProfileSerializer, ChangePasswordSerializer, OrganizationMembershipSerializer
from .models import OrganizationMembership

User = get_user_model()

# API function views replacing templates
@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def profile_dashboard(request):
    """Return or update the authenticated user's profile and basic activity."""
    user = request.user
    if request.method == 'PATCH':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    activities = []  # Placeholder for future activity tracking
    data = UserProfileSerializer(user).data
    data.update({"activities": activities})
    return Response(data)

# API views
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own profile."""
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        """Override to ensure users can only access their own profile."""
        return self.request.user

    @action(detail=True, methods=['post'])
    def change_password(self, request):
        """Change user password endpoint."""
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'error': 'Wrong old password.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)  # Keep user logged in
            return Response({'message': 'Password updated successfully.'})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True)
    def organizations(self, request):
        """Get all organization memberships for the current user."""
        user = self.get_object()
        memberships = user.memberships.all()
        serializer = OrganizationMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join_organization(self, request):
        """Join an organization (requires invitation)."""
        user = self.get_object()
        organization_id = request.data.get('organization')
        organization = get_object_or_404(User, id=organization_id, organization_name__isnull=False)
        
        # Check if already a member
        if user.memberships.filter(organization=organization).exists():
            return Response(
                {"error": "Already a member of this organization"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create membership (viewer role by default)
        OrganizationMembership.objects.create(
            member=user,
            organization=organization,
            role="viewer"
        )
        
        return Response({"message": "Successfully joined organization"})

    @action(detail=True)
    def activity(self, request):
        """Get user's recent activity across all apps."""
        user = self.get_object()
        # Add activity tracking here when implemented
        return Response({
            'message': 'Activity tracking will be implemented in future release.'
        })


class OrganizationMembershipViewSet(viewsets.ModelViewSet):
    """Manage organization memberships via API."""
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Staff see everything
        if user.is_staff:
            return OrganizationMembership.objects.all()

        # If user is an organization (represents an org) and is owner/admin, show org members
        if getattr(user, 'organization_name', None) and getattr(user, 'organization_role', None) in ['owner', 'admin']:
            return user.member_memberships.all()

        # Otherwise, show memberships where the user is a member
        return user.memberships.all()

    def perform_create(self, serializer):
        org = serializer.validated_data.get('organization')
        if not getattr(org, 'organization_name', None):
            raise serializers.ValidationError({"organization": "Selected user is not an organization"})
        serializer.save()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_index(request):
    """List organizations related to the current user."""
    user = request.user
    if getattr(user, 'organization_name', None):
        orgs = [user]
    else:
        orgs = [m.organization for m in user.memberships.select_related('organization').all()]

    return Response({
        "organizations": [
            {"id": org.id, "name": getattr(org, "organization_name", None) or org.username}
            for org in orgs
        ]
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_detail(request, org_id):
    """Details for a single organization as JSON."""
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    allowed = request.user.is_staff or request.user == org or request.user.memberships.filter(organization=org).exists()
    if not allowed:
        return Response({'error': 'You do not have access to that organization.'}, status=status.HTTP_403_FORBIDDEN)

    members = OrganizationMembership.objects.filter(organization=org).select_related('member')
    return Response({
        'organization': {
            'id': org.id,
            'name': org.organization_name,
        },
        'members': [
            {'id': m.member.id, 'username': m.member.username, 'role': m.role}
            for m in members
        ]
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_members(request, org_id):
    """List members of a specific organization."""
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    allowed = request.user.is_staff or request.user == org or getattr(request.user, 'organization_role', None) in ['owner', 'admin'] or request.user.memberships.filter(organization=org).exists()
    if not allowed:
        return Response({'error': 'You do not have access to view members for this organization.'}, status=status.HTTP_403_FORBIDDEN)

    memberships = OrganizationMembership.objects.filter(organization=org).select_related('member')
    return Response({
        'organization': {'id': org.id, 'name': org.organization_name},
        'memberships': [
            {'id': m.id, 'member_id': m.member.id, 'member_username': m.member.username, 'role': m.role}
            for m in memberships
        ]
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_members_list(request):
    """Fallback members list (global) as JSON."""
    user = request.user
    if getattr(user, 'organization_name', None):
        target_id = user.id
    else:
        membership = user.memberships.first()
        target_id = membership.organization.id if membership else None

    if not target_id:
        return Response({'info': 'You are not a member of any organization yet.'}, status=status.HTTP_404_NOT_FOUND)
    return organization_members(request, target_id)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_settings(request, org_id):
    """Return basic settings metadata for an organization."""
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    allowed = request.user.is_staff or request.user == org or request.user.memberships.filter(organization=org, role__in=['owner','admin']).exists()
    if not allowed:
        return Response({'error': 'You do not have access to organization settings.'}, status=status.HTTP_403_FORBIDDEN)

    return Response({'organization': {'id': org.id, 'name': org.organization_name}, 'settings': {}})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_settings_global(request):
    """Return the first organization settings accessible to the current user."""
    user = request.user
    if getattr(user, 'organization_name', None):
        return organization_settings(request, user.id)
    membership = user.memberships.filter(role__in=['owner','admin']).first()
    if membership:
        return organization_settings(request, membership.organization.id)
    return Response({'info': 'No organization settings accessible.'}, status=status.HTTP_404_NOT_FOUND)
