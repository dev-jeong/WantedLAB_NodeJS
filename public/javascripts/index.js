let page = 1
let max_page = -1
let mode = 0 // 0 이면 list, 1이면 search

$(document).ready(function () {
    // 검색 Enter Key Event
    $("#word").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            search()
        }
    });

    // 알람 Enter Key Event
    $("#name").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            check_alert()
        }
    });

    list()
});

// 게시판의 전체 리스트 가져오기
function list() {
    mode = 0

    $.ajax({
        type: 'POST',
        data: { page: page },
        url: '/api/board/list',
        success: function (data) {
            max_page = Math.ceil(data.total_cnt / 10)
            var dataHtml = ''
            data.list.forEach(function (item) {
                dataHtml += '<button type="button" class="list-group-item list-group-item-action" onclick="board(1, ' + item.idx + ')">'
                dataHtml += '<span class="subject">' + item.subject + '</span>'
                dataHtml += '<span class="name">' + item.name + '</span>'
                if (item.edit_ts != null)
                    dataHtml += '<span class="reg_ts">' + item.edit_ts + '</span>'
                else
                    dataHtml += '<span class="reg_ts">' + item.reg_ts + '</span>'
                dataHtml += '</button>'
            });

            $('#list').empty()
            $('#list').append(dataHtml)
            $('#page_num').text(page)

            if (page == 1)
                $('#page_down').attr('disabled', true)
            if (max_page == 1)
                $('#page_up').attr('disabled', true)
        }
    });
}

// 검색
function search() {
    mode = 1

    $.ajax({
        type: 'POST',
        url: '/api/board/search',
        data: { word: $('#word').val(), page: page },
        success: function (data) {
            max_page = Math.ceil(data.total_cnt / 10)
            var dataHtml = ''

            if (data.list.length == 0) {
                dataHtml += '<button type="button" class="list-group-item list-group-item-action">검색결과를 찾을 수 없습니다</button>'
            }
            else {
                data.list.forEach(function (item) {
                    dataHtml += '<button type="button" class="list-group-item list-group-item-action" onclick="board(1, ' + item.idx + ')">'
                    dataHtml += '<span class="subject">' + item.subject + '</span>'
                    dataHtml += '<span class="name">' + item.name + '</span>'
                    if (item.edit_ts != null)
                        dataHtml += '<span class="reg_ts">' + item.edit_ts + '</span>'
                    else
                        dataHtml += '<span class="reg_ts">' + item.reg_ts + '</span>'
                    dataHtml += '</button>'
                });
            }

            $('#list').empty()
            $('#list').append(dataHtml)
            $('#page_num').text(page)

            if (page == 1)
                $('#page_down').attr('disabled', true)
            if (max_page == 1)
                $('#page_up').attr('disabled', true)
        }
    });
}

// 알람확인하기
function check_alert() {
    $.ajax({
        type: 'POST',
        url: '/api/alert/list',
        data: { name: $('#name').val() },
        success: function (data) {
            $('.modal-body').empty()
            if (data.length == 0) {
                $('.modal-body').append('<p>알람이 없습니다<p/>')
            }
            else {
                data.forEach(function (row) {
                    $('.modal-body').append('<p>"' + row.subject + '"에 키워드로 등록한 단어, "' + row.keyword + '"(이)가 발견되었습니다.\n' + '<p/>')
                })
            }
        }
    });
}

// 다음 페이지로 이동
function page_up() {
    if (page == (max_page - 1)) {
        $('#page_up').attr('disabled', true)
    }

    page++

    if (mode) {
        search()
    }
    else {
        list()
    }
    $('#page_down').attr('disabled', false)

}

// 이전 페이지로 이동
function page_down() {
    if (page != 1) {
        page--
        if (mode) {
            search()
        }
        else {
            list()
        }
        $('#page_up').attr('disabled', false)
    }
}

// 게시글(읽기, 쓰기)로 이동
function board(type, board_idx) {
    location.href = "/board?type=" + type + "&board_idx=" + board_idx
}