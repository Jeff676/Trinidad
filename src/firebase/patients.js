import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, or, and, doc, addDoc, updateDoc } from 'firebase/firestore'

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
  
  return patients.length > 0 ? patients : false
}

// Save patient
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

// Update patient
export const updatePatient = async (data, documentPatient) =>{
  var update = false;
    try {
      const itemDocRef = doc(db, "patients", documentPatient)
      await updateDoc(itemDocRef, data)
      update = true
    }catch (e) {
      console.error("Error agregando documento: ", e);
    }
    
  return update;

}

export const getDocument = async (nationalityType, identification) =>{
  var patient = ''
  const q = query(collection(db, "patients"), 
            where("nationalityType", "==", nationalityType),
            where("identification", "==", identification),
          );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    patient = doc.id
  });

  return patient

}