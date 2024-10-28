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
        Object.defineProperty(this._target, `${name}`, this.#isDesc(getter)
            ? getter
            : (this.#isFn(getter)
                ? this.#fnDescriptor(name, getter, setter)
                : this.#defaultDescriptor(name, getter, setter))
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

    #isDesc(v){return Type.isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
    #hasGetter(v){return Type.isObj(v) ? v.hasOwnProperty('get') : false;}
    #hasSetter(v){return Type.isObj(v) ? v.hasOwnProperty('set') : false}
    #isFn(v){return 'function'===typeof v}
    #defaultDescriptor(name) { return {
        get(){return this._[`${name}`]},
        set(v){this._[`${name}`]=v},
        enumerable:true,
    } }
    #fnDescriptor(name, getter, setter) {
        const d = {enumerable:true}
        if ('function'===typeof getter){d['get'] = getter.bind(this._target)}
        if ('function'===typeof setter){d['set'] = setter.bind(this._target)}
        return d
    }
    #getDefaultGetter(name) { console.log(name);return (function(){console.log(name, this._[name]);return this._[name]}).bind(this._target) }
    #getDefaultSetter(name) { return (function(v){this._[name]=v}).bind(this._target) }

    #getThrow(m) {return (function(){throw new TypeError(m)}).bind(this._target) }
    #getThrowGetter() {return this.#getThrow('Set only.') }
    #getThrowSetter() {return this.#getThrow('Get only.') }
    #getThrowFix() {return this.#getThrow('Read only.') }
//    #throwGetter() {return (function(){throw new TypeError('Set only.')}).bind(this._target) }
//    #throwSetter() {return (function(v){throw new TypeError('Get only.')}).bind(this._target) }
}
window.Property = Property
})();
