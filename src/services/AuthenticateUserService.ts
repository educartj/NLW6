import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"

interface IAuthenticateUserService{
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({email, password}:IAuthenticateUserService){
    const usersRepositories = getCustomRepository(UsersRepositories);
    //verificar se email existe
    const user = await usersRepositories.findOne({
      email
    })

    if (!user) {
      throw new Error("Email/Password incorrect")
    }
    //Verificar se a senha está correta
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }
    // Gerar token
    const token = sign(
      {
       email: user.email,
      },
      "d47423688375cd415fab4ba1f8464393",
      {
       subject:user.id,
       expiresIn: "1d",
      }
    );
    return token;
  }
}

export {AuthenticateUserService}