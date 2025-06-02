import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, or, and } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all patients
export const getDoctors = async () => {
  const q = query(collection(db, "doctors"), where("state", "==", "activo")); // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return doctors
}

// Get all specialities
export const getSpecialities = async () => {
  const q = query(collection(db, "specialities"), where("status", "==", "ACTIVE"));
  const querySnapshot = await getDocs(q);
  const specialities = querySnapshot.docs.map((doc) => doc.data())

  return specialities
}

// Find by specialities
export const getDoctorsFind = async (speciality) => {
  const q = query(collection(db, "doctors"), where("speciality", "==", speciality));
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())

  return doctors
}

// Search in directory
export const searchDirectory = async (filter) =>{
  const cadena = filter.charAt(0).toUpperCase() + filter.slice(1)
  const startAt = cadena.trim()
  const endAt = startAt + "\uf8ff"
  const q = query(collection(db, "doctors"), 
              and(
                where('name', '>=', startAt),
                where('name', '<=', endAt),
              ),           
            )
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())

  return doctors
}

// Find by identification 
export const findByDoctorId = async (nationalityType, doctorId) =>{
  const identification = nationalityType + doctorId;
  const q = query(collection(db, "doctors"), where("doctorId", "==", identification));
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())
  
  return doctors.length > 0 ? doctors : false
}