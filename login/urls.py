from django.urls import path, include
from . import views

app_name = 'login'

urlpatterns = [
    path('login/', views.fazer_login, name='login'),
    path('cadastro/', views.cadastro, name='fazer_cadastro')
]
