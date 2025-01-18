// pages/crud.tsx
"use client";
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const CrudPage = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocument, setNewDocument] = useState({ name: '', age: '' });
  const [error, setError] = useState<string | null>(null);
  const firestore = getFirestore();
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    } catch (error) {
      setError('Error fetching documents: ' + error.message);
    }
  };

  const addDocument = async () => {
    try {
      await addDoc(collection(firestore, "users"), newDocument);
      setNewDocument({ name: '', age: '' });
      await fetchDocuments();
    } catch (error) {
      setError('Error adding document: ' + error.message);
    }
  };

  const updateDocument = async (id: string) => {
    try {
      const docRef = doc(firestore, "users", id);
      await updateDoc(docRef, { name: "Updated Name" });
      await fetchDocuments();
    } catch (error) {
      setError('Error updating document: ' + error.message);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(firestore, "users", id);
      await deleteDoc(docRef);
      await fetchDocuments();
    } catch (error) {
      setError('Error deleting document: ' + error.message);
    }
  };

  return (
    <div>
      <h2>CRUD Operations</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newDocument.name}
          onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="text"
          name="age"
          value={newDocument.age}
          onChange={(e) => setNewDocument({ ...newDocument, age: e.target.value })}
        />
      </div>
      <button onClick={addDocument}>Add Document</button>

      <h3>Documents:</h3>
      {documents.length > 0 ? (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              {doc.name} - {doc.age}
              <button onClick={() => updateDocument(doc.id)}>Update</button>
              <button onClick={() => deleteDocument(doc.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CrudPage;
