import { firebaseApp } from './init'
import { getFirestore, getDocs, collection, query, where, or, and, addDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

// Get all doctors with state == Activo
export const getDoctors = async () => {
  const q = query(collection(db, "doctors"),
            where("status", "==", "Activo"),
            where("directory", "==", "Publicado")
          ); // Devuelve un Objeto Firebase , dentro estan todos los documentos
  const querySnapshot = await getDocs(q);
  console.log('q', q)
  const doctors = querySnapshot.docs.map((doc) => doc.data()) // Devuelve un array con los documentos

  return doctors
}

export const getAllDoctors = async () => {
  const q = query(collection(db, "doctors")); // Devuelve un Objeto Firebase , dentro estan todos los documentos
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
export const findByDoctorId = async (nationalityType, identification) =>{
  const q = query(collection(db, "doctors"), 
            where("nationalityType", "==", nationalityType),
            where("identification", "==", identification),
          );
  const querySnapshot = await getDocs(q);
  const doctors = querySnapshot.docs.map((doc) => doc.data())
  
  console.log(doctors)
  return doctors.length > 0 ? doctors : false
}

// Save doctors
export const saveDoctor = async (data) =>{
  var save = false;
    try {
       const docRef = await addDoc(collection(db, "doctors"), data);
       console.log("Documento escrito con ID: ", docRef.id);
       save = true;
     } catch (e) {
       console.error("Error agregando documento: ", e);
     }
    
  return save;

}