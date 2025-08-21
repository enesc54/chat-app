import { get, post } from "./fetchClient";

export const uploadFile = async file =>
    await post("/files/upload", file, { auth: true });

export const getFileInfo = async fileId =>
    await get(`/files/${fileId}`, { auth: true });
