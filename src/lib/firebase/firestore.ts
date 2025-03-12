import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  addDoc
} from 'firebase/firestore';
import { db } from './config';

// User ID from environment variables
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;

// Base path for user content
const getBasePath = () => `users/${USER_ID}/content`;

// Generic function to get a collection of items with real-time updates
export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (items: T[]) => void,
  orderByField: string = 'order',
  orderDirection: 'asc' | 'desc' = 'asc',
  limitCount?: number
): Unsubscribe => {
  const basePath = getBasePath();
  const collectionRef = collection(db, `${basePath}/${collectionName}/items`);
  
  let q = query(collectionRef, orderBy(orderByField, orderDirection));
  
  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const items = snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })) as T[];
    
    callback(items);
  }, (error: Error) => {
    console.error(`Error fetching ${collectionName}:`, error);
  });
};

// Function to get a single item from a collection
export const getItem = async <T>(collectionName: string, itemId: string): Promise<T | null> => {
  try {
    const basePath = getBasePath();
    const docRef = doc(db, `${basePath}/${collectionName}/items/${itemId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    
    return null;
  } catch (error: unknown) {
    console.error(`Error fetching ${collectionName} item:`, error);
    return null;
  }
};

// Function to get specific item by field value
export const getItemByField = async <T>(
  collectionName: string,
  fieldName: string,
  fieldValue: string | number | boolean
): Promise<T | null> => {
  try {
    const basePath = getBasePath();
    const collectionRef = collection(db, `${basePath}/${collectionName}/items`);
    const q = query(collectionRef, where(fieldName, '==', fieldValue), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      return {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T;
    }
    
    return null;
  } catch (error: unknown) {
    console.error(`Error fetching ${collectionName} by ${fieldName}:`, error);
    return null;
  }
};

// Function to add a new item to a collection
export const addItem = async <T>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string | null> => {
  try {
    const basePath = getBasePath();
    const collectionRef = collection(db, `${basePath}/${collectionName}/items`);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error: unknown) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
}; 