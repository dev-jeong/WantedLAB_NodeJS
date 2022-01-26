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
            success: function (result) {
                if (result.result) {
                    $('#subject').val(result.data.subject)
                    $('#context').val(result.data.context)
                    if (result.data.edit_ts != null)
                        $('#write_info').text('작성자 : ' + result.data.name + ' | 최종수정일 : ' + result.data.edit_ts)
                    else
                        $('#write_info').text('작성자 : ' + result.data.name + ' | 작성일 : ' + result.data.reg_ts)
                }
                else {
                    location.href = '/'
                    alert('잘못된 접근입니다')
                }
            }
        })

        $.ajax({
            url: "/api/reply/list",
            method: "POST",
            data: { board_idx: idx, page : 1},
            success: function (result) {
                result.list.forEach(function (reply) {
                    $('#reply').append(
                        '<button type="button" class="list-group-item list-group-item-action" onclick="toggle_rereply(' + reply.idx + ')">' +
                        '     <span class="reply_name">' + reply.name + '</span>' +
                        '     <span class="reply_context">' + reply.context + '</span>' +
                        '     <span class="reply_regts">' + reply.reg_ts + '</span>' +
                        '</button>'
                    )

                    $('#reply').append('<div class="list-group rereply" id="rereply' + reply.idx + '"></div>')

                    $('#reply').append(
                        '<div class="input-group write_rereply" id="write_rereply' + reply.idx + '">' +
                        '    <input type="text" class="form-control col-2" id="rereply_name' + reply.idx + '" placeholder="이름">' +
                        '    <input type="text" class="form-control col-10" id="rereply_context' + reply.idx + '" placeholder="댓글">' +
                        '    <div class="input-group-append">' +
                        '        <button class="btn btn-outline-secondary" type="button" onclick="enroll_rereply(' + reply.idx + ')">등록</button>' +
                        '    </div>' +
                        '</div>'
                    )

                    $.ajax({
                        url: "/api/rereply/list",
                        method: "POST",
                        data: { reply_idx: reply.idx },
                        dataType: "text",
                        success: function (result) {
                            JSON.parse(result).forEach(function (rereply) {
                                $('#rereply' + reply.idx).append(
                                    '<button type="button" class="list-group-item list-group-item-action">' +
                                    '     <span class="rereply_mark">ㄴ</span>' +
                                    '     <span class="rereply_name">' + rereply.name + '</span>' +
                                    '     <span class="rereply_context">' + rereply.context + '</span>' +
                                    '     <span class="reply_regts">' + reply.reg_ts + '</span>' +
                                    '</button>'
                                )
                            })
                        }
                    })
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
            success: function (result) {
                if (result.result) {
                    var password = prompt("비밀번호를 입력해주세요");

                    if (password != null) {
                        $.ajax({
                            url: "/api/board/auth",
                            method: "POST",
                            data: { password: password, idx: idx },
                            success: function (check) {
                                if (check) {
                                    $('#subject').val(result.data.subject)
                                    $('#context').val(result.data.context)
                                }
                                else {
                                    alert('비밀번호를 확인하세요')
                                    location.href = window.location.href.replace('type=3', 'type=1')
                                }
                            }
                        })
                    }
                    else {
                        location.href = window.location.href.replace('type=3', 'type=1')
                    }
                }
                else {
                    alert('잘못된 접근입니다')
                    location.href = '/'
                }
            }
        })
    }
});

function enroll() {
    var parameter = {
        subject: $('#subject').val(),
        name: $('#name').val(),
        password: $('#password').val(),
        context: $('#context').val()
    }

    if (parameter.subject == '') {
        alert('제목을 입력해주세요')
        return 0
    }
    else if (parameter.name == '') {
        alert('이름을 입력해주세요')
        return 0
    }
    else if (parameter.password == '') {
        alert('비밀번호를 입력해주세요')
        return 0
    }
    else if (parameter.context == '') {
        alert('내용을 입력해주세요')
        return 0
    }
    else {
        $.ajax({
            url: "/api/board/write",
            method: "PUT",
            data: parameter,
            dataType: "text",
            success: function (result) {
                if (result)
                    alert('등록이 완료되었습니다.')
                else
                    alert('잠시 후 다시 시도해주세요')
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
                if (result) {
                    $.ajax({
                        url: "/api/board/delete",
                        method: "DELETE",
                        data: { idx: idx },
                        dataType: "text",
                        success: function (result) {
                            if (result) {
                                alert('삭제되었습니다')
                                location.href = "/"
                            }
                            else {
                                alert('잠시 후 다시 시도해주세요')
                                location.reload()
                            }
                        }
                    })

                }
                else {
                    alert('비밀번호를 확인하세요')
                }
            }
        })
    }
}

function edit() {
    location.href = window.location.href.replace('type=1', 'type=3')
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

function toggle_rereply(reply_idx) {
    $(".write_rereply").css('display', 'none')
    $("#write_rereply" + reply_idx).css('display', 'flex')
}

function enroll_rereply(reply_idx) {
    var parameter = {
        reply_idx: reply_idx,
        name: $('#rereply_name' + reply_idx).val(),
        context: $('#rereply_context' + reply_idx).val()
    }

    $.ajax({
        url: "/api/rereply/write",
        method: "PUT",
        data: parameter,
        dataType: "text",
        success: function (result) {
            alert('등록이 완료되었습니다.')
            location.reload()
        }
    })
}