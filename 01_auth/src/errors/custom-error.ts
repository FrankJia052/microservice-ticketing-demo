export abstract class CustomError extends Error{
    abstract statusCode: number

    // 这里，为了让 Error('123') 可以在 log 中打出错误来，我们需要把string 传参
    constructor(message: string) {
        // 这里的string，完全为了 log 的目的，user 是看不到的
        super(message)

        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): {message: string, field?: string}[]

}