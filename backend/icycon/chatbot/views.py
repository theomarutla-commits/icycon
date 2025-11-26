import os
import openai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from tenants.models import Tenant, TenantUser
from .models import Conversation, Message

# Set OpenAI API key from settings
openai.api_key = settings.OPENAI_API_KEY

SYSTEM_PROMPT = """
You are an AI assistant helping users navigate the website for {{tenant_name}}.
Keep responses brief, friendly, and action-oriented. If asked about specific 
features or pages, provide clear steps or direct links to relevant sections.

You can help with:
- Finding specific features or pages
- Explaining how to use different tools
- Answering questions about available features
- Providing quick tips for better usage

Always stay factual and if unsure, ask for clarification.
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """
    Accept a message from a user and return an AI-generated response.
    Requires authentication and valid tenant membership.
    """
    user = request.user
    tenant_id = request.data.get('tenant')
    text = request.data.get('message', '').strip()
    conversation_id = request.data.get('conversation')

    # Validate inputs
    if not tenant_id or not text:
        return Response({'error': 'Both tenant and message are required'}, status=400)
    if len(text) > 1000:  # Reasonable limit for message length
        return Response({'error': 'Message too long'}, status=400)

    # Verify tenant access
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        TenantUser.objects.get(user=user, tenant=tenant)
    except (Tenant.DoesNotExist, TenantUser.DoesNotExist):
        return Response({'error': 'Invalid tenant or unauthorized'}, status=403)

    # Get or create conversation
    if conversation_id:
        conv = get_object_or_404(Conversation, id=conversation_id, tenant=tenant)
    else:
        conv = Conversation.objects.create(
            tenant=tenant,
            title=text[:50] + ('...' if len(text) > 50 else '')
        )

    # Store user message
    user_msg = Message.objects.create(
        conversation=conv,
        sender=user,
        role='user',
        content=text
    )

    # Build context for AI (include recent history)
    recent_msgs = Message.objects.filter(conversation=conv).order_by('-created_at')[:6]
    system_content = SYSTEM_PROMPT.replace("{{tenant_name}}", tenant.name)
    messages = [
        {"role": "system", "content": system_content}
    ] + [
        {"role": m.role, "content": m.content}
        for m in reversed(recent_msgs)  # Chronological order
    ]

    try:
        # Call OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or gpt-3.5-turbo for lower cost
            messages=messages,
            max_tokens=512,
            temperature=0.7,
            presence_penalty=0.6  # Encourage varied responses
        )

        assistant_text = response['choices'][0]['message']['content']
        tokens_used = response['usage']['total_tokens']

        # Store assistant response
        assistant_msg = Message.objects.create(
            conversation=conv,
            sender=user,  # or create a system user
            role='assistant',
            content=assistant_text,
            tokens=tokens_used
        )

        return Response({
            'conversation': conv.id,
            'message_id': assistant_msg.id,
            'reply': assistant_text,
            'tokens': tokens_used
        })

    except Exception as e:
        # Log the error but don't expose details to client
        print(f"OpenAI API error: {str(e)}")
        return Response(
            {'error': 'Unable to generate response. Please try again.'},
            status=500
        )