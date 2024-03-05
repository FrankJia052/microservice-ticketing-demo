import type { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError{
    statusCode = 400
    constructor(public errors: ValidationError[]) {
        // 必须 call super to invoke the constructor inside the base class
        super("Invalid request parameters")

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(err => {
            if(err.type === 'field') {
                return {
                    message: err.msg,
                    field: err.path
                }
            }
            return {message: err.msg}
        })
    }
}