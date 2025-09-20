import { Issue } from "../models/Issue.js";
import { sendEmail } from "../utils/email.js";
import { sendSMS } from "../utils/sms.js";
import { sendPush } from "../utils/push.js";

export const reportIssue = async (req, res) => {
  try {
    const { description, category, location, userEmail, userPhone, pushToken } = req.body;

    const issue = await Issue.create({
      description,
      category,
      location,
      status: "Reported",
      userId: req.user.id,
    });

    // Notify citizen
    if (userEmail) {
      await sendEmail(
        userEmail,
        "Issue Reported Successfully",
        `Your issue has been logged with ID: ${issue.id}`,
        `<p>Your issue <b>${description}</b> was successfully reported.</p>`
      );
    }

    if (userPhone) {
      await sendSMS(userPhone, `✅ Issue reported: ${description}`);
    }

    if (pushToken) {
      await sendPush(pushToken, "Issue Reported", description);
    }

    res.status(201).json({ message: "Issue reported successfully", issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
