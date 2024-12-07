import { queries } from "../utils/db.js";
import Nylas from "nylas";

export async function syncEmails({ userId, timestamp }, queueEmail) {
    try {
  
        const nylas = new Nylas({
          apiKey: process.env.NYLAS_API_KEY,
          apiUri: process.env.NYLAS_API_URI,
        });
        console.log("Syncing emails for user", userId);
        const user = await queries.users.getById(userId);
        const lastSync = parseInt((new Date(user.last_sync)).getTime() / 1000) - 60; // Subtract 1 minute to avoid race condition
        const yesterday = parseInt((new Date(Date.now() - 24 * 60 * 60 * 1000)).getTime() / 1000);
        const messages = await nylas.messages.list({
            identifier: user.nylas_token,
            queryParams: {
                received_after: user.last_sync ? lastSync : yesterday,
                limit: 10,  // Nylas account limit
            },
        });
        for (const message of messages.data) {
            console.log("Save email to DB", message.id);
            const email = await queries.emails.create({
                emailId: message.id,
                userId,
                subject: message.subject,
                body: message.body,
            });
            queueEmail(email.id);
        }
        await queries.users.updateLastSync(userId, timestamp);
    } catch (error) {
        console.error("Error syncing emails:", error);
        throw error;
    }
}

export async function syncAllEmails(queueEmail) {
    const users = await queries.users.getAll();
    for (const user of users) {
        await syncEmails({ userId: user.id, timestamp: new Date() }, queueEmail);
    }
}
