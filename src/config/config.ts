/* eslint-disable */
import { User } from "src/users/entities/user.entity";
export const Config = () => ({
    jwtSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    database: {
        type: process.env.DB_DRIVER || "mysql",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE || "auth",
        synchronize: true,
        logging: false,
        entities: [
            "dist/**/entities/*.entity.js",
            // User
        ]
    }
});