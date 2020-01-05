/**
 * 函数
 * Touchview
 *
 * 作用
 * 快速实现元素的旋转与缩放
 *
 * 使用示例
 * new Touchview('#box')
 * new Touchview('img')
 *
 * 依赖
 * gesture.js
 * transformCSS.js
 */
function Touchview(selector) {
    //获取元素对象
    let el = document.querySelector(selector);
    //绑定事件
    gesture(el, {
        start: function () {
            //获取元素起始的样式
            el.initScale = transformCSS(el, 'scale');
            el.initRotate = transformCSS(el, 'rotate');
        },
        change: function (e) {
            //设置元素的变形
            transformCSS(el, 'rotate', el.initRotate + e.rotation);
            transformCSS(el, 'scale', el.initScale * e.scale);
        }
    });
}