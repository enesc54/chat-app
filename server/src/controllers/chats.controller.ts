import { Request, Response } from "express";
import { CustomRequest } from "../types/request.types";
import { IRoom, Room } from "../models/room.model";
import {
    IServer,
    ICategory,
    Server as ServerModel,
    IServerRole,
    IServerMember
} from "../models/server.model";
import {
    IApiResponse,
    ErrorMessages,
    ErrorCodes
} from "../types/response.types";
import mongoose, { Types } from "mongoose";
import { ServerTemplateTypes } from "../types/server.types";
import { IRoomPermissions, PermKey, IRoomTemplate } from "../types/room.types";

export const getServers = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user || !("userId" in req.user)) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.UNAUTHORIZED,
                    message: ErrorMessages[ErrorCodes.UNAUTHORIZED]
                }
            });
        }
        const { userId } = req.user;

        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.USER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.USER_NOT_FOUND]
                }
            });
        }

        const servers = await ServerModel.find(
            {
                "members.userId": userId
            },
            { name: 1, logo: 1, banner: 1 }
        );

        const response: IApiResponse<IServer[]> = {
            success: true,
            data: servers
        };

        return res.json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const getRooms = async (req: Request, res: Response) => {
    try {
        const { serverId } = req.params;

        if (!Types.ObjectId.isValid(serverId)) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.SERVER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.SERVER_NOT_FOUND]
                }
            });
        }

        const rooms = await Room.find(
            { serverId },
            { name: 1, type: 1, categoryId: 1 }
        );

        const response: IApiResponse<IRoom[]> = {
            success: true,
            data: rooms
        };

        res.json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const { serverId } = req.params;

        if (!Types.ObjectId.isValid(serverId)) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.SERVER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.SERVER_NOT_FOUND]
                }
            });
        }

        const server = await ServerModel.findOne(
            { _id: serverId },
            { categories: 1 }
        );

        if (!server || !server.categories) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.SERVER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.SERVER_NOT_FOUND]
                }
            });
        }

        const categories = server.categories;
        categories.sort((a, b) => a.position - b.position);

        const response: IApiResponse<ICategory[]> = {
            success: true,
            data: categories
        };

        res.json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const createServer = async (req: CustomRequest, res: Response) => {
    const { serverName, serverDescription, logoUrl, bannerUrl } = req.body;
    const { template } = req.body as { template: ServerTemplateTypes };

    if (!Object.values(ServerTemplateTypes).includes(template)) {
        return res.status(400).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.INVALID_PAYLOAD,
                message: ErrorMessages[ErrorCodes.INVALID_PAYLOAD]
            }
        });
    }

    const { userId } = req.user;

    const textCategoryId = new mongoose.Types.ObjectId();
    const voiceCategoryId = new mongoose.Types.ObjectId();

    const categoriesData: ICategory[] = [
        {
            _id: textCategoryId,
            name: "Text Rooms",
            position: 1
        },
        {
            _id: voiceCategoryId,
            name: "Voice Rooms",
            position: 2
        }
    ];

    const adminRoleId = new mongoose.Types.ObjectId();
    const everyoneRoleId = new mongoose.Types.ObjectId();

    const rolesData: IServerRole[] = [
        { _id: adminRoleId, name: "admin" },
        { _id: everyoneRoleId, name: "everyone" }
    ];

    const membersData: IServerMember[] = [{ userId, role: adminRoleId }];

    const serverData = {
        name: serverName,
        description: serverDescription,
        logo: logoUrl,
        banner: bannerUrl,
        categories: categoriesData,
        owner: userId,
        roles: rolesData,
        members: membersData
    };

    const newServer = new ServerModel(serverData);
    const savedServer = await newServer.save();

    const rolePermissions: Record<PermKey, IRoomPermissions> = {
        "admin:text": {
            roleId: adminRoleId,
            canAccess: true,
            canSendMessage: true
        },
        "admin:voice": {
            roleId: adminRoleId,
            canAccess: true,
            canSendMessage: true
        },
        "everyone:text": {
            roleId: everyoneRoleId,
            canAccess: true,
            canSendMessage: true
        },
        "everyone:voice": {
            roleId: everyoneRoleId,
            canAccess: true,
            canSpeak: true
        },
        "everyone:readOnly": {
            roleId: everyoneRoleId,
            canAccess: true,
            canSendMessage: false,
            canSpeak: false
        },
        "everyone:blocked": {
            roleId: everyoneRoleId,
            canAccess: false,
            canSendMessage: false,
            canSpeak: false
        }
    };

    const serverId = savedServer._id;

    const serverTemplates: Record<ServerTemplateTypes, IRoomTemplate[]> = {
        [ServerTemplateTypes.NOT_USING]: [
            {
                name: "general chat",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "voice chat",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            }
        ],
        [ServerTemplateTypes.GAMING]: [
            {
                name: "general chat",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "moderation",
                type: "text",
                perms: ["admin:text", "everyone:blocked"]
            },
            {
                name: "media",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "game",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            },
            {
                name: "lobby",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            }
        ],
        [ServerTemplateTypes.FRIENDS]: [
            {
                name: "general chat",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "games",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "music",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "voice chat",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            }
        ],
        [ServerTemplateTypes.SCHOOL]: [
            {
                name: "announcements",
                type: "text",
                perms: ["admin:text", "everyone:readOnly"]
            },
            {
                name: "general chat",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "homework help",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "clubs",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "lecture hall",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            },
            {
                name: "study room",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            },
            {
                name: "club meetings",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            }
        ],
        [ServerTemplateTypes.WORKING]: [
            {
                name: "general chat",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "announcements",
                type: "text",
                perms: ["admin:text", "everyone:readOnly"]
            },
            {
                name: "project updates",
                type: "text",
                perms: ["admin:text", "everyone:text"]
            },
            {
                name: "meeting room 1",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            },
            {
                name: "meeting room 2",
                type: "voice",
                perms: ["admin:voice", "everyone:voice"]
            }
        ]
    };

    const roomsData: IRoom[] = (serverTemplates[template] ?? []).map(
        ({ name, type, perms }: IRoomTemplate) => {
            const permissions = perms.map(
                (perm: PermKey) => rolePermissions[perm]
            );

            const categoryId =
                type == "text" ? textCategoryId : voiceCategoryId;

            return {
                name,
                type,
                serverId,
                categoryId,
                permissions
            } as IRoom;
        }
    );

    let savedRooms: IRoom[];
    try {
        savedRooms = await Room.insertMany(roomsData);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }

    const response: IApiResponse<{ server: IServer; rooms: IRoom[] }> = {
        success: true,
        data: {
            server: savedServer.toObject(),
            rooms: savedRooms
        }
    };

    return res.json(response);
};

export const joinServer = async (req: CustomRequest, res: Response) => {
    const { serverId } = req.params;
    const { userId } = req.user;

    const server = await ServerModel.findById(serverId);
    if (!server) {
        return res.status(404).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.SERVER_NOT_FOUND,
                message: ErrorMessages[ErrorCodes.SERVER_NOT_FOUND]
            }
        });
    }

    const role = server.roles.find(r => r.name == "everyone");
    if (!role || !role?._id) {
        return res.status(404).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.ROLE_NOT_FOUND,
                message: ErrorMessages[ErrorCodes.ROLE_NOT_FOUND]
            }
        });
    }
    const roleId = role._id;

    const alredyMember = server.members.some(
        (m: IServerMember) => m.userId.toString() == userId
    );
    if (alredyMember) {
        return res.status(400).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.ALREADY_MEMBER,
                message: ErrorMessages[ErrorCodes.ALREADY_MEMBER]
            }
        });
    }

    server.members.push({ userId, role: roleId } as IServerMember);

    const updatedServer = await server.save();

    const response: IApiResponse<IServer> = {
        success: true,
        data: updatedServer
    };

    res.json(response);
};
