import { PrismaClient ,WebsiteStatus} from "../generated/prisma/index.js";

export const prismaClient = new PrismaClient();
export const websiteStatus=WebsiteStatus;