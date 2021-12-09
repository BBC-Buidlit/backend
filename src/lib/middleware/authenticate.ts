import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.headers.authorization;
  if (!access_token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(access_token, process.env.JWT_SECRET ?? "") as {
      id: string;
    };
    req.query.id = payload.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateUser;
