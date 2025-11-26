from rest_framework import serializers
from .models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend

class EmailListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailList
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'

class EmailFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailFlow
        fields = '__all__'

class EmailSendSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSend
        fields = '__all__'
