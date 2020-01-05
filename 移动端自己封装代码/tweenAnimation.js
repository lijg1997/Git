/**
    函数名
    tweenAnimation

    函数功能
    帮我们实现动画效果 类似 transition 效果

    示例  2s left  100 -> 800   //t=0
    tweenAnimation(el, 'left', 100, 800, 2000, 20, 'linear');

    // 3s  width 200 ->  900
    tweenAniation(el, 'width', 200, 900, 3000, 30, 'linear');
    tweenAniation(el, 'width', 200, 900, 3000, 30, 'easeout');
    tweenAniation(el, 'width', 200, 900, 3000, 30, 'back');

    依赖
    - transformCSS

 */
/**
 *
 * @param el            元素对象
 * @param style         CSS 样式
 * @param init          起始状态
 * @param end           结束状态
 * @param duration      过渡的时间
 * @param timeout       时间间隔
 * @param type          过渡的类型
 */

function tweenAnimation(el, style, init, end, duration, timeout, type) {
	//tween 函数声明
	let tween = {
		linear: function(t, b, c, d) {
			return c * t / d + b;
		},
		easeout: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		back: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}
	};
	//参数
	if (el.timer === undefined) {
		el.timer = {};
	}
	el.timer[style] = null;
	let t = 0;
	let b = init;
	let c = end - init;
	let d = duration;
	let step = timeout;
	//安全起见
	clearInterval(el.timer[style]);
	el.timer[style] = setInterval(function() {
		//0. 清空定时器
		if (t >= d) {
			clearInterval(el.timer[style]);
			return;
		}
		//1. 时间自增
		t += step;
		//2. 计算当前的样式值
		let res = tween[type](t, b, c, d);
		//3. 设置样式
		switch (style) {
			case 'width':
			case 'height':
			case 'left':
			case 'top':
				el.style[style] = res + 'px';
				break;

			case 'translateX':
			case 'translateY':
			case 'translateZ':
			case 'scale':
			case 'scaleX':
			case 'scaleY':
			case 'scaleZ':
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
			case 'rotateZ':
				transformCSS(el, style, res);
				break;

			case 'opacity':
				el.style[style] = res;
				break;
		}
	}, step);

}
