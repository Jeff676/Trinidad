<template>
  <div class="flex flex-col md:w-8/10 text-white m-auto mb-5 bg-vitality rounded-xl m-5 mt-3">
      <div class="text-4xl text-center">FORMULARIO MÉDICO DE CORTESÍA</div>
      <div class="w-1/2 h-2 mb-5 bg-hope m-auto"></div>
  </div>
  <div class="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto my-12">
    <Form v-slot="$field" :initialValues @submit="submitForm" :resolver>
      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3>Datos personales</h3>
          <div class="w-25 h-2 mb-8 bg-hope"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div class="mb-1">
            <div class="flex">
              <FormField v-slot="$field" name="nationalityType" initialValue="V">
                <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" />
              </FormField>
              <FloatLabel>
                <FormField v-slot="$field" name="identification" initialValue="">
                  <InputText type="text" class="w-full" />
                  <label for="identification">Cédula de identidad</label>
                  <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error.message }}
                  </Message>
                </FormField>
              </FloatLabel>
            </div>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="name" initialValue="">
              <FloatLabel>
                <InputText name="name" type="text" class="w-full" />
                <label for="name">Nombres</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="lastname" initialValue="">
              <FloatLabel>
                <InputText name="lastname" type="text" class="w-full" />
                <label for="nameInput">Apellidos</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="phone01" initialValue="">
              <FloatLabel>
                <InputText type="text" class="w-full" v-phone-mask :maxlength="15" />
                <label for="phone01">Teléfono 1</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="phone02" initialValue="">
              <FloatLabel>
                <InputText type="text" class="w-full" v-phone-mask :maxlength="15" />
                <label for="phone02">Teléfono 2</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="landlinePhone" initialValue="">
              <FloatLabel>
                <InputText type="text" class="w-full" v-phone-mask :maxlength="15" />
                <label for="landlinePhone">Teléfono fijo</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
              <FloatLabel>
                <InputText name="email" type="text" class="w-full" />
                <label for="email">Email</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="cmv" initialValue="">
              <FloatLabel>
                <InputText name="cmv" type="text" class="w-full"/>
                <label for="cmv">CMV</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="mppps" initialValue="">
              <FloatLabel>
                <InputText name="mppps" type="text" class="w-full" />
                <label for="mppps">MPPPS</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div class="lg:col-span-2">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="speciality" initialValue="">
              <FloatLabel>
                <MultiSelect display="chip" :options="specialities" optionLabel="name" optionValue="name" :maxSelectedLabels="2" class="w-full" v-model="specialityInput"/>
                <label for="speciality">Especialidad(es)</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="birthday" initialValue="">
              <FloatLabel>
                <DatePicker name="birthday" fluid dateFormat="dd/mm/yy" v-model="birthdayInput"/>
                <label for="birthday">Fecha de nacimiento</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="instagram" initialValue="">
              <FloatLabel>
                <InputText name="instagram" type="text" class="w-full" />
                <label for="instagram">Instagram</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="otherRRSS" initialValue="">
              <FloatLabel>
                <InputText name="otherRRSS" type="text" class="w-full" />
                <label for="otherRRSS">Otra RRSS</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <h3>Datos del consultorio</h3>
          <div class="w-25 h-2 mb-8 bg-hope"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-3">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="addressConsultation" initialValue="">
              <FloatLabel>
                <InputText name="addressConsultation" type="text" class="w-full" />
                <label for="addressConsultation">Dirección de consulta</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="nameInstitution" initialValue="">
              <FloatLabel>
                <InputText name="nameInstitution" type="text" class="w-full" />
                <label for="nameInstitution">Nombre de la institución</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="phoneInstitution" initialValue="">
              <FloatLabel>
                <InputText name="phoneInstitution" type="text" class="w-full" />
                <label for="phoneInstitution">Teléfono de la institución</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div class="lg:col-span-2">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="nameAssistant" initialValue="">
              <FloatLabel>
                <InputText name="nameAssistant" type="text" class="w-full" />
                <label for="nameAssistant">Nombre y apellido del asistente</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="phoneAssistant" initialValue="">
              <FloatLabel>
                <InputText name="phoneAssistant" type="text" class="w-full" />
                <label for="phoneAssistant">Teléfono del asistente</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <h3>Datos bancarios</h3>
          <div class="w-25 h-2 mb-8 bg-hope"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="bank" initialValue="">
              <FloatLabel>
                <InputText name="bank" type="text" class="w-full" />
                <label for="bank">Nombre del banco</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="bankAcount" initialValue="">
              <FloatLabel>
                <InputText name="bankAcount" type="text" class="w-full" />
                <label for="bankAcount">Número de cuenta</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
        <div>
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="bankpm" initialValue="">
              <FloatLabel>
                <InputText name="bankpm" type="text" class="w-full" />
                <label for="bankpm">Teléfono del pagomovil</label>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                    $field.error?.message }}</Message>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <h3>Resumen</h3>
          <div class="w-25 h-2 mb-8 bg-hope"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-3">
          <div class="mb-1">
            <FormField class="flex-1" v-slot="$field" name="summary" initialValue="">
              <FloatLabel>
                <Textarea name="summary" autoResize rows="5" cols="30" />
                <label for="summary">Resumen de perfil</label>
              </FloatLabel>
            </FormField>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div>
          <h3>Documentos adjuntos</h3>
          <div class="w-25 h-2 mb-8 bg-hope"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Cédula de identidad</label>
              <input type="file" @change="onCedulaSelected" />
              <!-- <FileUpload ref="cedulaDoc" mode="basic" name="cedulaDoc[]" chooseLabel="Seleccione documento" @change="onCedulaSelected"/> -->
          </div>
        </div>
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Rif</label>
              <input type="file" @change="onRifSelected" />
              <!-- <FileUpload ref="rifDoc" mode="basic" name="rifDoc[]" url="/api/upload" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Seleccione documento" @change="onRifSelected"/> -->
          </div>
        </div>
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Curriculum</label>
              <input type="file" @change="onCurriculumSelected" />
              <!-- <FileUpload ref="curriculumDoc" mode="basic" name="curriculumDoc[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Seleccione documento" @change="onCurriculumSelected"/> -->
          </div>
        </div>
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Título (carta de culminación de estudios si fuese el caso)</label>
              <input type="file" @change="onTituloSelected" />
              <!-- <FileUpload ref="tituloDoc" mode="basic" name="tituloDoc[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Seleccione documento" @change="onTituloSelected"/> -->
          </div>
        </div>
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Foto (se utilizará para su perfil en el directorio)</label>
              <input type="file" @change="onPhotoSelected" />
              <!-- <FileUpload ref="photoDoc" mode="basic" name="photoDoc[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Seleccione documento" @change="onPhotoSelected"/> -->
          </div>
        </div>
        <div style="border: 1px solid grey; border-radius: 5px;" class="lg:col-span-3">
          <div class="mb-1" style="margin: 10px; display: grid;">
              <label>Otro documento</label>
              <input type="file" @change="onOtherSelected" />
              <!-- <FileUpload ref="otherDoc" mode="basic" name="otherDoc[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Seleccione documento" @change="onOtherSelected"/> -->
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <button
          :loading="loading"
          type="submit"
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
          REGISTRAR
        </button>
      </div>
    </Form>
  </div>

  <div class="card flex justify-center">
      <Dialog v-model:visible="visible" modal header="Datos enviados.!" :style="{ width: '25rem' }">
        <span class="pi pi-check-circle text-center"></span>
          <span class="text-surface-500 dark:text-surface-400 block mb-8">
            ¡Tus datos han sido enviados, pronto nos comunicaremos contigo para validar tu información.!
          </span>
          <div class="flex justify-end gap-2">
              <Button type="button" label="OK" @click="accept" ></Button>
          </div>
      </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSpecialities, findByDoctorId, saveDoctor } from '/src/firebase/doctors'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from "primevue/useconfirm"
import { storage, ref as storageRef, uploadBytes, getDownloadURL } from '../firebase/init.js';


const toast = useToast();
const confirm = useConfirm();
const loading = ref(false);

var specialities = ref([])
const specialityInput = ref([])
const specialityDoc = ref([])
const visible = ref(false);

const birthdayInput = ref('')

const cedulaDoc = ref(null);
const cedulaURL = ref(null);
const rifDoc = ref(null);
const rifURL = ref(null);

const curriculumDoc = ref(null);
const curriculumURL = ref(null);
const tituloDoc = ref(null);
const tituloURL = ref(null);
const photoDoc = ref(null);
const photoURL = ref(null);
const otherDoc = ref(null);
const otherURL = ref(null);

const nationalityOptions = ref([
    { letter: 'V' },
    { letter: 'E' },
])

const resolver = zodResolver(
    z.object({
      nationalityType: z.string().length(1, { message: "Debe ser exactamente un caracter" }),
      identification: z.string().min(8, { message: 'La cedula es requerida' }),
      name: z.string().min(1, { message: 'El nombre es requerido' }),
      lastname: z.string().min(1, { message: 'El apellido es requerido' }),
      cmv: z.string().min(1, { message: 'El CMV es requerido' }),
      mppps: z.string().min(1, { message: 'El MPPPS es requerido' }),
      email: z.string().min(1, { message: 'El email es requerido' }),
      phone01: z.string().min(1, { message: 'El teléfono es requerido' }),
      phone02: z.string(),
      landlinePhone: z.string(),
      speciality: z
            .array(
                z.string().min(1, 'Seleccione una especialidad.')
            )
            .min(1, 'Seleccione una especialidad.'),
      birthday: z.string(),
      instagram: z.string(),
      otherRRSS: z.string(),
      addressConsultation: z.string(),
      nameInstitution: z.string(),
      phoneInstitution: z.string(),
      nameAssistant: z.string(),
      phoneAssistant: z.string(),
      bank: z.string(),
      bankAcount: z.string(),
      bankpm: z.string(),
      summary: z.string(),
      status: z.literal('Pendiente').optional(),
      directory: z.literal('No publicado').optional(),
      verify: z.literal('No verificado').optional(),
    })
);
    
// Computada para formatear la fecha a dd/mm/yyyy
const dateFormatDDMMYYYY = () => {
  if (birthdayInput.value) {
    const dia = String(birthdayInput.value.getDate()).padStart(2, '0');
    const mes = String(birthdayInput.value.getMonth() + 1).padStart(2, '0'); // Meses son de 0-11
    const año = birthdayInput.value.getFullYear();
    console.log(`${dia}/${mes}/${año}`)
    return `${dia}/${mes}/${año}`;
  }
  return '';
};

const initialValues = reactive({
    id: '',
    identification: '',
    nationalityType: 'V',
    name: '',
    lastname: '',
    phone01: '',
    phone02: '',
    landlinePhone: '',
    email: '',
    cmv: '',
    mppps: '',
    speciality: [],
    birthday: null,
    instagram: '',
    otherRRSS: '',
    addressConsultation: '',
    nameInstitution: '',
    phoneInstitution: '',
    nameAssistant: '',
    phoneAssistant: '',
    bank: '',
    bankAcount: '',
    bankpm: '',
    summary: '',
    status: 'Pendiente',
    directory: 'No publicado',
    verify: 'No verificado',
});

// Computada para formatear la fecha a dd/mm/yyyy
const todayFormatDDMMYYYY = () => {
    const today = new Date()
    const dia = String(today.getDate()).padStart(2, '0');
    const mes = String(today.getMonth() + 1).padStart(2, '0'); // Meses son de 0-11
    const año = today.getFullYear();
    console.log(`${dia}/${mes}/${año}`)
    return `${dia}/${mes}/${año}`;
  
};

const submitForm = async ({ valid, values }) => {

  if(valid){
    loading,value = true
    values.status = 'Pendiente'
    values.directory = 'No publicado'
    values.verify = 'No verificado'
    values.verify = 'No verificado'

    values.timestamp = todayFormatDDMMYYYY()

    if (!cedulaDoc.value) {
      toast.add({ severity: 'error', summary: 'Agrega una cédula de identidad', detail: 'No olvides agregar un archivo con la cédula de identidad.!', life: 4000 });

      return;
    }

    if (!rifDoc.value) {
      toast.add({ severity: 'error', summary: 'Agrega un rif', detail: 'No olvides agregar un archivo con el RIF.!', life: 4000 });

      return;
    }

    const cedulaRef = storageRef(storage, `archivos/${values.identification+'/'+cedulaDoc.value.name}`);
    const rifRef = storageRef(storage, `archivos/${values.identification+'/'+rifDoc.value.name}`);
    
    const curriculumRef = null
    const tituloRef = null
    const photoRef = null
    const otherRef = null

    try {
      // Sube el archivo
      const uploadCedula = await uploadBytes(cedulaRef, cedulaDoc.value);
      const uploadRif = await uploadBytes(rifRef, rifDoc.value);

      // Obtén la URL de descarga
      cedulaURL.value = await getDownloadURL(uploadCedula.ref);
      rifURL.value = await getDownloadURL(uploadRif.ref);

      console.log(cedulaURL.value)
      console.log(rifURL.value)
      
      if (curriculumDoc.value != null) {
        const curriculumRef = storageRef(storage, `archivos/${values.identification+'/'+curriculumDoc.value.name}`);
        const uploadCurriculum = await uploadBytes(curriculumRef, curriculumDoc.value)
        curriculumURL.value = await getDownloadURL(uploadCurriculum.ref);
      }
      if (tituloDoc.value != null) {
        const tituloRef = storageRef(storage, `archivos/${values.identification+'/'+tituloDoc.value.name}`)
        const uploadTitulo = await uploadBytes(tituloRef, tituloDoc.value)
        tituloURL.value = await getDownloadURL(uploadTitulo.ref);
      }
      if (photoDoc.value != null) {
        const photoRef = storageRef(storage, `archivos/${values.identification+'/'+photoDoc.value.name}`)
        const uploadPhoto = await uploadBytes(photoRef, photoDoc.value)
        photoURL.value = await getDownloadURL(uploadPhoto.ref);
      }
      if (otherDoc.value != null) {
        const otherRef = storageRef(storage, `archivos/${values.identification+'/'+otherDoc.value.name}`)
        const uploadOther = await uploadBytes(otherRef, otherDoc.value)
        otherURL.value = await getDownloadURL(uploadOther.ref);

      }
      

    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      cedulaDoc.value = null; // Limpia la selección de archivo
    }


    //archivos
    values.cedulaDoc = cedulaURL.value
    values.rifDoc = rifURL.value
    values.curriculumDoc = curriculumURL.value
    values.tituloDoc = tituloURL.value
    values.photoDoc = photoURL.value
    values.otherDoc = otherURL.value
        
    console.log('Datos del médico a registrar:', valid);
    console.log('Formulario de médico enviado con éxito!', values);
    try{
        
        var sv = await saveDoctor(values);
        if(sv){
          visible.value = true
          loading.value = false     
        }
    }catch(e){
        loading.value = false
        toast.add({ severity: 'error', summary: 'Error al guardar', detail: 'Ha ocurrido un error.!', life: 3000 });
    }
  }

};

onMounted(async () => {
    specialities.value = await getSpecialities()

})

const accept = () => {
  window.location.replace('/');

};

const onCedulaSelected = (event) => {
  cedulaDoc.value = event.target.files[0]
  console.log(cedulaDoc.value)
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onRifSelected = (event) => {
  rifDoc.value = event.target.files[0]
  console.log(rifDoc.value)
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onCurriculumSelected = (event) => {
  curriculumDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onTituloSelected = (event) => {
  tituloDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onPhotoSelected = (event) => {
  photoDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onOtherSelected = (event) => {
  otherDoc.value = event.target.files[0]
  console.log(otherDoc.value)
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Archivo agregado con exito.!', life: 3000 });

}

const onUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

</script>

<style scoped>
.card {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
textarea {
  border: 1px solid grey;
  width: 100%;
  resize: none;

}
input[type="file"]::file-selector-button {
  background-color: #03a5a5; /* Green background */
  color: white; /* White text */
  padding: 10px 15px; /* Padding for the button */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
}
</style>