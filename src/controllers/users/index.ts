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
  showStatus
} from "../../services/users";
import { Request, Response } from "express";

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
  const { email } = req.body;
  try {
    await deleteUser(email as string);
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
  const { email, status } = req.body;

  if (!email || !status) {
    return res.status(400).json({ error: true, message: "Email and status are required." });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: true,
      message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}.`,
    });
  }

  try {
    const result = await updateUserStatus(email, status);

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
  const { email } = req.body;

  try {
    const status = await showStatus(email);

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
