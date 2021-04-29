function moveEase(el, targetMove, fn) {
    if (el.offsetLeft == targetMove) {
        return;
    }

    // 为了避免定时器叠加把之前的定时器清除之后重新走
    clearInterval(el.timer);
    el.timer = setInterval(function() {
        // element.offsetParent 返回距离该元素最近的带有定位的父级元素
        // var currentPosition = el.offsetParent;
        // console.log(currentPosition);
        // 获取当前元素位置的left
        var currentLeft = el.offsetLeft;
        // 一次移动的步长
        var step = (targetMove - currentLeft) / 10; //可以把变量提在前面的函数作用域中避免，定时器循环执行循环创建变量，导致效率下降
        // 判断他是否往回移动
        if (Math.abs(step) < 1) {
            step = step > 0 ? 1 : Math.floor(step);
        }
        // step = (targetMove - currentLeft) > 0 ? step : -1 * step;
        // 移动的目标位置
        currentLeft += step; //设定的时间循环执行之后的left
        // 然后赋值给目标元素
        el.style.left = currentLeft + "px";
        // console.log("当前的left", circleLeft, "走的px", circleLeft, "差", targetMove - circleLeft, "步长", outStep);
        // if (Math.abs(circleLeft) > Math.abs(targetMove))
        // if (Math.abs(targetMove - circleLeft) < Math.abs(step)) {
        //     el.style.left = targetMove + "px";
        //     clearInterval(el.timer);
        // }
        if (targetMove == currentLeft) {
            // el.style.left = targetMove + "px";
            clearInterval(el.timer);
            if (fn) {
                fn();
            }
        }
    }, 1000 / 60);
}