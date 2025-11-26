from django.urls import path
from . import views

urlpatterns = [
    path('', views.aso_dashboard, name='aso-dashboard'),
    path('app-management/', views.aso_app_management, name='aso-app-management'),
    path('keyword-research/', views.aso_keyword_research, name='aso-keyword-research'),
]