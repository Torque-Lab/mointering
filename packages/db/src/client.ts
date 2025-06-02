import { PrismaClient ,WebsiteStatus} from "../generated/prisma";

export const prismaClient = new PrismaClient();
export const websiteStatus=WebsiteStatus;