import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
//  || "mongodb://localhost:27017"
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("AIPrompt");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "User",
            },
            subscription: {
                type: "string",
                defaultValue: "Free",
            }
        }
    }
});
