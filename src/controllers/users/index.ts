import dns from "dns";
import nodemailer from "nodemailer";
import axios from "axios";

import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  checkUser,
  refreshAccessTokenService,
  deleteRefreshTokenService,
  updatePassword,
  updateUser,
  addTutor,
  updateUserStatus,
  updateUserDetails,
  showStatus,
  getUserById,
  verifyUserService
} from "../../services/users";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { jwtTokens } from "../../helpers/index";

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email as string, password as string);
    if (!result.is_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
      });
    }
    let tokens = jwtTokens(result.user_id, result.user_name, result.user_email);
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).send({ error: false, result, tokens });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Invalid email or password") {
        return res.status(404).json({ error: "Invalid email " });
      }
      if (error.message === "Invalid password") {
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpadateUserController = async (req: Request, res: Response) => {
  const { name, email, phone_number, newEmail, gender, date_of_birth } =
    req.body;

  try {
    const result = await updateUser(
      name as string,
      email as string,
      phone_number as string,
      gender as string,
      newEmail as string,
      date_of_birth as string
    );

    let tokens = jwtTokens(result.user_id, result.user_name, result.user_email);
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).send({ error: false, result, tokens });
  } catch (error: unknown) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const result = await getUsers();
    res.status(200).send({ error: false, result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await getUser(email as string);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const { password, ...userData } = result[0];

    return res.status(200).json({ error: false, user: userData });
  } catch (error) {
    console.error("Error in getUserController:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

export const updatePasswordController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await checkUser(email as string);
    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    await updatePassword(email as string, password as string);

    return res
      .status(200)
      .json({ error: false, message: "Password updated successfully" });
  } catch (error: unknown) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
};

const verifyCaptcha = async (token: string) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;
  const response:any = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: { secret, response: token },
    }
  );
  return response.data.success;
};



export const addUserController = async (req: Request, res: Response) => {
  const { name, email, password, type_register, phone_number, gender ,captchaToken} = req.body;

  try {
    const human = await verifyCaptcha(captchaToken);
    if (!human) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }
    // Save user (status = waiting, is_verified = false by default)
    await addUser(name, email, password, type_register, phone_number, gender);

    // Create token valid for 24h
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Welcome, ${name}!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return res.status(200).json({
      error: false,
      message: "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    await deleteUser(id as string);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "user not found" });
  }
};

const checkDomain = (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const domain = email.split("@")[1];
    if (!domain) {
      return resolve(false);
    }

    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const CheckUserExistController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const emailExists = await checkUser(email); 
    const isDomainValid = await checkDomain(email); 

    return res.status(200).json({
      exists: emailExists,
      domainValid: isDomainValid,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getRefreshTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const tokens = await refreshAccessTokenService(req);
    res.json(tokens);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const deleteRefreshTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    deleteRefreshTokenService(res);
    res.status(200).json({ message: "Refresh token deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const addTutorDetails = async (req: Request, res: Response) => {
  const {
    email,
    country,
    price_per_hour,
    specialty,
    degree,
    languages,
    availability,
  } = req.body;

  if (
    !email ||
    !country ||
    !price_per_hour ||
    !specialty ||
    !degree ||
    !languages ||
    !availability
  ) {
    return res
      .status(400)
      .send({ error: true, message: "All tutor fields are required." });
  }

  try {
    await addTutor(
      email as string,
      country as string,
      price_per_hour as number,
      specialty as string,
      degree as string,
      languages as string[],
      availability as string
    );

    res.status(200).send({ error: false, message: "Tutor added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAcceuil = async (req: Request, res: Response) => {
  const { email, bio, photo } = req.body;

  if (!email) {
    return res.status(400).send({ error: true, message: "Email is required" });
  }

  try {
    await updateUserDetails(email, bio, photo);

    return res.status(200).send({ error: false, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const validStatuses = ["accepted", "rejected", "waiting","aproved"];

export const UpdateStatusController = async (req: Request, res: Response) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: true, message: "Email and status are required." });
  }
 
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: true,
      message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}.`,
    });
  }

  try {
    const result = await updateUserStatus(id, status);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "No user found with the provided email.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "User status updated successfully.",
    });
  } catch (error) {
    console.error("UpdateStatusController Error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
};

export const ShowStatusController = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const status = await showStatus(id);

    if (!status) {
      return res.status(404).json({
        error: true,
        message: "User not found or no status available for the given email",
      });
    }

    return res.status(200).json({
      error: false,
      status: status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};



export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(200).json({ error: false, user });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: (error as Error).message || "Internal server error",
    });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    const result = await verifyUserService(token as string);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};