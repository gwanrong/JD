/**
 * Created by GWR on 2016/8/15 0006.
 */
/*--AD--*/
(function () {
    var ad = document.getElementById('ad'),
        close = document.getElementById('close');
    close.onclick = function () {
        animate(ad, {opacity: 0, display: 'none'}, 400, 1)
    };
})();


/*--changeTab--*/
var changeTab = (function () {
    return {
        init: function (ul, div) {
            var list = utils.getElementsByClass(ul)[0],
                listHide = utils.getElementsByClass(div)[0],
                oLi = list.getElementsByTagName('li'),
                oDiv = listHide.getElementsByClassName('tabCon');
            for (var i = 0; i < oLi.length; i++) {
                oLi[i].index = i;
                oLi[i].onmouseover = function () {
                    listHide.style.display = 'block';
                    oDiv[this.index].style.display = 'block';
                };
                oLi[i].onmouseout = function () {
                    listHide.style.display = 'none';
                    oDiv[this.index].style.display = 'none';
                }
            }
        }
    }
})();
changeTab.init('bList', 'leftHide');
changeTab.init('tab', 'middleHide');

/*---banner---*/
var banner = (function () {
    var banner = utils.getElementsByClass('bMiddle')[0],
        bannerInner = utils.getElementsByClass('circle', banner)[0],
        imgs = bannerInner.getElementsByTagName('img'),
        focusList = banner.getElementsByTagName('ol')[0],
        lis = focusList.getElementsByTagName('li'),
        left = utils.getElementsByClass('aLeft', banner)[0],
        right = utils.getElementsByClass('aRight', banner)[0];
    var step = 0, timer = null, interval = 2000;

    function getData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "json/data.txt?_=" + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
                data = utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    function bindData() {
        if (data) {
            var str = "";
            var liStr = "";
            for (var i = 0; i < data.length; i++) {
                var curData = data[i];
                str += '<li><a href="javascript:;"><img src="" trueSrc="' + curData.src + '"/></a></li>';
                liStr += i === 0 ? '<li class="selected">1</li>' : '<li>' + (i + 1) + '</li>';

            }
            bannerInner.innerHTML = str;
            focusList.innerHTML = liStr;
        }
    }

    function imgsDelayLoad() {
        for (var i = 0; i < imgs.length; i++) {
            (function (i) {
                var curImg = imgs[i];
                if (curImg.isloaded) return;
                var tempImg = new Image();
                tempImg.src = curImg.getAttribute('trueSrc');
                tempImg.onload = function () {
                    curImg.src = this.src;
                    var curPar = curImg.parentNode;
                    utils.css(curPar.parentNode, "display", "block");
                    if (i === 0) {
                        utils.css(curPar.parentNode, 'zIndex', 1);
                        animate(curPar.parentNode, {opacity: 1}, 300);
                    } else {
                        utils.css(curPar.parentNode, "zIndex", 0);
                        utils.css(curPar.parentNode, 'opacity', 0);
                    }
                };
                tempImg = null;
                curImg.isloaded = true;
            })(i);
        }
    }

    function setBanner() {
        for (var i = 0; i < imgs.length; i++) {
            var curImg = imgs[i];
            var curPar = curImg.parentNode;
            if (i === step) { //
                utils.css(curPar.parentNode, 'zIndex', 1);
                animate(curPar.parentNode, {opacity: 1}, 300, function () {
                    var siblings = utils.siblings(this);
                    for (var j = 0; j < siblings.length; j++) {
                        var curSibling = siblings[j];
                        utils.css(curSibling, 'opacity', 0);
                    }
                });

            } else {
                utils.css(curPar.parentNode, 'zIndex', 0);
            }
        }
        for (var i = 0; i < lis.length; i++) {
            lis[i].className = i == step ? 'selected' : '';
        }
    }

    function bindEventForLi() {
        for (var i = 0; i < lis.length; i++) {
            var curLi = lis[i];
            curLi.index = i;
            curLi.onclick = function () {
                step = this.index;
                setBanner();
            }
        }
    }

    function autoMove() {
        if (step == data.length - 1) {
            step = -1;
        }
        step++;
        setBanner();
    }

    return {
        init: function () {
            getData();
            bindData();
            window.setTimeout(imgsDelayLoad, 500);
            timer = window.setInterval(autoMove, interval);
            bindEventForLi();
            banner.onmouseover = function () {
                window.clearInterval(timer);
            };
            banner.onmouseout = function () {
                //left.style.display = right.style.display = 'none';
                timer = window.setInterval(autoMove, interval);
            };
            left.onclick = function () {
                step--;
                if (step == -1) {
                    step = data.length - 1;
                }
                setBanner();
            };
            right.onclick = autoMove;
        }
    }
})();
banner.init();


/*--page---*/
(function pageChange() {
    var firstUl = utils.getElementsByClass('firstUl')[0],
        firstRight = utils.getElementsByClass('firstRight')[0],
        bMArrow = firstRight.getElementsByClassName('bMArrow')[0],
        left = bMArrow.getElementsByTagName('a')[0],
        right = bMArrow.getElementsByTagName('a')[1],
        oLis = firstUl.getElementsByTagName('li');
    var step = 0;
    utils.css(firstUl, 'width', (oLis.length) * 1000);
    utils.css(firstUl, 'left', -1000);
    left.onclick = function () {
        if (step <= 0) {
            step = oLis.length - 1;
            console.log(step);
            utils.css(firstUl, 'left', step * -1000);
        }
        step--;
        animate(firstUl, {left: -1000 * step}, 300);
    };
    right.onclick = function () {
        if (step > oLis.length - 3) {
            console.log(step);
            step = -1;
            utils.css(firstUl, 'left', 0);
        }
        step++;
        animate(firstUl, {left: -1000 * (step + 1)}, 300);
    }
})();

/*--guess---*/
var guessRender = (function () {
    (function lineChange() {
        var guessList = utils.getElementsByClass('guessList')[0],
            redCircle = utils.getElementsByClass('redCircle', guessList)[0];
        guessList.onmouseover = function () {
            animate(redCircle, {'right': 0}, 1000);
            utils.css(redCircle, 'right', 1208);
        };
    })();
    return {
        init: function () {

        }
    }
})();
guessRender.init();

/*----elevator----*/
var elevator = (function () {
    var winH = utils.win('clientHeight'),
        floor = document.getElementById('elevator'),
        firstFloor = utils.getElementsByClass('FLOOR')[0],
        floorDivs = utils.getElementsByClass('Floor'),
        floorLis = utils.getElementsByClass('hander'),
        footer = utils.getElementsByClass('footer')[0];

    function show() {
        var curHeight = utils.offset(firstFloor).top,
            curScrollTop = utils.win('scrollTop'),
            curFooter = utils.offset(footer).top;
        if ((curScrollTop + winH / 2) >= curHeight) {
            floor.style.display = 'block';
        } else if ((curScrollTop + 300) >= (curFooter)) {
            floor.style.display = 'none';
        } else {
            floor.style.display = 'none';
        }

    }


    return {
        init: function () {
            window.onscroll = show;
        }
    }
})();
elevator.init();

/*--toolbar--*/
var toolbarRender = (function () {
    var close = utils.getElementsByClass('J-close')[0],
        wrap = utils.getElementsByClass('J-wrap')[0],
        shopping = utils.getElementsByClass('J-tab-shopping')[0],
        top = utils.getElementsByClass('tool-footer-top')[0];

    function changeHeight() {
        var winH = $(window).innerHeight(),
            $con = $('.J-panel-content');
        var h = winH - 90;
        $con.css('height', h);
    }

    return {
        init: function () {
            shopping.onclick = function () {
                utils.css(wrap, 'right', '270px');
            };
            close.onclick = function () {
                utils.css(wrap, 'right', 0);
            };
            top.onclick = function () {
                window.clearInterval(top.timer);
                top.timer = window.setInterval(function () {
                    var curScrollTop = utils.win('scrollTop');
                    var speed = curScrollTop / 500 * 10;
                    if (curScrollTop <= 0) {
                        window.clearInterval(top.timer);
                        utils.win("scrollTop", 0);
                        return;
                    }
                    curScrollTop -= speed;
                    utils.win("scrollTop", curScrollTop);
                }, 500);
                window.onscroll = null;
            };
            changeHeight();
            $(window).on('resize', changeHeight);
        }
    }
})();
toolbarRender.init();

/*--silder--*/
var sliderRender=(function (){
    var step= 0,timer=null;
    return {
        init:function (silder,silderMain){
            var silder1=utils.getElementsByClass(silder)[0],
                silderMain2=utils.getElementsByClass(silderMain,silder1)[0],
                imgs=silderMain2.getElementsByTagName('img'),
                page = utils.getElementsByClass('page', silder1)[0],
                oLi = page.getElementsByTagName('li'),
                left = utils.getElementsByClass('aLeft',silder1)[0],
                right = utils.getElementsByClass('aRight',silder1)[0];
            utils.css(silderMain2,'width',440*imgs.length);
            timer=window.setInterval(autoMove,1000);
            function autoMove(){
                step++;
                if(step>=imgs.length-1){
                    step=0;
                    utils.css(silderMain2,'left',-step*440);
                }
                animate(silderMain2,{left:-step*440},300);
                for(var i=0;i<oLi.length;i++){
                    oLi[i].className=i==step?'selected':'';
                }
            }
            right.onclick=autoMove;
        }
    }
})();
sliderRender.init('auto','autoBody');

