/* eslint-disable */
import { User } from "src/users/entities/user.entity";
export const Config = () => ({
    jwtSecret: process.env.JWT_ACCESs_TOKEN_SECRET,
    database: {
        type: process.env.DB_DRIVER,
        // host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        // username: process.env.DB_USERNAME,
        // password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: [
            "dist/**/entities/*.entity.js",
            // User
        ]
    }
});