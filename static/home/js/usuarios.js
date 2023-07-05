
$("#menu-mobile").click(function () {
  console.log('aqui')
  if ($(".menu-mobile").css('display') == 'none') {
    $(".menu-mobile").css('display', 'block');
  } else {
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
  var my_data = { 'comentario': comentario };
  $.ajax({
    url: 'http://localhost:8000/comentar/' + id + '/',
    method: 'POST',
    data: my_data,
    success: function (data) {
      if (data.status === 'Save') {
        console.log('Save com sucesso');
        $("form")[0].reset();
        $("#comentario" + id).val('');

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
  var img_atual = '';

  $('#inputImagem').change(function() {
    var arquivo = this.files[0];
    var leitor = new FileReader();

    img_atual = $('#imagemPreview').attr('src');

    leitor.onload = function(e) {
      $('#imagemPreview').attr('src', e.target.result);
    };

    leitor.readAsDataURL(arquivo);
  });

  $(".cancelar-edit").click(function(e) {
    e.preventDefault();

    $('#imagemPreview').attr('src', img_atual);
  });

  buscar_cliente();
});


function buscar_cliente(x) {
  var buscar = ""
  if (x == 1) {
    buscar = $("#bucar_user_mobile").val();
  } else {
    buscar = $("#bucar_user").val();
  }

  var my_data = { 'buscar': buscar }
  console.log(buscar);
  $.ajax({
    method: 'POST',
    url: "http://localhost:8000/bucar_usuario/",
    data: my_data,
    success: function (data) {
      if (data.status == 'Save') {
        var lista_users = $(".user_recente");
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


function curtir(user_id, post_id) {
  var my_data = { 'id': user_id };
  $.ajax({
    method: 'POST',
    url: "http://localhost:8000/curtir_post/" + post_id + "/",
    data: my_data, 
    success: function (data) {
      if (data.status == 'Save') { 
        var img_like = '/static/base/img/icons/like.png';
        var img_deslike = '/static/base/img/icons/coracao.png';
        // curti = 1
        // descurtir = 0


        console.log(data['like']['like']);
        if (data['like']['like'] ==='1') {
          $("#img_like" + post_id).attr("src", img_like);
        } else if (data['like']['like'] === '0') {
          $("#img_like" + post_id).attr("src", img_deslike);
        }

      } else {
        console.log('erro');
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
    }
  });
}

function seguir(id_user_logado, id_user_perfil) {
  var my_data = {'id_user_perfil': id_user_perfil};
  
  $.ajax({
    method: "POST",
    url: "http://localhost:8000/seguir_user/" + id_user_logado + "/",
    data: my_data,
    success: function (data) {
      if (data.status == 'Save') { 
        var div_seguir = $(".seguir_btn")
        var seguidores = $(".qtd_seguidor")
        var seguindo = $(".qtd_seguindo")

        if (data['result']['result'] ==='1') {
          div_seguir.empty()
          div_seguir.append("\
          <p>seguir</p>\
          <img src='/static/base/img/icons/seguir.png' alt=''>")
          
          seguidores.empty().text(data['result']['seguidores'])
          seguindo.empty().text(data['result']['seguindo'])

        } else if (data['result']['result'] === '0') {
          div_seguir.empty()
          div_seguir.append("\
          <p>seguindo</p>\
          <img src='/static/base/img/icons/deixar-de-seguir.png' alt=''>")

          seguidores.empty().text(data['result']['seguidores'])
          seguindo.empty().text(data['result']['seguindo'])
        }

    }
  }
  });

}

function carregar_seguidores(id_perfil) {
  my_data = {}
  $.ajax({
    method: 'GET',
    url: "http://localhost:8000/carregar_seguidores/" + id_perfil + "/",
    data: my_data,
    success: function (data) {
      if (data.status == 'Save') {

        var list_seguidor = $(".list_seguidor")
        list_seguidor.empty()
        for (i = 0; i < data['result'].length; i++) {
          if (data['result'][i]['imagem']){
            list_seguidor.append(
              "<tr>\
                  <td><a href=''><img src='" + data['result'][i]['imagem']+"' alt='Perfil 1' width='50px' height='50px'></a></td>\
                  <td><a href=''>" + data['result'][i]['nome']+"</a></td>\
                  <td><a href=''>" + data['result'][i]['seguidores']+" seguidores</a></td>\
                  <td><a href=''>" + data['result'][i]['seguindo']+" seguindo</td>\
                </tr>"
            )
          } else {
            list_seguidor.append(
              "<tr>\
                  <td><a href=''><img src='/static/base/img/icons/user.png' alt='Perfil 1' width='50px' height='50px'></a></td>\
                  <td><a href=''>" + data['result'][i]['nome']+"</a></td>\
                  <td><a href=''>" + data['result'][i]['seguidores']+" seguidores</a></td>\
                  <td><a href=''>" + data['result'][i]['seguindo']+" seguindo</td>\
                </tr>"
            )
          }

        }

      }
    }
  });
}

function carregar_seguindo(id_perfil) {
  my_data = {}
  $.ajax({
    method: 'GET',
    url: "http://localhost:8000/carregar_seguindo/" + id_perfil + "/",
    data: my_data,
    success: function (data) {
      if (data.status == 'Save') {

        var list_seguindo = $(".list_seguindo")
        list_seguindo.empty()
        for (i = 0; i < data['result'].length; i++) {
          
          if (data['result'][i]['imagem']){
            list_seguindo.append(
              "<tr>\
                  <td><a href=''><img src='" + data['result'][i]['imagem']+"' alt='Perfil 1' width='50px' height='50px'></a></td>\
                  <td><a href=''>" + data['result'][i]['nome']+"</a></td>\
                  <td><a href=''>" + data['result'][i]['seguidores']+" seguidores</a></td>\
                  <td><a href=''>" + data['result'][i]['seguindo']+" seguindo</td>\
                </tr>"
            )
          } else {
            list_seguindo.append(
              "<tr>\
                  <td><a href=''><img src='/static/base/img/icons/user.png' alt='Perfil 1' width='50px' height='50px'></a></td>\
                  <td><a href=''>" + data['result'][i]['nome']+"</a></td>\
                  <td><a href=''>" + data['result'][i]['seguidores']+" seguidores</a></td>\
                  <td><a href=''>" + data['result'][i]['seguindo']+" seguindo</td>\
                </tr>"
            )
          }

        }

      }
    }
  });
}

$(".editar-perfil").click(function () {
  if ($(".feed-seguindo").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-seguindo").css('display', 'none');
  }

  if ($(".feed-seguidores").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
    $(".feed-seguidores").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
    $(".post").css('display', 'none');
    $(".feed-editar").css('display', 'block');
  } else {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
  }
});

$(".cancelar-edit").click(function () {
  $(".post").css('display', 'block');
  $(".feed-editar").css('display', 'none');
})


$(".seguidores").click(function () {
  if ($(".feed-editar").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
  }

  if ($(".feed-seguindo").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
    $(".feed-seguindo").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
    $(".post").css('display', 'none');
    $(".feed-seguidores").css('display', 'block');
  } else {
    $(".post").css('display', 'block');
    $(".feed-seguidores").css('display', 'none');
  }
})


$(".seguindo").click(function () {
  if ($(".feed-editar").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
  }
  if ($(".feed-seguidores").css('display') == 'block') {
    $(".post").css('display', 'block');
    $(".feed-editar").css('display', 'none');
    $(".feed-seguidores").css('display', 'none');
  }

  if ($(".post").css('display') == 'block') {
    $(".post").css('display', 'none');
    $(".feed-seguindo").css('display', 'block');
  } else {
    $(".post").css('display', 'block');
    $(".feed-seguindo").css('display', 'none');
  }
})



