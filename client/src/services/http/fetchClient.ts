const BASE_URL = "http://localhost:3000/api";
const request = async (url, { auth = false, body, ...options } = {}) => {
    const headers = {
        ...options.headers
    };

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        if (body) {
            body = JSON.stringify(body);
        }
    }

    if (auth) {
        headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        body
    });

    const responseData = await response.json();

    return responseData;
};

export const get = async (path, { auth = false } = {}) => {
    return await request(path, {
        method: "GET",
        auth
    });
};

export const post = async (path, data, { auth = false } = {}) => {
    return await request(path, {
        method: "POST",
        body: data,
        auth
    });
};
