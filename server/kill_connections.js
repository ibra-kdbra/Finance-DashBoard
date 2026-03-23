import prisma from "./src/data/prisma.js";
async function run() {
    try {
        await prisma.$executeRawUnsafe(`
            SELECT pg_terminate_backend(pid) 
            FROM pg_stat_activity 
            WHERE pid <> pg_backend_pid() 
            AND usename = current_user;
        `);
        console.log("Killed all hanging queries for the user");
    } catch(e) {
        console.error("Error killing connections", e.message);
    }
    process.exit(0);
}
run();
