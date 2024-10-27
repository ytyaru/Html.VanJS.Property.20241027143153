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
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

