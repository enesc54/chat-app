import { createErrorResponse } from "../../../src/utils/response";
import { ErrorCodes, ErrorMessages } from "../../../src/types/response.types";

describe("createErrorResponse", () => {
    it("should create correct error response for each error code", () => {
        Object.values(ErrorCodes).forEach(code => {
            const result = createErrorResponse(code);

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe(code);
            expect(result.error?.message).toBe(ErrorMessages[code]);
        });
    });
});
