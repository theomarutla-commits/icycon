from rest_framework import permissions


class IsTenantAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        tenant_user = obj.tenantuser_set.filter(user=request.user).first()
        return tenant_user and tenant_user.role in ['owner', 'admin']
