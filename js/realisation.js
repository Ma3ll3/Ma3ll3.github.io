// JS pour les pages de projets
// Afficher les images en grand
$(document).ready(function () {
    var modal = $('#showGalerie')
    var span = $(".close")
    var modalImg = $("#img01")
    var captionText = $("#caption")
    var img = $('.myImg')
    img.click(function () {
        modal.css('display', 'flex')
        modalImg.attr('src', this.src)
        captionText.html(this.alt)
    });
    span.click(function () {
        modal.css('display', 'none')
    });
});

// En version mobile, fait apparaître le menu burger
function toggleMenu() {
    var nav = document.querySelector('header');
    nav.classList.toggle('active');
    console.log('click');
}