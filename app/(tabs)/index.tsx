import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { theme } from "@/constants/theme";

const categories = [
  { label: "All notes", value: "all" },
  { label: "Work", value: "work" },
  { label: "Study", value: "study" },
  { label: "Personal", value: "personal" },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = () => {
    router.push("/create");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Your settings screen will be added later.");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>YOUR PERSONAL SPACE</Text>
              <Text style={styles.title}>Hello!</Text>
              <Text style={styles.subtitle}>What's on your mind today?</Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.profileButton}
                accessibilityRole="button"
                accessibilityLabel="Profile"
              >
                <Text style={styles.profileInitial}>S</Text>
              </Pressable>

              <Pressable
                style={styles.settingsButton}
                onPress={handleSettings}
                accessibilityRole="button"
                accessibilityLabel="Settings"
              >
                <Text style={styles.settingsIcon}>{"\u2699"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>{"\u2315"}</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search your notes..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />

            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Text style={styles.clearSearch}>{"\u00D7"}</Text>
              </Pressable>
            )}
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category.value;

                return (
                  <Pressable
                    key={category.value}
                    onPress={() => setSelectedCategory(category.value)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Notes */}
          <View style={styles.notesSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Your notes</Text>
                <Text style={styles.notesSubtitle}>Your ideas live here</Text>
              </View>

              <Text style={styles.noteCount}>0 NOTES</Text>
            </View>

            {/* Empty state */}
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>{"\u2726"}</Text>
              </View>

              <Text style={styles.emptyTitle}>A little space for ideas</Text>

              <Text style={styles.emptyDescription}>
                You haven't created any notes yet. Start capturing your
                thoughts, plans and ideas in one place.
              </Text>

              <Pressable
                onPress={handleAddNote}
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.createButtonIcon}>{"\uFF0B"}</Text>
                <Text style={styles.createButtonText}>
                  Create your first note
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    maxWidth: 900,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 7,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  headerActions: {
    alignItems: "center",
    gap: 8,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: theme.colors.primaryLight,
    fontSize: 18,
    fontWeight: "700",
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    color: theme.colors.textSecondary,
    fontSize: 27,
  },
  searchContainer: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 18,
    marginBottom: 38,
  },
  searchIcon: {
    color: theme.colors.textMuted,
    fontSize: 26,
    marginRight: 14,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
    outlineStyle: "none",
  } as object,
  clearSearch: {
    color: theme.colors.textSecondary,
    fontSize: 25,
    paddingLeft: 10,
  },
  section: {
    marginBottom: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
  },
  categoryList: {
    gap: 10,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  notesSection: {
    flex: 1,
  },
  notesSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  noteCount: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    paddingHorizontal: 24,
    paddingVertical: 48,
    marginTop: 8,
  },
  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(167, 139, 250, 0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  emptyIcon: {
    color: theme.colors.primary,
    fontSize: 36,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  emptyDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 380,
    marginBottom: 28,
  },
  createButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 24,
    gap: 10,
  },
  createButtonIcon: {
    color: theme.colors.textOnPrimary,
    fontSize: 22,
    fontWeight: "600",
  },
  createButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
