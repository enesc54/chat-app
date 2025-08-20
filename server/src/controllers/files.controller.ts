import { supabase } from "../config/supabase";
import { Request, Response } from "express";
import { CustomRequest } from "../types/request.types";
import {
    IApiResponse,
    ErrorMessages,
    ErrorCodes
} from "../types/response.types";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import path from "path";
import { File as FileModel, IFile } from "../models/file.model";

export const uploadFile = async (req: CustomRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.FILE_NOT_UPLOADED,
                message: ErrorMessages[ErrorCodes.FILE_NOT_UPLOADED]
            }
        });
    }

    const file = req.file;

    const fileExt = path.extname(file.originalname);

    const uniqueFileName = `${uuidv4()}${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("files")
        .upload(uniqueFileName, file.buffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.mimetype
        });

    if (uploadError) {
        return res.status(400).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.FILE_NOT_UPLOADED,
                message: ErrorMessages[ErrorCodes.FILE_NOT_UPLOADED]
            }
        });
    }

    const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(uniqueFileName);
    const publicUrl = publicUrlData.publicUrl;

    const dbFile = new FileModel({
        name: file.originalname,
        url: publicUrl,
        size: file.size,
        uploaded_by: req.user.userId,
        uploaded_at: new Date()
    });
    const dbSavedFile = await dbFile.save();

    const response: IApiResponse<IFile> = {
        success: true,
        data: dbSavedFile
    };

    return res.json(response);
};

export const getFileInfo = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;

        if (!Types.ObjectId.isValid(fileId)) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.FILE_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.FILE_NOT_FOUND]
                }
            });
        }

        const file = await FileModel.findOne({ _id: fileId });

        if (!file) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.FILE_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.FILE_NOT_FOUND]
                }
            });
        }

    

        const response: IApiResponse<IFile> = {
            success: true,
            data: file
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
