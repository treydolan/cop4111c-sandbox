

// m.mount(root, {
//     view: function() {
//         return m("h1", "Try me Out")
//     }
// })

// m.render(root, [
//     m("main", [
//         m("h1", {class: "bg-primary font-monospace"}, "My first app"),
//         m("button", {class: "btn btn-primary"}, "A button"),
//     ])
// ])

// var Hello = {
//     view: function() {
//         return m("main", [
//             m("h1", {class: "bg-primary font-monospace"}, "My First App"),
//             m("button", {class: "btn btn-primary"}, "A button")
//         ])
//     }
// }

// m.mount(root, Hello)

var root = document.body;
var count = 0

var increment = function() {
    m.request({
        method: "PUT",
        url: "localhost:3000/api/tutorial/1",
        body: {count: count +1},
    })
    .then(function(data) {
        count = parseInt(data.count)
    })
}

var Hello = {
    view: function() {
        return m("main", [
            m("h1", {class: "bg-primary font-monospace"}, "My First App"),
            m("button", {onclick: increment}, count + " clicks"),
        ])
    }
}

// m.mount(root, Hello)

var Splash = {
    view: function() {
        return m("main", [
            m("h1", {class: "fs-1"}, "Welcome to Discussion 3"),
            m("p", {class: "font-monospace"}, "Click the link below to enter"),
            m("p", {class: "badge text-bg-danger"}, "test"),
            m("a", {href: "#!/hello"}, "Enter!"),
        ]) 
    }
}

m.route(root, "/splash", {
    "/splash": Splash,
    "/hello": Hello,
})
