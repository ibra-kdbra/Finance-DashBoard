import { generateMockData } from "./src/domain/services/mock.service.js";
import prisma from "./src/data/prisma.js";

async function run() {
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found");
        process.exit(1);
    }
    console.log("Running mock for user:", user.id);
    const productsCheck = await prisma.product.findMany({ where: { userId: user.id } });
    console.log("Products currently in DB:", productsCheck.length);
    
    try {
        await generateMockData(user.id);
        console.log("Success");
    } catch(e) {
        console.error("ERROR:");
        console.error(e);
    }
    process.exit(0);
}
run();
