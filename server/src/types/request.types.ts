import { Request } from "express";

export interface CustomRequest extends Request {
    user?:
        | {
              userId: string;
              username: string;
          }
        | JwtPayload;
    file?: Express.Multer.File;
}
