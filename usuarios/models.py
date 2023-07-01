from django.db import models
from django.conf import settings
from stdimage.models import StdImageField
from django.contrib.auth.models import User
from django.utils.text import slugify


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    seguidores = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='seguidores', blank=True)
    user_img = StdImageField(upload_to='img_perfil', blank=True)

    def __str__(self):
        return self.user.username

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    imagem = imagem = StdImageField(upload_to='img_post', variations={
        'medium': (400, 300),
    })
    comentarios = models.ManyToManyField('usuarios.Comentario', related_name='post_comentarios', blank=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    legenda = models.CharField(max_length=120, blank=True)
    dt_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)
    
    class Meta:
        ordering = ['-id']

class Comentario(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_comentarios')
    comentario = models.CharField(max_length=200)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comentario
    
    class Meta:
        ordering = ['-id']