import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    // 这里我们定义好 statusCode
    statusCode = 500
    // 这里我们新属性定义 reason
    reason = 'Error connecting to database'
    constructor() {
        super("error connection to database!")
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    // 这里，确保我们返回的数据是common response structure
    serializeErrors() {
        return [
            {message: this.reason}
        ]
    }
}