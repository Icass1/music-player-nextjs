/* global self, caches, fetch, URL, Response */
'use strict';

var config = {
    version: 'achilles',
    staticCacheItems: [
        '/',
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main-app.js'
    ],
};



function parseRequest(request) {
    
}



async function addToCache(request, response) {

    let url = new URL(request.url);

    let responseToSave;

    if (url.pathname.startsWith("/list/")) {
        console.log(url.pathname)
        let id = url.pathname.split("/")[2];
        url.pathname = "/list/[id]/" + url.pathname.split("/").slice(3).join("/");

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

    console.log(responseToSave, responseToSave.headers)

    if (responseToSave.headers.get("content-type") && responseToSave.headers.get("content-type").includes("text/html")) {
        cacheKey = "content"
    }


    if (response.ok) {
        caches.open(cacheKey).then(cache => {
            cache.put(newRequest, responseToSave);
        });
    }
    return response;
}

async function fetchFromCache(event) {

    let request = event.request
    let url = new URL(request.url);
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

    if (request.mode !== 'navigate') {
        requestOptions.mode = request.mode;

    }

    let id;
    if (url.pathname.startsWith("/list/")) {
        id = url.pathname.split("/")[2];
        url.pathname = "/list/[id]/" + url.pathname.split("/").slice(3).join("/");

    }

    let newRequest = new Request(url.toString(), requestOptions);

    return caches.match(newRequest).then(async (response) => {
        if (!response) {
            throw Error(`${newRequest.url} not found in cache`);
        }

        if (id) {

            let modifiedHtml;

            await response.text().then(html => {

                modifiedHtml = html
                while (modifiedHtml.includes('[id]')) {
                    modifiedHtml = modifiedHtml.replace('[id]', id);
                }
            })
            response = new Response(modifiedHtml, {
                headers: response.headers
            });
        }

        console.log("fetchfromcache response", id, response)
        return response;
    })
}

self.addEventListener('install', event => {
    async function onInstall(event, opts) {
        var cacheKey = 'static';
        return caches.open(cacheKey)
            .then(cache => {
                cache.addAll(opts.staticCacheItems)
            });
    }

    event.waitUntil(
        onInstall(event, config).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    async function onActivate(event, opts) {

        console.log("onactivate ")
        let startUrl = [
            "/",
            "/list/a",
            "_next/static/chunks/app/page.js",
            "_next/static/chunks/app/list/a/page.js",
        ]

        for (let url of startUrl) {
            console.log(url)
            let request = new Request(url)
            fetch(request).then((response) => { addToCache(request, response) })
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
                return Response("OK")
            }

        }
    }

    onFetch(event, config);

});