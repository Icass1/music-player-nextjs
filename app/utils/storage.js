import { openDB } from 'idb';
import { apiFetch } from './apiFetch';

const DB_NAME = 'musicDB';
const DB_VERSION = 1;
const LIST_TABLE = 'list';
const SONG_TABLE = 'song';

const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore(LIST_TABLE);
            // db.createObjectStore(SONG_TABLE);
        },
    });
};

// export function addList(id) {

//     const db = await initDB();
//     apiFetch(`/api/list/${id}`).then(data => data.json()).then(data => {
//         console.log(data)
//         initDB().then(db => {
//             db.put(LIST_TABLE, { "tsert": "asfd" }, "Key 1")
//             console.log(db)
//         })
//         // initDB().then(db => db.put(LIST_TABLE, { name: data.name}, "TEST"))
//     })
// }


export const addList = async (id) => {
    const db = await initDB();
    const response = await apiFetch(`/api/list/${id}`)
    const data = await response.json()
    await db.put(LIST_TABLE, { name: "ASDF", fileBlob: "a" }, "B");
    console.log("PUT")
};

export const saveMusicFile = async (fileName, fileBlob) => {
    const db = await initDB();
    await db.put(STORE_NAME, { name: "ASDF", fileBlob: fileBlob }, fileName);
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