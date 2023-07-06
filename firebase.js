import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import {
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';

import { firebaseConfig } from './config.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const getPasteCollection = async (pasteId) => {
  const snapshot = await getDoc(doc(db, "pastes", pasteId));
  if (snapshot.exists()) {
    const data = snapshot.data();
    return { pasteName: data.name, language: data.language };
  } else {
    throw new Error("Paste ID " + pasteId + " does not exist!");
  }
};

export const getPaste = async (pasteId, pasteName) => {
  const storageRef = ref(storage, pasteId + "/" + pasteName);
  const downloadUrl = await getDownloadURL(storageRef);
  const bytes = await getBytes(storageRef);

  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(bytes).trimEnd();
  return { downloadUrl, content };
};

export const storePaste = async (pasteName, language, content) => {
  const pasteIdRef = await addDoc(
    collection(db, "pastes"),
    { name: pasteName, language: language },
  );
  
  const pasteId = pasteIdRef.id;
  const storageRef = ref(storage, pasteId + "/" + pasteName);
  const snapshot = await uploadString(storageRef, content);
  return pasteId;
};
