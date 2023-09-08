const axios = require("axios");

async function sendMessage(text: string) {
  const res = await axios.post(
    "https://api.telnyx.com/v2/messages",
    {
      from: process.env.FROM_PHONE_NUMBER,
      to: process.env.TO_PHONE_NUMBER,
      text,
      type: "SMS",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
      },
    }
  );

  return res;
}

export { sendMessage };
