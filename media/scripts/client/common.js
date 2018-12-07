particlesJS.load('particles-js', 'scripts/assets/particles.json');
const menu = document.querySelector('.menu');

[].slice.call(menu.children).forEach(item => {
    item.firstChild.classList.remove('active');
});

//menu selection
switch (document.title) {
    case "Главная": {
        menu.children[0].firstChild.classList.add('active');
        break;
    }

    case "Модельный ряд": {
        menu.children[1].firstChild.classList.add('active');
        break;
    }

    case "Подержанные автомобили": {
        menu.children[2].firstChild.classList.add('active');
        break;
    }

    case "Финансовые автомобили": {
        menu.children[3].firstChild.classList.add('active');
        break;
    }

    case "О нас": {
        menu.children[4].firstChild.classList.add('active');
        break;
    }
}

$(document).ready(function() {
    $('select').formSelect();
    $('.tabs').tabs();
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.modal').modal();
});

document.querySelectorAll('.btn').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add("pulse");
    });
    item.addEventListener('mouseleave', () => {
        item.classList.remove("pulse");
    });
});

$(document).ready(function(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
});

//preloader
document.body.onload = () => {
    setTimeout(() => {
        document.querySelector('.bg').classList.add('hidden');
        document.querySelector('.car').classList.add('go');
    }, 1000);
}
