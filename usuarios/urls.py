from django.urls import path, include
from . import views

app_name = 'usuarios'
urlpatterns = [
    path('home/', views.home, name='home'),

    path('perfil/<int:id>/', views.perfil, name='perfil_user'),
    
    path('logout_user/', views.logout_user, name='logout_user'),

    path('criar/<str:username>/', views.criar, name='criar_publi'),

    path('comentar/<int:id>/', views.comentar, name='comentar'),
    path('apagar_post/<int:id>/', views.apagar_post, name='apagar_post'),

    path('bucar_usuario/', views.bucar_usuario, name='bucar_usuario'),


]
