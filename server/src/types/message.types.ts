export enum MessageContentType {
    Text = "text",
    Image = "image",
    Video = "video",
    Audio = "Audio",
    File = "file"
}

export interface ISendMessagePayload {
    roomId: string;
    content: {
        type: MessageContentType;
        data: string;
    };
}

export interface IGetRoomMessagesPayload {
    roomId: string;
}
