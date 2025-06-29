export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteUpdateData {
  title?: string;
  content?: string;
}
