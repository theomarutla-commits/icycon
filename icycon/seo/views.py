from django.shortcuts import redirect, render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

# Create your views here.
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Site, KeywordCluster, ContentItem, FAQ
from .serializers import SiteSerializer, KeywordClusterSerializer, ContentItemSerializer, FAQSerializer
from tenants.models import Tenant, TenantUser

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()  # Base queryset, will be filtered in get_queryset
    serializer_class = SiteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['domain']

    def get_queryset(self):
        """Get sites for the user's primary tenant."""
        tenant = Tenant.objects.filter(tenantuser__user=self.request.user).first()
        if not tenant:
            return Site.objects.none()
        return Site.objects.filter(tenant=tenant)

    @csrf_exempt
    @action(detail=True, methods=["post"])
    def submit_sitemap(self, request, pk=None):
        site = self.get_object()
        # DRY RUN: No task, just dummy response
        return Response({"message": "[DRY RUN] Sitemap submission simulated (no task executed)"})

    @action(detail=True, methods=["post"])
    def audit(self, request, pk=None):
        site = self.get_object()
        # DRY RUN: No task, just dummy response
        return Response({"message": "[DRY RUN] CWV audit simulated (no task executed)"})


class KeywordClusterViewSet(viewsets.ModelViewSet):
    queryset = KeywordCluster.objects.all()  # Base queryset, will be filtered in get_queryset
    serializer_class = KeywordClusterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['intent', 'terms']

    def get_queryset(self):
        """Get keyword clusters for the user's primary tenant."""
        tenant = Tenant.objects.filter(tenantuser__user=self.request.user).first()
        if not tenant:
            return KeywordCluster.objects.none()
        return KeywordCluster.objects.filter(tenant=tenant)


class ContentItemViewSet(viewsets.ModelViewSet):
    queryset = ContentItem.objects.all()  # Base queryset, will be filtered in get_queryset
    serializer_class = ContentItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['url', 'type', 'status']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """Get content items for the user's primary tenant."""
        tenant = Tenant.objects.filter(tenantuser__user=self.request.user).first()
        if not tenant:
            return ContentItem.objects.none()
        return ContentItem.objects.filter(tenant=tenant)


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()  # Base queryset, will be filtered in get_queryset
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['question', 'answer']

    def get_queryset(self):
        """Get FAQs for the user's primary tenant."""
        tenant = Tenant.objects.filter(tenantuser__user=self.request.user).first()
        if not tenant:
            return FAQ.objects.none()
        return FAQ.objects.filter(tenant=tenant)


# Server-rendered tenant-facing SEO pages
@login_required
def seo_dashboard(request):
    """Tenant-scoped SEO dashboard (server-rendered).

    Picks the first tenant the user belongs to and displays basic site
    statistics and quick actions.
    """
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    sites = Site.objects.filter(tenant=tenant)
    # Simple metrics for the dashboard (can be expanded later)
    metrics = {
        'site_count': sites.count(),
        # Models are tenant-scoped (no direct FK to Site in this schema), count by tenant
        'keyword_clusters': KeywordCluster.objects.filter(tenant=tenant).count(),
        'content_items': ContentItem.objects.filter(tenant=tenant).count(),
    }
    return render(request, 'seo/dashboard.html', {
        'tenant': tenant,
        'sites': sites,
        'metrics': metrics,
    })


@login_required
def seo_sites_list(request):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')
    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'seo/sites.html', {'tenant': tenant, 'sites': sites})


@login_required
def seo_site_detail(request, site_id):
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    site = get_object_or_404(Site, id=site_id, tenant=tenant)

    # Try to get items linked to this specific site first, fall back to tenant-wide items
    # For now these are tenant-scoped; if site relationships are added later, this will use them
    content_items = ContentItem.objects.filter(
        tenant=tenant,
        url__icontains=site.domain  # Simple heuristic to find content for this site
    )
    if not content_items.exists():
        # Fall back to tenant-wide items if no site-specific ones found
        content_items = ContentItem.objects.filter(tenant=tenant)

    # Keyword clusters and FAQs are tenant-wide for now
    keyword_clusters = KeywordCluster.objects.filter(tenant=tenant)
    faqs = FAQ.objects.filter(tenant=tenant)

    return render(request, 'seo/site_detail.html', {
        'tenant': tenant,
        'site': site,
        'keyword_clusters': keyword_clusters,
        'content_items': content_items,
        'faqs': faqs,
    })


@login_required
def seo_site_create(request):
    """Create a new Site for the user's first tenant."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    if request.method == 'POST':
        domain = request.POST.get('domain', '').strip()
        sitemaps_url = request.POST.get('sitemaps_url', '').strip()
        default_locale = request.POST.get('default_locale', 'en').strip()
        robots_txt = request.POST.get('robots_txt', '').strip()

        errors = {}
        if not domain:
            errors['domain'] = 'Domain/URL is required.'

        if errors:
            return render(request, 'seo/site_form.html', {
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
        return redirect('seo_sites')

    # GET
    return render(request, 'seo/site_form.html', {
        'tenant': tenant,
        'is_edit': False,
        'site': None,  # Add empty site for template
        'form': None  # Add empty form for template
    })


@login_required
def seo_site_edit(request, site_id):
    """Edit an existing Site belonging to the user's tenant."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

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
            return render(request, 'seo/site_form.html', {
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
        return redirect('seo_sites')

    # GET
    return render(request, 'seo/site_form.html', {
        'tenant': tenant,
        'is_edit': True,
        'site': site
    })


@login_required
def seo_keyword_clusters(request):
    """SEO Keyword Clusters view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')
    
    keyword_clusters = KeywordCluster.objects.filter(tenant=tenant)
    return render(request, 'seo/keyword_clusters.html', {
        'tenant': tenant,
        'keyword_clusters': keyword_clusters
    })


@login_required
def seo_content_items(request):
    """SEO Content Items view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')
    
    content_items = ContentItem.objects.filter(tenant=tenant)
    return render(request, 'seo/content_items.html', {
        'tenant': tenant,
        'content_items': content_items
    })


@login_required
def seo_faqs(request):
    """SEO FAQs view."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')
    
    faqs = FAQ.objects.filter(tenant=tenant)
    return render(request, 'seo/faqs.html', {
        'tenant': tenant,
        'faqs': faqs
    })


# ============ BACKLINKS VIEWS ============

@login_required
def seo_backlinks_dashboard(request):
    """Backlinks Dashboard - Overview of backlink profile and opportunities."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'seo/backlinks_dashboard.html', {
        'tenant': tenant,
        'sites': sites,
    })


@login_required
def seo_backlinks_analysis(request):
    """Backlinks Analysis - Detailed analysis of backlinks for a site."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    site_id = request.GET.get('site_id')
    site = None
    if site_id:
        site = get_object_or_404(Site, id=site_id, tenant=tenant)
    
    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'seo/backlinks_analysis.html', {
        'tenant': tenant,
        'site': site,
        'sites': sites,
    })


@login_required
def seo_backlinks_competitors(request):
    """Competitors - Compare backlinks with competitors."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    site_id = request.GET.get('site_id')
    site = None
    if site_id:
        site = get_object_or_404(Site, id=site_id, tenant=tenant)
    
    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'seo/backlinks_competitors.html', {
        'tenant': tenant,
        'site': site,
        'sites': sites,
    })


@login_required
def seo_backlinks_outreach(request):
    """Outreach - Manage link outreach and opportunities."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'seo/no_tenant.html')

    site_id = request.GET.get('site_id')
    site = None
    if site_id:
        site = get_object_or_404(Site, id=site_id, tenant=tenant)
    
    sites = Site.objects.filter(tenant=tenant)
    return render(request, 'seo/backlinks_outreach.html', {
        'tenant': tenant,
        'site': site,
        'sites': sites,
    })
