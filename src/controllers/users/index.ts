import { addUser, deleteUser, getUser, getUsers,loginUser,checkUser} from "../../services/users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { error } from "console";


export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email as string, password as string);

    return res.status(200).send({ error: false, result });
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }

  }
};

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

export const getUserController = async (req: Request, res: Response) => {
  const { login, password } = req.body

  try {
    const result = await getUser(login as string, password as string);

    if (result.length === 0) {
      	res.status(200).send({ error: true, user: [] });
		}

		const user = result[0];
		const match = await bcrypt.compare(password, user.password);

		if (match) {
      let error = result[0] === undefined ? true : false;
			res.status(200).send({ error: error, user: user });
        console.log({ user });
			return user;
    
		} else {
			res.status(200).send({ error: true, user: [] });
		}
    
  } catch (error) {
  	res.status(200).send({ error: true, user: [] });
  }
};

export const addUserController = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;
  try {
 
    await addUser(
/* 			id as string,
 */			name as string,
			email as string,
			password as string,
      

		);
    res.status(200).send({ error: false ,"message": "User added successfully" });
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

export const CheckUserExistController = async (req:Request, res:Response) => {
  const { email } = req.body;
  
  try {
      const emailExists = await checkUser(email);  // This checks if the email is already in the database

      if (emailExists) {
          // Email exists, return true for exists
          return res.status(200).json({ exists: true });
      } else {
          // Email does not exist, return false for exists
          return res.status(200).json({ exists: false });
      }
  } catch (err) {
      // Handle errors
      return res.status(500).json({ error: 'Internal server error' });
  }
};
