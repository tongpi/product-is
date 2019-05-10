function drawPage() {

    $("#gadgetBody").empty();
    if (json != null || fedJson != null) {
        var noRaws = true;
        var top =
            "    <div class=\"col-lg-12 content-section\">\n" +
            "        <table class=\"table table-bordered\">\n" +
            "            <thead>\n" +
            "                <tr>\n" +
            "                    <th class='txtAlnCen width30p'>用户 ID</th>\n" +
            "                    <th class='txtAlnCen width30p'>身份提供者</th>\n" +
            "                    <th class='txtAlnCen'>操作</th>\n" +
            "                </tr>\n" +
            "            </thead>\n" +
            "            <tbody>\n";

        var middle = "";
        if (isArray(json)) {
            for (var i in json) {
                noRaws = false;
                middle = middle +
                    "                <tr>\n" +
                    "                    <td>" + json[i].fullUsername + "</td>\n" +
                    "                    <td><i  class='resident-idp'></i>   自身身份提供者   </td>\n";

                var connectedAccount = json[i].username;
                if ('PRIMARY' != json[i].domain) {
                    connectedAccount = json[i].domain + "/" + connectedAccount;
                }
                if ('carbon.super' != json[i].tenantDomain) {
                    connectedAccount = connectedAccount + '@' + json[i].tenantDomain;
                }

                middle = middle +
                    "                    <td>\n" +
                    "                        <a title='' onclick=\"deleteUserAccountConnection('" + connectedAccount + "');\" href=\"javascript:void(0)\"><i class=\"icon-trash\"></i> \n" + "移除</a>\n" +
                    "                    </td>\n" +
                    "                </tr>\n";
            }
        }
        if (isArray(fedJson.list)) {
            for (var i in fedJson.list) {
                noRaws = false;
                middle = middle +
                    "                <tr>\n" +
                    "                    <td>" + fedJson.list[i].username + "</td>\n" +
                    "                    <td><i class='fedarate'></i>   " + fedJson.list[i].idPName + "   </td>\n" +
                    "                    <td>\n" +
                    "                        <a title=\"\" onclick=\"deleteFedUserAccountConnection('" + fedJson.list[i].idPName + "' ,'" + fedJson.list[i].username + "');\" href=\"javascript:void(0)\"><i class=\"icon-trash\"></i> 移除</a>\n" +
                    "                    </td>\n" +
                    "                </tr>\n";
            }
        }
        if (noRaws) {
            middle = middle +
                "<tr>" +
                "<td colspan=\"3\"><i>未找到账号.</i></td>" +
                "</tr>";
        }

        var end =
            "            </tbody>\n" +
            "        </table>\n" +
            "    </div>";

        var output = top + middle + end;
        console.log(output);
        $("#gadgetBody").append(output);

    }
}

function isArray(element) {
    return Object.prototype.toString.call(element) === '[object Array]';
}

function deleteUserAccountConnection(delUser) {

    var msg = "你将要意移除 '" + delUser + "'. 要继续处理吗?";
    message({
        content: msg, type: 'confirm', okCallback: function () {
            $.ajax({
                url: "/portal/gadgets/connected_accounts/index.jag",
                type: "POST",
                data: {cookie : cookie, userName : delUser, action: "delete"},
                success: function (data) {
                    var resp = $.parseJSON(data);
                    if (resp.success == true) {
                        reloadGrid();
                    } else {
                        if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                            window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                        } else {
                            if (resp.message != null && resp.message.length > 0) {
                                message({
                                    content: resp.message, type: 'error', cbk: function () {
                                    }
                                });
                            } else {
                                message({
                                    content: '移除用户账号出错了.',
                                    type: 'error',
                                    cbk: function () {
                                    }
                                });
                            }
                        }
                    }
                },
                error: function (e) {
                    message({
                        content: '移除用户账号出错了.', type: 'error', cbk: function () {
                        }
                    });
                }
            });
        }, cancelCallback: function () {
        }
    });
}

function reloadGrid() {
    $.ajax({
        url: "/portal/gadgets/connected_accounts/index.jag",
        type: "POST",
        data: {cookie : cookie, action : "list"},
        success: function (data) {
            var resp = $.parseJSON(data);
            if (resp.success == true) {
                json = resp.data;
                reloadFedGrid(json);
                drawPage();
                changeDropDownMenu();
            } else {

                if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                    window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                } else {
                    if (resp.message != null && resp.message.length > 0) {
                        message({
                            content: resp.message, type: 'error', cbk: function () {
                            }
                        });
                    } else {
                        message({
                            content: '加载网格数据值时出错了.',
                            type: 'error',
                            cbk: function () {
                            }
                        });
                    }
                }
            }
        },
        error: function (e) {
            message({
                content: '加载网格数据值时出错了.', type: 'error', cbk: function () {
                }
            });
        }
    });
}

function changeDropDownMenu() {
    if (json != null) {
        if (isArray(json)) {
            var htmlContent = '<div class="dropdown_separator"><span class="switch_to_div">切换到 :</span></div>';
            for (var i in json) {
                var connectedAccount = json[i].username;
                if ('PRIMARY' != json[i].domain) {
                    connectedAccount = json[i].domain + "/" + connectedAccount;
                }
                if ('carbon.super' != json[i].tenantDomain) {
                    connectedAccount = connectedAccount + '@' + json[i].tenantDomain;
                }
                htmlContent += '<li class="associated_accounts"><a href="javascript:void(0)" onclick="switchAccount(\'' +
                    connectedAccount + '\');"><i class="icon-user pdR2p"></i>' + connectedAccount + '</a></li>';

            }
            if ($('.dropdown-account', window.parent.document).find('.dropdown_separator') != null) {
                $('.dropdown-account', window.parent.document).find('.dropdown_separator').remove();
                $('.dropdown-account', window.parent.document).find('.associated_accounts').remove();
            }
            $('.dropdown-account', window.parent.document).append(htmlContent);
        }
    } else {
        if ($('.dropdown-account', window.parent.document).find('.dropdown_separator') != null) {
            $('.dropdown-account', window.parent.document).find('.dropdown_separator').remove();
            $('.dropdown-account', window.parent.document).find('.associated_accounts').remove();
        }
    }

    var sessionRefresherUrl = window.location.protocol + '//' + serverUrl + '/dashboard/refresh.jag';

    $.ajax({
        url: sessionRefresherUrl,
        type: "POST",
        data: "&userList=" + JSON.stringify(json)
    });
}

function reloadFedGrid(json) {
    $.ajax({
        url: "/portal/gadgets/connected_accounts/index.jag",
        type: "POST",
        data: {cookie : cookie, username : userName, action: "associatedIdList"},
        success: function (data) {
            var resp = $.parseJSON(data);
            if (resp.success == true) {
                fedJson = resp.data;
                drawPage();
            } else {

                if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                    window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                } else {
                    if (resp.message != null && resp.message.length > 0) {
                        message({
                            content: resp.message, type: 'error', cbk: function () {
                            }
                        });
                    } else {
                        message({
                            content: '加载网格数据值时出错了.',
                            type: 'error',
                            cbk: function () {
                            }
                        });
                    }
                }
            }
        },
        error: function (e) {
            message({
                content: '加载网格数据值时出错了.', type: 'error', cbk: function () {
                }
            });
        }
    });
}

function drawFedPage() {

    $("#fedGadgetBody").empty();

    if (fedJson != null) {
        var top =
            "    <div class=\"col-lg-12 content-section\">\n" +
            "        <table class=\"table table-bordered\">\n" +
            "            <thead>\n" +
            "                <tr>\n" +
            "                    <th class='txtAlnCen width40p'>身份提供者</th>\n" +
            "                    <th class='txtAlnCen width40p'>联邦用户 ID</th>\n" +
            "                    <th class='txtAlnCen'>操作</th>\n" +
            "                </tr>\n" +
            "            </thead>\n";

        var middle =
            "            <tbody>\n" +
            "                <tr>\n" +
            "                    <td> 主 OpenID </td>" +
            "                    <td>" + fedJson.primaryOpenID + "</td>\n" +
            "                    <td> </td>" +
            "                </tr>\n";


        if (isArray(fedJson.list)) {
            for (var i in fedJson.list) {
                middle = middle +
                    "                <tr>\n" +
                    "                    <td>" + fedJson.list[i].idPName + "</td>\n" +
                    "                    <td>" + fedJson.list[i].username + "</td>\n" +
                    "                    <td class='txtAlnCen'>\n" +
                    "                        <a title=\"\" onclick=\"deleteFedUserAccountConnection('" + fedJson.list[i].idPName + "' ,'" + fedJson.list[i].username + "');\" href=\"javascript:void(0)\"><i class=\"icon-trash\"></i> 移除</a>\n" +
                    "                    </td>\n" +
                    "                </tr>\n";
            }
        }

        var end = "            </tbody>\n" +
            "        </table>\n" +
            "    </div>";

        var output = top + middle + end;

        $("#fedGadgetBody").append(output);
    }
}

function deleteFedUserAccountConnection(idPId, username) {

    var msg = "你将要删除 Id '" + username + "' 从 IDP '" + idPId + "'. 确定要继续吗?";
    message({
        content: msg, type: 'confirm', okCallback: function () {
            $.ajax({
                url: "/portal/gadgets/connected_accounts/index.jag",
                type: "POST",
                data: {cookie : cookie, username : username, idPId : idPId, action: "fedDelete"},
                success: function (data) {
                    var resp = $.parseJSON(data);
                    if (resp.success == true) {
                        reloadFedGrid();
                    } else {
                        if (typeof resp.reLogin != 'undefined' && resp.reLogin == true) {
                            window.top.location.href = window.location.protocol + '//' + serverUrl + '/dashboard/logout.jag';
                        } else {
                            if (resp.message != null && resp.message.length > 0) {
                                message({
                                    content: resp.message, type: 'error', cbk: function () {
                                    }
                                });
                            } else {
                                message({
                                    content: '删除用户账号出错了.',
                                    type: 'error',
                                    cbk: function () {
                                    }
                                });
                            }
                        }
                    }
                },
                error: function (e) {
                    message({
                        content: '删除用户账号出错了.', type: 'error', cbk: function () {
                        }
                    });
                }
            });
        }, cancelCallback: function () {
        }
    });
}
