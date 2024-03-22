import jwt from "jsonwebtoken";
import Payload from "Payload";

export async function generateToken(
  payload: Payload,
  jwtSecret: string,
  jwtExpiration: string
) {
  const token = await jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return token;
}
