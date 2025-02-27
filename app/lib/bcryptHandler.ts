import bcrypt from "bcryptjs";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}
