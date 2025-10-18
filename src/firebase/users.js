import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, doc, addDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all users
export const getAllUsers = async () => {
  const q = query(collection(db, "users"))
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data()) 

  return doctors
}

// Save User
export const saveUser = async (data) =>{
  var save = false;
    try {
      const docRef = await addDoc(collection(db, "users"), data);
      console.log("Documento escrito con ID: ", docRef.id);
      save = true;
      } catch (e) {
        console.error("Error agregando documento: ", e);
    }
    
  return save;
}

// Update User
export const updateUser = async (data, documentUser) =>{
  var update = false;
    try {
      const itemDocRef = doc(db, "users", documentUser)
      await updateDoc(itemDocRef, data)
      update = true
    }catch (e) {
      console.error("Error agregando documento: ", e);
    }
    
  return update;

}

// Exist User
export const existUser = async (email) =>{
  const q = query(collection(db, "users"), 
            where("email", "==", email),
          );
  const querySnapshot = await getDocs(q);
  const patients = querySnapshot.docs.map((doc) => doc.data())
  
  return patients.length > 0 ? patients.length : 0
}

// Get User
export const getUser = async (email) =>{
  const q = query(collection(db, "users"),
            where("email", "==", email)          
          );
  const querySnapshot = await getDocs(q);
  const user = querySnapshot.docs.map((doc) => doc.data())

  return user
}

export const getDocument = async (email) =>{
  var user = ''
  const q = query(collection(db, "users"), 
            where("email", "==", email)
          );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    user = doc.id
  });

  return user
  
  
}