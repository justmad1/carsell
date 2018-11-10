let login,
    password,
    email,
    fio,
    data = {};

document.querySelector('.login').addEventListener('click', () => {
    login = document.querySelector('input#login').value;
    password = document.querySelector('input#password').value;
    data = {
        type: 'login',
        password: password,
        login: login
    };
    console.log(data);
    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/auth'
    }).done(data => {
        M.toast({html: data.res});
    }).fail(console.log('failed'));
});

document.querySelector('.register').addEventListener('click', () => {
    fio = `${document.querySelector('input#first_name').value} ${document.querySelector('input#last_name').value}`;
    login = document.querySelector('input#email').value;
    password = document.querySelector('input#new_password').value;
    data = {
        type: 'register',
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
        url: '/auth'
    }).done(data => {
        M.toast({html: data.res});
    });
});