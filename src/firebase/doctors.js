import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all patients
export const getDoctors = async () => {
  const doctorsSnapShop = await getDocs(collection(db, 'doctors')) // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const doctors = doctorsSnapShop.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return doctors
}

export const getSpecialities = async () => {
  const q = query(collection(db, "specialities"), where("status", "==", "ACTIVE"));
  const querySnapshot = await getDocs(q);
  const specialities = querySnapshot.docs.map((doc) => doc.data())

  return specialities
}

export const getDoctorsFind = async (speciality) => {
  const q = query(collection(db, "doctors"), where("speciality", "==", speciality));
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())

  return doctors
}