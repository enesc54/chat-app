import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages
} from "../types/response.types";

export function createErrorResponse(code: ErrorCodes): IApiResponse<undefined> {
    return {
        success: false,
        error: {
            message: ErrorMessages[code],
            code
        }
    };
}
