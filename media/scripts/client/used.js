data = [];
let ulElement = document.querySelector('ul.popout'),
    i = 0,
    items = [],
    car = null;

function render(item, i) {
    if (!item.available) return "";   // check for availability
    items[i] = item;
    item.m = item.model.split(" ")[1];
    let diff = new Date() - new Date(item.date),
        badge = "",
        time = 0;
    if (diff / 60e3 < 60) {
        time = Math.round(diff / 60e3);
        if (time == 0) time += 1;
        badge = `<span class="new badge" data-badge-caption="минут назад">Добавлена ${time}</span>`;
    }
    return `
        <li class="car-item">
            <div class="collapsible-header">
                <div style="width: 100%" class="collapsible-text valign-wrapper">
                    <h4 class="car-name">
                        ${item.model}
                    </h4>
                    ${badge}
                </div>
            </div>
            <div class="collapsible-body">
                <ul class="collection with-header">
                    <li class="collection-header">
                        <h4>Характеристики автомобиля</h4>
                    </li>
                    <li class="collection-item">
                        <div>Комплектация<a href="#" class="secondary-content">${item.complectation}</a></div>
                    </li>
                    <li class="collection-item">
                        <div>Цвет<a href="#" class="secondary-content">${item.color}</a></div>
                    </li>
                    <li class="collection-item">
                        <div>Мощность двигателя<a href="#" class="secondary-content">${item.engine}</a></div>
                    </li>
                    <li class="collection-item">
                        <div>Пробег<a href="#" class="mileage secondary-content">${item.mileage}</a></div>
                    </li>
                    <li class="collection-item">
                        <div>Цена<a href="#" class="secondary-content">${item.price}</a></div>
                    </li>
                </ul>
                <button id="nom${i}" data-target="buy" class="buy btn modal-trigger">Оформить покупку</button>
            </div>
        </li>
        `;
}

function send() {
    car.login = document.querySelector("#user").innerText;
    $.ajax({
        type: "POST",
        url: "/buyusedcar",
        contentType: 'application/json',
        data: JSON.stringify(car)
    }).done(data => {
        console.log(data);
        M.toast({ html: data.message });
    });
}

function renew() {
    i = 0;
    document.querySelectorAll('input[type=checkbox]').forEach((item, i) => {
        data[i] = item.checked;
    });

    $.ajax({
        type: "POST",
        url: "/getusedcars",
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(data => {
        ulElement.innerHTML = "";
        data.data.forEach(item => {
            ulElement.innerHTML += render(item, i);
            i++;
        });

        document.querySelectorAll('.buy').forEach(item => {
            item.addEventListener('click', event => {
                car = items[event.target.id.split("")[3]];
                document.querySelector('.complectation').innerHTML = car.complectation;
                document.querySelector('.price').innerHTML = car.price;
                document.querySelector('.engine').innerHTML = car.engine;
                document.querySelector('.color').innerHTML = car.color;
                document.querySelector('.modal-car-name').innerHTML = car.model;
                document.querySelector('.mileage').innerHTML = car.mileage;
            });
        });
    });
}

setTimeout(() => {
    renew();
}, 1000);