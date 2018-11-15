$(document).ready(function () {
    $('textarea#message').characterCounter();
});
let textarea = document.querySelector('#message');

function createEl(message) {
    let card = document.createElement('div');
    let cardContent = document.createElement('div');
    let nameEl = document.createElement('span');
    let messageEl = document.createElement('p');

    card.classList.add('card');
    card.classList.add('blue-grey');
    
    cardContent.classList.add('card-content');
    cardContent.classList.add('white-text');

    nameEl.classList.add('card-title');
    nameEl.innerText = document.querySelector('#user').innerText;

    messageEl.innerText = message;

    cardContent.appendChild(nameEl);
    cardContent.appendChild(messageEl);
    card.appendChild(cardContent);
    document.querySelector('.feedback').appendChild(card);
}

document.querySelector('.btn-large').addEventListener('click', () => {
    if (textarea.value) {
        $.ajax({
            type: "POST",
            data: JSON.stringify({ message: textarea.value }),
            contentType: 'application/json',
            url: '/about'
        }).done(data => {
            console.log(data);
            if (data.ok){
                M.toast({ html: 'Ваш отзыв добавлен!' });
                createEl(textarea.value);
                textarea.value = "";
            } else {
                M.toast({ html: 'Возникла ошибка!' });
            }
            });
    } else {
        M.toast({html: 'Введите свой отзыв в поле!'});
    }
});
