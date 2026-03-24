import Razorpay from "razorpay";

function getKeys() {
  const mode = process.env.APP_MODE || "TEST";

  if (mode === "PROD") {
    return {
      key_id: process.env.RAZORPAY_LIVE_KEY_ID!,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET!,
    };
  }

  return {
    key_id: process.env.RAZORPAY_TEST_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
  };
}

export function getRazorpayInstance() {
  const { key_id, key_secret } = getKeys();
  return new Razorpay({ key_id, key_secret });
}

export function getRazorpayKeyId() {
  return getKeys().key_id;
}

export function getRazorpayKeySecret() {
  return getKeys().key_secret;
}
