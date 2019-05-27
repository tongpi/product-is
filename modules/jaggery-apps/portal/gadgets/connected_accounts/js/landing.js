var addType;

$(function () {
    $('#connectBtn').click(function (e) {
        e.preventDefault();
        $('#light').show();
        $('#fade').show();
        drawAddAccountPopup();
    });
});

$(function () {
    $('#connectFedBtn').click(function (e) {
        e.preventDefault();
        drawAddFedAccountPopup();
    });
});

function drawAddAccountPopup() {

    var top =
        "    <div class=\"container content-section-wrapper\">\n" +
        "        <div class=\"row\">\n" +
        "            <div class=\"col-lg-12 content-section\">\n" +
        "                <div class=\"headerDiv\">\n" +
        "                   <span class=\"headerText\">关联用户账号<span>\n" +
        "                </div>" +
        "                <form method=\"post\" class=\"form-horizontal\" id=\"associateForm\" name=\"selfReg\"" +
        " >\n" +
        "<div><div class=\"control-group\">\n" +
        "                        <div class=\"controls\">\n" +
        "                            <label class=\"control-label inputlabel pdR25\" for=\"domain\">账号类型" +
        "                                <span class=\"required\">*</span>" +
        "                            </label>\n" +
        "                            <select class=\"col-lg-3 inputContent\" id=\"accountType\"" +
        " onchange='loadForm()'>>\n" +
        "                                <option value=\"Associated\">本地</option>\n"  +
        "                                <option value=\"Federated\">联邦</option>\n"  +
        "                            </select>\n" +
        "                        </div>\n" +
        "                    </div>\n";

    var middle =
        "                    <div class=\"control-group\">\n" +
        "                        <div class=\"controls\">\n" +
        "                            <label class=\"control-label inputlabel pdR25\" for=\"userName\">用户名<span                             class=\"required\">*</span></label>\n" +
        "                            <input class=\"col-lg-3 inputContent requiredField userInputs\" type=\"text\" value=\"\" id=\"userName\" name=\"userName\"  />\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div class=\"control-group\">\n" +
        "                        <div class=\"controls\">\n" +
        "                            <label class=\"control-label inputlabel pdR25\" for=\"password\">密码<span                             class=\"required\">*</span></label>\n" +
        "                            <input class=\"col-lg-3 inputContent requiredField userInputs\" type=\"password\" value=\"\" id=\"password\" name=\"password\"  />\n" +
        "                        </div>\n" +
        "                    </div>\n";

    var end =
        "                    <div class=\"control-group\" style=\"margin-left: 116px;\">\n" +
        "                        <div class=\"controls\">\n" +
        "                            <input type=\"button\" onclick=\"connect();\" class=\"btn btn-primary\"  style=\"margin-right: 5px;\" value=\"关联\"/>\n" +
        "                            <input type=\"button\" onclick=\"cancelConnect();\" class=\"btn btn-default btn-cancel\" value=\"&nbsp;取消&nbsp;\"/>\n" +
        "                        </div>\n" +
        "                    </div></div>\n" +
        "                </form>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>   ";

    var output = top + middle + end;

    $("#light").empty();
    $("#light").append(output);

    $(".userInputs").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            connect();
        }
    });
}

function loadForm() {
    var e = document.getElementById("accountType");
    addType = e.options[e.selectedIndex].value;
    if (addType == "Federated") {
        drawAddFedAccountPopup();
    } else {
        drawAddAccountPopup();
    }

}

function cancelConnect() {

    $('#light').hide();
    $('#fade').hide();
}

function connect() {

    if (hasValidInputs()) {

        $('#light').hide();
        $('#fade').hide();

        $.ajax({
            url: "/portal/gadgets/connected_accounts/index.jag",
            type: "POST",
            data: $('#associateForm').serialize() + "&cookie=" + cookie + "&action=connect",
            success: function (data) {
                var resp = $.parseJSON(data);
                if (resp.success == true) {
                    reloadGrid();
                } else {
                    if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                        window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                    } else {
                        if (resp.message != null && resp.message.length > 0) {
                            message({content: resp.message, type: 'error', cbk: function () {
                            }});
                        } else {
                            message({content: '关联用户账号时出错.', type: 'error', cbk: function () {
                            }});
                        }
                        reloadGrid();
                    }
                }
            },
            error: function (e) {
                message({content: '关联用户账号时出错.', type: 'error', cbk: function () {
                }});
                reloadGrid();
            }
        });
    }
}

function hasValidInputs() {

    var valid = true;

    $(".requiredField").each(function () {
        if ($(this).val() == null || $(this).val().trim().length == 0) {

            message({content: $('label[for=' + $(this).attr('id') + ']').text() + ' 必须填写', type: 'warning', cbk: function () {
            }});
            valid = false;
            return false;
        }
    });

    return valid;
}

function drawAddFedAccountPopup() {

    $.ajax({
        url: "/portal/gadgets/connected_accounts/index.jag",
        type: "POST",
        data: {cookie : cookie, action : "idPList"},
        success: function (data) {
            var resp = $.parseJSON(data);
            if (resp.success == true) {
                if (resp.data != null && resp.data.length > 0) {
                    $('#light').show();
                    $('#fade').show();


                    var top =
                        "    <div class=\"container content-section-wrapper\">\n" +
                        "        <div class=\"row\">\n" +
                        "            <div class=\"col-lg-12 content-section\">\n" +
                        "                <div class=\"headerDiv\">\n" +
                        "                   <span class=\"socialHeaderText\">关联联邦账户ID<span>\n" +
                        "                </div>" +
                        "                <form method=\"post\" class=\"form-horizontal\" id=\"associateForm\" name=\"selfReg\"  >\n"+
                        "<div><div class=\"control-group\">\n" +
                        "                        <div class=\"controls\">\n" +
                        "                            <label class=\"control-label inputlabel pdR25\" for=\"domain\">账户类型" +
                        "                                <span class=\"required\">*</span>" +
                        "                            </label>\n" +
                        "                            <select class=\"col-lg-3 inputContent\" id=\"accountType\"" +
                        " onchange='loadForm()'>>\n" +
                        "                                <option value=\"Federated\">联邦</option>\n"  +
                        "                                <option value=\"Associated\">本地</option>\n"  +
                        "                            </select>\n" +
                        "                        </div>\n" +
                        "                    </div>\n";

                    var middle =
                        "                  <div><div class=\"control-group\">\n" +
                        "                        <div class=\"controls\">\n" +
                        "                            <label class=\"control-label inputlabel pdR25\" for=\"domain\">身份提供者Id" +
                        "                                <span class=\"required\">*</span>" +
                        "                            </label>\n" +
                        "                            <select class=\"col-lg-3 inputContent\" name=\"idPId\">\n" ;

                    for (var i in resp.data) {
                        middle = middle +"                                <option value=\""+resp.data[i]+"\">"+resp.data[i]+"</option>\n" ;
                    }

                    middle = middle +
                        "                            </select>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"control-group\">\n" +
                        "                        <div class=\"controls\">\n" +
                        "                            <label class=\"control-label inputlabel pdR25\" for=\"user_name\">用户名<span class=\"required\">*</span></label>\n" +
                        "                            <input class=\"col-lg-3 inputContent requiredField\" type=\"text\" value=\"\" id=\"user_name\" name=\"username\"  />\n" +
                        "                        </div></div>\n" ;

                    var end =
                        "                    <div class=\"control-group mgnL135\">\n" +
                        "                        <div class=\"controls\">\n" +
                        "                            <input type=\"button\" onclick=\"fedConnect();\" class=\"btn btn-primary\" style=\"margin-right: 5px;\" value=\"关联\"/>\n" +
                        "                            <input type=\"button\" onclick=\"cancelConnect();\" class=\"btn btn-default btn-cancel\" value=\"取消\"/>\n" +
                        "                        </div>\n" +
                        "                    </div></div>\n" +
                        "                </form>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>   " ;

                    var output = top + middle + end;
                    $("#light").empty();
                    $("#light").append(output);

                } else {
                    message({content: '未找到注册的身份提供者 !', type: 'info', cbk: function () {
                    }});
                }
            } else {

                if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                    window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                } else {
                    message({content: '加载身份提供者发生错误.', type: 'error', cbk: function () {
                    }});
                }
            }
        },
        error: function (e) {
            message({content: '加载身份提供者发生错误.', type: 'error', cbk: function () {
            }});
        }
    });
}

function fedConnect() {
    if (hasValidInputs()) {
        $('#light').hide();
        $('#fade').hide();

        $.ajax({
            url: "/portal/gadgets/connected_accounts/index.jag",
            type: "POST",
            data: $('#associateForm').serialize() + "&cookie=" + cookie + "&action=fedConnect",
            success: function (data) {
                var resp = $.parseJSON(data);
                if (resp.success == true) {
                    reloadFedGrid();
                } else {
                    if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                        window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                    } else {
                        if (resp.message != null && resp.message.length > 0) {
                            message({content: resp.message, type: 'error', cbk: function () {
                            }});
                        } else {
                            message({content: '关联联邦用户账号时发生错误.', type: 'error', cbk: function () {
                            }});
                        }
                        reloadGrid();
                    }
                }
            },
            error: function (e) {
                message({content: '关联联邦用户账号时发生错误.', type: 'error', cbk: function () {
                }});
                reloadGrid();
            }
        });
    }
}
