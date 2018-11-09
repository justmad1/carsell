particlesJS.load('particles-js', 'scripts/assets/particles.json');
$(document).ready(function() {
    $('select').formSelect();
    $('.tabs').tabs();
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.collapsible').collapsible();
});
$('.carousel').carousel({
    duration: 200,
    dist: -100,
    fullWidth: true,
    indicators: true
});
let carousel = M.Carousel.getInstance(document.querySelector('.carousel'));
setInterval(() => {
    carousel.next();
}, 5000);