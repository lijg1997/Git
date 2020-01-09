//该文件模拟原生Promise
(function() {
    const PENDING = 'pending' //定义常量,用来储存初始化状态字符
    const RESOLVED = 'resolved' //定义常量,用来储存成功状态字符
    const REJECTED = 'rejected' //定义常量,用来储存失败状态字符

    //Promise构造函数
    function Promise(executor) {
        const self = this //缓存this
        self.status = PENDING //初始化实例的状态
        self.data = undefined //初始化实例所保存的值,（后期可能是成功的value，或是失败的reason）
        self.callback = [] //用来保存一组一组的回调函数
            /* self.callbacks形如：
            [
                {onResolved:()=>{},onRejected:()=>{}},
                {onResolved:()=>{},onRejected:()=>{}}
            ] */

        //调用resolve：1.内部状态改为resolved，2.保存成功的value，3.去callbacks中取出所有的onResolved依次异步调用
        function resolve(value) {
            //实例的状态只能改变一次,如果值发生过变化,不是PENDING,直接return
            if (self.status !== PENDING) return
                //1.内部状态改为resolved
            self.status = RESOLVED
                //2.保存成功的value
            self.data = value
                //3.去callbacks中取出所有的onResolved依次异步调用
            setTimeout(() => {
                self.callback.forEach((cbkObj) => {
                    cbkObj.onResolved(self.data)
                })
            });
        }

        //调用reject会：1.内部状态改为rejected，2.保存失败的reason，3.去callbacks中取出所有的onRejected依次异步调用
        function reject(reason) {
            if (self.status !== PENDING) return
            self.status = REJECTED
            self.data = reason
            setTimeout(() => {
                self.callback.forEach((cbkObj) => {
                    cbkObj.onRejected(self.data)
                })
            });
        }
        //保险起见，使用try catch调用
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    /* 一、then做什么？
        1.如果调用then的时候，Promise实例状态为resolved，去执行onResolved回调。
        2.如果调用then的时候，Promise实例状态为rejected，去执行onRejected回调。
        3.如果调用then的时候，Promise实例状态为pending，不去执行回调，去将onResolved和onRejected保存起来 
    二、then的返回值是什么？
        返回的是Promise的实例对象，返回的这个Promise实例对象的状态、数据如何确定？
        1.如果then所指定的回调执行是抛出了异常，then返回的那个Promise实例状态为：rejected，reason是该异常
        2.如果then所指定的回调返回值是一个非Promise类型，then返回的那个Promise实例状态为：resolved，value是该返回值
        3.如果then所指定的回调返回值是一个Promise实例，then返回的那个Promise实例状态、数据与之一致。 */
    Promise.prototype.then = function(onResolved, onRejected) {
        const self = this

        //下面这行代码，作用是：让catch具有传递功能
        onResolved = typeof onResolved === 'function' ? onResolved : value => value

        //下面这行代码，作用是：将错误的reason一层一层抛出
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        }

        return new Promise((resolve, reject) => {
            //专门用于执行onResolved,onRejected
            function handle(callback) {
                try {
                    let result = callback(self.data)
                    if (result instanceof Promise) {
                        //进入此判断，意味着：返回值是一个Promise实例
                        result.then(
                            value => resolve(value),
                            reason => reject(reason)
                        )
                    } else {
                        //进入此else，意味着：返回值是一个，非Promise实例
                        resolve(result)
                    }
                } catch (error) {
                    //进入catch,意味着：返回值抛出异常
                    reject(error)
                }
            }

            if (self.status === RESOLVED) {
                //1.如果调用then的时候，Promise实例状态为resolved，去执行onResolved回调。
                setTimeout(() => {
                    handle(onResolved)
                });
            } else if (self.status === REJECTED) {
                //2.如果调用then的时候，Promise实例状态为rejected，去执行onRejected回调。
                setTimeout(() => {
                    handle(onRejected)
                });
            } else {
                //3.如果调用then的时候，Promise实例状态为pending，不去执行回调，去将onResolved和onRejected保存起来 
                self.callback.push({
                    onResolved: () => handle(onResolved),
                    onRejected: () => handle(onRejected)
                })
            }
        })
    }

    //catch方法只允许传一个参数，即使传两个，第一个也会被默认改为undefined
    Promise.prototype.catch = function(onRejected) {
        return this.then(undefined, onRejected)
    }

    //构造函数的resolve方法，如果传非Promise类型或成功的Promise实例，返回的全部都是成功状态的Promise实例，
    //如果传入的是失败的Promise实例，返回的将会变成失败状态的Promise实例
    Promise.resolve = function(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(
                    val => resolve(val),
                    reason => reject(reason)
                )
            } else {
                resolve(value)
            }
        })
    }

    //构造函数的reject方法，返回的全部都是失败的Promise实例，失败的值就是传入的reason
    //因为完全是用JS写的Promise，所以返回的结果和用C写出来的结果有所不同，这是没办法的
    Promise.reject = function(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    //构造函数的resolveDelay方法，是自己新增的，可以做到延时确定成功状态，用法与resolve一致，
    //只需要传两个参数，第二个是延时的时间，单位毫秒
    Promise.resolveDelay = function(value, timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value instanceof Promise) {
                    value.then(
                        val => resolve(val),
                        reason => reject(reason)
                    )
                } else {
                    resolve(value)
                }
            }, timeout);
        })
    }

    //构造函数的rejectDelay方法，是自己新增的，可以做到延时确定失败状态，用法与reject一致，
    //只需要传两个参数，第二个是延时的时间，单位毫秒
    Promise.rejectDelay = function(reason, timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(reason)
            }, timeout);
        })
    }

    /* 构造函数的all方法，传入的是多个Promise实例，它所返回的新的Promise实例的状态分两种情况，
        1.如果有一个实例失败了，新的Promise实例的状态就是失败状态，失败的reason就是第一个失败实例的reason，其他实例的状态不管
        2.如果所有的实例都成功了，新的Promise实例的状态才是成功，成功的value是有所成功实例按顺序传入所排列好的value
    */
    Promise.all = function(promiseArr) {
        return new Promise((resolve, reject) => {
            let resolvedCount = 0
            let values = []
            promiseArr.forEach((promise, index) => {
                promise.then(
                    value => {
                        resolvedCount++
                        values[index] = value
                        if (resolvedCount === promiseArr.length) {
                            resolve(values)
                        }
                    },
                    reason => reject(reason)
                )

            })
        })
    }

    //构造函数的race方法，传入的是多个Promise实例，它所返回的新的Promise实例的状态，只看传进来实例中第一个确定状态的实例
    Promise.race = function(promiseArr) {
        return new Promise((resolve, reject) => {
            promiseArr.forEach((promise) => {
                promise.then(
                    value => resolve(value),
                    reason => reject(reason)
                )
            })
        })
    }

    //替换掉window上的Promise
    window.Promise = Promise
})()