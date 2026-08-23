import prisma from "./prisma/client.js";
import { ConflictError } from "./errors/AppError.js";
import bcrypt from "bcrypt";
import { SignupData } from "./auth.schema.js";

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
