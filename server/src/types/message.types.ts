export enum MessageContentType {
    Text = "text",
    Image = "image",
    Video = "video",
    Audio = "Audio",
    File = "file"
}

export interface ISendMessagePayload {
    roomId: string;
    senderId: string;
    content: {
        type: MessageContentType;
        data: string;
    };
}

export interface IGetRoomMessagesPayload {
    userId: string;
    roomId: string;
}
