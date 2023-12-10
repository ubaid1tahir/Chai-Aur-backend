class ApiError extends Error {
    constructor(
        statusCode,
        message= "Error",
        errors = [],
        stackTrace = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.message = message
        this.data = null;// to be learn
        this.success = false
        // if(stack){
        //     this.stack = stackTrace
        // }else{
        //     Error.captureStackTrace(this,this.constructor)
        // }
    }
}

export default ApiError;