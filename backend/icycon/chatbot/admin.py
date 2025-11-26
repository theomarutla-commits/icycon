from django.contrib import admin
from .models import Conversation, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'title', 'created_at', 'updated_at']
    list_filter = ['tenant', 'created_at']
    search_fields = ['title', 'tenant__name']
    date_hierarchy = 'created_at'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'role', 'sender', 'tokens', 'created_at']
    list_filter = ['role', 'conversation__tenant', 'created_at']
    search_fields = ['content', 'conversation__title']
    date_hierarchy = 'created_at'
    raw_id_fields = ['conversation', 'sender']