from django.urls import path

from . import views

app_name = 'marketplace'

urlpatterns = [
    path('dashboard/', views.marketplace_dashboard, name='dashboard'),
    path('api/products/', views.product_list, name='product_list'),
    path('api/products/<int:product_id>/sales/', views.sales_for_product, name='product_sales'),
    path('api/products/<int:product_id>/interactions/', views.interactions_for_product, name='product_interactions'),
]
