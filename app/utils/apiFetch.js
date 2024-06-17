// utils/apiFetch.js


export function apiFetch(url, session, options = {}) {
    // console.log("apiFetch")

    // console.log(session)

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data.user.id}`,
        ...options.headers // Include any additional headers passed in options
    };

    const response = fetch(url, {
        ...options,
        headers
    });

    return response;
}
