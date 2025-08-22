export interface IJoinRoomPayload {
    roomId: string;
}

export interface IRoomPermissions {
    roleId: Types.ObjectId;
    canAccess?: boolean;
    canSendMessage?: boolean;
    canSpeak?: boolean;
}

export type PermKey =
    | "admin:text"
    | "admin:voice"
    | "everyone:text"
    | "everyone:voice"
    |'everyone:readOnly'
    | "everyone:blocked"

export interface IRoomTemplate {
    name: string;
    type: "text" | "voice";
    perms: PermKey[];
}
