from django.urls import path

from . import views

app_name = 'seo'

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('api/pages/', views.pages_list, name='pages_list'),
    path('api/pages/<slug:slug>/', views.page_detail, name='page_detail'),
    path('api/pages/<slug:slug>/backlinks/', views.page_backlinks, name='page_backlinks'),
    path('api/sites/', views.site_list, name='site_list'),
    path('api/directories/', views.directory_list, name='directory_list'),
]
