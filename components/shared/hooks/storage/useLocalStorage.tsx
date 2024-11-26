import { useCallback } from "react";
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "fileStorage";
const STORE_NAME = "files";
const DB_VERSION = 1;

interface StoredFile {
  blob: Blob;
  key: string;
  chatRoomId: string;
  messageId: string;
}

interface FileStorage {
  saveFile: (
    file: Blob,
    chatRoomId: string,
    messageId: string
  ) => Promise<string>;
  getFileUrl: (key: string) => Promise<string | null>;
  getFileUrlsByChat: (chatRoomId: string) => Promise<StoredFile[]>;
  deleteFile: (key: string) => Promise<void>;
}

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
        store.createIndex("chatRoomId", "chatRoomId");
      }
    },
  });
}

export function useLocalStorage(): FileStorage {
  const saveFile = useCallback(
    async (
      file: Blob,
      chatRoomId: string,
      messageId: string
    ): Promise<string> => {
      try {
        const db = await getDb();
        const key = `${chatRoomId}-${messageId}`;

        const fileObject: StoredFile = {
          blob: file,
          key,
          chatRoomId,
          messageId,
        };
        await db.put(STORE_NAME, fileObject);

        return key;
      } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save file to storage");
      }
    },
    []
  );

  const getFileUrl = useCallback(
    async (key: string): Promise<string | null> => {
      try {
        const db = await getDb();
        const file: StoredFile = await db.get(STORE_NAME, key);

        if (!file) return null;

        const url = URL.createObjectURL(file.blob);

        return url;
      } catch (error) {
        console.error("Error getting file:", error);
        throw new Error("Failed to retrieve file from storage");
      }
    },
    []
  );

  const getFileUrlsByChat = useCallback(
    async (chatRoomId: string): Promise<StoredFile[]> => {
      try {
        const db = await getDb();
        const tx = db.transaction(STORE_NAME, "readonly");
        const index = tx.store.index("chatRoomId");
        const files: StoredFile[] = await index.getAll(chatRoomId);

        return files;
      } catch (error) {
        console.error("Error getting files by chat:", error);
        throw new Error("Failed to retrieve files for chat room");
      }
    },
    []
  );

  const deleteFile = useCallback(async (key: string): Promise<void> => {
    try {
      const db = await getDb();
      await db.delete(STORE_NAME, key);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file from storage");
    }
  }, []);

  return { saveFile, getFileUrl, deleteFile, getFileUrlsByChat };
}
