(document.onload = () => {
    data = [];
    let ulElement = document.querySelector('ul.popout');

    function render(item, i) {
        return `
        <li class="car-item">
            <div class="collapsible-header">
                <div style="width: 100%" class="collapsible-text valign-wrapper">
                    <h4 class="car-name">
                        ${item.model}
                    </h4>
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
            </div>
        </li>
        `;
    }

    function renew() {
        i = 0;
        document.querySelectorAll('input[type=checkbox]').forEach((item, i) => {
            data[i] = item.checked;
        });

        $.ajax({
            type: "POST",
            url: "/getclientcars",
            contentType: 'application/json',
            data: JSON.stringify(data),
        }).done(data => {
            ulElement.innerHTML = "";
            data.cars.forEach(item => {
                ulElement.innerHTML += render(item, i);
                i++;
            });
        });
    }

    setTimeout(() => {
        renew();
    }, 1000);
})(); 