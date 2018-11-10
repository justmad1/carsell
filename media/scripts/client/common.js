particlesJS.load('particles-js', 'scripts/assets/particles.json');
document.querySelectorAll('.btn').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add("pulse");
    });
    item.addEventListener('mouseleave', () => {
        item.classList.remove("pulse");
    });
});

$(document).ready(function() {
    $('select').formSelect();
    $('.tabs').tabs();
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.collapsible').collapsible();
});