import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, Settings01Icon } from "@hugeicons/core-free-icons";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppTheme } from "@/constants/theme";

export default function ProfileScreen() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");

  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success",
  );

  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordFeedbackType, setPasswordFeedbackType] = useState<
    "success" | "error"
  >("success");

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  async function handleSaveChanges() {
    if (!fullName.trim()) {
      setFeedbackType("error");
      setFeedback("Please enter your full name.");
      return;
    }

    if (!username.trim()) {
      setFeedbackType("error");
      setFeedback("Please enter a username.");
      return;
    }

    try {
      setIsSaving(true);
      setFeedback("");

      await updateProfile({
        fullName: fullName.trim(),
        username: username.trim(),
        email: user!.email,
      });

      setFeedbackType("success");
      setFeedback("Your profile has been updated successfully.");
      setShowPersonalInfoForm(false);
    } catch (error) {
      setFeedbackType("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword() {
    try {
      setIsChangingPassword(true);
      setPasswordFeedback("");

      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordFeedbackType("success");
      setPasswordFeedback("Your password has been changed successfully.");
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordFeedbackType("error");
      setPasswordFeedback(
        error instanceof Error
          ? error.message
          : "Unable to change your password. Please try again.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await logout();
      setShowSignOutModal(false);
      router.replace("/login");
    } catch {
      setFeedbackType("error");
      setFeedback("Unable to sign out. Please try again.");
      setShowSignOutModal(false);
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Pressable
            onPress={() => router.replace("/")}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.backButtonContent}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={20}
                color={theme.colors.primaryLight}
              />
              <Text style={styles.backButtonText}>Back to Notes</Text>
            </View>
          </Pressable>

          <View style={styles.headingContainer}>
            <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
            <Text style={styles.heading}>My Profile</Text>
            <Text style={styles.subtitle}>
              Manage your account information.
            </Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "U"}</Text>
            </View>

            <Text style={styles.displayName}>{user.fullName}</Text>
            <Text style={styles.displayUsername}>@{user.username}</Text>
            <Text style={styles.displayEmail}>{user.email}</Text>
          </View>

          {/* Settings navigation */}
          <Pressable
            onPress={() => router.push("/settings")}
            style={({ pressed }) => [
              styles.settingsCard,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
          >
            <View style={styles.settingsIcon}>
              <HugeiconsIcon
                icon={Settings01Icon}
                size={23}
                color={theme.colors.primaryLight}
              />
            </View>

            <View style={styles.settingsTextContainer}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <Text style={styles.settingsDescription}>
                Manage your app preferences and appearance.
              </Text>
            </View>

            <Text style={styles.settingsArrow}>›</Text>
          </Pressable>

          {/* Personal information */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeadingRow}>
              <View style={styles.sectionHeadingText}>
                <Text style={styles.sectionTitle}>Personal information</Text>
                <Text style={styles.sectionDescription}>
                  Update your full name and username. Your registered email
                  address cannot be changed.
                </Text>
              </View>

              {!showPersonalInfoForm && (
                <Pressable
                  onPress={() => {
                    setFullName(user.fullName);
                    setUsername(user.username);
                    setFeedback("");
                    setShowPersonalInfoForm(true);
                  }}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
              )}
            </View>

            {!showPersonalInfoForm ? (
              <>
                <View style={styles.readOnlyInfoGroup}>
                  <Text style={styles.label}>Full name</Text>
                  <Text style={styles.readOnlyValue}>{user.fullName}</Text>
                </View>

                <View style={styles.readOnlyInfoGroup}>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.readOnlyValue}>@{user.username}</Text>
                </View>

                <View style={styles.readOnlyInfoGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <View style={[styles.input, styles.readOnlyInput]}>
                    <Text style={styles.readOnlyEmail}>{user.email}</Text>
                    <Text style={styles.readOnlyLabel}>Cannot be changed</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full name</Text>
                  <TextInput
                    value={fullName}
                    onChangeText={(value) => {
                      setFullName(value);
                      setFeedback("");
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.colors.textMuted}
                    autoCapitalize="words"
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={(value) => {
                      setUsername(value);
                      setFeedback("");
                    }}
                    placeholder="Enter your username"
                    placeholderTextColor={theme.colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={20}
                    style={styles.input}
                  />
                  <Text style={styles.fieldHint}>
                    3-20 characters. Letters, numbers and underscores only.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <View style={[styles.input, styles.readOnlyInput]}>
                    <Text style={styles.readOnlyEmail}>{user.email}</Text>
                    <Text style={styles.readOnlyLabel}>Cannot be changed</Text>
                  </View>
                </View>

                {feedback ? (
                  <View
                    style={[
                      styles.feedbackContainer,
                      feedbackType === "error"
                        ? styles.errorFeedback
                        : styles.successFeedback,
                    ]}
                  >
                    <Text
                      style={[
                        styles.feedbackText,
                        feedbackType === "error"
                          ? styles.errorText
                          : styles.successText,
                      ]}
                    >
                      {feedback}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleSaveChanges}
                  disabled={isSaving}
                  style={({ pressed }) => [
                    styles.saveButton,
                    pressed && !isSaving && styles.pressed,
                    isSaving && styles.disabledButton,
                  ]}
                >
                  {isSaving ? (
                    <ActivityIndicator color={theme.colors.textOnPrimary} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </Pressable>
              </>
            )}

            {!showPersonalInfoForm && feedback ? (
              <View
                style={[
                  styles.feedbackContainer,
                  feedbackType === "error"
                    ? styles.errorFeedback
                    : styles.successFeedback,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    feedbackType === "error"
                      ? styles.errorText
                      : styles.successText,
                  ]}
                >
                  {feedback}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Change password option and form */}
          {!showPasswordForm ? (
            <Pressable
              onPress={() => {
                setPasswordFeedback("");
                setShowPasswordForm(true);
              }}
              style={({ pressed }) => [
                styles.settingsCard,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Change password"
            >
              <View style={styles.settingsIcon}>
                <Text style={styles.passwordOptionIcon}>•••</Text>
              </View>

              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsTitle}>Change password</Text>
                <Text style={styles.settingsDescription}>
                  Update your account password.
                </Text>
              </View>

              <Text style={styles.settingsArrow}>›</Text>
            </Pressable>
          ) : (
            <View style={styles.formCard}>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionHeadingText}>
                  <Text style={styles.sectionTitle}>Change password</Text>
                  <Text style={styles.sectionDescription}>
                    Enter your current password and choose a new password with
                    at least 8 characters.
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordFeedback("");
                  }}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Current password</Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={(value) => {
                    setCurrentPassword(value);
                    setPasswordFeedback("");
                  }}
                  placeholder="Enter your current password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>New password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                    setPasswordFeedback("");
                  }}
                  placeholder="Enter your new password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm new password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setPasswordFeedback("");
                  }}
                  placeholder="Confirm your new password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              {passwordFeedback ? (
                <View
                  style={[
                    styles.feedbackContainer,
                    passwordFeedbackType === "error"
                      ? styles.errorFeedback
                      : styles.successFeedback,
                  ]}
                >
                  <Text
                    style={[
                      styles.feedbackText,
                      passwordFeedbackType === "error"
                        ? styles.errorText
                        : styles.successText,
                    ]}
                  >
                    {passwordFeedback}
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleChangePassword}
                disabled={isChangingPassword}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && !isChangingPassword && styles.pressed,
                  isChangingPassword && styles.disabledButton,
                ]}
              >
                {isChangingPassword ? (
                  <ActivityIndicator color={theme.colors.textOnPrimary} />
                ) : (
                  <Text style={styles.saveButtonText}>Update Password</Text>
                )}
              </Pressable>
            </View>
          )}

          <View style={styles.signOutCard}>
            <View style={styles.signOutTextContainer}>
              <Text style={styles.signOutTitle}>Sign out</Text>
              <Text style={styles.signOutDescription}>
                Sign out of your Notes App account on this device.
              </Text>
            </View>

            <Pressable
              onPress={() => setShowSignOutModal(true)}
              style={({ pressed }) => [
                styles.signOutButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sign out?</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to sign out of your account?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowSignOutModal(false)}
                disabled={isSigningOut}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSignOut}
                disabled={isSigningOut}
                style={({ pressed }) => [
                  styles.confirmSignOutButton,
                  pressed && styles.pressed,
                  isSigningOut && styles.disabledButton,
                ]}
              >
                {isSigningOut ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.confirmSignOutText}>Sign Out</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xxl,
    },
    container: {
      width: "100%",
      maxWidth: 900,
      alignSelf: "center",
      gap: theme.spacing.xl,
    },
    backButton: {
      alignSelf: "flex-start",
      paddingVertical: theme.spacing.sm,
      paddingRight: theme.spacing.md,
    },
    backButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    backButtonText: {
      color: theme.colors.primaryLight,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
    },
    headingContainer: {
      gap: theme.spacing.xs,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: 1.5,
    },
    heading: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.display,
      fontWeight: theme.typography.weights.bold,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
    },
    profileCard: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xxl,
      gap: theme.spacing.sm,
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    avatarText: {
      color: theme.colors.textOnPrimary,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
    },
    displayName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      textAlign: "center",
    },
    displayUsername: {
      color: theme.colors.primaryLight,
      fontSize: theme.typography.sizes.sm,
      textAlign: "center",
    },
    displayEmail: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      textAlign: "center",
    },
    settingsCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
    },
    settingsIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.md,
      backgroundColor: `${theme.colors.primary}20`,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsTextContainer: {
      flex: 1,
      gap: 4,
    },
    settingsTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
    },
    settingsDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      lineHeight: 19,
    },
    settingsArrow: {
      color: theme.colors.textMuted,
      fontSize: 27,
      fontWeight: "400",
    },
    passwordOptionIcon: {
      color: theme.colors.primaryLight,
      fontSize: 17,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: 2,
    },
    formCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xxl,
      gap: theme.spacing.lg,
    },
    sectionHeadingRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    sectionHeadingText: {
      flex: 1,
      gap: theme.spacing.md,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
    },
    sectionDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      lineHeight: 20,
    },
    editButton: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    editButtonText: {
      color: theme.colors.primaryLight,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
    },
    readOnlyInfoGroup: {
      gap: theme.spacing.sm,
    },
    readOnlyValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
    },
    fieldGroup: {
      gap: theme.spacing.sm,
    },
    label: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    fieldHint: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.sizes.xs,
    },
    readOnlyInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      opacity: 0.8,
    },
    readOnlyEmail: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
      flexShrink: 1,
    },
    readOnlyLabel: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.sizes.xs,
    },
    feedbackContainer: {
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
    },
    errorFeedback: {
      backgroundColor: "rgba(248, 113, 113, 0.12)",
    },
    successFeedback: {
      backgroundColor: "rgba(52, 211, 153, 0.12)",
    },
    feedbackText: {
      fontSize: theme.typography.sizes.sm,
    },
    errorText: {
      color: theme.colors.status.error,
    },
    successText: {
      color: theme.colors.status.success,
    },
    saveButton: {
      minHeight: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    saveButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
    },
    disabledButton: {
      opacity: 0.6,
    },
    signOutCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
    },
    signOutTextContainer: {
      flex: 1,
      minWidth: 180,
      gap: theme.spacing.xs,
    },
    signOutTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
    },
    signOutDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      lineHeight: 20,
    },
    signOutButton: {
      borderColor: theme.colors.status.error,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    signOutButtonText: {
      color: theme.colors.status.error,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
    modalCard: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xxl,
      gap: theme.spacing.lg,
    },
    modalTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
    },
    modalDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
      lineHeight: 22,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    cancelButton: {
      minWidth: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    cancelButtonText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
    },
    confirmSignOutButton: {
      minWidth: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    confirmSignOutText: {
      color: theme.colors.white,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.bold,
    },
    pressed: {
      opacity: 0.75,
    },
  });
}
