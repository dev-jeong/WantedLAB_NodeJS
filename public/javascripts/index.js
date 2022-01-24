$( document ).ready(function() {
    // 게시판의 전체 리스트 가져오기
    const container = $('#pagination');
    container.pagination({
        dataSource: function (done) {
            $.ajax({
                type: 'POST',
                url: '/api/board/list',
                success: function (response) {
                    done(response);
                }
            });
        },
        callback: function (data, pagination) {
            var dataHtml = '<div class="list-group">'

            $.each(data, function (index, item) {
                dataHtml += '<button type="button" class="list-group-item list-group-item-action" onclick="board(1, ' + item.idx + ')">'
                dataHtml += '<span class="subject">' + item.subject + '</span>'
                dataHtml += '<span class="name">' + item.name + '</span>'
                if(item.edit_ts != null)
                    dataHtml += '<span class="reg_ts">' + item.edit_ts + '</span>'
                else
                    dataHtml += '<span class="reg_ts">' + item.reg_ts + '</span>'
                dataHtml += '</button>'
            });
            dataHtml += '</div>'

            $("#data-container").html(dataHtml);
        }
    })

    // 검색 Enter Key Event
    $("#word").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            search()
        }
    });
});

function search() {
    var word = $('#word').val()
    const container = $('#pagination');
    container.pagination({
        dataSource: function (done) {
            $.ajax({
                type: 'POST',
                url: '/api/board/search',
                data: { word: word },
                success: function (response) {
                    done(response);
                }
            });
        },
        callback: function (data, pagination) {
            var dataHtml = '<div class="list-group">'

            if (data.length == 0) {
                dataHtml += '<button type="button" class="list-group-item list-group-item-action">검색결과를 찾을 수 없습니다</button>'
            }
            else {
                $.each(data, function (index, item) {
                    dataHtml += '<button type="button" class="list-group-item list-group-item-action" onclick="board(1, ' + item.idx + ')">'
                    dataHtml += '<span class="subject">' + item.subject + '</span>'
                    dataHtml += '<span class="name">' + item.name + '</span>'
                    dataHtml += '<span class="reg_ts">' + item.reg_ts + '</span>'
                    dataHtml += '</button>'
                });
            }

            dataHtml += '</div>'

            $("#data-container").html(dataHtml);
        }
    })
}

function board(type, board_idx) {
    location.href = "/board?type=" + type + "&board_idx=" + board_idx
}



