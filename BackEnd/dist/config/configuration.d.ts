export declare const configuration: () => {
    port: number;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    corsOrigins: string[];
};
