import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import { queries } from "../utils/db.js";
import Nylas from "nylas";

const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  redirectUri: process.env.NYLAS_CALLBACK_URI,
};

const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});

// Add authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Get all emails
router.get("/emails", requireAuth, async (req, res) => {
  try {
    const emails = await queries.emails.getAll(req.session.userId);
    res.json({ emails });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// Trigger email sync
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const msg = {
      type: "SYNC_EMAILS",
      userId: req.session.userId,
      timestamp: new Date(),
    };
    await req.channel.sendToQueue("email_sync", Buffer.from(JSON.stringify(msg)));
    res.json({ message: "Sync initiated" });
  } catch (error) {
    console.error("Failed to initiate sync:", error);
    res.status(500).json({ error: "Failed to initiate sync" });
  }
});

router.get("/current_user", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = queries.users.get(req.session.userId);
  res.json(user);
});

router.get("/nylas/auth", (req, res) => {
  try {
    const authUrl = nylas.auth.urlForOAuth2(nylasConfig);
    res.json({ authUrl });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get auth URL", message: error.message });
  }
});

// callback route Nylas redirects to
router.post("/auth/validate", async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).send("No authorization code returned from Nylas");
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: process.env.NYLAS_API_KEY,
      clientId: process.env.NYLAS_CLIENT_ID,
      redirectUri: process.env.NYLAS_CALLBACK_URI,
      code,
    });

    // Create or update user
    const user = await queries.users.create({
      email: response.email,
      nylasToken: response.grantId,
    });

    // Set up session
    req.session.userId = user.id;
    req.session.email = user.email;

    res.json({
      message: "OAuth2 flow completed successfully",
      user: {
        email: user.email,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res
      .status(500)
      .json({ error: "Failed to exchange authorization code for token" });
  }
});

// Add logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
