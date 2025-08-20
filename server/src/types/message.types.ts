export enum MessageContentType {
    Text = "text",
    Image = "image",
    Video = "video",
    Audio = "audio",
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
