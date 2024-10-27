;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    constructor(target) {this._target=target} // target は instance を想定している
    add(name, value=null, getter=null, setter=null) {
        // getter/setterの元であるprotectedプロパティは _ プロパティで一元管理する
        //if (!this._target.hasOwnProperty('_')) { this._target['_'] = {} }
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
        Object.defineProperty(this._target._, `${name}`, {value:value, writable:true})
        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
            ? getter
            : (this.#isFn(getter)
                ? this.#fnDescriptor(name, getter, setter)
                : this.#defaultDescriptor(name, getter, setter))
        )
    }
    get(name, value=null, getter=null) {
        //if (!this._target.hasOwnProperty('_')) { this._target['_'] = {} }
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
        if (this.#isDesc(getter) && !getter.hasOwnProperty('get')) {throw new TypeError('Required get()')}
//        if (this.#isDesc(getter)) {
//            if (!getter.hasOwnProperty('get')){throw new TypeError('Required get()')}
//        }
        const d = this.#isDesc(getter) ? getter : {}
        d.get = this.#isFn(getter) ? getter.bind(this._target) : d.get
        d.set = (function() {throw new TypeError('Get only.')}).bind(this._target)
        if (!this.#isFn(d.get)){throw new TypeError('Required getter.')}
        Object.defineProperty(this._target._, `${name}`, {value:value, writable:true})
        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
            ? getter
            : (this.#isFn(getter)
                ? this.#fnDescriptor(name, getter, setter)
                : this.#defaultDescriptor(name, getter, setter))
        )
    }
    set(name, value=null, setter=null) {
    }
    fix(name, value) { Object.defineProperty(this._target, `${name}`, {get(){return value},set(){throw new TypeError(`Read only.`)}}) }
    extend(name) { // classでget()だけオーバーライドしたらset()が消える。二つで一つのディスクリプタだから。
//        return this._target[name]    getter override
//        this._target[name] = v       setter override
    }
    del(name) { delete this._[`${name}`]; delete this[`${name}`]; }

    #isObj(v){return null!==v&&'object'===typeof v}
    #isDesc(v){return this.#isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #isFn(v){return 'function'===typeof v}
    #defaultDescriptor(name) { return {
        get(){return this._[`${name}`]},
        set(v){this._[`${name}`]=v},
        enumerable:true,
    } }
    #fnDescriptor(name, getter, setter) {
        const d = {}
        if ('function'===typeof getter){d['get'] = getter.bind(this._target)}
        if ('function'===typeof setter){d['set'] = setter.bind(this._target)}
        return d
    }
    #getDefaultGetter(name) { return (function(){return this._[name]}).bind(this._target) }
    #getDefaultSetter(name) { return (function(v){this._[name]=v}).bind(this._target) }
}
window.Property = Property
})();
