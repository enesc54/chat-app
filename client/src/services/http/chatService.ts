import { get, post } from "./fetchClient";

export const getServers = async () =>
    await get("/chats/getServers", { auth: true });

export const getRooms = async serverId =>
    await get(`/chats/getRooms/${serverId}`, { auth: true });

export const getCategories = async serverId =>
    await get(`/chats/getCategories/${serverId}`, { auth: true });

export const createServer = async data =>
    await post("/chats/createServer", data, { auth: true });

export const joinServer = async serverId =>
    await get(`/chats/joinServer/${serverId}`, { auth: true });
