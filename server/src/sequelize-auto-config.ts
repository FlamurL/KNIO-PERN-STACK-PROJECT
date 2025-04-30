import SequelizeAuto from "sequelize-auto";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const auto = new SequelizeAuto(process.env.DB_NAME || "magacin",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    singularize: false,
    useDefine: false,
    host: process.env.DB_HOST || "localhost", // or your PostgreSQL host
    dialect: "postgres",
    directory: "./@automodels/automodels", // output directory for generated automodels
    port: Number(process.env.DB_PORT) || 5432, // default port for PostgreSQL
    lang: "ts", // tells sequelize-auto to generate TypeScript files
    additional: {
      timestamps: false, // if your tables don't use timestamps
      freezeTableName: true, // keep the original table names
    }
  });

auto.run()
  .then(() => {
    console.log("Models generated successfully!");
  })
  .catch((err) => {
    console.error("Error generating automodels:", err);
  });
