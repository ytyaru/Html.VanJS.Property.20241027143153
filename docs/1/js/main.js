window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.Property.20241027143153/`}, 'Property')),
        van.tags.p('JSのプロパティを動的付与する。'),
//        p('Dynamically assign JS properties.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    class C {}
    const c = new C()
    const p = new Property(c)
    p.add('name')
    console.log(c)
    p.add('age', 0)
    p.add('weight', 50, function(){return this.age}, function(v){this.age=v})
    //p.add('height', 99, ()=>{return this.age}, (v)=>{this.age=v}) // アロー関数はthisが固定されてしまいbind()不能。undefined!!
    //p.add('height', 99, get(){return this.age}, set(v){this.age=v})
    p.add('height', 99, {get(){return this.age}, set(v){this.age=v}}) // discriptorそのまま渡す
    // Object.defineProperty(c, 'height', {get(){return this.age}, set(v){this.age=v}})
    console.assert(null===c.name)
    console.assert(0===c.age)
    console.assert(0===c.weight)
    console.assert(0===c.height)
    c.age = 1
    console.assert(1===c.age)
    console.assert(1===c.weight)
    console.assert(1===c.height)
    console.log(Object.getOwnPropertyNames(c))
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

