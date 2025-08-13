import { get } from "./fetchClient";

export const getServers = async () =>
    await get("/chats/getServers", { auth: true });

export const getRooms = async serverId =>
    await get(`/chats/getRooms/${serverId}`, { auth: true });
