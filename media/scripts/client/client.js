(document.onload = () => {
    $.ajax({
        type: "POST",
        url: "/getclientcars",
        contentType: 'application/json'
    }).then(data => {
        
    });
})();