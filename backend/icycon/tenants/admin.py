from django.contrib import admin
from django.utils.html import format_html
from .models import Tenant, TenantUser, Integration

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'plan', 'created_at', 'actions_buttons')
    list_filter = ('region', 'plan', 'created_at')
    search_fields = ('name', 'region')
    readonly_fields = ('created_at',)
    list_per_page = 20
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'region', 'plan'),
            'classes': ('wide',)
        }),
        ('Brand Settings', {
            'fields': ('brand_tone',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def actions_buttons(self, obj):
        return format_html(
            '<a class="button" href="/admin/tenants/tenant/{}/change/" '
            'style="background: #1a73e8; color: white; padding: 4px 8px; '
            'border-radius: 4px; text-decoration: none;">Edit</a> ',
            obj.id
        )
    actions_buttons.short_description = 'Actions'

@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'tenant', 'role')
    list_filter = ('tenant', 'role')
    search_fields = ('user__username', 'tenant__name')
    autocomplete_fields = ['user', 'tenant']

@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    list_display = ('get_name', 'tenant', 'type', 'connected_at')
    list_filter = ('type', 'tenant', 'connected_at')
    search_fields = ('tenant__name', 'type')
    autocomplete_fields = ['tenant']
    readonly_fields = ('connected_at',)

    def get_name(self, obj):
        return f"{obj.tenant.name} - {obj.type}"
    get_name.short_description = 'Integration Name'
