import { PrismaClient ,WebsiteStatus,Website,WebsiteTick} from "../generated/prisma/index.js";

export const prismaClient = new PrismaClient();
export const websiteStatus=WebsiteStatus;