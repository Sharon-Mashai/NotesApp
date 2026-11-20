import type { Note } from "@/types/note";

export type NoteSortOrder = "newest" | "oldest";

export function searchNotes(notes: Note[], searchTerm: string): Note[] {
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return notes;
  }

  return notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query)
    );
  });
}

export function sortNotes(
  notes: Note[],
  order: NoteSortOrder = "newest",
): Note[] {
  return [...notes].sort((first, second) => {
    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();

    return order === "newest" ? secondDate - firstDate : firstDate - secondDate;
  });
}
