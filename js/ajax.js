//->createXHR:创建AJAX对象,兼容所有的浏览器,使用惰性思想进行封装处理
function createXHR() {
    var xhr = null, flag = 0;
    var ary = [
        function () {
            return new XMLHttpRequest;
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    ];
    for (var i = 0, len = ary.length; i < len; i++) {
        try {
            var tempFn = ary[i];
            xhr = tempFn();
            //->success
            flag++;
            createXHR = tempFn;
            break;
        } catch (e) {
            //->error
        }
    }
    if (flag === 0) {
        throw new ReferenceError("your browser is not support ajax!");
    }
    return xhr;
}

//->ajax:封装一个AJAX请求数据的方法,以后只要是请求数据,我们直接的调取这个方法执行即可
function ajax(options) {
    //->init parameter
    var _default = {
        url: null,
        type: 'get',
        dataType: 'json',
        async: true,
        data: null,
        success: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->SEND AJAX
    var xhr = createXHR();
   if (_default.type === 'get') {
        var code = _default.url.indexOf('?') > -1 ? '&' : '?';
        _default.url += code + '_=' + Math.random();
    }
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var text = xhr.responseText;
            if (_default.dataType === 'json') {
                text = "JSON" in window ? JSON.parse(text) : eval('(' + text + ')');
            }
            _default.success && _default.success.call(xhr, text);
        }
    };
    xhr.send(_default.data);
}