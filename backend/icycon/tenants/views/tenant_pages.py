from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from ..models import Tenant


class TenantListView(LoginRequiredMixin, TemplateView):
    """Show tenants in the UI.

    - Staff/superusers see all tenants.
    - Regular authenticated users see only their own tenant(s).
    """
    template_name = 'tenants.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user

        # Admin users (staff or superuser) see all tenants
        if user.is_staff or user.is_superuser:
            qs = Tenant.objects.select_related('owner').order_by('-created_at')
        else:
            # Regular users only see tenants they own
            qs = Tenant.objects.select_related('owner').filter(owner=user).order_by('-created_at')

        context['tenants'] = qs
        return context