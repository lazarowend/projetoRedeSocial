from django.shortcuts import render, redirect, get_object_or_404
from .models import Comentario, Post, UserProfile
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def home(request):

    if request.user.is_authenticated:
        user_logado = User.objects.get(id=request.user.id)

        posts = Post.objects.all()
        comentarios = Comentario.objects.all()
        user_profile = UserProfile.objects.all()
        user = User.objects.exclude(id=request.user.id)
        context = {
            'posts': posts,
            'comentarios': comentarios,
            'user_profile': user_profile,
            'user':user,
            'user_logado': user_logado,
        }
        return render(request, 'home/home.html', context)
    else:
        posts = Post.objects.all()
        comentarios = Comentario.objects.all()
        user_profile = UserProfile.objects.all()
        user = User.objects.all()
        context = {
            'posts': posts,
            'comentarios': comentarios,
            'user_profile': user_profile,
            'user':user,
        }
        return render(request, 'home/home.html', context)

def logout_view(request):
    logout(request)
    return redirect('usuarios:home')

def perfil(request, username):
    if request.user.is_authenticated:
        user_logado = User.objects.get(id=request.user.id)
        user_perfil = get_object_or_404(User, username=username)
        post = Post.objects.filter(user=user_perfil).order_by('-dt_criacao')
        comentarios_post = Comentario.objects.filter(post__in=post)

        context = {
            'user_logado': user_logado,
            'user_perfil': user_perfil,
            'post': post,
            'comentarios_post': comentarios_post
        }

        return render(request, 'home/perfil.html', context)
    else:
        user_perfil = get_object_or_404(User, username=username)
        post = Post.objects.filter(user=user_perfil).order_by('-dt_criacao')
        comentarios_post = Comentario.objects.filter(post__in=post)

        context = {
            'user_perfil': user_perfil,
            'post': post,
            'comentarios_post': comentarios_post
        }

        return render(request, 'home/perfil.html', context)
    

def pesquisar(request):
    pass


def explorar(request):
    pass

@login_required(login_url='/login')
def criar(request, username):
    if request.method == 'POST':
        imagem = request.FILES['imagem']
        legenda = request.POST.get('legenda')
        user_logado = User.objects.get(id=request.user.id)

        try:
            post = Post.objects.create(imagem=imagem, legenda=legenda, user=user_logado)
            post.save()
            return redirect('usuarios:home')  
        except:
            messages.warning(request, "Erro ao publicar, tente novamente!")
            context = {
                'user_logado': user_logado
            }
            return render(request, 'home/criar.html', context)    

    if request.user.is_authenticated:
        user_logado = User.objects.get(id=request.user.id)
    
        context = {
            'user_logado': user_logado
        }
        return render(request, 'home/criar.html', context)    



@csrf_exempt
def comentar(request, id):
    if request.method == 'POST':
        coment = request.POST.get('comentario')

        user_logado = User.objects.get(id=request.user.id)
        post = get_object_or_404(Post, id=id)

        comentario = Comentario(user=user_logado, post=post, comentario=coment)
        comentario.save()
        post.comentarios.add(comentario)

        data_comentario = {
            'id': comentario.id,
            'user': user_logado.username,
            'comentario': comentario.comentario,
            'post_id': comentario.post_id,
        }

        return JsonResponse({'status': 'Save', 'comentario': data_comentario})
    else:
        return JsonResponse({'status': 0})