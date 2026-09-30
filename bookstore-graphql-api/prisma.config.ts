import "dotenv/config"
import { definePrismaConfig } from "prisma/config";
import { defineConfig } from "@prisma/orm-postgres/config";
export default definePrismaConfig({
  orm: defineConfig({
    contract:"./src/prisma/schema.prisma",
    db:{
      connection:process.env["DATABASE_URL"]!,
    }
  })
});
