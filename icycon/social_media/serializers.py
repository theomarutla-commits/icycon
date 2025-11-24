from rest_framework import serializers
from .models import SocialAccount, Post, Engagement, Comment
from .models import Conversation, Message

class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ['id', 'tenant', 'platform', 'handle', 'connected_at']
        read_only_fields = ['connected_at']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'content', 'created_at', 'parent']
        read_only_fields = ['created_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username

class EngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engagement
        fields = ['platform', 'likes', 'shares', 'comments', 'clicks', 'impressions', 'reach', 'timestamp']
        read_only_fields = ['timestamp']

class PostSerializer(serializers.ModelSerializer):
    engagements = EngagementSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'tenant', 'author', 'author_name', 'title', 'content', 'excerpt',
            'post_type', 'status', 'platforms', 'scheduled_at', 'media_attachments',
            'is_sponsored', 'target_audience', 'ad_budget', 'tags',
            'meta_description', 'seo_keywords', 'created_at', 'updated_at',
            'published_at', 'campaign_id', 'engagements', 'comments'
        ]
        read_only_fields = ['created_at', 'updated_at', 'published_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class MessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'author', 'author_name', 'content', 'sent_at', 'is_read']
        read_only_fields = ['sent_at', 'is_read', 'author_name']

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class ConversationSerializer(serializers.ModelSerializer):
    participants_detail = serializers.SerializerMethodField(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'subject', 'participants', 'participants_detail', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['created_at', 'updated_at', 'messages', 'participants_detail']

    def get_participants_detail(self, obj):
        return [{'id': p.id, 'name': p.name} for p in obj.participants.all()]