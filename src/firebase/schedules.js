import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, or, and, doc, addDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all schedules today
export const getScheduleToday = async () => {
  const q = query(collection(db, "schedules"));
  const querySnapshot = await getDocs(q);
  const schedules = querySnapshot.docs.map((doc) => doc.data())

  return schedules
}

// Get all specialities
export const getSpecialities = async () => {
  const q = query(collection(db, "specialities"), 
            where("status", "==", "ACTIVE")
          );
  const querySnapshot = await getDocs(q);
  const specialities = querySnapshot.docs.map((doc) => doc.data())

  return specialities
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

// Find by specialities
export const getDoctorsFind = async (speciality) => {
  const q = query(collection(db, "doctors"),
          and(
            where('speciality', 'array-contains', speciality),
            where("status", "==", "Activo"),
            where("directory", "==", "Publicado")
          )
        );
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())

  return doctors
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
