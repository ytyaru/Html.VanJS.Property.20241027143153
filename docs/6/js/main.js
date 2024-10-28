window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.Property.20241027143153/`}, 'Property')),
        van.tags.p('JSのプロパティを動的付与する。'),
//        p('Dynamically assign JS properties.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    const a = new Assertion()
    const bb = new BlackBox(a)
    a.t(!!Property)
    //a.t(Type.isIns(new Property(), Property))
    ;(function(){
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property())
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(undefined))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(null))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(false))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(0))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(0.0))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(0n))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(''))
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(Symbol()))
        class C {}
        a.e(TypeError, `1st augument 'target' should be an instance.`, ()=>new Property(C))
        a.t(Type.isIns(new Property(new C())))
    })();
    // add
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name')
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t(null===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))
        c.name = 'Yamada'
        a.t('Yamada'===c.name)
//        a.t(undefined===Reflect.getOwnPropertyDescriptor(c, 'name').set)
    })();
    // add + value
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値') // add()でgetter/setter省略時はデフォルト（そのまま返却＆代入）が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))
        c.name = 'Yamada'
        a.t('Yamada'===c.name)
//        a.t(undefined===Reflect.getOwnPropertyDescriptor(c, 'name').set)
    })();
    // add + value + Fn(getter)
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', (k,t)=>'G:'+t._[k]) // add()でsetter省略時はデフォルトセッター（そのまま代入）が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('G:初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        // add()でsetter省略時はデフォルトセッター（そのまま代入）が実装される
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))
        //a.t(undefined===Reflect.getOwnPropertyDescriptor(c, 'name').set)

        // add()でsetter省略時はデフォルトセッター（そのまま代入）が実装される
        c.name = 'Yamada'
        a.t('G:Yamada'===c.name)
        a.t('Yamada'===c._.name)
    })();
    // add + value + Fn(setter)
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', null, (v,k,t)=>t._[k]='S:'+v) // add()でgetter省略時はデフォルトセッター(そのまま返却)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c.name)
        a.t('初期値'===c._.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        // add()でgetter省略時はデフォルトセッター(そのまま返却)が実装される
        //a.t(undefined===Reflect.getOwnPropertyDescriptor(c, 'name').get)
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        // add()でgetter省略時はデフォルトセッター(そのまま返却)が実装される
        c.name = 'Yamada'
        a.t('S:Yamada'===c.name)
        a.t('S:Yamada'===c._.name)
    })();
    // add + value + Fn(getter & setter)
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', (k,t)=>'G:'+t._[k], (v,k,t)=>t._[k]='S:'+v) // add()でgetter省略時はデフォルトセッター(そのまま返却)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('G:初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('S:Yamada'===c._.name)
        a.t('G:S:Yamada'===c.name)
    })();
    // add + value + Obj(非descriptor(value,get,setキーがない))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {}) // Obj(非descriptor(value,get,setキーがない))時はデフォルト(そのまま返却＆代入)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        console.log(c._.name)
        a.t('Yamada'===c._.name)
        a.t('Yamada'===c.name)
    })();
    // add + value + Obj(descriptor(valueのみ))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {value:'X'}) // Obj(descriptor(valueのみ))時はvalue削除&デフォルト(そのまま返却＆代入)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        console.log(c.name)
        a.t('初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('Yamada'===c._.name)
        a.t('Yamada'===c.name)
    })();
    // add + value + Obj(descriptor(getterのみ))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {get(){return 'G:'+this._.name}}) // セッター省略時はデフォルトゲッター(そのまま返却)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('G:初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('Yamada'===c._.name)
        a.t('G:Yamada'===c.name)
    })();
    // add + value + Obj(descriptor(setterのみ))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {set(v){this._.name='S:'+v}}) // ゲッター省略時はデフォルトゲッター(そのまま返却)が実装される
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('S:Yamada'===c._.name)
        a.t('S:Yamada'===c.name)

        c._.name = 'Suzuki'
        a.t('Suzuki'===c._.name)
        a.t('Suzuki'===c.name)
    })();
    // add + value + Obj(descriptor(getter & setter))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {
            get(){return 'G:'+this._.name},
            set(v){this._.name='S:'+v}
        })
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('G:初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('S:Yamada'===c._.name)
        a.t('G:S:Yamada'===c.name)

        c._.name = 'Suzuki'
        a.t('Suzuki'===c._.name)
        a.t('G:Suzuki'===c.name)
    })();
    // add + value + Obj(descriptor(value & getter & setter))
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.add('name', '初期値', {
            value:'X', // 削除される
            get(){return 'G:'+this._.name},
            set(v){this._.name='S:'+v}
        })
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t('初期値'===c._.name)
        a.t('G:初期値'===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))

        c.name = 'Yamada'
        a.t('S:Yamada'===c._.name)
        a.t('G:S:Yamada'===c.name)

        c._.name = 'Suzuki'
        a.t('Suzuki'===c._.name)
        a.t('G:Suzuki'===c.name)
    })();











    // get
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.get('name')
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        a.t(null===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))
        a.e(TypeError, `Get only.`, ()=>c.name = 'Yamada')
        a.t(null===c.name)
    })();
    // set
    ;(function(){
        class C {}
        const c = new C()
        const p = new Property(c)
        a.t(0===Object.getOwnPropertyNames(c).length)

        p.set('name')
        a.t(2===Object.getOwnPropertyNames(c).length)
        a.t(['_','name'].every((k,i)=>Object.getOwnPropertyNames(c).includes(k)))
        a.t(1===Object.getOwnPropertyNames(c._).length)
        a.t(c._.hasOwnProperty('name'))

        //a.t(null===c.name)
        a.t(Type.isObj(Reflect.getOwnPropertyDescriptor(c, 'name')))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').get))
        a.t(Type.isFn(Reflect.getOwnPropertyDescriptor(c, 'name').set))
        a.e(TypeError, `Set only.`, ()=>c.name)
        c.name = 'Yamada'
        //a.t('Yamada'===c.name)
        //a.e(TypeError, `Get only.`, ()=>c.name = 'Yamada')
        //a.t(null===c.name)
    })();
    // 
    ;(function(){
    })();
    // 
    ;(function(){
    })();
    // 
    ;(function(){
    })();
    // 
    ;(function(){
    })();
    // 
    ;(function(){
    })();
    a.fin()

    class C {}
    const c = new C()
    const p = new Property(c)
    p.add('name')
    console.log(c)
    p.add('age', 0)
    //p.add('weight', 50, function(){return this.age}, function(v){this.age=v})
    p.add('weight', 50, function(){return this._.age}, function(v){this._.age=v}) // ._.でprotectedのほうにアクセス可
    //p.add('height', 99, ()=>{return this.age}, (v)=>{this.age=v}) // アロー関数はthisが固定されてしまいbind()不能。undefined!!
    //p.add('height', 99, get(){return this.age}, set(v){this.age=v})
    p.add('height', 99, {get(){return this._.age}, set(v){this._.age=v}}) // discriptorそのまま渡す
    // Object.defineProperty(c, 'height', {get(){return this.age}, set(v){this.age=v}})
    console.assert(null===c.name)
    console.assert(0===c.age)
    console.assert(0===c.weight)
    console.assert(0===c.height)
    c.age = 1
    console.assert(1===c.age)
    console.assert(1===c.weight)
    console.assert(1===c.height)
    c.weight = 2
    console.assert(2===c.age)
    console.assert(2===c.weight)
    console.assert(2===c.height)
    c.height = 3
    console.assert(3===c.age)
    console.assert(3===c.weight)
    console.assert(3===c.height)
    console.log(Object.getOwnPropertyNames(c))

    p.fix('NUM', 999)
    console.assert(999===c.NUM)
    try {c.NUM = 0;throw new Error('Fail.')} catch(e) {console.assert(TypeError===e.constructor && 'Read only.'===e.message)}
    
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

