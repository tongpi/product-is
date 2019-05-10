function drawPage() {
    console.log(json);
    var output = "";
    var body = "    <div class=\"col-lg-12 content-section\">\n" +
        "        <input type=\"hidden\" name=\"appName\" value=\"\" />\n" +
        "        <table class=\"table table-bordered\">\n" +
        "            <thead>\n" +
        "                <tr>\n" +
        "                    <th>授权的应用</th>\n" +
        "                    <th>应用开发者</th>\n" +
        "                    <th>操作</th>\n" +
        "                </tr>\n" +
        "            </thead>\n" +
        "            <tbody>\n";
    if (json != null) {

        if (isArray(json.return)) {

            for (var i in json.return) {

                var username = json.return[i].username;

                if (username.indexOf("carbon.super") > -1) {
                    username = username.substring(0, username.indexOf("carbon.super") - 1);
                }

                body = body + "                <tr>\n" +
                    "                    <td>" + json.return[i].applicationName + "</td>\n" +
                    "                    <td>" + username + "</td>\n" +
                    "                    <td><a title=\"移除应用\" onclick=\"validate('" + json.return[i].
                    applicationName + "');\"\n" +
                    " href=\"javascript:void(0)\"><i class=\"icon-trash\"></i> 移除应用</a></td>\n" +
                    "                </tr>\n";
            }
        }
        else {

            var username = json.return.username;

            if (username.indexOf("carbon.super") > -1) {
                username = username.substring(0, username.indexOf("carbon.super") - 1);
            }

            body = body + "                <tr>\n" +
                "                    <td>" + json.return.applicationName + "</td>\n" +
                "                    <td>" + username + "</td>\n" +
                "                    <td><a title=\"移除应用\" onclick=\"validate('" + json.return.
                applicationName + "');\"\n" +
                " href=\"javascript:void(0)\"><i class=\"icon-trash\"></i> 移除应用</a></td>\n" +
                "                </tr>\n";
        }
    }
    body = body + "            </tbody>\n" +
        "        </table>\n" +
        "\n" +
        "    </div>";

    output = body;
    $("#gadgetBody").empty();
    $("#gadgetBody").append(output);
}

function itemRemove(appName) {
    var str = PROXY_CONTEXT_PATH + "/portal/gadgets/user_auth_apps/controllers/my_auth_apps/my_authorized_app_remove.jag";
    $.ajax({
        url:str,
        type:"POST",
        data:"appName=" + appName + "&cookie=" + cookie + "&user=" + userName
    })
        .done(function (data) {
            cancel();

        })
        .fail(function () {
            message({content:'移除应用出错 ', type:'error', cbk:function () {
            } });
            console.log('error');

        })
        .always(function () {
            console.log('completed');
        });

}

function isArray(element) {
    return Object.prototype.toString.call(element) === '[object Array]';
}

function cancel() {
    gadgets.Hub.publish('org.wso2.is.dashboard', {
        msg:'A message from User profile',
        id:"user_auth_apps .shrink-widget"
    });

}

function validate(appName) {
    var element = "<div class=\"modal fade\" id=\"messageModal\">\n" +
        "  <div class=\"modal-dialog\">\n" +
        "    <div class=\"modal-content\">\n" +
        "      <div class=\"modal-header\">\n" +
        "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
        "        <h3 class=\"modal-title\">标题</h4>\n" +
        "      </div>\n" +
        "      <div class=\"modal-body\">\n" +
        "        <p>One fine body&hellip;</p>\n" +
        "      </div>\n" +
        "      <div class=\"modal-footer\">\n" +
        "      </div>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>";
    $("#message").append(element);
    itemRemoveValidate(appName);
}

function itemRemoveValidate(appName) {
    var msg = "你简要移除应用 " + appName + ". 确定要继续吗?";
    message({content:msg, type:'confirm', okCallback:function () {
        itemRemove(appName);
    }, cancelCallback:function () {
    }});
}
