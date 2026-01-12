import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BlogPost, SocialLink } from '../types/blog';

// Posts Collection
const POSTS_COLLECTION = 'posts';
const SOCIAL_LINKS_COLLECTION = 'socialLinks';

// Posts Service
export const postsService = {
  // Get all posts
  getAll: async (): Promise<BlogPost[]> => {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  },

  // Get post by ID
  getById: async (id: string): Promise<BlogPost | null> => {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
    return null;
  },

  // Create post
  create: async (postData: Omit<BlogPost, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
    return docRef.id;
  },

  // Update post
  update: async (id: string, postData: Partial<BlogPost>): Promise<void> => {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, postData);
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to posts changes (realtime)
  subscribe: (
    callback: (posts: BlogPost[]) => void
  ): (() => void) => {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      callback(posts);
    });
    return unsubscribe;
  }
};

// Social Links Service
export const socialLinksService = {
  // Get all social links
  getAll: async (): Promise<SocialLink[]> => {
    try {
      console.log('Firebase: Getting all social links from collection:', SOCIAL_LINKS_COLLECTION);
      const querySnapshot = await getDocs(collection(db, SOCIAL_LINKS_COLLECTION));
      const links = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SocialLink[];
      console.log('Firebase: Retrieved', links.length, 'social links:', links);
      return links;
    } catch (error: any) {
      console.error('Firebase Error getting social links:', error);
      throw error;
    }
  },

  // Get social link by ID
  getById: async (id: string): Promise<SocialLink | null> => {
    const docRef = doc(db, SOCIAL_LINKS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SocialLink;
    }
    return null;
  },

  // Create social link
  create: async (linkData: Omit<SocialLink, 'id'>): Promise<string> => {
    try {
      console.log('Firebase: Creating document in collection:', SOCIAL_LINKS_COLLECTION);
      console.log('Firebase: Data to save:', linkData);
      const docRef = await addDoc(collection(db, SOCIAL_LINKS_COLLECTION), linkData);
      console.log('Firebase: Document created with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Firebase Error creating social link:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      throw error;
    }
  },

  // Update social link
  update: async (id: string, linkData: Partial<SocialLink>): Promise<void> => {
    const docRef = doc(db, SOCIAL_LINKS_COLLECTION, id);
    await updateDoc(docRef, linkData);
  },

  // Delete social link
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, SOCIAL_LINKS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to social links changes (realtime)
  subscribe: (
    callback: (links: SocialLink[]) => void
  ): (() => void) => {
    const unsubscribe = onSnapshot(
      collection(db, SOCIAL_LINKS_COLLECTION),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const links = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SocialLink[];
        callback(links);
      }
    );
    return unsubscribe;
  }
};

