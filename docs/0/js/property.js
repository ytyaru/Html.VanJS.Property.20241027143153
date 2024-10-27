;(function(){
class Property {
    constructor(target) {this._target=target}
    add(name, value=null, getter=null, setter=null) {
        Object.defineProperty(this._target, `_${name}`, {value:value})
        Object.defineProperty(this._target, `${name}`, {
            get(){return this[`_${name}`]},
            set(v){this[`_${name}`]=v},
        })
    }
    // add(function(){return this}, )
    del(name) { delete this[`_${name}`]; delete this[`${name}`]; }
}
window.Property = Property
})();
