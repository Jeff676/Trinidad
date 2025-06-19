import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, or, and, doc, addDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all patients
export const getAllPatients = async () => {
  const q = query(collection(db, "patients"));
  const querySnapshot = await getDocs(q);
  const patients = querySnapshot.docs.map((doc) => doc.data())

  return patients
}

// Find by identification 
export const findByPatientId = async (nationalityType, identification) =>{
  const q = query(collection(db, "patients"), 
            where("nationalityType", "==", nationalityType),
            where("identification", "==", identification),
          );
  const querySnapshot = await getDocs(q);
  const patients = querySnapshot.docs.map((doc) => doc.data())
  
  return patients.length > 0 ? doctors : false
}

// Save doctors
export const savePatient = async (data) =>{
  var save = false;
    try {
       const docRef = await addDoc(collection(db, "patients"), data);
       console.log("Documento escrito con ID: ", docRef.id);
       save = true;
     } catch (e) {
       console.error("Error agregando documento: ", e);
     }
    
  return save;
}