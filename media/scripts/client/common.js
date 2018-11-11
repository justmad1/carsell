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

document.body.onload = () => {
    setTimeout(() => {
        document.querySelector('.bg').classList.add('hidden');
        document.querySelector('.car').classList.add('go');
    }, 1000);
}