import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign out",
          style: "destructive",
          onPress: confirmSignOut,
        },
      ],
    );
  };

  const confirmSignOut = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      router.replace("/login");
    } catch {
      Alert.alert("Sign out failed", "Unable to sign out. Please try again.");
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
              <Text style={styles.settingTitle}>Dark mode</Text>
              <Text style={styles.settingDescription}>
                Your current app appearance
              </Text>
            </View>

            <Text style={styles.currentValue}>Active</Text>
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

            {isSigningOut ? (
              <ActivityIndicator color={theme.colors.status.error} />
            ) : (
              <Text style={[styles.arrow, styles.signOutText]}>{"\u203A"}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
