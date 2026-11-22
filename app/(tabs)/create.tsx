import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { theme } from "@/constants/theme";
import { createNote, getNotes, updateNote } from "@/services/notes";
import type { NoteCategory } from "@/types/note";

const categories: NoteCategory[] = ["Work", "Study", "Personal"];

function getCategoryRoute(category?: NoteCategory) {
  if (category === "Work") {
    return "/categories/work" as const;
  }

  if (category === "Study") {
    return "/categories/study" as const;
  }

  if (category === "Personal") {
    return "/categories/personal" as const;
  }

  return "/" as const;
}

export default function CreateNoteScreen() {
  const { id, category, returnTo } = useLocalSearchParams<{
    id?: string;
    category?: string;
    returnTo?: string;
  }>();

  const noteId = typeof id === "string" ? id : undefined;

  const presetCategory =
    typeof category === "string" &&
    categories.includes(category as NoteCategory)
      ? (category as NoteCategory)
      : undefined;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>(
    presetCategory ?? "Personal",
  );
  const [returnCategory, setReturnCategory] = useState<
    NoteCategory | undefined
  >(presetCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(Boolean(noteId));

  const returnToCategory = getCategoryRoute(returnCategory);

  const navigateBack = () => {
    if (returnTo === "home") {
      router.replace("/");
      return;
    }

    router.replace(returnToCategory);
  };

  useEffect(() => {
    let isActive = true;

    const loadNote = async () => {
      if (!noteId) {
        setIsLoadingNote(false);
        return;
      }

      try {
        const savedNotes = await getNotes();
        const existingNote = savedNotes.find((note) => note.id === noteId);

        if (!existingNote) {
          if (isActive) {
            Alert.alert(
              "Note not found",
              "This note may have been deleted. Please return to your notes.",
              [{ text: "OK", onPress: navigateBack }],
            );
          }
          return;
        }

        if (isActive) {
          setTitle(existingNote.title);
          setContent(existingNote.content);
          setSelectedCategory(existingNote.category);
          setReturnCategory(existingNote.category);
        }
      } catch {
        if (isActive) {
          Alert.alert(
            "Unable to load note",
            "Something went wrong while loading this note. Please try again.",
            [{ text: "OK", onPress: navigateBack }],
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingNote(false);
        }
      }
    };

    loadNote();

    return () => {
      isActive = false;
    };
  }, [noteId]);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Missing content", "Please write something in your note.");
      return;
    }

    try {
      setIsSaving(true);

      if (noteId) {
        const updatedNote = await updateNote(noteId, {
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory,
        });

        if (!updatedNote) {
          Alert.alert(
            "Unable to update note",
            "This note could not be found. It may have been deleted.",
          );
          return;
        }
      } else {
        await createNote({
          title: title.trim(),
          content: content.trim(),
          category: presetCategory ?? selectedCategory,
        });
      }

      navigateBack();
    } catch {
      Alert.alert(
        noteId ? "Unable to update note" : "Unable to save note",
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigateBack();
  };

  if (isLoadingNote) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your note...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>

              <Text style={styles.heading}>
                {noteId ? "Edit your note" : "Create a note"}
              </Text>

              <Text style={styles.subtitle}>
                {noteId
                  ? "Make changes to your saved thoughts and ideas."
                  : "Capture a thought, idea or something important."}
              </Text>
            </View>

            <Pressable
              onPress={handleCancel}
              style={styles.cancelButton}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>

            <TextInput
              style={styles.titleInput}
              placeholder="Give your note a title..."
              placeholderTextColor={theme.colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              returnKeyType="next"
            />

            <Text style={styles.helperText}>Optional</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>What's on your mind?</Text>

            <TextInput
              style={styles.contentInput}
              placeholder="Start writing your thoughts here..."
              placeholderTextColor={theme.colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={10000}
            />

            <Text style={styles.characterCount}>
              {content.length}/10,000 characters
            </Text>
          </View>

          {!noteId && !presetCategory && (
            <View style={styles.field}>
              <Text style={styles.label}>Choose a category</Text>

              <View style={styles.categoryList}>
                {categories.map((categoryOption) => {
                  const isSelected = selectedCategory === categoryOption;

                  return (
                    <Pressable
                      key={categoryOption}
                      onPress={() => setSelectedCategory(categoryOption)}
                      style={[
                        styles.categoryButton,
                        isSelected && styles.categoryButtonSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          isSelected && styles.categoryButtonTextSelected,
                        ]}
                      >
                        {categoryOption}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {(presetCategory || noteId) && (
            <View style={styles.lockedCategory}>
              <Text style={styles.lockedCategoryLabel}>SAVING UNDER</Text>
              <Text style={styles.lockedCategoryText}>{selectedCategory}</Text>
            </View>
          )}

          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
              isSaving && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
          >
            {isSaving ? (
              <ActivityIndicator color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={styles.saveButtonText}>
                {noteId ? "Update note" : "Save note"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    gap: 14,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 900,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  heading: {
    color: theme.colors.textPrimary,
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 400,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  field: {
    marginBottom: 28,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  titleInput: {
    minHeight: 56,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  contentInput: {
    minHeight: 240,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  characterCount: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextSelected: {
    color: theme.colors.textOnPrimary,
  },
  lockedCategory: {
    marginBottom: 28,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  lockedCategoryLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  lockedCategoryText: {
    color: theme.colors.primaryLight,
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    marginTop: 8,
  },
  saveButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
