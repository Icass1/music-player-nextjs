importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')


function matchFunction({ url }) {
    console.log(url)
    const pages = ['/', '/about'];
    return pages.includes(url.pathname);
}

workbox.routing.registerRoute(
    matchFunction,
    new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
    ({ request }) => request.destination == 'image',
    new workbox.strategies.CacheFirst()
)

workbox.routing.registerRoute(
    /\.json$/,
    new workbox.strategies.NetworkFirst()
)
workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.NetworkFirst()
)
workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.NetworkFirst()
)
workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.NetworkFirst()
)

