from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import SocialAccount, Post, Engagement, Comment
from .serializers import SocialAccountSerializer, PostSerializer, EngagementSerializer, CommentSerializer
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from tenants.models import Tenant, TenantUser
from django.views.decorators.http import require_http_methods

class SocialAccountViewSet(viewsets.ModelViewSet):
    serializer_class = SocialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['handle', 'platform']

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return SocialAccount.objects.filter(tenant_id__in=tenant_ids)

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'published_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Post.objects.filter(tenant_id__in=tenant_ids)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.status = 'published'
        post.published_at = timezone.now()
        post.save()
        return Response({'status': 'post published'})

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Comment.objects.filter(post__tenant_id__in=tenant_ids)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EngagementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EngagementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Engagement.objects.filter(post__tenant_id__in=tenant_ids)


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Conversation.objects.filter(participants__id__in=tenant_ids).distinct()

    def perform_create(self, serializer):
        # Expect `participants` to be a list of tenant ids in the request data
        conversation = serializer.save()
        participants = self.request.data.get('participants', [])
        if participants:
            conversation.participants.set(participants)
        conversation.save()


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant_ids = TenantUser.objects.filter(user=self.request.user).values_list('tenant_id', flat=True)
        return Message.objects.filter(conversation__participants__id__in=tenant_ids).distinct()

    def perform_create(self, serializer):
        # Ensure the author is the current user
        serializer.save(author=self.request.user)


@login_required
@require_http_methods(["GET", "POST"])
def create_post_view(request):
    """Server-rendered form to create a Post for one of the user's tenants.

    Shows a simple form and creates a Post with the authenticated user as author.
    """
    # Get tenants the user belongs to
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)

    if request.method == 'POST':
        tenant_id = request.POST.get('tenant')
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        status = request.POST.get('status', 'draft')

        # Basic validation
        if not tenant_id or not title or not content:
            messages.error(request, 'Please select a tenant and provide title and content.')
            return render(request, 'social_media/create_post.html', {'tenants': tenant_qs})

        try:
            tenant = tenant_qs.get(id=tenant_id)
        except Tenant.DoesNotExist:
            messages.error(request, 'Invalid tenant selection.')
            return render(request, 'social_media/create_post.html', {'tenants': tenant_qs})

        post = Post.objects.create(
            tenant=tenant,
            author=request.user,
            title=title,
            content=content,
            status=status,
        )
        if status == 'published':
            post.published_at = timezone.now()
            post.save()

        messages.success(request, 'Post created successfully.')
        return redirect('social_media:create_post')

    return render(request, 'social_media/create_post.html', {'tenants': tenant_qs})


@login_required
def social_channels_view(request):
    """Display connected social media channels for tenant's org promotion."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'social_media/no_tenant.html')
    
    accounts = SocialAccount.objects.filter(tenant=tenant).order_by('platform', 'handle')
    platform_stats = {}
    for platform, _ in SocialAccount.PLATFORM_CHOICES:
        platform_stats[platform] = accounts.filter(platform=platform).count()
    
    return render(request, 'social_media/channels.html', {
        'tenant': tenant,
        'accounts': accounts,
        'platform_stats': platform_stats,
        'platform_choices': SocialAccount.PLATFORM_CHOICES
    })


@login_required
def social_posts_view(request):
    """Display all posts for tenant's social media content."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'social_media/no_tenant.html')
    
    posts = Post.objects.filter(tenant=tenant).order_by('-created_at')
    status_stats = {}
    for status, _ in Post.STATUS_CHOICES:
        status_stats[status] = posts.filter(status=status).count()
    
    return render(request, 'social_media/posts_list.html', {
        'tenant': tenant,
        'posts': posts,
        'status_stats': status_stats,
        'status_choices': Post.STATUS_CHOICES
    })


@login_required
def conversations_view(request):
    """Display conversations/messages for org communication and promotion."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'social_media/no_tenant.html')
    
    conversations = Conversation.objects.filter(participants=tenant).order_by('-updated_at')
    
    return render(request, 'social_media/conversations_list.html', {
        'tenant': tenant,
        'conversations': conversations
    })


@login_required
def conversation_detail_view(request, conversation_id):
    """Display messages within a specific conversation."""
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return render(request, 'social_media/no_tenant.html')
    
    conversation = Conversation.objects.filter(
        id=conversation_id,
        participants=tenant
    ).first()
    
    if not conversation:
        return redirect('social_media:conversations')
    
    messages_list = Message.objects.filter(conversation=conversation).order_by('sent_at')
    
    return render(request, 'social_media/conversation_detail.html', {
        'tenant': tenant,
        'conversation': conversation,
        'messages': messages_list
    })


@login_required
def send_message_view(request, conversation_id):
    """Send a message within a conversation."""
    if request.method != 'POST':
        return redirect('social_media:conversations')
    
    tenant_qs = Tenant.objects.filter(tenantuser__user=request.user)
    tenant = tenant_qs.first()
    if not tenant:
        return redirect('social_media:conversations')
    
    conversation = Conversation.objects.filter(
        id=conversation_id,
        participants=tenant
    ).first()
    
    if not conversation:
        return redirect('social_media:conversations')
    
    content = request.POST.get('content', '').strip()
    if content:
        Message.objects.create(
            conversation=conversation,
            sender=tenant,
            author=request.user,
            content=content
        )
        messages.success(request, 'Message sent.')
    
    return redirect('social_media:conversation_detail', conversation_id=conversation_id)
