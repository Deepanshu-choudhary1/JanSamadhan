import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Load service account JSON from env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPush = async (token, title, body) => {
  const message = {
    notification: { title, body },
    token,
  };

  try {
    await admin.messaging().send(message);
    console.log(`🔔 Push sent to ${token}`);
  } catch (err) {
    console.error("❌ Push error:", err);
  }
};
