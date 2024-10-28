;(function(){
// 【ネタ】アロー関数でもthisを使いたい！
// https://qiita.com/Syuparn/items/77935b5a4af046fc6fa9
class Property {
    //constructor(target) {this._target=target} // target は instance を想定している
    constructor(target) {if(!Type.isIns(target)){throw new TypeError(`1st augument 'target' should be an instance.`)}this._target=target} // target は instance を想定している
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
//        const d = this.#hasGetter(getter)
//                    ? getter
//                    : (this.#isFn(getter)
//                        ? this.#fnDescriptor(name, getter, this.#getThrowSetter())
//                        : (()=>{throw new TypeError(`3rd argument 'getter' should be a descriptor object or a function.`)})())
        const d = this.#getGetOrSet(name, false, getter)
        this.#addProtected(name, value)
        this.#addProperty(name, d)
        /*
        if (!this._target.hasOwnProperty('_')) { this._target['_'] = {} }
        //if (!this._target.hasOwnProperty('_')) { this._target['_'] = Object.create(null) }
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
        */
    }
    set(name, value=null, setter=null) {
//        const d = this.#hasSetter(setter)
//                    ? setter
//                    : (this.#isFn(setter)
//                        ? this.#fnDescriptor(name, this.#throwGetter(), setter)
//                        : (()=>{throw new TypeError(`3rd argument 'setter' should be a descriptor object or a function.`)})())
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
        /*
        //return this[`#has${id}etter`](objOrFn)
        return (isSet ? this.#hasSetter : this.#hasGetter)(objOrFn)
                    ? objOrFn
                    : (this.#isFn(objOrFn)
                        ? this.#fnDescriptor(name, ...(isSet
                                                        ? [this.#getThrowGetter(), objOrFn]
                                                        : [objOrFn, this.#getThrowSetter()]))
                        : this.#fnDescriptor(name, ...(isSet
                                                        ? [this.#getThrowGetter(), this.#getDefaultSetter(name)]
                                                        : [this.#getDefaultGetter(name), this.#getThrowSetter()]))
                        )
                        //: (()=>{throw new TypeError(`3rd argument '${id.toLowerCase()}etter' should be a descriptor object or a function.`)})())
        */
    }
    fix(name, value) { Object.defineProperty(this._target, `${name}`, {get(){return value},set(){throw new TypeError(`Read only.`)}}) }
    extend(name) { // classでget()だけオーバーライドしたらset()が消える。二つで一つのディスクリプタだから。
//        return this._target[name]    getter override
//        this._target[name] = v       setter override
    }
    del(name) { delete this._[`${name}`]; delete this[`${name}`]; }

//    #isObj(v){return null!==v && 'object'===typeof v}
//    #isDesc(v){return this.#isObj(v) ? ['value','get','set'].some(k=>v.hasOwnProperty(k)) : false}
//    #hasGetter(v){console.log(v);console.log(null!==v, 'object'===typeof v);console.log(this.#isObj(v));return this.#isObj(v) ? v.hasOwnProperty('get') : false;}
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
