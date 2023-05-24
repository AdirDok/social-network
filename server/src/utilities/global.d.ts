namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        session_secret: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        SESSION_SECRET: string;
        // TokeExpiresIn: string;
        ACCSESS_TOKEN_EXPIRES_IN: string
        REFRESH_TOKEN_EXPIRES_IN: string
    }
}
