from django.urls import path
from . import views

urlpatterns = [
    # Main marketplace
    path('', views.marketplace_home, name='marketplace-home'),
    path('products/', views.product_list, name='product-list'),
    path('products/<int:product_id>/', views.product_detail, name='product-detail'),
    
    # Product management
    path('products/create/', views.product_create, name='product-create'),
    path('products/<int:product_id>/edit/', views.product_edit, name='product-edit'),
    path('products/<int:product_id>/publish/', views.product_publish, name='product-publish'),
    path('products/<int:product_id>/archive/', views.product_archive, name='product-archive'),
    path('my-products/', views.my_products, name='my-products'),
    
    # Saved products
    path('saved-products/', views.saved_products, name='saved-products'),
    path('products/<int:product_id>/save/', views.save_product, name='save-product'),
    path('products/<int:product_id>/unsave/', views.unsave_product, name='unsave-product'),
    
    # Reviews
    path('products/<int:product_id>/review/', views.review_create, name='review-create'),
    
    # Orders and purchases
    path('products/<int:product_id>/order/', views.order_create, name='order-create'),
    path('orders/<int:order_id>/', views.order_detail, name='order-detail'),
    path('my-orders/', views.my_orders, name='my-orders'),
    
    # Seller dashboard
    path('sales/', views.sales_dashboard, name='sales-dashboard'),
    
    # Conversations
    path('conversations/', views.conversation_list, name='conversation-list'),
    path('conversations/<int:conversation_id>/', views.conversation_detail, name='conversation-detail'),
    path('products/<int:product_id>/conversation/', views.conversation_start, name='conversation-start'),
]