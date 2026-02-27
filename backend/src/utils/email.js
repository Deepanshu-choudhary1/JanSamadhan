const hasEmailGateway = () =>
  Boolean(process.env.EMAIL_WEBHOOK_URL && process.env.EMAIL_FROM);

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return { skipped: true, reason: "missing-recipient" };

  if (!hasEmailGateway()) {
    console.log(`[email:mock] to=${to} subject=${subject} text=${text}`);
    return { skipped: true, reason: "email-gateway-not-configured" };
  }

  const payload = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email delivery failed: ${response.status} ${body}`);
  }

  return { sent: true };
};
