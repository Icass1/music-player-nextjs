/* global self, caches, fetch, URL, Response */
'use strict';

var config = {
    version: 'achilles',
    staticCacheItems: [
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main-app.js',
    ],
    contentCacheItems: [
        '/',
        '/list/randomstringthatcannotbefoundinhtml',
    ]
};

async function addToCache(request, response) {

    let url = new URL(request.url);

    let responseToSave;

    console.log("addToCache", url.pathname, url.pathname.startsWith("/list/"))

    // if (url.pathname.startsWith("/list/") && url.pathname.split("/").length == 3) {
    if (url.pathname.startsWith("/list/")) {
        let id = url.pathname.split("/")[2];

        let restOfThePath = url.pathname.split("/").slice(3).join("/");
        url.pathname = "/list/[id]" + (restOfThePath ? "/" : "") + restOfThePath;


        console.info("SaveCache:", url.pathname)
        console.log("/list/[id]", (restOfThePath ? "/" : ""), restOfThePath)


        await response.clone().text().then(html => {

            let modifiedHtml = html;
            while (modifiedHtml.includes(id)) {
                modifiedHtml = modifiedHtml.replace(id, '[id]');
            }

            // Create a new response with the modified HTML
            responseToSave = new Response(modifiedHtml, {
                headers: response.headers
            });
        })
    } else if (url.pathname == "/_next/image") {

        let imageUrl = new URL(url.searchParams.get("url"))

        url.pathname = imageUrl.pathname

        responseToSave = response.clone();

    } else {
        responseToSave = response.clone();
    }

    url.search = '';

    let requestOptions = {
        method: request.method,
        headers: request.headers,
        body: request.body,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
    };

    // Remove mode if it's 'navigate' because it's not allowed in new Request
    if (request.mode !== 'navigate') {
        requestOptions.mode = request.mode;
    }

    let newRequest;
    try {
        newRequest = new Request(url.toString(), requestOptions);

    } catch (error) {
        newRequest = request
    }

    let cacheKey = "static"

    if (responseToSave.headers.get("content-type") && responseToSave.headers.get("content-type").includes("text/html")) {
        cacheKey = "content"
    }

    if (response.ok) {
        caches.open(cacheKey).then(cache => {
            cache.put(newRequest, responseToSave).catch((reason) => {console.error("Failed to save to cache", reason, newRequest.url)}) 
        }).catch((reason) => {console.error("Failed to save to cache", reason, newRequest.url)})
    }
    return response;
}

async function fetchFromCache(event) {

    let request = event.request
    let url = new URL(request.url);

    let requestOptions = {
        method: request.method,
        headers: request.headers,
        body: request.body,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: request.keepalive,
    };

    if (request.mode !== 'navigate') {
        requestOptions.mode = request.mode;

    }

    let id;

    if (url.pathname.startsWith("/list/")) {
        // if (url.pathname.startsWith("/list/") && url.pathname.split("/").length == 3) {
        id = url.pathname.split("/")[2];
        // url.pathname = "/list/[id]";
        let restOfThePath = url.pathname.split("/").slice(3).join("/")
        url.pathname = "/list/[id]" + (restOfThePath ? "/" : "") + restOfThePath;
        console.log("GetCache 1:", url.pathname)

    } else if (url.pathname == "/_next/image") {
        let imageUrl = new URL(url.searchParams.get("url"))
        url.pathname = imageUrl.pathname
    } else if (url.pathname.startsWith("/_next/static/chunks/app/list/")) {
        id = url.pathname.split("/")[6];
        let restOfThePath = url.pathname.split("/").slice(7).join("/")
        url.pathname = "/_next/static/chunks/app/list/[id]" + (restOfThePath ? "/" : "") + restOfThePath;
        console.log("GetCache 2:", url.pathname)
    }

    url.search = '';

    let newRequest = new Request(url.toString(), requestOptions);


    return caches.match(newRequest).then(async (response) => {
        if (!response) {

            console.log(await caches.keys())

            throw Error(`${newRequest.url} not found in cache`);
        }

        if (id) {

            let modifiedHtml;

            await response.text().then(html => {

                modifiedHtml = html
                while (modifiedHtml.includes('[id]')) {
                    modifiedHtml = modifiedHtml.replace('[id]', id);
                }
                while (modifiedHtml.includes('%5Bid%5D')) {
                    modifiedHtml = modifiedHtml.replace('%5Bid%5D', id);
                }
            })
            response = new Response(modifiedHtml, {
                headers: response.headers
            });
        }

        // console.log("fetchfromcache response", id, response)
        return response;
    })
}

self.addEventListener('install', event => {
    async function onInstall(event, opts) {
        await caches.open('static')
            .then(cache => {
                cache.addAll(opts.staticCacheItems)
            });
        await caches.open('content')
            .then(cache => {
                cache.addAll(opts.contentCacheItems)
            });
    }

    event.waitUntil(
        onInstall(event, config).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    async function onActivate(event, opts) {

        let startUrl = [
            "/",
            "/list/randomstringthatcannotbefoundinhtml",
            "_next/static/chunks/app/page.js",
            "_next/static/chunks/app/layout.js",
            "_next/static/chunks/app/list/randomstringthatcannotbefoundinhtml/page.js",
            "https://api.music.rockhosting.org/images/pause.svg",
            "https://api.music.rockhosting.org/images/play.svg",
            "https://api.music.rockhosting.org/images/next.svg",
            "https://api.music.rockhosting.org/images/previous.svg",
            "https://api.music.rockhosting.org/images/addList.svg",
            "https://api.music.rockhosting.org/images/download.svg",
            "https://api.music.rockhosting.org/images/search.svg",
            '/_next/static/chunks/webpack.js',
            '/_next/static/chunks/main-app.js'
        ]

        if (navigator.onLine) {
            for (let url of startUrl) {
                let request = new Request(url)
                fetch(request).then((response) => { addToCache(request, response) })
            }
        }

        return caches.keys()
            .then(cacheKeys => {
                var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
                var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
                return Promise.all(deletePromises);
            });
    }

    event.waitUntil(
        onActivate(event, config)
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    var url = new URL(event.request.url);

    console.log("fetch", url.origin + url.pathname + url.search)

    caches.keys().then(value => console.log("Cache:", value))

    function onFetch(event, opts) {
        var request = event.request;

        if (navigator.onLine) {
            if (event.request.method == "GET") {
                event.respondWith(
                    fetch(request, {
                        mode: 'cors',
                    })
                        .then(response => addToCache(request, response))
                        .catch((reason) => { return fetchFromCache(event) })
                )
            } else {
                event.respondWith(
                    fetch(request, {
                        mode: 'cors',
                    })
                )
            }
        }
        else {
            if (event.request.method == "GET") {
                event.respondWith(
                    fetchFromCache(event)
                )
            } else {
                event.respondWith(
                    new Response("OK")
                )
            }

        }
    }

    onFetch(event, config);

});