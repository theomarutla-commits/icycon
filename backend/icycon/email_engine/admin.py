from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend, Lead, SmsMessage, EmailCampaign

admin.site.register(EmailList)
admin.site.register(Contact)
admin.site.register(EmailTemplate)
admin.site.register(EmailFlow)
admin.site.register(EmailSend)
admin.site.register(Lead)
admin.site.register(SmsMessage)
admin.site.register(EmailCampaign)
