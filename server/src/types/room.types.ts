export interface IRoomPermissions {
    roleId: Types.ObjectId;
    canAccess?: boolean;
    canSendMessage?: boolean;
    canSpeak?: boolean;
}
