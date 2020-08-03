/** 
 * 辅助工具
 * tool
 */

window.tool = {};
tool.mouseCapture = function (element, touchStartEvent, touchMoveEvent, touchEndEvent) {

    if (!element) return;

    // 判断是否是移动端
    var isTouch = ('ontouchend' in document);
    isTouch = false;
    var touchstart = null;
    var touchmove = null
    var touchend = null;
    if (isTouch) {
        touchstart = 'touchstart';
        touchmove = 'touchmove';
        touchend = 'touchend';
    } else {
        touchstart = 'mousedown';
        touchmove = 'mousemove';
        touchend = 'mouseup';
    };

    // 获取鼠标焦点
    function getPoint(event) {

        event = event || window.event;
        // 这里获取的鼠标距离目标元素的偏移量
        // var x = (event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) - element.offsetLeft;
        // var y = (event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop) - element.offsetTop;

        // 这里又考虑到 html的 margin 值，万一有谁非要在html上设置 margin呢
        // var x = (event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) - window.getComputedStyle(document.documentElement).marginLeft.slice(0, -2) - canvas.offsetLeft;
        // var y = (event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop) - window.getComputedStyle(document.documentElement).marginTop.slice(0, -2) - canvas.offsetLeft;

        // 直接用offsetX
        var x = event.offsetX;
        var y = event.offsetY;

        return {
            x: x,
            y: y
        };
    }

    element.addEventListener(touchstart, function (event) {
        event.point = getPoint(event);
        touchStartEvent && touchStartEvent.call(this, event);
    }, false);

    /*为element元素绑定touchmove事件*/
    element.addEventListener(touchmove, function (event) {
        event.point = getPoint(event);
        touchMoveEvent && touchMoveEvent.call(this, event);
    }, false);

    /*为element元素绑定touchend事件*/
    element.addEventListener(touchend, function (event) {
        event.point = getPoint(event);
        touchEndEvent && touchEndEvent.call(this, event);
    }, false);
};