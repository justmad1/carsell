(document.onload = () => {

    let menu = document.querySelectorAll('.menu>li'),
        main = document.querySelector('main.main');

    menu[0].addEventListener('click', () => {
        $.ajax({
            type: "POST",
            url: "/getboughtcars",
            contentType: 'application/json',
        }).done(c => {
            console.log(c);

            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Модель', 'Количество'],
                    ['Model 1', c.data[0]],
                    ['Model 2', c.data[1]],
                    ['Model 3', c.data[2]],
                    ['Подержанные авто', c.data[3]]
                ]);

                var options = {
                    title: 'Проданные автомобили'
                };

                var chart = new google.visualization.PieChart(document.getElementById('piechart'));

                chart.draw(data, options);
            }
        });

        main.innerHTML = `<div id="piechart" style="width: 100%; height: 500px;"></div>`;
    });

    menu[1].addEventListener('click', () => {
        $.ajax({
            type: "GET",
            url: "/add",
            contentType: 'application/json'
        }).done(data => {
            main.innerHTML = data.html;
            setTimeout(() => {
                $('select').formSelect();
            }, 500);
        });
    });
})();