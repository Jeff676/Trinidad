import { firebaseApp } from './init'
import { getFirestore, getDocs, collection } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all patients
export const getDoctors = async () => {
  const doctorsSnapShop = await getDocs(collection(db, 'doctors')) // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const doctors = doctorsSnapShop.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return doctors
}

export const getSpecialities = async () => {
  const specialitiesSnapShop = await getDocs(collection(db, 'specialities')) // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const specialities = specialitiesSnapShop.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return specialities
}