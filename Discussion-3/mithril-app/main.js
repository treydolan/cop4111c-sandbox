var root = document.body
var count = 0

var increment = function() {
    m.request({
        method: "PUT",
        url: "//mithril-rem.fly.dev",
        body: {count: count + 1},
        withCredentials: true,
    })
    .then(function(data) {
        count = parseInt(data.count)
    })
}

var Hello = {
    view: function() {
        return m("main", [
            m("h1", {
                class: "title"
            }, "My first app"),
            m("button", {
                onclick: increment
            }, count + " clicks"),
        ])
    }
}

m.mount(root, Hello)