import cookieJS from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export function serializeCookie(token = "", maxAge = 24 * 60 * 60): string {
  return cookieJS.serialize("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge,
    secure: process.env.VERCEL_ENV === "production",
  });
}

export function encryptToken(user): string {
  return jwt.sign({ user, time: new Date() }, "jwt_secret");
}
