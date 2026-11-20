import { useState } from "react";
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
import { router } from "expo-router";

import { theme } from "@/constants/theme";
import { createNote } from "@/services/notes";
import type { NoteCategory } from "@/types/note";

const categories: NoteCategory[] = ["Work", "Study", "Personal"];

export default function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<NoteCategory>("Personal");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Missing content", "Please write something in your note.");
      return;
    }

    try {
      setIsSaving(true);

      await createNote({
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
      });

      router.back();
    } catch {
      Alert.alert(
        "Unable to save note",
        "Something went wrong while saving your note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
              <Text style={styles.heading}>Create a note</Text>
              <Text style={styles.subtitle}>
                Capture a thought, idea or something important.
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

          {/* Title */}
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

          {/* Content */}
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

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Choose a category</Text>
            <View style={styles.categoryList}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
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
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Save */}
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
              <Text style={styles.saveButtonText}>Save note</Text>
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
