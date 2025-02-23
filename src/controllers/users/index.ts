import { addUser, deleteUser, login, getUsers} from "../../services/users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { jwtTokens } from '../../helpers/index';

export const getUsersController = async (req: Request, res: Response) => {
  const { login, password } = req.body
  try {
    const result = await getUsers(login as string, password as string);
    res.status(200).send({ error: false ,result});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export const addUserController = async (req: Request, res: Response) => {
  const { name, password, email, registerType } = req.body;
  try {
    await addUser(
			name as string,
			password as string,
			email as string,
			registerType as string,
		);
    res.status(200).send({ error: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await login(email as string, password as string);

    console.log({result})
    let tokens = jwtTokens(result.user_id, result.user_name, result.user_email);
    console.log({tokens})
    res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});

    res.status(200).send({ error: false ,tokens});
  } catch (Error :any) {
    return res.status(500).json({ error: Error.message });
  }
};


export const deleteUserController = async (req: Request, res: Response) => {
  const { login } = req.query;
  try {
    await deleteUser(login as string);
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
