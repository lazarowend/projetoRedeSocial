from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponse

# Create your views here.

def fazer_login(request):
    if request.method == 'GET':
        return render(request, 'login/login.html')
    elif request.method == 'POST':
        nome = request.POST.get('nome')
        senha = request.POST.get('senha')
        nome = nome.replace(' ', '-')
        user = authenticate(username=nome, password=senha)
        if user is not None:
            login(request, user)
            return redirect('usuarios:home')
        else:
            messages.error(request, "Usuário ou senha inválido!")
        return render(request, 'login/login.html')


def cadastro(request):
    if request.method == 'GET':
        return render(request, 'login/cadastro.html')
    elif request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        nome = nome.replace(' ', '-')

        def verificar_nome_usuario(username):
            try:
                User.objects.get(username=username)
                return True  # O nome de usuário já existe
            except User.DoesNotExist:
                return False
        
        if verificar_nome_usuario(nome):
            messages.warning(request, "Nome já existente!")
            return render(request, 'login/cadastro.html')

        try:
            user = User.objects.create_user(username=nome, password=senha, email=email)
            messages.success(request, "Usuário cadastrado, faça login!")
            return render(request, 'login/login.html')
        except Exception as e:
            messages.warning(request, "Erro ao cadastrar usuário: " + str(e))
            return render(request, 'login/cadastro.html')