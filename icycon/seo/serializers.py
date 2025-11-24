from rest_framework import serializers
from .models import Site, KeywordCluster, ContentItem, FAQ

class SiteSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)

    class Meta:
        model = Site
        fields = ['id', 'tenant', 'tenant_name', 'domain', 'sitemaps_url', 'default_locale', 'robots_txt', 'created_at']

class KeywordClusterSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)

    class Meta:
        model = KeywordCluster
        fields = ['id', 'tenant', 'tenant_name', 'locale', 'intent', 'terms', 'created_at']

class ContentItemSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)

    class Meta:
        model = ContentItem
        fields = ['id', 'tenant', 'tenant_name', 'type', 'url', 'status', 'locale', 'brief_json', 'draft_html', 'json_ld', 'created_at']

class FAQSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)

    class Meta:
        model = FAQ
        fields = ['id', 'tenant', 'tenant_name', 'question', 'answer', 'source_urls', 'created_at']
