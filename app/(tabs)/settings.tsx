import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { type AppTheme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { mode, theme, setMode } = useTheme();

  const styles = createStyles(theme);

  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = () => {
    setSignOutError("");
    setShowSignOutModal(true);
  };

  const handleCancelSignOut = () => {
    if (!isSigningOut) {
      setShowSignOutModal(false);
      setSignOutError("");
    }
  };

  const confirmSignOut = async () => {
    try {
      setIsSigningOut(true);
      setSignOutError("");

      await logout();

      setShowSignOutModal(false);
      router.replace("/login");
    } catch {
      setSignOutError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleOpenProfile = () => {
    router.push("/profile");
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u2039"}</Text>
          </Pressable>

          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your app preferences</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>{"\u263E"}</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingTitle}>Appearance</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred app theme
              </Text>
            </View>

            <Text style={styles.currentValue}>
              {mode === "dark" ? "Dark" : "Light"}
            </Text>
          </View>

          <View style={styles.modeOptions}>
            <Pressable
              style={[
                styles.modeButton,
                mode === "light" && styles.modeButtonActive,
              ]}
              onPress={() => void setMode("light")}
              accessibilityRole="button"
              accessibilityLabel="Switch to light mode"
              accessibilityState={{ selected: mode === "light" }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === "light" && styles.modeButtonTextActive,
                ]}
              >
                {"\u2600"} Light
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === "dark" && styles.modeButtonActive,
              ]}
              onPress={() => void setMode("dark")}
              accessibilityRole="button"
              accessibilityLabel="Switch to dark mode"
              accessibilityState={{ selected: mode === "dark" }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === "dark" && styles.modeButtonTextActive,
                ]}
              >
                {"\u263E"} Dark
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <Pressable
            style={styles.settingCard}
            onPress={handleOpenProfile}
            accessibilityRole="button"
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>{"\u263A"}</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingDescription}>
                Manage your personal information
              </Text>
            </View>

            <Text style={styles.arrow}>{"\u203A"}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURITY</Text>

          <Pressable
            style={styles.settingCard}
            onPress={handleOpenProfile}
            accessibilityRole="button"
          >
            <View style={styles.settingIcon}>
              <Text style={styles.iconText}>{"\u26BF"}</Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={styles.settingTitle}>Password</Text>
              <Text style={styles.settingDescription}>
                Manage your account password
              </Text>
            </View>

            <Text style={styles.arrow}>{"\u203A"}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SESSION</Text>

          <Pressable
            style={[styles.settingCard, styles.signOutCard]}
            onPress={handleSignOut}
            disabled={isSigningOut}
            accessibilityRole="button"
          >
            <View style={styles.settingIcon}>
              <Text style={[styles.iconText, styles.signOutText]}>
                {"\u21AA"}
              </Text>
            </View>

            <View style={styles.settingDetails}>
              <Text style={[styles.settingTitle, styles.signOutText]}>
                Sign out
              </Text>
              <Text style={styles.settingDescription}>
                Sign out of your account
              </Text>
            </View>

            <Text style={[styles.arrow, styles.signOutText]}>{"\u203A"}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelSignOut}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>{"\u21AA"}</Text>
            </View>

            <Text style={styles.modalTitle}>Sign out?</Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to sign out of your account?
            </Text>

            {signOutError ? (
              <Text style={styles.errorText}>{signOutError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleCancelSignOut}
                disabled={isSigningOut}
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.confirmButton}
                onPress={confirmSignOut}
                disabled={isSigningOut}
                accessibilityRole="button"
              >
                {isSigningOut ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Sign out</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      width: "100%",
      maxWidth: 900,
      alignSelf: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingTop: 56,
      paddingBottom: 48,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xxxl,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    backIcon: {
      color: theme.colors.textPrimary,
      fontSize: 34,
      lineHeight: 38,
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: "700",
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      marginTop: 4,
    },
    section: {
      marginBottom: theme.spacing.xxl,
    },
    sectionTitle: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.sizes.xs,
      fontWeight: "700",
      letterSpacing: 1.2,
      marginBottom: theme.spacing.md,
      marginLeft: 4,
    },
    settingCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    settingIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
    },
    iconText: {
      color: theme.colors.primaryLight,
      fontSize: 23,
    },
    settingDetails: {
      flex: 1,
    },
    settingTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
      fontWeight: "600",
    },
    settingDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.xs,
      marginTop: 4,
    },
    currentValue: {
      color: theme.colors.primaryLight,
      fontSize: theme.typography.sizes.xs,
      fontWeight: "600",
    },
    modeOptions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    modeButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    modeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    modeButtonText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      fontWeight: "600",
    },
    modeButtonTextActive: {
      color: theme.colors.textOnPrimary,
    },
    arrow: {
      color: theme.colors.textSecondary,
      fontSize: 27,
    },
    signOutCard: {
      borderColor: "rgba(248, 113, 113, 0.25)",
    },
    signOutText: {
      color: theme.colors.status.error,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    modalCard: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xxl,
      alignItems: "center",
    },
    modalIcon: {
      width: 58,
      height: 58,
      borderRadius: theme.radius.full,
      backgroundColor: "rgba(248, 113, 113, 0.12)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    modalIconText: {
      color: theme.colors.status.error,
      fontSize: 30,
    },
    modalTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xl,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    modalMessage: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: theme.spacing.xl,
    },
    errorText: {
      color: theme.colors.status.error,
      fontSize: theme.typography.sizes.sm,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    modalActions: {
      flexDirection: "row",
      width: "100%",
      gap: theme.spacing.md,
    },
    cancelButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButtonText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.sm,
      fontWeight: "600",
    },
    confirmButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.status.error,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.sizes.sm,
      fontWeight: "600",
    },
  });
}
