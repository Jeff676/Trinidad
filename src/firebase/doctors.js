import { firebaseApp } from './init'
import { getFirestore, getDocs, collection } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all patients
export const getDoctors = async () => {
  const doctorsSnapShop = await getDocs(collection(db, 'doctors')) // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const doctors = doctorsSnapShop.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return doctors
}
