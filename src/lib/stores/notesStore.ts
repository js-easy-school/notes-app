import { writable } from "svelte/store";
import type { Note, NoteUpdateData } from "$lib/types/Note";

const STORAGE_KEY = "notes-app-data";

function createNotesStore() {
  const { subscribe, set, update } = writable<Note[]>([]);

  return {
    subscribe,
    notes: [] as Note[],

    // Создать новую заметку
    createNote: (): Note => {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: "Новая заметка",
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      update((notes) => {
        const updatedNotes = [newNote, ...notes];
        // Сохраняем в localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        return updatedNotes;
      });

      return newNote;
    },

    // Обновить заметку
    updateNote: (id: string, data: NoteUpdateData) => {
      update((notes) => {
        const updatedNotes = notes.map((note) => {
          if (note.id === id) {
            return {
              ...note,
              ...data,
              updatedAt: new Date(),
            };
          }
          return note;
        });
        // Сохраняем в localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        return updatedNotes;
      });
    },

    // Удалить заметку
    deleteNote: (id: string) => {
      update((notes) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        // Сохраняем в localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        return updatedNotes;
      });
    },

    // Загрузить заметки из localStorage
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const notes = JSON.parse(stored).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          set(notes);
        }
      } catch (error) {
        console.error("Ошибка при загрузке заметок:", error);
        set([]);
      }
    },

    // Очистить все заметки
    clearAll: () => {
      localStorage.removeItem(STORAGE_KEY);
      set([]);
    },
  };
}

export const notesStore = createNotesStore();
