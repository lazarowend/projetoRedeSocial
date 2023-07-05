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



def logout_user(request):
    logout(request)
    return redirect('usuarios:home')



def perfil(request, id):
    print('aqui')
    if request.user.is_authenticated:
        user_logado = User.objects.get(id=request.user.id)
        user_perfil = get_object_or_404(User, id=id)
        posts = Post.objects.filter(user=user_perfil).order_by('-dt_criacao')
        comentarios_post = Comentario.objects.filter(post__in=posts)

        user_prof = UserProfile.objects.get(user_id=id)
        seguidores = str(user_prof.quantidade_seguidores())
        seguindo = str(user_prof.quantidade_seguindo())
        num_posts = Post.objects.filter(user=user_perfil).count()


        context = {
            'user_logado': user_logado,
            'user_perfil': user_perfil,
            'posts': posts,
            'comentarios_post': comentarios_post,
            'seguidores': seguidores,
            'seguindo': seguindo,
            'num_posts':num_posts
        }




        return render(request, 'home/perfil.html', context)
    else:
        user_perfil = get_object_or_404(User, id=id)
        posts = Post.objects.filter(user=user_perfil).order_by('-dt_criacao')
        comentarios_post = Comentario.objects.filter(post__in=posts)
        
        user_prof = UserProfile.objects.get(user_id=id)
        seguidores = str(user_prof.quantidade_seguidores())
        seguindo = str(user_prof.quantidade_seguindo())

        context = {
            'user_perfil': user_perfil,
            'posts': posts,
            'comentarios_post': comentarios_post,
            'seguidores': seguidores,
            'seguindo': seguindo
        }

        return render(request, 'home/perfil.html', context)
    


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
    
@csrf_exempt
def apagar_post(resquest, id):
    if resquest.method == "POST":
        try:
            post = Post.objects.get(id=id)
            post.delete()
            return JsonResponse({'status': 1})
        except:
            return JsonResponse({'status': 0})
        
@csrf_exempt
def bucar_usuario(request):
    if request.method == 'POST':
        buscar = request.POST.get('buscar')
        print(buscar)

        users = User()
        if buscar is not None:
            users = UserProfile.objects.filter(user__username__icontains=buscar)
        else:
            users = UserProfile.objects.all()

        data_user = []

        for user in users:
            user_data = {
                'username': user.user.username,
                'imagem': user.user_img.url if user.user_img else None,
                'id': user.user.id,
            }
            data_user.append(user_data)

        return JsonResponse({'status': 'Save', 'data_user': data_user})
    else:
        return JsonResponse({'status': 0})

        
@csrf_exempt
def curtir_post(request, id):
    if request.method == 'POST':
        user_id = request.POST.get('id')

        post = Post.objects.get(id=id)
        user = User.objects.get(id=user_id)

        #curtir = 1
        #descurtir = 0
        
        x = ''

        is_like = post.veificar_like(user)
        if is_like:
            post.remove_like(user)
            x = '0'
        else:
            post.add_like(user)
            x = '1'

        like = {'like': x}
        
        return JsonResponse({'status': 'Save', 'like': like})
    else:
        return JsonResponse({'status': 0})


@csrf_exempt
def seguir_user(request, id):
    if request.method == 'POST':
        id_user_logado = id
        id_user_perfil = request.POST.get('id_user_perfil')

        print(id_user_perfil)

        perfil = UserProfile.objects.get(user_id=id_user_perfil)
        user_seguir = User.objects.get(id=id_user_logado)

        verificar = perfil.verificar_seguidor(user_seguir)

        x = ''

        if verificar:
            perfil.deixar_de_seguir(user_seguir)
            x = '1'
        else:
            perfil.seguir_usuario(user_seguir)
            x = '0'
        
        qtd_segidores = str(perfil.quantidade_seguidores())

        qtd_seguindo = str(perfil.quantidade_seguindo())



        result = {'result': x, 'seguidores': qtd_segidores, 'seguindo': qtd_seguindo}

        return JsonResponse({'status': 'Save', 'result': result})
    else:
        return JsonResponse({'status': 0})



@csrf_exempt
def carregar_seguidores(request, id):
    if request.method == 'GET':
        user_perfil = get_object_or_404(User, id=id)
        user_prof = UserProfile.objects.get(user=user_perfil)
        list_seguidor = []
        seguidores = user_prof.seguidores.all()

        for seguidor in seguidores:
            user_data = {
                'imagem': seguidor.profile.user_img.url if seguidor.profile.user_img else None,
                'nome': seguidor.username,
                'seguidores': seguidor.profile.quantidade_seguidores(),
                'seguindo': seguidor.profile.quantidade_seguindo()
            }

            list_seguidor.append(user_data)



        return JsonResponse({'status': 'Save', 'result': list_seguidor})
    else:
        return JsonResponse({'status': 0})
    

@csrf_exempt
def carregar_seguindo(request, id):
    if request.method == 'GET':
        user_perfil = get_object_or_404(User, id=id)
        user_prof = UserProfile.objects.get(user=user_perfil)
        list_seguidor = []
        seguindo = user_prof.user.seguidores.all()

        for seguidor in seguindo:
            user_data = {
                'imagem': seguidor.user_img.url if seguidor.user_img else None,
                'nome': seguidor.user.username,
                'seguidores': seguidor.quantidade_seguidores(),
                'seguindo': seguidor.quantidade_seguindo()
            }

            list_seguidor.append(user_data)



        return JsonResponse({'status': 'Save', 'result': list_seguidor})
    else:
        return JsonResponse({'status': 0})
    


def atualizar_user(request, id):
    if request.method == 'POST':
        imagem = request.FILES['imagem']
        