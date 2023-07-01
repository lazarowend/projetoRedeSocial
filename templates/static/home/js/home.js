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
            $(".campo-comentario").val('');
  
          var list_comentarios = $("#lista_" + id);
          console.log(list_comentarios);
  
          var comentarioHTML = "<li class='list-group-item'>" + data.comentario.user + ' - ' + data.comentario.comentario + "</li>";
          list_comentarios.append(comentarioHTML);
        }
        if (data.status === 0) {
          console.log('error');
        }
      }
    });
}