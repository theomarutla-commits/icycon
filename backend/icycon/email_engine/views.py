from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend
from .serializers import (EmailListSerializer, ContactSerializer,
                          EmailTemplateSerializer, EmailFlowSerializer, EmailSendSerializer)
# DRY RUN: Task imports removed

class EmailListViewSet(viewsets.ModelViewSet):
    queryset = EmailList.objects.all()
    serializer_class = EmailListSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def unsubscribe(self, request, pk=None):
        contact = self.get_object()
        contact.subscribed = False
        contact.unsubscribed_at = timezone.now()
        contact.save()
        return Response({"message": f"{contact.email} unsubscribed."})

class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmailFlowViewSet(viewsets.ModelViewSet):
    queryset = EmailFlow.objects.all()
    serializer_class = EmailFlowSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmailSendViewSet(viewsets.ModelViewSet):
    queryset = EmailSend.objects.all().order_by('-created_at')
    serializer_class = EmailSendSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def send_now(self, request, pk=None):
        send = self.get_object()
        if send.status not in ("queued", "failed"):
            return Response({"error": "Only queued or failed sends can be retried."},
                            status=status.HTTP_400_BAD_REQUEST)
        # DRY RUN: No task, just mark as sent with dummy data
        send.status = "sent"
        send.sent_at = timezone.now()
        send.message_id = f"dry-run-msg-{send.id}"
        send.save()
        return Response({"message": "[DRY RUN] Email marked as sent (no actual sending)"})

    @action(detail=False, methods=["post"])
    def deliverability_check(self, request):
        tenant_id = request.data.get("tenant_id")
        # DRY RUN: Return dummy deliverability data
        return Response({
            "message": "[DRY RUN] Deliverability check simulated",
            "dummy_results": {
                "spf": "pass",
                "dkim": "pass",
                "dmarc": "pass",
                "mx_records": ["dummy.mail.protection.outlook.com"]
            }
        })
