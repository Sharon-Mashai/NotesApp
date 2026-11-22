
import type { Note } from "@/types/note";

export type NoteSortOrder = "date" | "newest" | "oldest" | "name";

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
  order: NoteSortOrder = "date",
): Note[] {
  return [...notes].sort((first, second) => {
    if (order === "name") {
      const firstTitle = first.title.trim().toLowerCase();
      const secondTitle = second.title.trim().toLowerCase();

      return firstTitle.localeCompare(secondTitle);
    }

    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();

    // Date and Newest display the most recently created notes first.
    if (order === "date" || order === "newest") {
      return secondDate - firstDate;
    }

    return firstDate - secondDate;
  });
}
