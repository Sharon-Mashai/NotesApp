import { useState } from "react";
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
    Alert.alert(
      "Create a note",
      "Your note editor will be added in the next step.",
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>YOUR PERSONAL SPACE</Text>
            <Text style={styles.title}>Good morning 👋</Text>
            <Text style={styles.subtitle}>What's on your mind today?</Text>
          </View>

          <View style={styles.profileButton}>
            <Text style={styles.profileInitial}>S</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your notes..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearch}>×</Text>
            </Pressable>
          )}
        </View>

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

        <View style={styles.notesSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your notes</Text>
              <Text style={styles.notesSubtitle}>Your ideas live here</Text>
            </View>

            <Text style={styles.noteCount}>0 NOTES</Text>
          </View>

          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>✦</Text>
            </View>

            <Text style={styles.emptyTitle}>A little space for ideas</Text>

            <Text style={styles.emptyDescription}>
              You haven't created any notes yet. Start capturing your thoughts,
              plans and ideas in one place.
            </Text>

            <Pressable
              onPress={handleAddNote}
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.createButtonIcon}>＋</Text>
              <Text style={styles.createButtonText}>
                Create your first note
              </Text>
            </Pressable>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 28,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
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
  searchContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: 32,
  },
  searchIcon: {
    color: theme.colors.textMuted,
    fontSize: 27,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
    outlineStyle: "none",
  } as object,
  clearSearch: {
    color: theme.colors.textSecondary,
    fontSize: 24,
    paddingLeft: 10,
  },
  section: {
    marginBottom: 34,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
    paddingHorizontal: 17,
    paddingVertical: 11,
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
    fontSize: 13,
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
    marginTop: 5,
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
    paddingVertical: 42,
    marginTop: 8,
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(167, 139, 250, 0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  emptyIcon: {
    color: theme.colors.primary,
    fontSize: 34,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyDescription: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 290,
    marginBottom: 25,
  },
  createButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 20,
    gap: 8,
  },
  createButtonIcon: {
    color: theme.colors.textOnPrimary,
    fontSize: 21,
    fontWeight: "600",
  },
  createButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
