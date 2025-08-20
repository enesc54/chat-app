import { Request, Response } from "express";
import { CustomRequest } from "../types/request.types";
import { IRoom, Room } from "../models/room.model";
import {
    IServer,
    ICategory,
    Server as ServerModel
} from "../models/server.model";
import {
    IApiResponse,
    ErrorMessages,
    ErrorCodes
} from "../types/response.types";
import { Types } from "mongoose";

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
