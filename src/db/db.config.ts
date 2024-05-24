import { DataSource } from "typeorm"
import path from "path"

// Create a new instance of the DataSource class
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: [path.join(__dirname,".." , "entities/*.entity{.ts,.js}")],
    synchronize: true,
    logging: true,
})