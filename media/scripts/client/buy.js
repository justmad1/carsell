data = [];
let ulElement = document.querySelector('ul.popout');

function render(item) {
    item.m = item.model.split(" ")[1];
    let diff = new Date() - new Date(item.date),
        badge = "",
        time = 0;
    if (diff * 60 / 60e3) {
        time = Math.round(diff / 60e3);
        badge = `<span class="new badge" data-badge-caption="минут назад">Добавлена ${time}</span>`;
    }
    return `
        <li class="car-item">
            <div class="collapsible-header"><img class="car-badge" src="images/cars/${item.m}/${item.color}/car.png" alt="car">
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
                        <div>Цена<a href="#" class="secondary-content">${item.price}</a></div>
                    </li>
                </ul>
                <a class="waves-effect waves-light btn"><i class="material-icons left">cloud</i>Оформить покупку</a>
            </div>
        </li>
        `;
}

function renew() {
    document.querySelectorAll('input[type=checkbox]').forEach((item, i) => {
        data[i] = item.checked;
    });

    $.ajax({
        type: "POST",
        url: "/getcars",
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(data => {
        ulElement.innerHTML = "";
        data.data.forEach(item => {
            ulElement.innerHTML += render(item);
        });
    });
}

document.querySelectorAll('input[type=checkbox]').forEach(item => {
    item.addEventListener('click', () => {
        renew()
    });
});

setTimeout(() => {
    renew();
}, 1000);