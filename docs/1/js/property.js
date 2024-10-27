;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    constructor(target) {this._target=target}
    add(name, value=null, getter=null, setter=null) {
        Object.defineProperty(this._target, `_${name}`, {value:value, writable:true})
        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
            ? getter
            : (this.#isFn(getter)
                ? this.#fnDescriptor(name, getter, setter)
                : this.#defaultDescriptor(name, getter, setter))
        )
        //Object.defineProperty(this._target, `${name}`, null===getter && null===setter ? this.#defaultDescriptor(name) : this.#funcDescriptor(name, getter, setter))
        /*
        Object.defineProperty(this._target, `${name}`, {
            get(){return this[`_${name}`]},
            set(v){this[`_${name}`]=v},
            enumerable:true,
        })
        */
        /*
        Object.defineProperty(this._target, `${name}`, null===getter && null===setter ? {
            get(){return this[`_${name}`]},
            set(v){this[`_${name}`]=v},
            enumerable:true,
        } : )


        const descriptor = {}
        if ('function'===typeof getter){descriptor['get'] = getter}
        if ('function'===typeof setter){descriptor['set'] = setter}
        Object.defineProperty(this._target, `${name}`, descriptor)
        Object.defineProperty(descriptor, `get`, {value:value})
        descriptor.

        get:getter,
        set:setter,
        */
    }
    // add(function(){return this}, )
    del(name) { delete this[`_${name}`]; delete this[`${name}`]; }

    #isObj(v){return null!==v&&'object'===typeof v}
    #isDesc(v){return this.#isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #isFn(v){return 'function'===typeof v}
    #defaultDescriptor(name) { return {
        get(){return this[`_${name}`]},
        set(v){this[`_${name}`]=v},
        enumerable:true,
    } }
    #fnDescriptor(name, getter, setter) {
        const d = {}
        if ('function'===typeof getter){d['get'] = getter.bind(this._target)}
        if ('function'===typeof setter){d['set'] = setter.bind(this._target)}
        return d
    }
}
window.Property = Property
})();
