export class AppError extends Error {
    constructor(public statusCode: number, message: string){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor( message = 'Resource not found'){
        super(404, message);
    }
}

export class BadRequestError extends AppError {
    constructor( message = 'Bad request'){
        super(400, message);
    }
}

export class ConflictError extends AppError {
    constructor( message = "Resource already exists"){
        super(409, message)
        this.name="ConflictError";
    }
}

export class MisMatchError extends AppError {
    constructor ( message = "Resource doesn't match"){
        super(401, message)
        this.name = "MisMatchError";
    }
}
