import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AiSparklesIcon } from "@hugeicons/core-free-icons";

import type { AppTheme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Stack.Screen options={{ title: "Page not found" }} />

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <HugeiconsIcon
            icon={AiSparklesIcon}
            size={34}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.title}>Lost your way?</Text>

        <Text style={styles.description}>
          We couldn't find the page you're looking for. Let's get you back to
          your notes.
        </Text>

        <Link href="/" style={styles.link}>
          Back to home
        </Link>
      </View>
    </>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    iconContainer: {
      width: 68,
      height: 68,
      borderRadius: theme.radius.xl,
      backgroundColor: "rgba(167, 139, 250, 0.13)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xl,
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    description: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
      lineHeight: 24,
      textAlign: "center",
      maxWidth: 300,
      marginBottom: theme.spacing.xl,
    },
    link: {
      color: theme.colors.primaryLight,
      fontSize: theme.typography.sizes.md,
      fontWeight: "700",
      padding: theme.spacing.md,
    },
  });
}
