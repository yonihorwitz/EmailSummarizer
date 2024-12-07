import dotenv from "dotenv";
dotenv.config({
    override: true, 
});
import { connectRabbitMQ } from "../utils/connectServices.js";
import { syncAllEmails, syncEmails } from "./syncer.js";
import cron from "node-cron";
import { pool } from "../utils/db.js";

async function waitForDatabase(maxRetries = 30, retryInterval = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Try to query the database
            await pool.query("SELECT 1");
            console.log("Successfully connected to database");
            return true;
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            console.log(`Database not ready, attempt ${i + 1}/${maxRetries}. Retrying in ${retryInterval/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }
    throw new Error("Failed to connect to database after maximum retries");
}

async function startProcessor() {
    try {
        await waitForDatabase();

        // Connect to RabbitMQ
        const connection = await connectRabbitMQ();
        const channel = await connection.createChannel();
        
        // Setup queues
        const queueSync = "email_sync";
        await channel.assertQueue(queueSync, { durable: true });
        const queueProcess = "email_process";
        await channel.assertQueue(queueProcess, { durable: true });

        const queueEmail = (email) => {
            console.log("Queueing email");
            channel.sendToQueue(queueProcess, Buffer.from(JSON.stringify(email)));
        };
        
        await channel.consume(queueSync, async (queueMsg) => {
            if (queueMsg !== null) {
                const msg = JSON.parse(queueMsg.content.toString());
                try {
                    await syncEmails(msg, queueEmail);
                    channel.ack(queueMsg);
                } catch (error) {
                    console.error("Syncing error:", error);
                    channel.nack(queueMsg);
                }
            }
        });

        // Schedule daily processing
        cron.schedule("0 0 * * *", () => syncAllEmails(queueEmail));
        
        console.log("Email syncer service started");
    } catch (error) {
        console.error("Failed to start syncer:", error);
        process.exit(1);
    }
}

startProcessor(); 