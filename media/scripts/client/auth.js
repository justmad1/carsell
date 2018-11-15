let login,
    password,
    email,
    fio,
    data = {};

document.querySelector('.login').addEventListener('click', () => {
    login = document.querySelector('input#login').value;
    password = document.querySelector('input#password').value;
    data = {
        password: password,
        login: login
    };

    for (let key in data) {
        if (data[key] == ''){
            M.toast({html: 'Все поля должны быть заполнены!'});
            return;
        }
    }

    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/login'
    }).done(data => {
        M.toast({html: data.res});
        if (data.ok)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
    }).fail(console.log('failed'));
});

document.querySelector('.register').addEventListener('click', () => {
    fio = `${document.querySelector('input#first_name').value} ${document.querySelector('input#last_name').value}`;
    login = document.querySelector('input#email').value;
    password = document.querySelector('input#new_password').value;
    data = {
        fio: fio,
        password: password,
        login: login
    };

    for (let key in data) {
        if (data[key] == ''){
            M.toast({html: 'Все поля должны быть заполнены!'});
            return;
        }
    }

    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/register'
    }).done(data => {
        M.toast({html: data.res});
        if (data.ok)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
    });
});