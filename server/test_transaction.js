import prisma from "./src/data/prisma.js";

async function run() {
    try {
        const user = await prisma.user.findFirst();
        console.log("Found user");
        const products = await prisma.product.findMany({ where: { userId: user.id }, take: 2 });
        console.log("Found products:", products.length);
        
        console.log("Creating transaction...");
        await prisma.transaction.create({
            data: {
                userId: user.id,
                buyer: "Customer",
                amount: 100,
                products: {
                    connect: products.map(p => ({ id: p.id }))
                }
            }
        });
        console.log("Success");
    } catch(e) {
        console.error("ERROR:", e);
    }
    process.exit(0);
}
run();
