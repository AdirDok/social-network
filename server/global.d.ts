namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        Password_Validator: string | RegExp;
        Email_Validator: string | RegExp;
        SESSION_SECRET: string;
    }
}
