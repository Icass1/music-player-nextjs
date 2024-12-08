// utils/apiFetch.js

export function apiFetch(url, session, options = {}) {
    if (url.startsWith("/")) {
        url = "https://api.music.rockhosting.org" + url;
    }
    let headers;

    if (session?.data?.user?.id) {
        // Default headers
        headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.user.id}`,
            ...options.headers, // Include any additional headers passed in options
        };
    } else {
        headers = {
            "Content-Type": "application/json",
            ...options.headers, // Include any additional headers passed in options
        };
    }

    const response = fetch(url, {
        ...options,
        headers,
    });

    return response;
}
