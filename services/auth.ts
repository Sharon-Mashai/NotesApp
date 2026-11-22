
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import type { LoginInput, RegisterInput, User } from "@/types/user";

const USERS_STORAGE_KEY = "@notes_app/users";
const SESSION_STORAGE_KEY = "@notes_app/session";

export type UpdateProfileInput = {
  fullName: string;
  email: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type StoredUser = Omit<User, "fullName"> & {
  fullName?: string;
  username?: string;
};

async function getUsers(): Promise<User[]> {
  const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  const parsedUsers: unknown = JSON.parse(storedUsers);

  if (!Array.isArray(parsedUsers)) {
    return [];
  }

  // Migrate older accounts from username to fullName.
  const migratedUsers: User[] = (parsedUsers as StoredUser[]).map(
    (storedUser) => {
      const { username, ...userData } = storedUser;

      return {
        ...userData,
        fullName:
          typeof storedUser.fullName === "string" && storedUser.fullName.trim()
            ? storedUser.fullName.trim()
            : (username?.trim() ?? ""),
      };
    },
  );

  await saveUsers(migratedUsers);

  return migratedUsers;
}

async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !email || !input.password) {
    throw new Error("Please complete all fields.");
  }

  const users = await getUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  const newUser: User = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fullName,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, newUser]);
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, newUser.id);

  return newUser;
}

export async function loginUser(input: LoginInput): Promise<User> {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    throw new Error("Please enter your email and password.");
  }

  const users = await getUsers();
  const user = users.find((item) => item.email === email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordHash = await hashPassword(input.password);

  if (user.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password.");
  }

  await AsyncStorage.setItem(SESSION_STORAGE_KEY, user.id);

  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    return null;
  }

  const users = await getUsers();
  const currentUser = users.find((user) => user.id === sessionId);

  if (!currentUser) {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }

  return currentUser;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<User> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName || !email) {
    throw new Error("Please enter your full name and email address.");
  }

  const users = await getUsers();
  const currentUser = users.find((user) => user.id === userId);

  if (!currentUser) {
    throw new Error("User account could not be found.");
  }

  const emailAlreadyExists = users.some(
    (user) => user.id !== userId && user.email === email,
  );

  if (emailAlreadyExists) {
    throw new Error("This email address is already registered.");
  }

  const updatedUser: User = {
    ...currentUser,
    fullName,
    email,
  };

  const updatedUsers = users.map((user) =>
    user.id === userId ? updatedUser : user,
  );

  await saveUsers(updatedUsers);

  return updatedUser;
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const { currentPassword, newPassword, confirmPassword } = input;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Please complete all password fields.");
  }

  if (newPassword.length < 8) {
    throw new Error("Your new password must contain at least 8 characters.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Your new passwords do not match.");
  }

  if (currentPassword === newPassword) {
    throw new Error("Your new password must be different from your current password.");
  }

  const users = await getUsers();
  const currentUser = users.find((user) => user.id === userId);

  if (!currentUser) {
    throw new Error("User account could not be found.");
  }

  const currentPasswordHash = await hashPassword(currentPassword);

  if (currentUser.passwordHash !== currentPasswordHash) {
    throw new Error("Your current password is incorrect.");
  }

  const newPasswordHash = await hashPassword(newPassword);

  const updatedUsers = users.map((user) =>
    user.id === userId
      ? { ...user, passwordHash: newPasswordHash }
      : user,
  );

  await saveUsers(updatedUsers);
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
