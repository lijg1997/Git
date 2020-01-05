//封装设置/获取transform属性/属性值

function transformCss(el, type, value) {
    // el.style.transform = type +'('+ value +'px)';
    //box.style.transform = 'translateX(200px) scale(2)'
    //设置transform
    if (el.store === undefined) {
        el.store = {};
    }
    if (arguments.length === 3) {
        var str = '';
        el.store[type] = value;
        for (i in el.store) {
            switch (i) {
                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    str += i + '(' + el.store[i] + 'px)';
                    break;
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':
                    str += i + '(' + el.store[i] + ')';
                    break;
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    str += i + '(' + el.store[i] + 'deg)'
            }
            el.style.transform = str;
        }
    }
    //获取transform的value值
    if(arguments.length === 2){
        //判断store中是否存在值，如果存在，返回存在的值，否则返回默认值 translate 0 rotate 0 scale 1
        if(el.store[type] !== undefined){
            return el.store[type];
        }else{
            if(type.substr(0,5) === 'scale'){
                return 1;
            }else{
                return 0;
            }
        }
    }
}