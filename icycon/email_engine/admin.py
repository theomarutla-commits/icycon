from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend

admin.site.register(EmailList)
admin.site.register(Contact)
admin.site.register(EmailTemplate)
admin.site.register(EmailFlow)
admin.site.register(EmailSend)
