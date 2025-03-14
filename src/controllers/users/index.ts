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
} from "../../services/users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { jwtTokens } from "../../helpers/index";

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email as string, password as string);
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
  const {
    name,
    email,
    type_register,
    phone_number,
    newEmail,
    gender,
    date_of_birth,
  } = req.body;

  try {
    const result = await updateUser(
      name as string,
      email as string,
      type_register as string,
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
  const { login, password } = req.body;
  try {
    const result = await getUsers(login as string, password as string);
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

export const addUserController = async (req: Request, res: Response) => {
  const { id, name, email, password, type_register, phone_number, gender } =
    req.body;
  try {
    await addUser(
      /* 			id as string,
       */ name as string,
      email as string,
      password as string,
      type_register as string,
      phone_number as string,
      gender as string
    );
    res.status(200).send({ error: false, message: "User added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error " });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { login } = req.query;
  try {
    await deleteUser(login as string);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "user not found" });
  }
};

export const CheckUserExistController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const emailExists = await checkUser(email);

    if (emailExists) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
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
