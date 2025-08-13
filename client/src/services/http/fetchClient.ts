const BASE_URL = "http://localhost:3000/api";
const request = async (url, { auth = false, ...options } = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (auth) {
        headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers
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

export const post = (path, data, { auth = false } = {}) =>
    request(path, {
        method: "POST",
        body: JSON.stringify(data),
        auth
    });
