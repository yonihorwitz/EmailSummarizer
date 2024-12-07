import { connectRabbitMQ } from "../utils/connectServices.js";
import { processEmail } from "./processor.js";
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
        // Connect to RabbitMQ
        const connection = await connectRabbitMQ();
        const channel = await connection.createChannel();

        await waitForDatabase();
        
        // Setup queue
        const queueProcess = "email_process";
        await channel.assertQueue(queueProcess, { durable: true });
        
        await channel.consume(queueProcess, async (queueMsg) => {
            if (queueMsg !== null) {
                const msg = JSON.parse(queueMsg.content.toString());
                try {
                    await processEmail(msg);
                    channel.ack(queueMsg);
                } catch (error) {
                    console.error("Processing error:", error);
                    channel.nack(queueMsg);
                }
            }
        });
        
        console.log("Email processor service started");
    } catch (error) {
        console.error("Failed to start processor:", error);
        process.exit(1);
    }
}

startProcessor(); 