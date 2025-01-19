import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode || 500;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (res: NextApiResponse, msg: string, code?: number) => {
    const statusCode = code || 500;

    // res.status(statusCode).json({
    //     status: 'error',
    //     statusCode,
    //     message: msg || 'Internal Server Error',
    // });

    return NextResponse.json({ message: msg || 'Internal Server Error' }, { status: statusCode });
};

export default AppError;