import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { theme } from "@/constants/theme";
import { deleteNote, getNotes } from "@/services/notes";
import type { Note } from "@/types/note";
import { sortNotes, type NoteSortOrder } from "@/utils/noteHelpers";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PersonalCategoryScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPersonalNotes = async () => {
        try {
          const savedNotes = await getNotes();

          if (isActive) {
            setNotes(savedNotes.filter((note) => note.category === "Personal"));
          }
        } catch {
          if (isActive) {
            Alert.alert(
              "Unable to load notes",
              "Something went wrong while loading your Personal notes.",
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      setIsLoading(true);
      loadPersonalNotes();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const sortedNotes = sortNotes(notes, sortOrder);

  const handleCreateNote = () => {
    router.push({
      pathname: "/create",
      params: { category: "Personal" },
    });
  };

  const handleEditNote = (note: Note) => {
    router.push({
      pathname: "/create",
      params: { id: note.id, category: "Personal" },
    });
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Pressable
            onPress={() => router.replace("/")}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>
              {"\u2190"} Back to dashboard
            </Text>
          </Pressable>

          <View style={styles.header}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>P</Text>
            </View>

            <Text style={styles.title}>Personal Notes</Text>

            <Text style={styles.subtitle}>
              Keep your personal thoughts, plans and everyday ideas together.
            </Text>
          </View>

          <View style={styles.notesSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Your Personal notes</Text>
                <Text style={styles.notesSubtitle}>
                  Notes saved in the Personal category
                </Text>
              </View>

              <Text style={styles.noteCount}>
                {notes.length} {notes.length === 1 ? "NOTE" : "NOTES"}
              </Text>
            </View>

            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by date</Text>

              <View style={styles.sortOptions}>
                <Pressable
                  onPress={() => setSortOrder("newest")}
                  style={[
                    styles.sortButton,
                    sortOrder === "newest" && styles.sortButtonSelected,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortOrder === "newest" && styles.sortButtonTextSelected,
                    ]}
                  >
                    Newest first
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSortOrder("oldest")}
                  style={[
                    styles.sortButton,
                    sortOrder === "oldest" && styles.sortButtonSelected,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortOrder === "oldest" && styles.sortButtonTextSelected,
                    ]}
                  >
                    Oldest first
                  </Text>
                </Pressable>
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                  Loading Personal notes...
                </Text>
              </View>
            ) : sortedNotes.length > 0 ? (
              <View style={styles.notesList}>
                {sortedNotes.map((note) => (
                  <View key={note.id} style={styles.noteCard}>
                    <View style={styles.noteCardHeader}>
                      <View style={styles.categoryLabel}>
                        <View style={styles.categoryDot} />
                        <Text style={styles.categoryLabelText}>Personal</Text>
                      </View>

                      <Text style={styles.noteDate}>
                        {formatDate(note.createdAt)}
                      </Text>
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
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>{"\u270E"}</Text>

                <Text style={styles.emptyTitle}>No Personal notes yet</Text>

                <Text style={styles.emptyDescription}>
                  Your personal thoughts, plans and everyday ideas will appear
                  here when you create them using the Personal category.
                </Text>

                <Pressable
                  onPress={handleCreateNote}
                  style={({ pressed }) => [
                    styles.createButton,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.createButtonText}>
                    {"\uFF0B"} Create a personal note
                  </Text>
                </Pressable>
              </View>
            )}

            {!isLoading && notes.length > 0 && (
              <Pressable
                onPress={handleCreateNote}
                style={({ pressed }) => [
                  styles.addAnotherButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.addAnotherButtonText}>
                  {"\uFF0B"} Add another Personal note
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={noteToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <Text style={styles.confirmationIconText}>{"\u26A0"}</Text>
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
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 28,
  },
  backButtonText: {
    color: theme.colors.primaryLight,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.xl,
    backgroundColor: `${theme.colors.categories.personal}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  categoryIconText: {
    color: theme.colors.categories.personal,
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  notesSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 12,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
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
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  sortLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  sortOptions: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: theme.radius.full,
  },
  sortButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  sortButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  sortButtonTextSelected: {
    color: theme.colors.textOnPrimary,
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
  categoryLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: `${theme.colors.categories.personal}20`,
  },
  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.categories.personal,
  },
  categoryLabelText: {
    color: theme.colors.categories.personal,
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
  emptyIcon: {
    color: theme.colors.categories.personal,
    fontSize: 42,
    marginBottom: 18,
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
    marginBottom: 24,
  },
  createButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 24,
  },
  createButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  addAnotherButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
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
  confirmationIconText: {
    color: theme.colors.status.error,
    fontSize: 26,
    fontWeight: "700",
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
