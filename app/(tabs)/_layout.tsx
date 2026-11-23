import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, Slot } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppTheme } from "@/constants/theme";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
