import { queries } from "../utils/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateSummary(email, categories) {
    const categoriesString = categories.length > 0 ? categories.map(category => category.category).join(", ") : "No categories available";
    const summary = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant that summarizes and categorizes emails.  
                    You are given an email and you need to summarize it in one or two sentences.

                    Also, you should provide a high-level category for the email based on its content.
                    If possible, the category should be one of the following: ${categoriesString}.
                    Only provide a new category if the email does not fit into any of the existing categories.
                    The category you provide could be used to categorize future e-mails, so it should be fairly broad.

                    Your response should be in JSON format: { summary: <string>, category: <string> }`
            },
            { role: "user", content: email.body }
        ],
    });
    try {
        const parsedSummary = JSON.parse(summary.choices[0].message.content);
        console.log("Successfully parsed summary!");
        return {
            status: "success",
            ...parsedSummary,
        };
    } catch (error) {
        console.error("Error parsing summary:", error, summary.choices[0].message.content);
        return { status: "error", summary: "", category: "" };
    }
}

export async function processEmail(msg) {
    const email = await queries.emails.getById(msg);
    const categories = await queries.emails.getEmailCategories();
    console.log("Sending email to AI", email.id);
    const { status, category, summary } = await generateSummary(email, categories);
    if (status === "success") {
        await queries.emails.updateEmail(email.id, { category, summary });
    } else {
        console.error(`Error generating summary for email ${email.id}`);
    }
}
