import { PrismaClient } from "../generated/prisma/index.js";

export const prismaClient = new PrismaClient();
export * from "../generated/prisma/index.js";
