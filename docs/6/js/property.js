;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    constructor(target) {
        if(!Type.isIns(target)){throw new TypeError(`1st augument 'target' should be an instance.`)}
        this._target=target
    }
    add(name, value=null, getter=null, setter=null) {
        this.#addProtected(name, value)
        this.#addProperty(name, getter, setter)
    }
    #addProtected(name, value) { // getter/setterの元であるprotectedプロパティを追加する
        // protectedプロパティ達 は _ プロパティで一元管理する。
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = {} } // hasOwnProperty()を使えるよう非Object.create(null)
        //if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
        Object.defineProperty(this._target._, `${name}`, {value:value, writable:true})
    }
    #addProperty(name, getter, setter=null) {
        Object.defineProperty(this._target, `${name}`, Type.isObj(getter)
//        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
//            ? getter
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
        console.log(objOrFn)
        console.log(id)
        console.log(this.#hasGetter)
        console.log(this.#hasSetter)
        console.log(this[`#hasSetter`])

        return (isSet ? this.#hasSetter : this.#hasGetter)(objOrFn)
                    ? objOrFn
                    : this.#fnDescriptor(name, ...(isSet
                        ? [this.#getThrowGetter(), this.#isFn(objOrFn) ? objOrFn : this.#getDefaultSetter(name)]
                        : [this.#isFn(objOrFn) ? objOrFn : this.#getDefaultGetter(name), this.#getThrowSetter()]))
    }
    fix(name, value) { Object.defineProperty(this._target, `${name}`, {get(){return value},set(){throw new TypeError(`Read only.`)}}) }
    extend(name) { // classでget()だけオーバーライドしたらset()が消える。二つで一つのディスクリプタだから。
//        return this._target[name]    getter override
//        this._target[name] = v       setter override
    }
    del(name) { delete this._[`${name}`]; delete this[`${name}`]; }

    //#isDesc(v){return Type.isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #isDesc(v){return Type.isObj(v) ? ['get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #hasGetter(v){return Type.isObj(v) ? v.hasOwnProperty('get') : false;}
    #hasSetter(v){return Type.isObj(v) ? v.hasOwnProperty('set') : false}
    #isFn(v){return 'function'===typeof v}
    #createDefaultDescriptor(name) { return {
        get(){return this._[`${name}`]},
        set(v){this._[`${name}`]=v},
        enumerable:true,
    } }
    #completeDefaultDescriptor(name, d) {
        delete d.value
        d.enumerable = true
        for (let id of ['g','s']) {
            const k = `${id}et`
            if (!Type.isFn(d[k] ?? null)) { d[k] = this.#getDefaulter(name, 's'===id) }
            //if (!Type.isFn(d[k] ?? null)) { d[k] = 'g'===id ? this.#getDefaultGetter(name) : this.#getDefaultSetter(name)}
            //if (!Type.isFn(d[k] ?? null)) { d[k] = this.#getDefaultGetter(name) }
        }
        
        console.log(d)
        return d
        /*
        if (!Type.isFn(d.get ?? null))
        if (!Type.isFn(d.set ?? null))
        if (!d.hasOwnProperty('get')) { d.get = this.#getDefaultGetter(name) }
        if (!d.hasOwnProperty('set')) { d.set = this.#getDefaultSetter(name) }
        return d
        */
    }
    #fnDescriptor(name, getter, setter) {
        const D = {enumerable:true}
//        Type.isFn(getter) ? getter : (function(){return this._[name]}).bind(this._target)
//        Type.isFn(setter) ? setter : (function(v){return this._[name]=v}).bind(this._target)
//        const G = Type.isFn(getter) ? getter : this.#getDefaultGetter(name)
//        const S = Type.isFn(setter) ? setter : this.#getDefaultSetter(name)
//        const G = Type.isFn(getter) ? getter : (function(){return this._[name]})
//        const S = Type.isFn(setter) ? setter : (function(v){console.log(this);return this._[name]=v})
        const G = Type.isFn(getter) ? getter : (function(){return this._[name]})
        const S = Type.isFn(setter) ? setter : (function(v){return this._[name]=v})
        console.log(G, G===getter)
        console.log(S, S===setter)
        D['get'] = (function(){return G.apply(this, [name, this])}).bind(this._target)
        D['set'] = (function(v){return S.apply(this, [v, name, this])}).bind(this._target)
//        if ('function'===typeof getter){D['get'] = (function(){return G.apply(this, [name, this])}).bind(this._target)}
//        if ('function'===typeof setter){D['set'] = (function(v){return S.apply(this, [v, name, this])}).bind(this._target)}
        console.log(D)

//        if ('function'===typeof getter){d['get'] = (function(){return getter.apply(this, [name, this])}).bind(this.target)}
//        if ('function'===typeof setter){d['set'] = (function(v){return setter.apply(this, [v, name, this])}).bind(this._target)}
//        if ('function'===typeof getter){d['get'] = (function(){return getter.apply(this, [name, this])}).bind(this._target)}
//        if ('function'===typeof setter){d['set'] = (function(v){return setter.apply(this, [v, name, this])}).bind(this._target)}
//        if ('function'===typeof getter){d['get'] = (function(){console.log(this, this._target);return getter.apply(this._target, [name, this._target])}).bind(this._target)}
//        if ('function'===typeof setter){d['set'] = (function(v){return setter.apply(this._target, [v, name, this._target])}).bind(this._target)}
//        if ('function'===typeof getter){d['get'] = (function(){return getter.apply(this._target, [name, this._target])})}
//        if ('function'===typeof setter){d['set'] = (function(v){return setter.apply(this._target, [v, name, this._target])})}
//        if ('function'===typeof getter){d['get'] = (function(){return getter(name, this._target)}).bind(this._target)}
//        if ('function'===typeof setter){d['set'] = (function(v){return setter(v, name, this._target)}).bind(this._target)}
//        if ('function'===typeof getter){d['get'] = getter.bind(this._target, name, this._target)}
//        if ('function'===typeof setter){d['set'] = setter.bind(this._target, v, name, this._target)}
//        if ('function'===typeof getter){d['get'] = getter.bind(this._target)}
//        if ('function'===typeof setter){d['set'] = setter.bind(this._target)}
        return D
    }
//    getGetterFn(k,t) {return (function(v,k,t)=>t._[k]).bind(this._target, k, this._target)}
//    getSetterFn(v,k,t) {return (function(v,k,t)=>t._[k]=v).bind(this._target, v, k, this._target)}
    //#getDefaultGetter(name) { console.log(name);return (function(){console.log(name, this._[name]);return this._[name]}).bind(this._target) }
//    #getDefaultGetter(name) { return (function(){return this._[name]}).bind(this._target) }
//    #getDefaultSetter(name) { return (function(v){this._[name]=v}).bind(this._target) }

    #getDefaultGetter(name) { return this.#getDefaulter(name) }
    #getDefaultSetter(name) { return this.#getDefaulter(name, true) }
    #getDefaulter(name, isSet=false) { return (isSet ? (function(v){this._[name]=v}) : (function(){return this._[name]})).bind(this._target) }
//    #getDefaulter(name, isSet) {
//        const fn = isSet ? (function(v){this._[name]=v}) : (function(){return this._[name]})
//        return fn.bind(this._target)
//    }

    #getThrow(m) {return (function(){throw new TypeError(m)}).bind(this._target) }
    #getThrowGetter() {return this.#getThrow('Set only.') }
    #getThrowSetter() {return this.#getThrow('Get only.') }
    #getThrowFix() {return this.#getThrow('Read only.') }
//    #throwGetter() {return (function(){throw new TypeError('Set only.')}).bind(this._target) }
//    #throwSetter() {return (function(v){throw new TypeError('Get only.')}).bind(this._target) }
}
window.Property = Property
})();
