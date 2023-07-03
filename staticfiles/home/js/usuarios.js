var staticImagePath = "{% static 'base/img/icons/user.png' %}";
var mediaUrl = "{{ MEDIA_URL }}";

$("#menu-mobile").click(function () { 
  console.log('aqui')
   if ($(".menu-mobile").css('display') == 'none') {
      $(".menu-mobile").css('display', 'block');
   }else {
      $(".menu-mobile").css('display', 'none');
   }
});

$("#form-feed").focus(function () { 
  $(".menu-mobile").css('display', 'none');
});

$("#mobile-buscar").click(function () { 
  $("#form-feed").focus();
  $(".menu-mobile").css('display', 'none');
});


function comentar(id, comentario) {
    var my_data = {'comentario': comentario};
    $.ajax({
      url: 'http://localhost:8000/comentar/' + id + '/',
      method: 'POST',
      data: my_data,
      success: function(data) {
        if (data.status === 'Save') {
          console.log('Save com sucesso');
            $("form")[0].reset();
            $("#comentario"+id).val('');
  
          var list_comentarios = $("#lista_" + id);
  
          var comentarioHTML = "<li>" + data.comentario.user + ' - ' + data.comentario.comentario + "</li>";
          list_comentarios.append(comentarioHTML);
        }
        if (data.status === 0) {
          console.log('error');
        }
      }
    });
}

function deletar_post(id) {
  var my_data = {};
  var post = $("#id_post_" + id);
  $.ajax({
    url: 'http://localhost:8000/apagar_post/' + id + '/',
    method: 'POST',
    data: my_data,
    success: function (data) {
      if (data.status == 1) {
        console.log('deletado');
        console.log(id);
        post.remove();
      } else {
        console.log('erro');
      }
    }
  });
}

$(document).ready(function() {
  $('#inputImagem').change(function() {
    var arquivo = this.files[0];
    var leitor = new FileReader();

    leitor.onload = function(e) {
      $('#imagemPreview').attr('src', e.target.result);
    }

    leitor.readAsDataURL(arquivo);
  });
  buscar_cliente();
});


function buscar_cliente() {
  var buscar = $("#bucar_user").val();
  var my_data = {'buscar':buscar}
  console.log(buscar);
  $.ajax({
    method: 'POST',
    url: "http://localhost:8000/bucar_usuario/",
    data: my_data,
    success: function (data) {
      if (data.status == 'Save') {
        var lista_users = $("#user_recente");
        lista_users.empty();
        for (i = 0; i < data['data_user'].length; i++) {
          if (data['data_user'][i]['imagem'] == null) {
            lista_users.append("<div class='usuarios'>" +
              "<img src='" + staticImagePath + "' alt='' width='50px' height='50px'>" +
              "<a href='/perfil/" + data['data_user'][i]['id'] + "/'><p>" + data['data_user'][i]['username'] + "</p></a>" +
              "</div>");
          } else {
            lista_users.append("<div class='usuarios'>" +
              "<img src='" + mediaUrl + data['data_user'][i]['imagem'] + "' alt='' width='50px' height='50px'>" +
              "<a href='/perfil/" + data['data_user'][i]['id'] + "/'><p>" + data['data_user'][i]['username'] + "</p></a>" +
              "</div>");
          }
        }
      } else {
        console.log('erro');
      }
    }
  });
}


$(".editar-perfil").click(function () { 
  if ($(".feed-seguindo").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-seguindo").css('display','none');
  }

  if ($(".feed-seguidores").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
     $(".feed-seguidores").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
     $(".post").css('display','none');
     $(".feed-editar").css('display','block');
  }else {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
  }
});

$(".cancelar-edit").click(function () {
  $(".post").css('display','block');
  $(".feed-editar").css('display','none');
})


$(".seguidores").click(function () {
  if ($(".feed-editar").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
  }

  if ($(".feed-seguindo").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
     $(".feed-seguindo").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
     $(".post").css('display','none');
     $(".feed-seguidores").css('display','block');
  }else {
     $(".post").css('display','block');
     $(".feed-seguidores").css('display','none');
  }
})


$(".seguindo").click(function () {
  if ($(".feed-editar").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
  }
  if ($(".feed-seguidores").css('display') == 'block') {
     $(".post").css('display','block');
     $(".feed-editar").css('display','none');
     $(".feed-seguidores").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
     $(".post").css('display','none');
     $(".feed-seguindo").css('display','block');
  }else {
     $(".post").css('display','block');
     $(".feed-seguindo").css('display','none');
  }
})

