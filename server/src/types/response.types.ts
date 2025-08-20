import { IRoomPermissions } from "./room.types";
import { IMessage } from "../models/message.model";

export enum ErrorCodes {
    INVALID_PAYLOAD = "INVALID_PAYLOAD",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = " FORBIDDEN",
    SERVER_NOT_FOUND = "SERVER_NOT_FOUND",
    ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    FILE_NOT_FOUND = "FILE_NOT_FOUND",
    PERMISSION_NOT_FOUND = "PERMISSION_NOT_FOUND",
    ROLE_NOT_FOUND = "ROLE_NOT_FOUND",
    API_ERROR = "API_ERROR",
    FILE_NOT_UPLOADED = "FILE_NOT_UPLOADED"
}

export const ErrorMessages: Record<ErrorCodes, string> = {
    [ErrorCodes.INVALID_PAYLOAD]: "Invalid or missing data provided.",
    [ErrorCodes.UNAUTHORIZED]: "You must be logged in to perform this action.",
    [ErrorCodes.FORBIDDEN]: "You do not have permission to access this room.",
    [ErrorCodes.SERVER_NOT_FOUND]:
        "Server not found or you don't have access to it.",
    [ErrorCodes.ROOM_NOT_FOUND]: "The specified room could not be found.",
    [ErrorCodes.USER_NOT_FOUND]: "User does not exist.",
    [ErrorCodes.FILE_NOT_FOUND]: "File does not exist.",
    [ErrorCodes.PERMISSION_NOT_FOUND]: "No permissions set for your role.",
    [ErrorCodes.ROLE_NOT_FOUND]: "User role not found.",
    [ErrorCodes.API_ERROR]: "An unexpected error occurred.",
    [ErrorCodes.FILE_NOT_UPLOADED]: "File could not be uploaded"
};

export interface IJoinRoomSuccessResponse {
    roomId: string;
    permissions: IRoomPermissions;
}

export interface IGetRoomMessagesResponse {
    roomId: string;
    messages: IMessage[];
}

export interface IApiResponse<T = undefined> {
    success: boolean;
    data?: T;
    error?: {
        code?: ErrorCodes;
        message: string;
    };
}
//
