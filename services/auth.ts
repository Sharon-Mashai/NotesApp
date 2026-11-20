import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import type { LoginInput, RegisterInput, User } from "@/types/user";

const USERS_STORAGE_KEY = "@notes_app/users";
const SESSION_STORAGE_KEY = "@notes_app/session";

async function getUsers(): Promise<User[]> {
  const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  const parsedUsers: unknown = JSON.parse(storedUsers);

  return Array.isArray(parsedUsers) ? (parsedUsers as User[]) : [];
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
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();

  if (!username || !email || !input.password) {
    throw new Error("Please complete all fields.");
  }

  const users = await getUsers();

  const emailExists = users.some((user) => user.email === email);

  if (emailExists) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  const newUser: User = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    username,
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

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
