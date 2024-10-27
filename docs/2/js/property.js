;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    constructor(target) {this._target=target}
    add(name, value=null, getter=null, setter=null) {
        // getter/setterの元であるprotectedプロパティは _ プロパティで一元管理する
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
        //Object.defineProperty(this._target, `_${name}`, {value:value, writable:true})
        //Object.defineProperty(this._target, `_${name}`, {value:value, writable:true})
        //this._[`${name}`] = value
        Object.defineProperty(this._target._, `${name}`, {value:value, writable:true})
        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
            ? getter
            : (this.#isFn(getter)
                ? this.#fnDescriptor(name, getter, setter)
                : this.#defaultDescriptor(name, getter, setter))
        )
    }
    //del(name) { delete this[`_${name}`]; delete this[`${name}`]; }
    del(name) { delete this._[`${name}`]; delete this[`${name}`]; }

    #isObj(v){return null!==v&&'object'===typeof v}
    #isDesc(v){return this.#isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #isFn(v){return 'function'===typeof v}
    #defaultDescriptor(name) { return {
        get(){return this._[`${name}`]},
        set(v){this._[`${name}`]=v},
//        get(){return this[`_${name}`]},
//        set(v){this[`_${name}`]=v},
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
