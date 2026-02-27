const hasSmsGateway = () =>
  Boolean(process.env.SMS_WEBHOOK_URL && process.env.SMS_FROM);

export const sendSMS = async ({ to, message }) => {
  if (!to) return { skipped: true, reason: "missing-recipient" };

  if (!hasSmsGateway()) {
    console.log(`[sms:mock] to=${to} message=${message}`);
    return { skipped: true, reason: "sms-gateway-not-configured" };
  }

  const payload = {
    from: process.env.SMS_FROM,
    to,
    message,
  };

  const response = await fetch(process.env.SMS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SMS delivery failed: ${response.status} ${body}`);
  }

  return { sent: true };
};
