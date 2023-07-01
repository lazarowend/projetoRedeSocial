from django.contrib import admin
from .models import Comentario, Post, UserProfile

# Register your models here.

admin.site.register(Comentario)
admin.site.register(Post)
admin.site.register(UserProfile)