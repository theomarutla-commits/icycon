from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (EmailListViewSet, ContactViewSet, EmailTemplateViewSet,
                    EmailFlowViewSet, EmailSendViewSet)

router = DefaultRouter()
router.register(r'lists', EmailListViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'templates', EmailTemplateViewSet)
router.register(r'flows', EmailFlowViewSet)
router.register(r'sends', EmailSendViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
