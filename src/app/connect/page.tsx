// pages/firebase-config.tsx
"use client";
import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const FirebaseConfigPage = () => {
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
      setFirebaseConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirebaseConfig({
      ...firebaseConfig,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Save Firebase configuration to localStorage
      localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));

      // Initialize Firebase App
      const appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      // Initialize Firestore and Auth
      getFirestore(appInstance);
      getAuth(appInstance);

      alert('Firebase connected successfully!');
      router.push('/register'); // Navigate to register page
    } catch (error: any) {
      setError('Error connecting Firebase: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Connect Firebase</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>API Key:</label>
          <input
            type="text"
            name="apiKey"
            value={firebaseConfig.apiKey}
            onChange={handleChange}
            placeholder="Enter API Key"
            required
          />
        </div>
        <div>
          <label>Auth Domain:</label>
          <input
            type="text"
            name="authDomain"
            value={firebaseConfig.authDomain}
            onChange={handleChange}
            placeholder="Enter Auth Domain"
            required
          />
        </div>
        <div>
          <label>Project ID:</label>
          <input
            type="text"
            name="projectId"
            value={firebaseConfig.projectId}
            onChange={handleChange}
            placeholder="Enter Project ID"
            required
          />
        </div>
        <div>
          <label>Storage Bucket:</label>
          <input
            type="text"
            name="storageBucket"
            value={firebaseConfig.storageBucket}
            onChange={handleChange}
            placeholder="Enter Storage Bucket"
            required
          />
        </div>
        <div>
          <label>Messaging Sender ID:</label>
          <input
            type="text"
            name="messagingSenderId"
            value={firebaseConfig.messagingSenderId}
            onChange={handleChange}
            placeholder="Enter Messaging Sender ID"
            required
          />
        </div>
        <div>
          <label>App ID:</label>
          <input
            type="text"
            name="appId"
            value={firebaseConfig.appId}
            onChange={handleChange}
            placeholder="Enter App ID"
            required
          />
        </div>
        <button type="submit">Connect Firebase</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FirebaseConfigPage;




// "use client";
// import { useState, useEffect } from 'react';
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// const FirebaseConfigForm = () => {
//   const [firebaseConfig, setFirebaseConfig] = useState({
//     apiKey: '',
//     authDomain: '',
//     projectId: '',
//     storageBucket: '',
//     messagingSenderId: '',
//     appId: '',
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [app, setApp] = useState(null);
//   const [firestore, setFirestore] = useState(null);
//   const [auth, setAuth] = useState(null);
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [newDocument, setNewDocument] = useState({ name: '', age: '' });
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const savedConfig = localStorage.getItem('firebaseConfig');
//     if (savedConfig) {
//       setFirebaseConfig(JSON.parse(savedConfig));
//     }
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFirebaseConfig({
//       ...firebaseConfig,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleNewDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewDocument({
//       ...newDocument,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // Save Firebase config to localStorage
//       localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));

//       const appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
//       setApp(appInstance);

//       const firestoreInstance = getFirestore(appInstance);
//       setFirestore(firestoreInstance);

//       const authInstance = getAuth(appInstance);
//       setAuth(authInstance);

//       setError(null);
//       alert('Firebase connected successfully!');
//     } catch (error: any) {
//       setError('Error connecting Firebase: ' + error.message);
//     }
//   };

//   // Register a new user with email and password
//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (email && password) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         setUser(userCredential.user);
//         alert('User registered successfully!');
//       } catch (error: any) {
//         setError('Error registering user: ' + error.message);
//       }
//     } else {
//       setError('Please provide both email and password');
//     }
//   };

//   // Fetch documents from Firestore
//   const fetchDocuments = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(firestore, 'users'));
//       const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setDocuments(docs);
//     } catch (error) {
//       console.error("Error fetching documents: ", error);
//       setError('Error fetching documents: ' + error.message);
//     }
//   };

//   // Add new document to Firestore
//   const addDocument = async () => {
//     try {
//       const docRef = await addDoc(collection(firestore, "users"), newDocument);
//       console.log("Document added with ID: ", docRef.id);
//       setNewDocument({ name: '', age: '' });
//       await fetchDocuments();  // Refresh document list
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       setError('Error adding document: ' + error.message);
//     }
//   };

//   // Update document in Firestore
//   const updateDocument = async (id: string) => {
//     try {
//       const docRef = doc(firestore, "users", id);
//       await updateDoc(docRef, {
//         name: "Updated Name",  // Change this to the updated data
//       });
//       alert('Document updated!');
//       await fetchDocuments();  // Refresh document list
//     } catch (error) {
//       console.error("Error updating document: ", error);
//       setError('Error updating document: ' + error.message);
//     }
//   };

//   // Delete document from Firestore
//   const deleteDocument = async (id: string) => {
//     try {
//       const docRef = doc(firestore, "users", id);
//       await deleteDoc(docRef);
//       alert('Document deleted!');
//       await fetchDocuments();  // Refresh document list
//     } catch (error) {
//       console.error("Error deleting document: ", error);
//       setError('Error deleting document: ' + error.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Connect Firebase, Register User, and Perform CRUD Operations</h2>
      
//       {/* Firebase Configuration Form */}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>API Key:</label>
//           <input
//             type="text"
//             name="apiKey"
//             value={firebaseConfig.apiKey}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Auth Domain:</label>
//           <input
//             type="text"
//             name="authDomain"
//             value={firebaseConfig.authDomain}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Project ID:</label>
//           <input
//             type="text"
//             name="projectId"
//             value={firebaseConfig.projectId}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Storage Bucket:</label>
//           <input
//             type="text"
//             name="storageBucket"
//             value={firebaseConfig.storageBucket}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Messaging Sender ID:</label>
//           <input
//             type="text"
//             name="messagingSenderId"
//             value={firebaseConfig.messagingSenderId}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>App ID:</label>
//           <input
//             type="text"
//             name="appId"
//             value={firebaseConfig.appId}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">Connect Firebase</button>
//       </form>

//       {/* User Registration Form */}
//       {!user ? (
//         <form onSubmit={handleRegister}>
//           <div>
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={handleEmailChange}
//             />
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={handlePasswordChange}
//             />
//           </div>
//           <button type="submit">Register</button>
//         </form>
//       ) : (
//         <p>Welcome, {user.email}!</p>
//       )}

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* CRUD Operations */}
//       {user && (
//         <div>
//           <h3>Add New Document</h3>
//           <div>
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={newDocument.name}
//               onChange={handleNewDocumentChange}
//             />
//           </div>
//           <div>
//             <label>Age:</label>
//             <input
//               type="text"
//               name="age"
//               value={newDocument.age}
//               onChange={handleNewDocumentChange}
//             />
//           </div>
//           <button onClick={addDocument}>Add Document</button>

//           <h3>Documents:</h3>
//           {documents.length > 0 ? (
//             <ul>
//               {documents.map((doc) => (
//                 <li key={doc.id}>
//                   {doc.name} - {doc.age} 
//                   <button onClick={() => updateDocument(doc.id)}>Update</button>
//                   <button onClick={() => deleteDocument(doc.id)}>Delete</button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No documents found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FirebaseConfigForm;
