import { post } from "./fetchClient";

export const uploadFile = async file =>
    await post("/files/upload", file, { auth: true });
