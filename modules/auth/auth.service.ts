import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "../users/user.model";
import { registerSchema, loginSchema } from "../auth/auth.schema";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  AppError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "../../core/errors/custom-errors";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountReactivationEmail,
} from "../../services/email.service";

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1h";
const VERIFICATION_TOKEN_LIFETIME = 24 * 60 * 60 * 1000;

const generateAuthToken = (user: IUser): string => {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    lastName: user.lastName,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const registerUser = async (
  userData: typeof registerSchema._type
): Promise<IUser> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser && existingUser.isDeleted) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + VERIFICATION_TOKEN_LIFETIME
      );
      
      await User.findByIdAndUpdate(
        existingUser._id,
        {
          verificationToken: await bcrypt.hash(rawToken, 10),
          verificationTokenExpires: verificationTokenExpires,
        },
        { new: true, runValidators: false }
      );

      await sendAccountReactivationEmail(
        existingUser.email,
        rawToken,
        existingUser._id.toString()
      );

      throw new ConflictError(
        "Tu cuenta estaba eliminada. Te enviamos un correo para reactivarla."
      );
    }

    if (existingUser) {
      throw new ConflictError("El correo electrónico ya está registrado.");
    }

    const user = new User(userData);
    const rawVerificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = await bcrypt.hash(rawVerificationToken, 10);
    user.verificationTokenExpires = new Date(
      Date.now() + VERIFICATION_TOKEN_LIFETIME
    );

    await user.save();
    await sendVerificationEmail(
      user.email,
      rawVerificationToken,
      user._id.toString()
    );

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Error al registrar usuario en auth.service.ts:", error);
    throw new InternalServerError(
      "Ocurrió un error inesperado durante el registro."
    );
  }
};

export const loginUser = async (
  credentials: typeof loginSchema._type
): Promise<{ user: IUser; token: string }> => {
  const { email, password } = credentials;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Credenciales inválidas.");
  }

  if (user.isDeleted) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(
      Date.now() + VERIFICATION_TOKEN_LIFETIME
    );
    
    await User.findByIdAndUpdate(
      user._id,
      {
        verificationToken: await bcrypt.hash(rawToken, 10),
        verificationTokenExpires: verificationTokenExpires,
      },
      { new: true, runValidators: false }
    );

    await sendAccountReactivationEmail(
      user.email,
      rawToken,
      user._id.toString()
    );

    throw new UnauthorizedError(
      "Tu cuenta fue eliminada. Te enviamos un correo para reactivarla."
    );
  }

  if (!user.isVerified) {
    throw new UnauthorizedError(
      "Por favor, verifica tu correo electrónico para iniciar sesión."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError("Credenciales inválidas.");
  }

  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

  const token = generateAuthToken(user);
  return { user, token };
};

export const verifyEmail = async (token: string): Promise<string> => {
  const users = await User.find({ verificationToken: { $ne: null } });

  let user: IUser | undefined;
  for (const u of users) {
    const isMatch = await bcrypt.compare(token, u.verificationToken || "");
    if (isMatch) {
      user = u as IUser;
      break;
    }
  }

  if (
    !user ||
    !user.verificationTokenExpires ||
    user.verificationTokenExpires < new Date()
  ) {
    throw new UnauthorizedError("El token es inválido o ha expirado.");
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    },
    { new: true, runValidators: false }
  );

  return "Tu cuenta ha sido verificada correctamente.";
};

export const forgotPassword = async (email: string): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("El correo no está registrado.");

  const rawToken = crypto.randomBytes(32).toString("hex");
  const passwordResetTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_LIFETIME);

  await User.findByIdAndUpdate(
    user._id,
    {
      passwordResetToken: await bcrypt.hash(rawToken, 10),
      passwordResetTokenExpires: passwordResetTokenExpires,
    },
    { new: true, runValidators: false }
  );

  await sendPasswordResetEmail(user.email, rawToken, user._id.toString());
  return "Te enviamos un correo con las instrucciones para restablecer tu contraseña.";
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<string> => {
  const users = await User.find({
    passwordResetToken: { $ne: null },
    passwordResetTokenExpires: { $gte: new Date() },
  });

  let user: IUser | null = null;
  for (const u of users) {
    const isMatch = await bcrypt.compare(token, u.passwordResetToken || "");
    if (isMatch) {
      user = u as IUser;
      break;
    }
  }

  if (!user) {
    throw new UnauthorizedError("Token inválido o expirado.");
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetTokenExpires: undefined,
    },
    { new: true, runValidators: false }
  );

  return "Tu contraseña ha sido actualizada correctamente.";
};

export const reactivateAccount = async (token: string): Promise<string> => {
  const users = await User.find({
    verificationToken: { $ne: null },
    isDeleted: true,
    verificationTokenExpires: { $gte: new Date() },
  });

  let user: IUser | null = null;
  for (const u of users) {
    const isMatch = await bcrypt.compare(token, u.verificationToken || "");
    if (isMatch) {
      user = u as IUser;
      break;
    }
  }

  if (!user) {
    throw new UnauthorizedError("Token inválido o expirado.");
  }
  
  await User.findByIdAndUpdate(
    user._id,
    {
      isDeleted: false,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    },
    { new: true, runValidators: false }
  );

  return "Tu cuenta ha sido reactivada correctamente. Ya puedes iniciar sesión.";
};