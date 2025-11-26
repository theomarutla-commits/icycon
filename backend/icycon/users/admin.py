from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User, OrganizationMembership

class OrganizationMembershipInline(admin.TabularInline):
    model = OrganizationMembership
    fk_name = 'member'
    extra = 1

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'organization_name', 'region', 'plan', 'is_staff', 'organization_role')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'region', 'plan', 'organization_role')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'organization_name')
    ordering = ('username',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Organization info', {
            'fields': (
                'organization_name', 
                'region', 
                'plan', 
                'brand_tone',
                'organization_role',
                'organization_created_at'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'password1', 'password2', 'email',
                'organization_name', 'region', 'plan', 'organization_role'
            ),
        }),
    )

    inlines = [OrganizationMembershipInline]

    def organization_link(self, obj):
        if obj.organization_name:
            return format_html(
                '<a href="/admin/users/user/{}/change/">{}</a>',
                obj.id,
                obj.organization_name
            )
        return '-'
    organization_link.short_description = 'Organization'

@admin.register(OrganizationMembership)
class OrganizationMembershipAdmin(admin.ModelAdmin):
    list_display = ('member', 'organization', 'role', 'joined_at')
    list_filter = ('role', 'joined_at')
    search_fields = ('member__username', 'organization__organization_name')
    raw_id_fields = ('member', 'organization')