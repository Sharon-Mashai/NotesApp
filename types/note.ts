export type NoteCategory = "Work" | "Study" | "Personal";

export type Note = {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
};
