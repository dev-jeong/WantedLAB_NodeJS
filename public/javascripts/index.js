$(function () {
    let container = $('#pagination');
    container.pagination({
        dataSource: function(done){
            var result = [];
            for (var i = 1; i < 10000; i++) {
                result.push(i);
            }
            done(result);
         },
        callback: function (data, pagination) {

            var dataHtml = ''

            $.each(data, function (index, item) {
                dataHtml += '<button type="button" class="list-group-item list-group-item-action">' + item + '</button >'
            });

            $("#data-container").html(dataHtml);
        }
    })
})