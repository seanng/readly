import { encryptToken, serializeCookie } from "utils/auth";

async function handler(req, res) {
  try {
    const { email, password } = req.body;
    // throw error if email is taken
    // create new user with hashed password
    const token = encryptToken("userobject");
    res.setHeader("Set-Cookie", serializeCookie(token));
    res.status(200).json({ token });
  } catch (e) {
    console.log("e: ", e);
  }
}

export default handler;
