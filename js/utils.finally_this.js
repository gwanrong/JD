var utils = (function () {
    var isStandBrowser = 'getComputedStyle' in window;
    //把类数组转化成数组
    function listToArray(likeArray) {
        if (isStandBrowser) {
            return Array.prototype.slice.call(likeArray, 0);
        }
        var ary = [];
        for (var i = 0; i < likeArray.length; i++) {
            ary[ary.length] = likeArray[i]; //push,length是逐渐变长的
        }
        return ary;
    }

    function getRandom(n,m){
        n = Number(n);
        m = Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n > m){
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }

    //把json字符串去引号
    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ')');
    }

    //当前元素距离body的偏移量
    function offset(ele) {
        var l = null, t = null, parent = ele.offsetParent;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        while (parent) {
            l += parent.clientLeft + parent.offsetLeft;
            t += parent.clientTop + parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {left: l, top: t};
    }

    //如果有两个参数就给当前可视窗口(html||body)的属性赋值，如果是一个就是获取
    function win(attr, val) {
        if (typeof val != 'undefined') {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    /**
     * 获取当前元素的所有元素子节点
     * @param ele 当前元素
     * @param tagName 标签名：你传了这个参数我就在所有的元素子节点中把tagName这个标签名挑出来
     */
    function children(ele, tagName) {
        var ary = [];
        if (isStandBrowser) {
            ary = listToArray(ele.children); //把获取来的类数组转化成数组
        } else {
            var childnodes = ele.childNodes; //所有子节点
            for (var i = 0; i < childnodes.length; i++) {
                var curNode = childnodes[i];
                if (curNode.nodeType === 1) { //元素子节点
                    ary.push(curNode);
                }
            }
            childnodes = null;
        }
        //我需要return ary之前处理ary，把不包含传进来tagName的都去掉
        if (typeof tagName == 'string') { //至少你传了一个字符串
            for (var k = 0; k < ary.length; k++) {
                //判断ary中的元素的标签名字是否和传进来的字符串相同
                var cur = ary[k];
                if (cur.nodeName.toLowerCase() != tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }

    //获取上一个哥哥元素节点
    function prev(ele) {
        if (isStandBrowser) {
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType !== 1) { //如果符合这个条件说明pre不是一个元素哥哥,如果不是元素哥哥那么就要继续向上找
            pre = pre.previousSibling;
        }
        return pre;
    }

    //获取下一个弟弟元素
    function next(ele) {
        if (isStandBrowser) {
            return ele.nextElementSibling;
        }
        var next = ele.nextSibling;
        while (next && next.nodeType != 1) {
            next = next.nextSibling;
        }
        return next;
    }

    //获取所有的元素哥哥节点
    function previousAll(ele) {
        var ary = [];
        var pre = prev(ele); //获取来的就是上一个元素哥哥,如果pre不存在。那么说明一个元素哥哥都没有。那么while循环没有必要执行下去了
        while (pre) {
            ary.unshift(pre); //只要存在一个元素哥哥我就放到我的容器中
            //迭代就是让判断的条件pre这个变量从有到无的过程
            pre = prev(pre); //更新迭代pre的值，把哥哥的哥哥赋值pre。总会有一次pre再也不存在一个元素哥哥
        }
        return ary;
    }

    //获取所有的元素弟弟节点
    function nextAll(ele) {
        var ary = [];
        var nex = next(ele);
        while (nex) {
            ary.push(nex);
            nex = next(nex);
        }
        return ary;
    }

    //获取相邻的两个兄弟
    function sibling(ele) {
        var pre = prev(ele); //这个有可能是null
        var nex = next(ele); //也有可能是一个null
        var ary = []; //是用来装兄弟的，只要是null就不要放里面了
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    }

    //获取所有的元素兄弟节点
    function siblings(ele) {
        return previousAll(ele).concat(nextAll(ele)); //把所有的哥哥和弟弟放一起就是所有的兄弟元素节点
    }

    //获取当前元素的索引
    function index(ele) {
        return previousAll(ele).length;
    }

    //第一个元素孩子
    function firstEleChild(ele) {
        var childs = children(ele); //获取所有的元素孩子
        return childs.length > 0 ? childs[0] : null; //只要孩子的个数大于0我就认为至少有一个孩子，那么我就把孩子中的第一个拿出来
    }

    //最后一个元素孩子
    function lastEleChild(ele) {
        var childs = children(ele);
        return childs.length != 0 ? childs[childs.length - 1] : null;
    }

    //把元素添加到指定容器中
    function append(ele, container) { //container代表的是容器
        container.appendChild(ele);
    }

    //把ele添加到指定容器的开头
    function prepend(ele, container) {
        var first = firstEleChild(container); //获取容器的第一个孩子
        if (first) {
            container.insertBefore(ele, first);
            return;
        }
        container.appendChild(ele);
    }

    //把一个新的元素插入到旧元素前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //把新元素插入到旧元素之后
    function insertAfter(newEle, oldEle) {
        var nex = next(oldEle); //获取旧元素的弟弟，如果弟弟存在那么就插入在弟弟之前，如果不存在那么直接appenChild
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }

    //判断一个元素是否存在一个当前的类   <div class='c3 c2 c4 c3 '></div>  c3
    function hasClass(ele, strClass) {
        var reg = new RegExp('(^| +)' + strClass + '( +|$)');  // c3
        return reg.test(ele.className); //如果验证通过说明strClass在ele的className中出现过
    }

    //添加类 在ele.className 末尾追加字符串
    function addClass(ele, strClass) {
        var classAry = strClass.replace(/^ +| +$/g, '').split(/ +/g); //strClass = [c2,c3]
        for (var i = 0; i < classAry.length; i++) {
            var curClass = classAry[i];
            if (!hasClass(ele, curClass)) { //在ele中有curClass
                ele.className += ' ' + curClass;
            }
        }
    }

    //把ele中的strClass移除掉
    function removeClass(ele, strClass) {
        var classAry = strClass.replace(/^ +| +$/g, '').split(/ +/g);
        for (var i = 0; i < classAry.length; i++) {
            var curClass = classAry[i];
            if (hasClass(ele, curClass)) {
                var reg = new RegExp('(^| +)' + curClass + '( +|$)', 'g');
                ele.className = ele.className.replace(reg, ' ');
            }
        }
    }

    //通过类名获取元素
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (isStandBrowser) {
            return listToArray(context.getElementsByClassName(strClass));
        }
        var ary = [];
        var nodes = context.getElementsByTagName('*');
        var classAry = strClass.replace(/^ +| +$/g, '').split(/ +/g); //这是一个包换你传进来的那个字符串类名字参数中的所有类,然后判断这个数组中每一个类是否在每一个标签中都出现过，只要有个没出现那么这个标签就不符合条件。
        for (var i = 0; i < nodes.length; i++) {
            var curNode = nodes[i];
            var curNodeisOk = true; //假设当前是符合条件的
            for (var k = 0; k < classAry.length; k++) { //循环判断每一个类名字只要有一个不符合我就把假设条件破坏
                var curClass = classAry[k];
                var reg = new RegExp('(^| +)' + curClass + '( +|$)');
                if (!reg.test(curNode.className)) {
                    curNodeisOk = false;
                    break; //只要有一个class没出现过，后面的class再符合也没用了
                }
            }
            if (curNodeisOk) {
                ary.push(curNode);
            }
        }
        return ary;

    }

    //获取元素样式
    function getCss(attr) {
        var val = null;
        if (isStandBrowser) {
            val = window.getComputedStyle(this, null)[attr];
        } else { //ie低版本，对透明度的解释是不同的
            if (attr === 'opacity') { //只有透明度在ie低版本中用filter
                val = this.currentStyle.filter; //alpha(opacity=90.5)
                var reg = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        //如果是带单位的要去掉 133.23px -5px
        var regUnit = /^-?\d+(\.\d+)?(px|em|pt|rem|deg)?$/;
        if (regUnit.test(val)) { //如果符合这个正则那么返回值是带单位的，我就把单位去掉
            val = parseFloat(val);
        }
        return val;
    }

    //设置单个样式
    function setCss(attr, val) {
        if (attr == 'opacity') { //对透明度的单独处理
            this.style.opacity = val;
            this.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr == 'float') { //对浮动的单独处理
            this.style.cssFloat = val;
            this.style.styleFloat = val;
            return;
        }
        //对带单位还要处理：没有单位的要加上,一般哪些样式带单位
        var reg = /^(width|height|left|top|right|bottom|(border|margin|padding)(Left|Top|Right|Bottom)?)$/; //margin = 5px   marginLeft
        if (reg.test(attr)) {
            //如果有单位就没有必要加了  val = 5px   val = 5
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        this.style[attr] = val;
    }

    //设置一组样式==> 循环设置单个
    function setGrooupCss(options) {
        for (var key in options) {
            //Object.prototype.opacity = 0.8;
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]); //这里的this是ele，从css那里弄过来的
            }
        }
    }

    //css方法：根据参数个数的不同做不用的操作   getCss(ele,attr) setCss(ele,attr,val);
    //setGroupCss(ele,options)
    function css(ele) {//,attr,val
        //如果attr传了，并且传的是一个字符串类型 ==> getCss 要获取某一个元素的样式
        //如果attr传了，并且传的是一个对象  ==> setGroupCss
        //如果第二个参数是字符串并且第三个参数也传了，==> setCss 设置单个css样式
        var aryArgu = listToArray(arguments).slice(1); //aryArgu代表从第二个参数到末尾
        var secondArg = arguments[1]; //第二个参数
        var thirdArg = arguments[2];
        if (typeof secondArg == 'string') { //第二个参数传了，并且还是字符串那么暂时有两种情况 1 获取  2 设置
            if (typeof thirdArg == 'undefined') {
                return getCss.apply(ele, aryArgu);
            }
            setCss.apply(ele, aryArgu);

        }
        secondArg = secondArg || []; //为了防止第二个参数是undeifned的toString不报错
        if (secondArg.toString() === '[object Object]') { //判断第二个参数是不是一个对象
            //批量设置样式
            setGrooupCss.apply(ele, aryArgu);
        }
    }

    return {
        getRandom : getRandom,
        listToArray: listToArray,
        jsonParse: jsonParse,
        offset: offset,
        win: win,
        children: children,
        prev: prev,
        next: next,
        previousAll: previousAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        fistEleChild: firstEleChild,
        lastEleChild: lastEleChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        /*
         getCss : getCss,
         setCss : setCss,
         setGroupCss : setGrooupCss,
         */
        css: css
    }

})();
