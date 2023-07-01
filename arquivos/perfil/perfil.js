document.addEventListener('DOMContentLoaded', function () {
  var modalImage = document.getElementById('modalImage');
  var images = document.querySelectorAll('.image-grid img');

  images.forEach(function (image) {
    image.addEventListener('click', function () {
      var imageUrl = image.getAttribute('src');
      modalImage.setAttribute('src', imageUrl);
    });
  });
});
function descurtir(){
  document.getElementById("img-like").style.display = 'none'
  document.getElementById("img-deslike").style.display = 'block'
}
function curtir(){
  document.getElementById("img-like").style.display = 'block'
  document.getElementById("img-deslike").style.display = 'none'
}