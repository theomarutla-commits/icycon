from django.urls import path

from . import views

app_name = 'aso'

urlpatterns = [
    path('dashboard/', views.aso_dashboard, name='dashboard'),
    path('api/listings/', views.listing_list, name='listings'),
]
