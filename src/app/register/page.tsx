"use client";
import { useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "../lib/firebase-config"; // Adjusted for alias
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0); // Tracks successful registrations
  const [elapsedTime, setElapsedTime] = useState(0); // Tracks the elapsed time in seconds

  const users = [
    { email: "syedwasifali080@gmail.com", password: "123456" },
    { email: "swasifali215@gmail.com", password: "password2" },
    { email: "frewasiflancer@gmail.com", password: "password2" },
    { email: "wasidaliapple123@gmail.com", password: "password2" },
    { email: "wasiftik@gmail.com", password: "password2" },
    { email: "infoserviceofhdhs4@gmail.com", password: "password2" },
    { email: "informationserdsa123@gmail.com", password: "password2" },
    { email: "infos2896@gmail.com", password: "password2" },
    { email: "infotechdsa123@gmail.com", password: "password2" },
  ];

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      // Start the timer when the process starts
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer); // Clear the timer when the process is finished
    }

    return () => clearInterval(timer); // Clean up timer on component unmount
  }, [isLoading]);

  const handleSignUp = async () => {
    setIsLoading(true);
    setSuccessCount(0); // Reset the count before starting

    try {
      for (const user of users) {
        try {
          // Check if the email is already registered
          const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
          if (signInMethods.length > 0) {
            console.log(`Email already registered: ${user.email}`);
            // Sign in the existing user to send verification email
            const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
            await sendEmailVerification(userCredential.user);
            console.log(`Verification email sent to: ${user.email}`);
            setSuccessCount(prevCount => prevCount + 1); // Increment the count for successful email
            continue; // Skip to the next user
          }

          // Register a new user if not already registered
          const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
          await sendEmailVerification(userCredential.user);
          console.log(`Verification email sent to: ${user.email}`);
          setSuccessCount(prevCount => prevCount + 1); // Increment the count for successful email
        } catch (innerError: any) {
          console.error(`Error with user ${user.email}: ${innerError.message}`);
        }
      }

      alert("Process completed!");
      // router.push("/crud"); // Navigate to CRUD operations page
    } catch (error: any) {
      setError("Error processing users: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Automated User Registration</h2>
      <button onClick={handleSignUp} disabled={isLoading}>
        {isLoading ? "Processing..." : "Register Users"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <p>Successfully registered: {successCount} out of {users.length}</p>
        <p>Time elapsed: {elapsedTime} seconds</p>
      </div>
    </div>
  );
};

export default RegisterPage;


// // pages/register.tsx
// "use client";
// import { useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { useRouter } from 'next/navigation';

// const RegisterPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const auth = getAuth();
//     if (email && password) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         setUser(userCredential.user);
//         alert('User registered successfully!');
//         router.push('/crud'); // Navigate to CRUD operations page
//       } catch (error: any) {
//         setError('Error registering user: ' + error.message);
//       }
//     } else {
//       setError('Please provide both email and password');
//     }
//   };

//   return (
//     <div>
//       <h2>User Registration</h2>
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
//     </div>
//   );
// };

// export default RegisterPage;
