function Swiper(selector, options) {
    //对loop选项功能进行设置
    // if (options !== undefined) {
    //     if (options.loop !== undefined) {
    //         var loop = options.loop;
    //     } else {
    //         var loop = false;
    //     }
    // } else {
    //     var loop = false;
    // }
    var loop = options !== undefined && options.loop !== undefined ? options.loop : false;
    var auto = options !== undefined && options.auto !== undefined ? options.auto : false;
    var dots = options !== undefined && options.dots !== undefined ? options.dots : false;
    var timeout = options !== undefined && options.timeout !== undefined ? options.timeout : 2000;
    var container = document.querySelector(selector);
    var wrapper = container.querySelector('.swiper-wrapper');
    var index = 0;
    var swiperItem = wrapper.querySelectorAll('.swiper-item');
    var len = swiperItem.length;
    var pagination = container.querySelector('.swiper-pagination');
    var points = document.getElementsByTagName('span');
    var autoTimer = null;
    if (loop) {
        //复制一份幻灯片内容
        wrapper.innerHTML += wrapper.innerHTML;
    }
    var length = wrapper.querySelectorAll('.swiper-item').length;
    var isFirst = true;
    var isHori = false;
	//开始点击
    container.addEventListener('touchstart', function (e) {
        if (loop) {
            //设置无缝滚动
            if (index === 0) {
                index = len;
                //滚动开关调用
                switchSlide(index, false);
            } else if (index === length - 1) {
                index = len - 1;
                switchSlide(index, false);
            }
        }
        //滚动优化
        container.x = e.changedTouches[0].clientX;
        container.y = e.changedTouches[0].clientY;
        container.l = transformCss(wrapper, 'translateX');
        wrapper.style.transition = 'none';
        //获取点击时间
        container.d1 = Date.now();
        //点击清除自动轮播
        clearInterval(autoTimer);
    });
	//移动
    container.addEventListener('touchmove', function (e) {
        container._x = e.changedTouches[0].clientX;
        container._y = e.changedTouches[0].clientY;
        var newLeft = container._x - container.x + container.l;
        //滚动优化
        var disX = Math.abs(container._x - container.x);
        var disY = Math.abs(container._y - container.y);
        if (isFirst) {
            isFirst = false;
            if (disX > disY) {
                isHori = true;
            } else {
                isHori = false;
            }
        }
        if (isHori) {
            e.preventDefault();
        } else {
            return;
        }
        transformCss(wrapper, 'translateX', newLeft);
    });
	//结束点击
    container.addEventListener('touchend', function (e) {
        //重置是否第一次
        isFirst = true;
        //抬起开启自动播放
        autoPlay();
        container._x = e.changedTouches[0].clientX;
        //获取抬起时间
        container.d2 = Date.now();
        var disX = Math.abs(container._x - container.x);
        var disTime = container.d2 - container.d1;
        if (disX >= container.offsetWidth / 2 || disTime <= 300) {
            if (container._x > container.x) {
                index--;
            } else {
                index++;
            }
        }
        //滚动开关调用
        switchSlide(index);
    });
	//动态设置内容宽度
    init();

    function init() {
        //动态设置包裹容器宽度
        wrapper.style.width = 100 * length + '%';
        //动态创建小圆点，设置高亮
        //获取新的内容
        var item = wrapper.querySelectorAll('.swiper-item');
        item.forEach(function (item) {
            item.style.width = 100 / length + '%';
        });
        //设置是否显示小圆点
        if(!dots) return;
        for (let i = 0; i < len; i++) {
            var spanNode = document.createElement('span');
            if (i === 0) {
                spanNode.className = 'active';
            }
            pagination.appendChild(spanNode);
        }
    }

	//设置自动播放
    autoPlay();

    function autoPlay() {
        if(!auto) return;
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            index++;
            //滚动开关调用
            switchSlide(index);
        }, timeout)
    }

	//过渡结束检测越界
    wrapper.addEventListener('transitionend', function () {
        if (index === length - 1) {
            index = len - 1;
            //滚动开关调用
            switchSlide(index, false);
        }
    });

	//封装滚动开关
    function switchSlide(i, isTransition = true) {
        //判断索引是否越界
        if (i <= 0) {
            i = 0;
        } else if (i >= length - 1) {
            i = length - 1;
        }
        if (isTransition) {
            wrapper.style.transition = 'all .5s'
        } else {
            wrapper.style.transition = 'none';
        }
        //根据index计算wrapper的translate值
        var newLeft = -i * container.offsetWidth;
        transformCss(wrapper, 'translateX', newLeft);
        //设置是否显示小圆点
        if(!dots) return;
        //小圆点高亮
        for (let j = 0; j < points.length; j++) {
            points[j].className = '';
        }
        points[i % len].className = 'active';
    }
}