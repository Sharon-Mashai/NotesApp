import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Add01Icon,
  Alert01Icon,
  Cancel01Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  Search01Icon,
  Settings01Icon,
  Sorting01Icon,
} from "@hugeicons/core-free-icons";

import { type AppTheme, type ThemeMode } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { deleteNote, getNotes } from "@/services/notes";
import type { Note, NoteCategory } from "@/types/note";
import {
  searchNotes,
  sortNotes,
  type NoteSortOrder,
} from "@/utils/noteHelpers";

const categories = [
  { label: "All notes", value: "all" },
  { label: "Work", value: "work" },
  { label: "Study", value: "study" },
  { label: "Personal", value: "personal" },
];

const sortOptions: { label: string; value: NoteSortOrder }[] = [
  { label: "Date", value: "date" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name", value: "name" },
];

function getCategoryColor(category: NoteCategory, theme: AppTheme) {
  switch (category) {
    case "Work":
      return theme.colors.categories.work;
    case "Study":
      return theme.colors.categories.study;
    case "Personal":
      return theme.colors.categories.personal;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCategoryName(value: string): NoteCategory | undefined {
  switch (value) {
    case "work":
      return "Work";
    case "study":
      return "Study";
    case "personal":
      return "Personal";
    default:
      return undefined;
  }
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme, mode } = useTheme();

  const styles = createStyles(theme, mode);

  const username = user?.username?.trim() || "there";
  const profileInitial = username.charAt(0).toUpperCase() || "U";

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>("date");
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadNotes = async () => {
        try {
          const savedNotes = await getNotes();

          if (isActive) {
            setNotes(savedNotes);
          }
        } catch {
          if (isActive) {
            Alert.alert(
              "Unable to load notes",
              "Something went wrong while loading your notes.",
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      setIsLoading(true);
      loadNotes();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleCategoryNavigation = (categoryValue: string) => {
    if (categoryValue === "all") {
      setSelectedCategory("all");
      return;
    }

    switch (categoryValue) {
      case "work":
        router.push("/(tabs)/categories/work");
        break;
      case "study":
        router.push("/(tabs)/categories/study");
        break;
      case "personal":
        router.push("/(tabs)/categories/personal");
        break;
    }
  };

  const handleFilterSelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setIsFilterMenuOpen(false);
  };

  const handleSortSelect = (order: NoteSortOrder) => {
    setSortOrder(order);
    setIsSortMenuOpen(false);
  };

  const handleAddNote = () => {
    const categoryName = getCategoryName(selectedCategory);

    router.push({
      pathname: "/create",
      params: {
        ...(categoryName ? { category: categoryName } : {}),
        returnTo: "home",
      },
    });
  };

  const handleEditNote = (note: Note) => {
    router.push({
      pathname: "/create",
      params: {
        id: note.id,
        returnTo: "home",
      },
    });
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleDeleteRequest = (note: Note) => {
    setNoteToDelete(note);
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setNoteToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      const wasDeleted = await deleteNote(noteToDelete.id);

      if (!wasDeleted) {
        Alert.alert(
          "Unable to delete note",
          "This note could not be found. Please refresh your notes.",
        );
        return;
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteToDelete.id),
      );

      setNoteToDelete(null);
    } catch {
      Alert.alert(
        "Unable to delete note",
        "Something went wrong while deleting your note. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotes = sortNotes(
    searchNotes(notes, searchQuery).filter((note) => {
      return (
        selectedCategory === "all" ||
        note.category.toLowerCase() === selectedCategory
      );
    }),
    sortOrder,
  );

  const selectedFilterLabel =
    categories.find((category) => category.value === selectedCategory)?.label ??
    "All notes";

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortOrder)?.label ?? "Date";

  const renderNoteCard = (note: Note) => {
    const categoryColor = getCategoryColor(note.category, theme);

    return (
      <View key={note.id} style={styles.noteCard}>
        <View style={styles.noteCardHeader}>
          <View
            style={[
              styles.noteCategory,
              { backgroundColor: `${categoryColor}20` },
            ]}
          >
            <View
              style={[styles.categoryDot, { backgroundColor: categoryColor }]}
            />
            <Text style={[styles.noteCategoryText, { color: categoryColor }]}>
              {note.category}
            </Text>
          </View>

          <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
        </View>

        <Text style={styles.noteTitle}>
          {note.title.trim() || "Untitled note"}
        </Text>

        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>

        <View style={styles.noteActions}>
          <Pressable
            onPress={() => handleEditNote(note)}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${note.title.trim() || "untitled note"}`}
          >
            <Text style={styles.editButtonText}>Edit note</Text>
          </Pressable>

          <Pressable
            onPress={() => handleDeleteRequest(note)}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${note.title.trim() || "untitled note"}`}
          >
            <Text style={styles.deleteButtonText}>Delete note</Text>
          </Pressable>
        </View>
      </View>
    );
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
              <Text style={styles.title}>Hello, {username}!</Text>
              <Text style={styles.subtitle}>What's on your mind today?</Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.profileButton}
                onPress={() => router.push("/profile")}
                accessibilityRole="button"
                accessibilityLabel="Open profile"
              >
                <Text style={styles.profileInitial}>{profileInitial}</Text>
              </Pressable>

              <Pressable
                style={styles.settingsButton}
                onPress={handleSettings}
                accessibilityRole="button"
                accessibilityLabel="Settings"
              >
                <HugeiconsIcon
                  icon={Settings01Icon}
                  size={22}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <HugeiconsIcon
              icon={Search01Icon}
              size={22}
              color={theme.colors.textMuted}
            />

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
                hitSlop={8}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            )}
          </View>

          {/* Category navigation */}
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
                const isSelected =
                  category.value === "all" && selectedCategory === "all";

                return (
                  <Pressable
                    key={category.value}
                    onPress={() => handleCategoryNavigation(category.value)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${category.label}`}
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

              <Text style={styles.noteCount}>
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "NOTE" : "NOTES"}
              </Text>
            </View>

            {/* Filter and sorting controls */}
            <View style={styles.controlsContainer}>
              {/* Filter */}
              <View style={styles.controlColumn}>
                <Text style={styles.controlLabel}>FILTER NOTES</Text>

                <Pressable
                  onPress={() => {
                    setIsFilterMenuOpen((current) => !current);
                    setIsSortMenuOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.controlButton,
                    isFilterMenuOpen && styles.controlButtonActive,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter notes: ${selectedFilterLabel}`}
                  accessibilityState={{ expanded: isFilterMenuOpen }}
                >
                  <View style={styles.controlButtonLeft}>
                    <HugeiconsIcon
                      icon={FilterIcon}
                      size={18}
                      color={theme.colors.primaryLight}
                    />
                    <Text style={styles.controlButtonText}>
                      {selectedFilterLabel}
                    </Text>
                  </View>

                  <HugeiconsIcon
                    icon={isFilterMenuOpen ? ChevronUpIcon : ChevronDownIcon}
                    size={16}
                    color={theme.colors.textMuted}
                  />
                </Pressable>

                {isFilterMenuOpen && (
                  <View style={styles.dropdownMenu}>
                    {categories.map((category) => {
                      const isSelected = selectedCategory === category.value;

                      return (
                        <Pressable
                          key={category.value}
                          onPress={() => handleFilterSelect(category.value)}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                          ]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              isSelected && styles.dropdownItemTextSelected,
                            ]}
                          >
                            {category.label}
                          </Text>

                          {isSelected && (
                            <HugeiconsIcon
                              icon={CheckIcon}
                              size={17}
                              color={theme.colors.primaryLight}
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Sort */}
              <View style={styles.controlColumn}>
                <Text style={styles.controlLabel}>SORT BY</Text>

                <Pressable
                  onPress={() => {
                    setIsSortMenuOpen((current) => !current);
                    setIsFilterMenuOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.controlButton,
                    isSortMenuOpen && styles.controlButtonActive,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort notes by ${selectedSortLabel}`}
                  accessibilityState={{ expanded: isSortMenuOpen }}
                >
                  <View style={styles.controlButtonLeft}>
                    <HugeiconsIcon
                      icon={Sorting01Icon}
                      size={18}
                      color={theme.colors.primaryLight}
                    />
                    <Text style={styles.controlButtonText}>
                      {selectedSortLabel}
                    </Text>
                  </View>

                  <HugeiconsIcon
                    icon={isSortMenuOpen ? ChevronUpIcon : ChevronDownIcon}
                    size={16}
                    color={theme.colors.textMuted}
                  />
                </Pressable>

                {isSortMenuOpen && (
                  <View style={styles.dropdownMenu}>
                    {sortOptions.map((option) => {
                      const isSelected = sortOrder === option.value;

                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => handleSortSelect(option.value)}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                          ]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              isSelected && styles.dropdownItemTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>

                          {isSelected && (
                            <HugeiconsIcon
                              icon={CheckIcon}
                              size={17}
                              color={theme.colors.primaryLight}
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your notes...</Text>
              </View>
            ) : filteredNotes.length > 0 ? (
              <View style={styles.notesList}>
                {filteredNotes.map(renderNoteCard)}
              </View>
            ) : notes.length === 0 ? (
              <View style={styles.emptyState}>
                <Image
                  source={require("../../assets/images/empty-state.png")}
                  style={styles.emptyIllustration}
                  resizeMode="contain"
                  accessibilityLabel="Empty notes illustration"
                />

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
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={21}
                    color={theme.colors.textOnPrimary}
                  />
                  <Text style={styles.createButtonText}>
                    Create your first note
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsTitle}>No matching notes</Text>
                <Text style={styles.noResultsDescription}>
                  Try another search term or select a different category.
                </Text>
              </View>
            )}

            {!isLoading && notes.length > 0 && (
              <Pressable
                onPress={handleAddNote}
                style={({ pressed }) => [
                  styles.addAnotherButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
              >
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={19}
                  color={theme.colors.primaryLight}
                />
                <Text style={styles.addAnotherButtonText}>
                  Add another note
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Delete confirmation dialog */}
      <Modal
        visible={noteToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <HugeiconsIcon
                icon={Alert01Icon}
                size={26}
                color={theme.colors.status.error}
              />
            </View>

            <Text style={styles.confirmationTitle}>Delete this note?</Text>

            <Text style={styles.confirmationDescription}>
              Are you sure you want to delete{" "}
              <Text style={styles.confirmationNoteTitle}>
                {noteToDelete?.title.trim() || "Untitled note"}
              </Text>
              ? This action cannot be undone.
            </Text>

            <View style={styles.confirmationActions}>
              <Pressable
                onPress={handleCancelDelete}
                disabled={isDeleting}
                style={({ pressed }) => [
                  styles.cancelDeleteButton,
                  pressed && styles.buttonPressed,
                  isDeleting && styles.buttonDisabled,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.cancelDeleteButtonText}>Keep note</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDelete}
                disabled={isDeleting}
                style={({ pressed }) => [
                  styles.confirmDeleteButton,
                  pressed && styles.buttonPressed,
                  isDeleting && styles.buttonDisabled,
                ]}
                accessibilityRole="button"
              >
                {isDeleting ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>
                    Delete note
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: AppTheme, mode: ThemeMode) {
  return StyleSheet.create({
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
    searchContainer: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 18,
      gap: 14,
      marginBottom: 38,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: 15,
      paddingVertical: 0,
      outlineStyle: "none",
    } as object,
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
    controlsContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 22,
      zIndex: 5,
    },
    controlColumn: {
      flex: 1,
      minWidth: 0,
      position: "relative",
      zIndex: 5,
    },
    controlLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.1,
      marginBottom: 9,
    },
    controlButton: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      paddingHorizontal: 13,
      gap: 8,
    },
    controlButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surfaceElevated,
    },
    controlButtonLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      minWidth: 0,
    },
    controlButtonText: {
      color: theme.colors.textPrimary,
      fontSize: 13,
      fontWeight: "600",
      flexShrink: 1,
    },
    dropdownMenu: {
      position: "absolute",
      top: 80,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: 6,
      zIndex: 20,
      elevation: 8,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    dropdownItem: {
      minHeight: 43,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      borderRadius: theme.radius.md,
    },
    dropdownItemSelected: {
      backgroundColor: `${theme.colors.primary}20`,
    },
    dropdownItemText: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: "500",
    },
    dropdownItemTextSelected: {
      color: theme.colors.primaryLight,
      fontWeight: "700",
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      gap: 14,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    notesList: {
      gap: 14,
    },
    noteCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
    },
    noteCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      gap: 12,
    },
    noteCategory: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: theme.radius.full,
    },
    categoryDot: {
      width: 7,
      height: 7,
      borderRadius: theme.radius.full,
    },
    noteCategoryText: {
      fontSize: 12,
      fontWeight: "600",
    },
    noteDate: {
      color: theme.colors.textMuted,
      fontSize: 12,
    },
    noteTitle: {
      color: theme.colors.textPrimary,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 9,
    },
    noteContent: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
    noteActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 10,
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    editButton: {
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: theme.radius.md,
      backgroundColor: `${theme.colors.primary}20`,
    },
    editButtonText: {
      color: theme.colors.primaryLight,
      fontSize: 13,
      fontWeight: "600",
    },
    deleteButton: {
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: theme.radius.md,
      backgroundColor: `${theme.colors.status.error}18`,
    },
    deleteButtonText: {
      color: theme.colors.status.error,
      fontSize: 13,
      fontWeight: "600",
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
      paddingVertical: 36,
      marginTop: 8,
    },
    emptyIllustration: {
      width: 280,
      height: 190,
      maxWidth: "100%",
      marginBottom: 20,
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
    createButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 14,
      fontWeight: "700",
    },
    noResults: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 32,
    },
    noResultsTitle: {
      color: theme.colors.textPrimary,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 8,
    },
    noResultsDescription: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
    },
    addAnotherButton: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginTop: 20,
    },
    addAnotherButtonText: {
      color: theme.colors.primaryLight,
      fontSize: 14,
      fontWeight: "700",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    confirmationCard: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
      alignItems: "center",
    },
    confirmationIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.status.error}20`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },
    confirmationTitle: {
      color: theme.colors.textPrimary,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 12,
      textAlign: "center",
    },
    confirmationDescription: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 24,
    },
    confirmationNoteTitle: {
      color: theme.colors.textPrimary,
      fontWeight: "700",
    },
    confirmationActions: {
      width: "100%",
      flexDirection: "row",
      gap: 12,
    },
    cancelDeleteButton: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelDeleteButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    confirmDeleteButton: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.radius.md,
    },
    confirmDeleteButtonText: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: "700",
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });
}
