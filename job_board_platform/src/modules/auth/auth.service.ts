import { prisma } from "../../../prisma/client";
import { ConflictError, NotFoundError, MisMatchError } from "../../errors/AppError.js";
import bcrypt from "bcrypt";
import { SignupData, LoginData } from "./auth.schema.js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function registerUser(input: SignupData) {
  const emailExists = await prisma.user.findUnique({ where: { email: input.email } });
  if (emailExists) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  return prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword,
        role: input.role,
      },
    });

    if (input.role === "EMPLOYER") {
      await tx.employerProfile.create({
        data: {
          userId: newUser.id,
          companyName: input.companyName,
          companyDescription: input.companyDescription,
        },
      });
    } else if (input.role === "CANDIDATE") {
      await tx.candidateProfile.create({
        data: { userId: newUser.id, headline: input.headline },
      });
    }

    return tx.user.findUnique({
      where: { id: newUser.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  });
}

export async function loginUser( input: LoginData ) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user){
    throw new MisMatchError("Incorret email or password");
  }

  const isMatch = await bcrypt.compare( input.password, user.paswordHash);
  if (!isMatch){
    throw new MisMatchError("Incorrect email or password");
  }

  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("secret key not set");
  }
  const token = jwt.sign({ _id: user.id.to_string(), email: user.email }, SECRET_KEY, { expiresIn: '2 days',});

  return { user: { id: user.id, email: user.email}, token: token};


}
