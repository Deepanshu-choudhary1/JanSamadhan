const hasPushGateway = () => Boolean(process.env.PUSH_WEBHOOK_URL);

export const sendPush = async ({ token, title, body }) => {
  if (!token) return { skipped: true, reason: "missing-device-token" };

  if (!hasPushGateway()) {
    console.log(`[push:mock] token=${token} title=${title} body=${body}`);
    return { skipped: true, reason: "push-gateway-not-configured" };
  }

  const payload = { token, notification: { title, body } };

  const response = await fetch(process.env.PUSH_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Push delivery failed: ${response.status} ${bodyText}`);
  }

  return { sent: true };
};
