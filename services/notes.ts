import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Note, NoteCategory } from "@/types/note";

const NOTES_STORAGE_KEY = "@notes_app/notes";

type CreateNoteInput = {
  title: string;
  content: string;
  category: NoteCategory;
};

type UpdateNoteInput = Partial<CreateNoteInput>;

export async function getNotes(): Promise<Note[]> {
  const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);

  if (!storedNotes) {
    return [];
  }

  const parsedNotes: unknown = JSON.parse(storedNotes);

  return Array.isArray(parsedNotes) ? (parsedNotes as Note[]) : [];
}

async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const notes = await getNotes();
  const now = new Date().toISOString();

  const newNote: Note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: input.title,
    content: input.content,
    category: input.category,
    createdAt: now,
    updatedAt: now,
  };

  await saveNotes([newNote, ...notes]);

  return newNote;
}

export async function updateNote(
  id: string,
  updates: UpdateNoteInput,
): Promise<Note | null> {
  const notes = await getNotes();

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return null;
  }

  const updatedNote: Note = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;

  await saveNotes(notes);

  return updatedNote;
}

export async function deleteNote(id: string): Promise<boolean> {
  const notes = await getNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);

  if (updatedNotes.length === notes.length) {
    return false;
  }

  await saveNotes(updatedNotes);

  return true;
}
