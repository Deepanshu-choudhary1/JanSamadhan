import { sendEmail } from "../utils/email.js";
import { sendPush } from "../utils/push.js";
import { sendSMS } from "../utils/sms.js";

export const notifyUser = async (user, payload) => {
  if (!user) return;

  const tasks = [
    sendEmail({
      to: user.email,
      subject: payload.emailSubject,
      text: payload.emailText,
      html: payload.emailHtml,
    }),
    sendSMS({ to: user.phone, message: payload.smsText }),
    sendPush({ token: user.pushToken, title: payload.pushTitle, body: payload.pushBody }),
  ];

  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Notification channel failed:", result.reason?.message || result.reason);
    }
  });
};
