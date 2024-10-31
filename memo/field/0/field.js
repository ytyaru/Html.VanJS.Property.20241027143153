function field(name, type, value, mutable=false) {
    if (!validName(name)){throw new TypeError(`Invalid name.`)}
    if (!validType(type)){throw new TypeError(`Invalid type.`)}
    if (!validValue(value,type)){throw new TypeError(`Invalid value.`)}
    //const o = {_:Object.freeze({name:name, type:type, value:value, mutable:mutable})}
    //const o = Object.create(null)
    const o = {}
    Object.defineProperty(o, '_', {
        value: Object.freeze({name:name, type:type, value:value, mutable:mutable}),
        enumerable:false,
        configurable:false,
        writable:false,
    })
    Object.defineProperty(o, 'v', {
        enumerable:true,
        get(){return this._.value},
        set(v){
            if (mutable) {
                if (Type[`is${type}`](v)) {this._.value = v}
                else {throw new TypeError(`Invalid type.`)}
            } else {throw new TypeError(`'${this.name}' is Immutable.`)}
        }
    })
    return o
}
function validName(name) { return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(name) }
//function validName(name) { return /^[_A-Z][_a-zA-Z0-9]*[\?]?(<[_A-Z][_a-zA-Z0-9]*>)?$/.test(name) }
const TYPE_NAMES = 'Boolean,Integer,Bigint,Float,String,Symbol,Function,AsyncFunction,GeneratorFunction,AsyncGeneratorFunction,Error,Class,Instance,Promise,Iterator,Object,Array,Map,Set,WeakMap,WeakSet,Proxy,Date,Regexp,URL,Element,Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,BigInt64Array,BigUint64Array,Float16Array,Float32Array,Float64Array,ArrayBuffer,SharedArrayBuffer,DataView'.split(',')
function validType(type) { return TYPE_NAMES.includes(type) }
function validValue(value, type) { return Type.isCls(type) ? value instanceof type : Type[`is${type}`](value) }


'?'
'<>'

