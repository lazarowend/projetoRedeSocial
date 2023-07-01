from django.urls import path, include
from . import views

app_name = 'usuarios'
urlpatterns = [
    path('home/', views.home, name='home'),

    path('perfil/<str:username>/', views.perfil, name='perfil_user'),
    
    path('logout/', views.logout_view, name='logout_user'),
    path('criar/<str:username>/', views.criar, name='criar_publi'),

    path('comentar/<int:id>/', views.comentar, name='comentar'),

]
