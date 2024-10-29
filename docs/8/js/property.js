;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    constructor(target) {
        if(!Type.isIns(target)){throw new TypeError(`1st augument 'target' should be an instance.`)}
        this._target=target
        //this._ins = target;
        this._cls = target.constructor;
    }
    add(name, value=null, getter=null, setter=null) {
        this.#addProtected(name, value)
        this.#addProperty(name, getter, setter)
    }
    #addProtected(name, value) { // getter/setterの元であるprotectedプロパティを追加する
        // protectedプロパティ達 は _ プロパティで一元管理する。
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = {} } // hasOwnProperty()を使えるよう非Object.create(null)
        //if (!this._target.hasOwnProperty('_')) { this._cls.prototype['_'] = {} } // hasOwnProperty()を使えるよう非Object.create(null)
        //if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
        Object.defineProperty(this._target._, `${name}`, {value:value, writable:true})
        //Object.defineProperty(this._cls.prototype._, `${name}`, {value:value, writable:true})
    }
    #addProperty(name, getter, setter=null) {
        Object.defineProperty(this._cls.prototype, `${name}`, Type.isObj(getter)
        //Object.defineProperty(this._target, `${name}`, Type.isObj(getter)
            ? this.#completeDefaultDescriptor(name, getter)
            : ([getter,setter].some(fn=>Type.isFn(fn))
                ? this.#fnDescriptor(name, getter, setter)
                : this.#createDefaultDescriptor(name, getter, setter))
        )
    }
    get(name, value=null, getter=null) {
        const d = this.#getGetOrSet(name, false, getter)
        this.#addProtected(name, value)
        this.#addProperty(name, d)
    }
    set(name, value=null, setter=null) {
        const d = this.#getGetOrSet(name, true, setter)
        this.#addProtected(name, value)
        this.#addProperty(name, d)
    }
    #getGetOrSet(name, isSet, objOrFn) {
        const id = isSet ? 'S' : 'G'
        return (isSet ? this.#hasSetter : this.#hasGetter)(objOrFn)
            ? objOrFn
            : this.#fnDescriptor(name, ...(isSet
                ? [this.#getThrowGetter(), this.#isFn(objOrFn) ? objOrFn : this.#getDefaultSetter(name)]
                : [this.#isFn(objOrFn) ? objOrFn : this.#getDefaultGetter(name), this.#getThrowSetter()]))
    }
    fix(name, value) { Object.defineProperty(this._target, `${name}`, {get(){return value},set(){throw new TypeError(`Read only.`)}}) }
    // addとの違いは2点：protected非作成。デフォルトcbFnの参照がthisでなくsuperである。
    extend(name, value, getter, setter) { // classでget()だけオーバーライドしたらset()が消える。二つで一つのディスクリプタだから。
//        return this._target[name]    getter override
//        this._target[name] = v       setter override
        const d = {enumerable:true}
        // SyntaxError: 'super' keyword unexpected here
//        d.get = Type.isFn(getter) ? getter.bind(this._target) : (function(){return super[name]}).bind(this._target)
//        d.set = Type.isFn(setter) ? setter.bind(this._target) : (function(){super[name]=v}).bind(this._target)
        d.get = Type.isFn(getter) ? getter.bind(this._target) : (function(){return this[name]}).bind(this._target.super)
        d.set = Type.isFn(setter) ? setter.bind(this._target) : (function(){this[name]=v}).bind(this._target.super)
        Object.defineProperty(this._cls.prototype, `${name}`, d)
    }
    del(name) { delete this._[`${name}`]; delete this[`${name}`]; }

    //#isDesc(v){return Type.isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #isDesc(v){return Type.isObj(v) ? ['get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #hasGetter(v){return Type.isObj(v) ? v.hasOwnProperty('get') : false;}
    #hasSetter(v){return Type.isObj(v) ? v.hasOwnProperty('set') : false}
    #isFn(v){return 'function'===typeof v}
    #createDefaultDescriptor(name) {
        const d = {enumerable:true}
        d.get = (function(){return this._[name]}).bind(this._target)
        d.set = (function(v){this._[name]=v}).bind(this._target)
        return d
    }
//    #createDefaultDescriptor(name) { return {
//        get(){return this._[`${name}`]},
//        set(v){this._[`${name}`]=v},
//        enumerable:true,
//    } }
    #completeDefaultDescriptor(name, d) {
        delete d.value
        d.enumerable = true

        for (let id of ['g','s']) {
            const k = `${id}et`
            d[k] = k in d && Type.isFn(d[k]) ? d[k].bind(this._target) : this.#getDefaulter(name, 's'===id)
            //d[k] = !(k in d) || !Type.isFn(d[k]) ? this.#getDefaulter(name, 's'===id) : d[k].bind(this._target)
            //d[k] = k in d ? d[k].bind(this._target) : this.#getDefaulter(name, 's'===id)
//        'get' in d ? d.get.bind(this._target) : this.#getDefaulter(name, false)
//        'set' in d ? d.set.bind(this._target) : this.#getDefaulter(name, false)
        }
//        for (let id of ['g','s']) {
//            const k = `${id}et`
//            if (!Type.isFn(d[k] ?? null)) { d[k] = this.#getDefaulter(name, 's'===id) }
//        }
        return d
    }
    #fnDescriptor(name, getter, setter) {
        const D = {enumerable:true}
        const G = Type.isFn(getter) ? getter : (function(){return this._[name]})
        const S = Type.isFn(setter) ? setter : (function(v){return this._[name]=v})
        console.log(G, G===getter)
        console.log(S, S===setter)
        D['get'] = (function(){return G.apply(this, [name, this])}).bind(this._target)
        D['set'] = (function(v){return S.apply(this, [v, name, this])}).bind(this._target)
        return D
    }
    #getDefaultGetter(name) { return this.#getDefaulter(name) }
    #getDefaultSetter(name) { return this.#getDefaulter(name, true) }
    //#getDefaulter(name, isSet=false) { return (isSet ? (function(v){this._[name]=v}) : (function(){return this._[name]})).bind(this._target) }
    #getDefaulter(name, isSet=false, isSuper=false) { return (isSet ? (function(v){this._[name]=v}) : (function(){return this._[name]})).bind(isSuper ? this._target.super : this._target) }
    #getThrow(m) {return (function(){throw new TypeError(m)}).bind(this._target) }
    #getThrowGetter() {return this.#getThrow('Set only.') }
    #getThrowSetter() {return this.#getThrow('Get only.') }
    #getThrowFix() {return this.#getThrow('Read only.') }
}
window.Property = Property
})();
