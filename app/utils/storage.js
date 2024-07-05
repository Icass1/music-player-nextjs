import { openDB } from 'idb';

const DB_NAME = 'musicDB';
const DB_VERSION = 1;
const STORE_NAME = 'musicFiles';

const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
};

export const saveMusicFile = async (fileName, fileBlob) => {
    const db = await initDB();
    await db.put(STORE_NAME, {name: "ASDF", fileBlob: fileBlob}, fileName);
};

export const getMusicFile = async (fileName) => {
    const db = await initDB();
    return await db.get(STORE_NAME, fileName);
};


export const downloadAndSaveMusic = async (id, url, name, artist, duration, genre, album) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    await saveMusicFile(fileName, blob);
};

export const playMusic = async (fileName) => {
    const fileBlob = await getMusicFile(fileName);
    if (!fileBlob) {
        throw new Error('File not found');
    }
    const url = URL.createObjectURL(fileBlob);
    const audio = new Audio(url);
    audio.play();
};