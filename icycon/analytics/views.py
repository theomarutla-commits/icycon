from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Site, KeywordCluster, ContentItem, FAQ, PageView
from tenants.models import Tenant, TenantUser

class SiteViewSet(viewsets.ModelViewSet):
    serializer_class = None  # TODO: Move serializers
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Site.objects.filter(tenant_id__in=tenant_ids)

    @csrf_exempt
    @action(detail=True, methods=["post"])
    def submit_sitemap(self, request, pk=None):
        site = self.get_object()
        return Response({"message": "[DRY RUN] Sitemap submission simulated (no task executed)"})

    @action(detail=True, methods=["post"])
    def audit(self, request, pk=None):
        site = self.get_object()
        return Response({"message": "[DRY RUN] CWV audit simulated (no task executed)"})

class KeywordClusterViewSet(viewsets.ModelViewSet):
    serializer_class = None  # TODO: Move serializers
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return KeywordCluster.objects.filter(tenant_id__in=tenant_ids)

class ContentItemViewSet(viewsets.ModelViewSet):
    serializer_class = None  # TODO: Move serializers
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return ContentItem.objects.filter(tenant_id__in=tenant_ids)

class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = None  # TODO: Move serializers
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return FAQ.objects.filter(tenant_id__in=tenant_ids)

@login_required
def dashboard(request):
    """Combined SEO and Analytics dashboard."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')

    sites = Site.objects.filter(tenant=tenant)
    metrics = {
        'site_count': sites.count(),
        'keyword_clusters': KeywordCluster.objects.filter(tenant=tenant).count(),
        'content_items': ContentItem.objects.filter(tenant=tenant).count(),
        'total_pageviews': PageView.objects.filter(site__tenant=tenant).count(),
    }
    return render(request, 'analytics/dashboard.html', {
        'tenant': tenant,
        'sites': sites,
        'metrics': metrics,
    })

@login_required
def site_list(request):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')
    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'analytics/sites.html', {'tenant': tenant, 'sites': sites})

@login_required
def site_detail(request, site_id):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')

    site = get_object_or_404(Site, id=site_id, tenant=tenant)
    keyword_clusters = KeywordCluster.objects.filter(tenant=tenant)
    content_items = ContentItem.objects.filter(tenant=tenant)
    faqs = FAQ.objects.filter(tenant=tenant)
    
    # Add analytics data
    pageviews = PageView.objects.filter(site=site).order_by('-timestamp')[:100]
    
    return render(request, 'analytics/site_detail.html', {
        'tenant': tenant,
        'site': site,
        'keyword_clusters': keyword_clusters,
        'content_items': content_items,
        'faqs': faqs,
        'pageviews': pageviews,
    })

@login_required
def site_create(request):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')

    if request.method == 'POST':
        domain = request.POST.get('domain', '').strip()
        sitemaps_url = request.POST.get('sitemaps_url', '').strip()
        default_locale = request.POST.get('default_locale', 'en').strip()
        robots_txt = request.POST.get('robots_txt', '').strip()

        errors = {}
        if not domain:
            errors['domain'] = 'Domain/URL is required.'

        if errors:
            return render(request, 'analytics/site_form.html', {
                'tenant': tenant,
                'errors': errors,
                'form': request.POST,
                'is_edit': False
            })

        site = Site.objects.create(
            tenant=tenant,
            domain=domain,
            sitemaps_url=sitemaps_url,
            default_locale=default_locale or 'en',
            robots_txt=robots_txt,
        )
        return redirect('site_list')

    return render(request, 'analytics/site_form.html', {
        'tenant': tenant,
        'is_edit': False,
        'site': None,  # Add empty site for template
        'form': None   # Add empty form for template
    })

@login_required
def site_edit(request, site_id):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')

    site = get_object_or_404(Site, id=site_id, tenant=tenant)

    if request.method == 'POST':
        domain = request.POST.get('domain', '').strip()
        sitemaps_url = request.POST.get('sitemaps_url', '').strip()
        default_locale = request.POST.get('default_locale', 'en').strip()
        robots_txt = request.POST.get('robots_txt', '').strip()

        errors = {}
        if not domain:
            errors['domain'] = 'Domain/URL is required.'

        if errors:
            return render(request, 'analytics/site_form.html', {
                'tenant': tenant,
                'errors': errors,
                'form': request.POST,
                'is_edit': True,
                'site': site
            })

        site.domain = domain
        site.sitemaps_url = sitemaps_url
        site.default_locale = default_locale or 'en'
        site.robots_txt = robots_txt
        site.save()
        return redirect('site_list')

    return render(request, 'analytics/site_form.html', {
        'tenant': tenant,
        'is_edit': True,
        'site': site
    })


@login_required
def keyword_clusters(request):
    """Analytics Keyword Clusters view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')
    
    keyword_clusters = KeywordCluster.objects.filter(tenant=tenant)
    return render(request, 'analytics/keyword_clusters.html', {
        'tenant': tenant,
        'keyword_clusters': keyword_clusters
    })


@login_required
def content_items(request):
    """Analytics Content Items view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')
    
    content_items = ContentItem.objects.filter(tenant=tenant)
    return render(request, 'analytics/content_items.html', {
        'tenant': tenant,
        'content_items': content_items
    })


@login_required
def faqs(request):
    """Analytics FAQs view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'analytics/no_tenant.html')
    
    faq_items = FAQ.objects.filter(tenant=tenant)
    return render(request, 'analytics/faqs.html', {
        'tenant': tenant,
        'faqs': faq_items
    })
