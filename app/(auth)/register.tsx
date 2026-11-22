import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/constants/theme";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    setErrorMessage("");

    if (
      !cleanFullName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      setErrorMessage(
        "Username must be 3-20 characters and contain only letters, numbers or underscores.",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const isStrongPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!isStrongPassword) {
      setErrorMessage(
        "Password must be at least 8 characters and contain an uppercase letter, a lowercase letter and a number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords do not match. Please check them.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        fullName: cleanFullName,
        username: cleanUsername,
        email: cleanEmail,
        password,
      });

      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>N.</Text>
          </View>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subtitle}>
            Start organising your thoughts, one note at a time.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Names</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full names"
                placeholderTextColor={theme.colors.textMuted}
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);
                  setErrorMessage("");
                }}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor={theme.colors.textMuted}
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  setErrorMessage("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                editable={!isSubmitting}
              />
              <Text style={styles.helperText}>
                3-20 characters. Letters, numbers and underscores only.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textMuted}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setErrorMessage("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.textMuted}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrorMessage("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={isSubmitting}
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffIcon : ViewIcon}
                    size={22}
                    color={theme.colors.textSecondary}
                    strokeWidth={1.8}
                  />
                </Pressable>
              </View>
              <Text style={styles.helperText}>
                At least 8 characters, including uppercase, lowercase and a
                number.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password again"
                  placeholderTextColor={theme.colors.textMuted}
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setErrorMessage("");
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  disabled={isSubmitting}
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                    size={22}
                    color={theme.colors.textSecondary}
                    strokeWidth={1.8}
                  />
                </Pressable>
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.textOnPrimary} />
              ) : (
                <Text style={styles.registerButtonText}>Create account</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  logo: {
    color: theme.colors.textOnPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  heading: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    gap: 11,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },
  passwordContainer: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  eyeButton: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    backgroundColor: "#3A2028",
    borderWidth: 1,
    borderColor: theme.colors.status.error,
    borderRadius: 10,
    padding: 9,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 12,
    lineHeight: 17,
  },
  registerButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});
