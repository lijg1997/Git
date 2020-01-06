function getRandom(a, b) {
    //获取一个区间的随机数
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function getRandomCode(n) {
    //获取随机验证码，位数可以自己确定
    var str = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    var code = "";
    for (var i = 0; i < n; i++) {
        code += str[Math.floor(Math.random() * str.length)];
    }
    return code;
}

function getDateAndTimeString() {
    //获取当地的年月日时间
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var time = date.toLocaleTimeString();
    //	return "现在是" + year + "年" + month + "月" + day + "日 " + time;
    return `现在是${year}年${month}月${day}日${time}`;
}

function getOrSetElementContent(obj, content) {
    //兼容处理textContent和innerText读写
    if (arguments.length == 1) {
        //获取内容，看看你是什么浏览器//
        if (obj.textContent) {
            //高级浏览器  obj.textContent是可以获取到内容的，最次也是一个空白或者换行
            return obj.textContent;
        } else {
            //低级浏览器  obj.textContent是获取不到内容的，拿到的一定是undefined
            return obj.innerText;
        }
    } else if (arguments.length == 2) {
        //设置内容
        if (obj.textContent) {
            obj.textContent = content;
        } else {
            obj.innerText = content;
        }
    }
}

function getFirstElementNode(node) {
    //兼容封装获取第一个元素节点
    if (node.firstElementChild) {
        //高级
        return node.firstElementChild;
    } else {
        //低级
        var result = node.firstChild;
        while (result.nodeType != 1) {
            result = result.nextSibling;
        }
        return result;
    }
}

function getLastElementNode(node) {
    //兼容封装获取最后一个元素节点
    if (node.lastElementChild) {
        //高级
        return node.lastElementChild;
    } else {
        var result = node.lastChild;
        while (result.nodeType != 1) {
            result = result.previousSibling;
        }
        return result;
    }
}

function addEvent(node, eventType, callback, isBubble) {
    //dom2事件绑定兼容处理
    if (node.addEventListener) {
        //高级浏览器和ie10以上的IE
        node.addEventListener(eventType, callback, isBubble);
    } else {
        //ie10以下的IE
        node.attachEvent('on' + eventType, callback);
    }
}

window.onload = function() {
    //拖拽模板
    box.onmousedown = function(event) {
        event = event || window.event;
        var eleX = box.offsetLeft;
        var eleY = box.offsetTop;
        var startX = event.clientX;
        var startY = event.clientY;
        box.setCapture && box.setCapture();
        document.onmousemove = function(event) {
            event = event || window.event;
            var endX = event.clientX;
            var endY = event.clientY;
            var disX = endX - startX;
            var disY = endY - startY;
            var lastX = eleX + disX;
            var lastY = eleY + disY;
            box.style.left = lastX + 'px';
            box.style.top = lastY + 'px';
        }
        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
            //全局捕获有添加就有释放；
            box.releaseCapture && box.releaseCapture()
        }
        return false;
    }
}

box.addEventListener('mousewheel', scrollMove);
box.addEventListener('DOMMouseScroll', scrollMove);
//滚轮模板
var flag = true; //代表往上
function scrollMove(event) {
    event = event || window.event;
    //区分检测鼠标滚轮是往上还是往下滚动
    if (event.wheelDelta) {
        //是ie或者谷歌
        if (event.wheelDelta > 0) {
            //往上滚的
            flag = true
        } else {
            //往下滚的
            flag = false
        }
    } else if (event.detail) {
        //是火狐
        if (event.detail > 0) {
            //往下滚的
            flag = false
        } else {
            //往上滚的
            flag = true;
        }
    }
}

function add(a, b, ...arr) {
    //打包 通常是在函数传参的时候,我们也称作不定参传参
    let sum = 0;
    console.log(arr instanceof Array);
    console.log(arr);
    //for of循环
    for (let value of arr) {
        sum += value;
        //for of遍历的是值 不是下标
    }
    return a + b + sum;
}

function myIterator() {
    //这个接口让数组使用for of  也可以让对象使用
    let that = this;
    let index = 0; //代表刚开始指向数组的起始位置
    if (this instanceof Array) {
        let length = this.length;
        return {
            next: function() {
                return index < length ? {
                    value: that[index++],
                    done: false
                } : {
                    value: undefined,
                    done: true
                };
            }
        }
    } else {
        let keysArr = Object.keys(this); //把对象得所有属性组成一个数组返回；
        let length = keysArr.length;
        return {
            next: function() {
                return index < length ? {
                    value: that[keysArr[index++]],
                    done: false
                } : {
                    value: undefined,
                    done: true
                };
            }
        }
    }
}
Array.prototype[Symbol.iterator] = myIterator;
Object.prototype[Symbol.iterator] = myIterator;

function checkType(data) {
    //封装函数实现自定义检测数据类型
    return Object.prototype.toString.call(data).slice(8, -1);
}

function deepCopy(data) { //拷贝的都是对象数据类型
    //深拷贝封装实现
    let dataType = checkType(data);
    let result;
    if (dataType == 'Array') {
        result = [];
    } else if (dataType == 'Object') {
        result = {};
    } else {
        result = data;
        return result;
    }
    for (let key in data) {
        if (checkType(data[key]) == 'Array' || 'Object') {
            result[key] = deepCopy(data[key]);
        } else {
            result[key] = data[key];
        }
    }
    return result;
}

function getAndSetPx(oldData, newData, size, x, y) {
    //设置马赛克
    for (var i = 0; i < oldData.width / size; i++) {
        for (var j = 0; j < oldData.height / size; j++) {
            var color = getPx(oldData, Math.floor(i * size + Math.random() * size),
                Math.floor(j * size + Math.random() * size));
            for (var a = 0; a < size; a++) {
                for (var b = 0; b < size; b++) {
                    setPx(newData, i * size + a, j * size + b, color);
                }
            }
        }
    }
    painting.putImageData(newData, x, y);
}

function setPx(ImageData, x, y, color) {
    //写入像素
    var width = ImageData.width;
    ImageData.data[(width * y + x) * 4 + 0] = color[0]; //255
    ImageData.data[(width * y + x) * 4 + 1] = color[1]; //0
    ImageData.data[(width * y + x) * 4 + 2] = color[2]; //0
    ImageData.data[(width * y + x) * 4 + 3] = color[3]; //255
}

function getPx(ImageData, x, y) {
    //单个像素读取
    //创建一个数组，保存颜色
    var colorArr = [];
    var width = ImageData.width;
    colorArr[0] = ImageData.data[(width * y + x) * 4 + 0]; //r
    colorArr[1] = ImageData.data[(width * y + x) * 4 + 1]; //g
    colorArr[2] = ImageData.data[(width * y + x) * 4 + 2]; //b
    colorArr[3] = ImageData.data[(width * y + x) * 4 + 3]; //a
    return colorArr;
}

function draw(cx, cy, radius) {
    //探照灯
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    var radialGradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);

    radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radialGradient.addColorStop(.65, 'rgba(0, 0, 0, 1)');
    radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'destination-out';

    ctx.arc(cx, cy, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = radialGradient;
    ctx.fill();
    ctx.restore();
}