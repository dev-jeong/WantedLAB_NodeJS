let idx = 0

$(document).ready(function () {
    // board idx 추출
    var data = window.location.href.split('?')[1].split('&')
    data.forEach(function (elemnet) {
        if (elemnet.indexOf('board_idx') != -1) {
            idx = elemnet.split('=')[1]
        }
    })

    // 읽기
    if (window.location.href.indexOf('type=1') != -1) {
        $('#user_info').hide()
        $('#subject').attr('readonly', true)
        $('#context').attr('readonly', true)
        $('#btn_enroll').hide()
        $('#btn_cancel').hide()
        $('#btn_update').hide()

        $.ajax({
            url: "/api/board/read",
            method: "POST",
            data: { idx: idx },
            dataType: "text",
            success: function (result) {
                $('#subject').val(JSON.parse(result).subject)
                $('#context').val(JSON.parse(result).context)
                if (JSON.parse(result).edit_ts != null)
                    $('#write_info').text('작성자 : ' + JSON.parse(result).name + ' | 최종수정일 : ' + JSON.parse(result).edit_ts)
                else
                    $('#write_info').text('작성자 : ' + JSON.parse(result).name + ' | 작성일 : ' + JSON.parse(result).reg_ts)

            }
        })

        $.ajax({
            url: "/api/reply/list",
            method: "POST",
            data: { board_idx: idx },
            dataType: "text",
            success: function (result) {
                JSON.parse(result).forEach(function (reply) {
                    $('#reply').append('<button type="button" class="list-group-item list-group-item-action">' +
                                       '     <span class="reply_name">'+reply.name+'</span>' +
                                       '     <span class="reply_context">'+reply.context+'</span>' +
                                       '</button>')
                })
            }
        })
    }

    // 쓰기
    if (window.location.href.indexOf('type=2') != -1) {
        $('#btn_del').hide()
        $('#btn_edit').hide()
        $('#btn_update').hide()
        $('#btn_back').hide()
        $('#write_reply').hide()
        $('#write_reply').hide()
        $('#reply').hide()
        $('#write_info').hide()
    }

    //수정하기
    if (window.location.href.indexOf('type=3') != -1) {
        $('#user_info').hide()
        $('#btn_del').hide()
        $('#btn_edit').hide()
        $('#btn_enroll').hide()
        $('#write_reply').hide()
        $('#reply').hide()
        $('#write_info').hide()

        $.ajax({
            url: "/api/board/read",
            method: "POST",
            data: { idx: idx },
            dataType: "text",
            success: function (result) {
                $('#subject').val(JSON.parse(result).subject)
                $('#context').val(JSON.parse(result).context)
            }
        })
    }
});

function enroll() {
    var korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    var parameter = {
        subject: $('#subject').val(),
        name: $('#name').val(),
        password: $('#password').val(),
        context: $('#context').val()
    }

    if (korean.test(parameter.password)) {
        alert('한글은 사용할 수 없습니다')
        return 0
    }
    else {
        $.ajax({
            url: "/api/board/write",
            method: "PUT",
            data: parameter,
            dataType: "text",
            success: function (result) {
                alert('등록이 완료되었습니다.')
                location.href = "/"
            }
        })
    }
}

function del() {
    var password = prompt("비밀번호를 입력해주세요");

    if (password != null) {
        $.ajax({
            url: "/api/board/auth",
            method: "POST",
            data: { password: password, idx: idx },
            dataType: "text",
            success: function (result) {
                if (result == 'fail') {
                    alert('비밀번호를 확인하세요')
                }
                else if (result == 'success') {
                    $.ajax({
                        url: "/api/board/delete",
                        method: "DELETE",
                        data: { idx: idx },
                        dataType: "text",
                        success: function (result) {
                            alert('삭제되었습니다')
                            location.href = "/"
                        }
                    })
                }
            }
        })
    }
}

function edit() {
    var password = prompt("비밀번호를 입력해주세요");

    if (password != null) {
        $.ajax({
            url: "/api/board/auth",
            method: "POST",
            data: { password: password, idx: idx },
            dataType: "text",
            success: function (result) {
                if (result == 'fail') {
                    alert('비밀번호를 확인하세요')
                }
                else if (result == 'success') {
                    location.href = window.location.href.replace('type=1', 'type=3')
                }
            }
        })
    }
}

function update() {
    var parameter = {
        idx: idx,
        subject: $('#subject').val(),
        context: $('#context').val()
    }

    $.ajax({
        url: "/api/board/update",
        method: "POST",
        data: parameter,
        dataType: "text",
        success: function (result) {
            alert('수정이 완료되었습니다.')
            window.history.back()
        }
    })
}

function cancel() {
    window.history.back()
}

function back() {
    location.href = "/"
}

function enroll_reply() {
    var parameter = {
        board_idx: idx,
        name: $('#reply_name').val(),
        context: $('#reply_context').val()
    }

    $.ajax({
        url: "/api/reply/write",
        method: "PUT",
        data: parameter,
        dataType: "text",
        success: function (result) {
            alert('등록이 완료되었습니다.')
            location.reload()
        }
    })
}