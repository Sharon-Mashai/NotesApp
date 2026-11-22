import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  changeUserPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from "@/services/auth";

import type { LoginInput, RegisterInput, User } from "@/types/user";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to restore authentication session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const newUser = await registerUser(input);
    setUser(newUser);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const loggedInUser = await loginUser(input);
    setUser(loggedInUser);
  }, []);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!user) {
        throw new Error("You must be logged in to update your profile.");
      }

      const updatedUser = await updateUserProfile(user.id, input);
      setUser(updatedUser);
    },
    [user],
  );

  const changePassword = useCallback(
    async (input: ChangePasswordInput) => {
      if (!user) {
        throw new Error("You must be logged in to change your password.");
      }

      await changeUserPassword(user.id, input);
    },
    [user],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
