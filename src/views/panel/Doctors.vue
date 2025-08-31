<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { getSpecialities, getAllDoctors, findByDoctorId, saveDoctor, updateDoctor, getDocument } from '/src/firebase/doctors'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
var doctorFind = ref([])
var specialities = ref([])
var doctors = ref([])
var document = ref()
const error = ref(null)

const idInput = ref('')
const nameInput = ref('')
const lastnameInput = ref('')
const cmvInput = ref('')
const mppsInput = ref('')
const experiencieInput = ref('')
const specialityInput = ref([])
const phone01Input = ref('')
const phone02Input = ref('')
const addressInput = ref('')
const emailInput = ref('')
const instagramInput = ref('')
const otherRRSSInput = ref('')
const profilePhotoInput = ref('')
const introduceVideoInput = ref('')
const bankInput = ref('')
const bankAcountInput = ref('')
const bankpmInput = ref('')
const birthdayInput = ref('')
const genderInput = ref('')
const recordInput = ref('1')
const courtesyInput = ref('')
const statusInput = ref('Pendiente')
const directoryInput = ref('No publicado')
const verifyInput = ref('No verificado')

const nationalityType = ref()
const loadDoctors = ref(false);

const img_male = 'https://firebasestorage.googleapis.com/v0/b/trinidad-e0aae.firebasestorage.app/o/trinidad-img%2Fdr-male_200x350.png?alt=media&token=1d2345b2-4dea-4394-adc7-5fb861255bc6'
const img_famale = 'https://firebasestorage.googleapis.com/v0/b/trinidad-e0aae.firebasestorage.app/o/trinidad-img%2Fdr-female_200x350.png?alt=media&token=98670b92-7185-456f-b206-dee236bb969b'

// Reglas de filtrado en la tabla
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    speciality: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone01: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    record: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const visible = ref(false)

const showDialog = () => {
    visible.value = true
    blockInputs.value = true
    clearForm()
}

const hideDialog = () => {
    specialityDoc.value = []
    specialitySelected.value = []
    identification.value = ''
    idInput.value = ''
    
    visible.value = false
    visibleEdit.value = false
    blockInputs.value = true
    blockVerify.value = false
    blockInputsEdit.value = true
}  

const editBtn = () => {
    blockInputsEdit.value = false
}

const activeDoctor = (value) => {
    switch (value) {
        case 'Activo':
            return 'active'
        case 'Inactivo':
            return 'inactive'
        case 'Suspendido':
            return 'suspended'
        default:
            return 'pending'
    }
}

const selectedDoctor = ref()
const specialitySelected = ref([])
const specialityDoc = ref([])

var editDoctor = reactive([])
const visibleEdit = ref(false)

const onRowSelect = (event) => {
    console.log('***', event)
    specialityDoc.value = []
    specialitySelected.value = []

    editDoctor = event.data
    visibleEdit.value = true
    specialitySelected.value = editDoctor.speciality
    
    // specialitySelected.value.forEach(item => {
    //     specialityDoc.value.push(item.name);
    // });
    blockInputsEdit.value = true
    btnEdit.value = true
    getDocumentDoctor()

}

const initialValues = reactive({
    id: '',
    identification: '',
    nationalityType: 'V',
    name: '',
    lastName: '',
    cmv: '',
    mpps: '',
    speciality: [],
    phone01: '',
    phone02: '',
    address: '',
    email: '',
    instagram: '',
    otherRRSS: '',
    profilePhoto: '',
    introduceVideo: '',
    bank: '',
    bankAcount: '',
    bankpm: '',
    birthday: null,
    gender: '',
    courtesy: '',
    record: '1',
    status: 'Pendiente',
    details: '',
    directory: 'No publicado',
    verify: 'No verificado',
})

const doctorsStatus = [
    { name: 'Activo', code: 'activo' },
    { name: 'Inactivo', code: 'inactivo' },
    { name: 'Suspendido', code: 'suspendido' },
    { name: 'Pendiente', code: 'pendiente' }
]

const nationalityOptions = ref([
    { letter: 'V' },
    { letter: 'E' },
])

const genderOptions = ref([
    { letter: 'Femenino' },
    { letter: 'Masculino' },
])

const statusOptions = ref([
    { letter: 'Pendiente' },
    { letter: 'Activo' },
    { letter: 'Inactivo' },
    { letter: 'Suspendido' },
])

const courtesyOptions = ref([
    { letter: 'Activo' },
    { letter: 'Inactivo' },
    { letter: 'Suspendido' },
])

const publicOptions = ref([
    { letter: 'No publicado' },
    { letter: 'Publicado' },
])

const verificatedOptions = ref([
    { letter: 'No verificado' },
    { letter: 'Verificado' },
])

const selectValue = ref(null)


// *** Dialg New Doctor *** //

// ** Reglas de validacion para el formulario de nuevo medico ** //
const resolver = zodResolver(
    z.object({

        nationalityType: z.string().length(1, { message: "Debe ser exactamente un caracter" }),
        identification: z.string().min(8, { message: 'La cedula es requerida' }),
        name: z.string().min(1, { message: 'El nombre es requerido' }),
        lastname: z.string().min(1, { message: 'El apellido es requerido' }),
        speciality: z
            .array(
                z.object({
                    name: z.string().min(1, 'Seleccione una especialidad.')
                })
            )
            .min(1, 'Seleccione una especialidad.'),
        cmv: z.string(),
        mpps: z.string(),
        experience: z.string(),
        phone01: z.string(),
        phone02: z.string(),
        record: z.string(),
        address: z.string(),
        email: z.string(),
        instagram: z.string(),
        otherRRSS: z.string(),
        profilePhoto: z.string(),
        introduceVideo: z.string(),
        bank: z.string(),
        bankAcount: z.string(),
        bankpm: z.string(),
        birthday: z.string(),
        gender: z.string().min(1, { message: "Seleccione un género" }),
        courtesy: z.string(),
        status: z.literal('Pendiente').optional(),
        directory: z.string(),
        verify: z.string(),
    })
);

// Desactivar inputs al iniciar el formulario
let blockInputs = ref(true)
let blockInputsEdit = ref(true)
let blockVerify = ref(false)
let btnEdit = ref(true)

// Desbloquear inputs al verificar la cedula
const checkDoctor = async () => {
    var nationality = nationalityType.value ? nationalityType.value : 'V'
    console.log(idInput.value.length)
        if(idInput.value.length >= 8){
            try {
                doctorFind.value = await findByDoctorId(nationality, idInput.value)
                console.log('-->',doctorFind.value)
                if (doctorFind.value == false) {
                    blockInputs.value = false
                    //blockVerify.value = true
                }
                if (doctorFind.value.length == 1){
                    editDoctor = doctorFind.value[0]

                    getDocumentDoctor()
                    msgConfirm()
                }
            } catch (err) {
                error.value = err.message;
            } 
        }
}

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

// Manejar el evento de submit del formulario
const onFormSubmit = async ({ valid, values }) => {
    console.log('valid:', valid)
    console.log('values:', values)

    if (valid) {
        values.birthday = dateFormatDDMMYYYY()

        if(values.profilePhoto == ''){
            if(values.gender == 'Femenino'){
                values.profilePhoto = img_famale
            }else{
                values.profilePhoto = img_male
            }
        }
        // specialityInput.value.forEach(item => {
        //     specialityDoc.value.push(item.name);
        // });
        // values.speciality = specialityDoc.value

        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        blockInputs.value = true
        console.log("guardar")
        try{
            var sv = await saveDoctor(values);
            if(sv){
                toast.add({ severity: 'success', summary: '', detail: 'Guardado con éxito.!', life: 3000 });
            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Error al guardar', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        doctors.value = await getAllDoctors();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

const onFormSubmitUp = async ({ valid, values }) => {
    values.birthday = dateFormatDDMMYYYY()    

    if (valid) {
        console.log('Form submitted with values:', values)
        if(values.profilePhoto == ''){
            if(values.gender == 'Femenino'){
                values.profilePhoto = img_famale
            }else{
                values.profilePhoto = img_male
            }
        }
        visibleEdit.value = false
        blockInputs.value = true
        console.log("actualizar")
        try{
            var up = await updateDoctor(values,document);
            if(up){
                toast.add({ severity: 'success', summary: '', detail: '¡Actualizado con éxito.!', life: 3000 });
            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Error al actualizar', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        doctors.value = await getAllDoctors()
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

onMounted(async () => {
    specialities.value = await getSpecialities()
    getDoctors()

})

const getDoctors = async () => {
    loadDoctors.value = true;
    try {
    doctors.value = await getAllDoctors()
    if (!doctors.ok) {
        throw new Error('Network response was not ok');
    }
    } catch (err) {
        error.value = err.message;
    } finally {
        loadDoctors.value = false;
    }
};

const getDocumentDoctor = async () => {
    document = await getDocument(editDoctor.nationalityType, editDoctor.identification)

}

const clearForm = () =>{
    idInput.value = ''
    nameInput.value = ''
    lastnameInput.value = ''
    cmvInput.value = ''
    mppsInput.value = ''
    experiencieInput.value = ''
    specialityInput.value = []
    phone01Input.value = ''
    phone02Input.value = ''
    addressInput.value = ''
    emailInput.value = ''
    instagramInput.value = ''
    otherRRSSInput.value = ''
    profilePhotoInput.value = ''
    introduceVideoInput.value = ''
    bankInput.value = ''
    bankAcountInput.value = ''
    bankpmInput.value = ''
    birthdayInput.value = ''
    genderInput.value = ''
    recordInput.value = ''
    courtesyInput.value = ''
    statusInput.value = ''
    directoryInput.value = ''
    verifyInput.value = ''
}

const confirm = useConfirm();

const msgConfirm = () => {
    confirm.require({
        message: 'La cédula ingresada ya existe para un medico. \n ¿Desea editar su información?',
        header: 'Alerta',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'No',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sí'
        },
        accept: () => {
            visibleEdit.value = true
            visible.value = false
            blockInputsEdit.value = false
            btnEdit.value = false

        },
        reject: () => {
            visible.value = false
        }
    });
};

const viewFile = (url) => {
    window.open(url ,'_blank');
}

</script>

<template>
    
    <div>
        <DataTable v-model:filters="filters" filterDisplay="row" :value="doctors" paginator
            :rows-per-page-options="[5, 10, 25]" :rows="10" stripedRows sortField="name" selectionMode="single"
            v-model:selection="selectedDoctor" @row-select="onRowSelect" :sortOrder="1"
            :globalFilterFields="['name', 'lastname', 'specialty', 'phone', 'email']">
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex align-items-center gap-2">
                        <div
                            class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                            <font-awesome-icon icon="user-doctor" size="2xl" />
                        </div>
                        <h1 style="display: inline;" class="ml-2">MEDICOS</h1>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <IconField>
                            <InputIcon>
                                <font-awesome-icon icon="magnifying-glass" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar" />
                        </IconField>

                        <Button rounded @click="showDialog" class="bg-vitality">
                            <font-awesome-icon icon="plus" size="xl" />
                            <span>Nuevo Medico</span>
                        </Button>
                    </div>
                </div>
            </template>
            <Column field="name" header="Nombre" sortable></Column>
            <Column field="lastname" header="Apellido" sortable></Column>
            <Column field="speciality" header="Especialidad" sortable>
                <template #body="{ data }">
                    <Label v-for="(speciality, index) in data.speciality" :key="index" size="large" >
                        {{speciality + ' '}}
                    </Label>
                </template>
            </Column>
            <Column field="phone01" header="Teléfono"></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="verify" header="Verificado">
                <template #body="{ data }">
                    <Badge v-if="data.verify == 'Verificado'" size="large" class="bg-vitality" >
                        <i class="pi pi-check-circle"></i>
                    </Badge>
                    <Badge v-else="data.verify == 'No verificado'" size="large" class="bg-vitality" >
                        <i class="pi pi-exclamation-circle"></i>
                    </Badge>
                </template>
            </Column>
            <Column field="record" header="Record" sortable>
                <template #body="{ data }">
                    <Badge :value="data.record ? data.record : 0" size="large" class="bg-vitality" />
                </template>
            </Column>
            <Column field="directory" header="Directorio" sortable>
                <template #body="{ data }">
                    <div class="card flex justify-center">
                        <Badge :value="data.directory" v-if="data.directory=='Publicado'" size="large" class="active w-full" />
                        <Badge :value="data.directory" v-else size="large" class="inactive w-full" />
                    </div>
                </template>
            </Column>
            <Column field="status" header="Estatus" sortable>
                <template #body="{ data }">
                    <Badge :value="data.status" size="large" class="w-full" :class="activeDoctor(data.status)" />
                </template>
            </Column>
            <template #empty>
                <div class="text-center">
                    <ProgressSpinner v-if="loadDoctors"/>
                </div>
                 <!-- No hay resultados para mostrar. -->
            </template>          
        </DataTable>
    </div>

    <!-- * Modal Nuevo Medico -->
    <Dialog v-model:visible="visible" modal style="width: 70%" maximizable>
        <template #header>
            <div class="flex align-items-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user-doctor" size="2xl" />
                </div>
                <h1 style="display: inline;" class="ml-2">NUEVO MEDICO</h1>
            </div>
        </template>

        <Form v-slot="$field" :initialValues @submit="onFormSubmit" :resolver>

            <div class="flex gap-2 align-items-center">            
                <FormField v-slot="$field" name="nationalityType" initialValue="V">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" v-model="nationalityType" :disabled="blockVerify"/>
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>
                <FormField v-slot="$field" name="identification" initialValue="">
                    <FloatLabel>
                        <InputText id="identification" placeholder="Cédula del Médico" type="text" v-model="idInput" :disabled="blockVerify"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            {{ $field.error.message }}
                        </Message>
                    </FloatLabel>
                    
                </FormField>
                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <Button label="Verificar" @click="checkDoctor" :disabled="blockVerify"/>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name" initialValue="">
                    <FloatLabel>
                        <label for="nameInput">Nombre del Medico</label>
                        <InputText id="nameInput" type="text" class="w-full" v-model="nameInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="lastname" initialValue="">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido del Medico</label>
                        <InputText id="lastnameInput" type="text" class="w-full" v-model="lastnameInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="speciality" initialValue="">
                    <FloatLabel>
                        <label for="specialtyInput">Especialidad</label>
                        <MultiSelect id="specialtyInput" :options="specialities" optionLabel="name" placeholder="Especialidades" :maxSelectedLabels="2" class="w-full" v-model="specialityInput" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="cmv" initialValue="">
                    <FloatLabel>
                        <label for="cmvInput">CMV</label>
                        <InputText id="cmvInput" type="text" class="w-full" v-model="cmvInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="mpps" initialValue="">
                    <FloatLabel>
                        <label for="mppsInput">MPPS</label>
                        <InputText id="mppsInput" type="text" class="w-full" v-model="mppsInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="experience" initialValue="">
                    <FloatLabel>
                        <label for="experience">Años de Experiencia</label>
                        <InputText id="experience" type="text" class="w-full" v-model="experiencieInput" :maxlength="2" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone01" initialValue="">
                    <FloatLabel>
                        <label for="phone01Input">Teléfono 1</label>
                        <InputText id="phone01Input" type="text" class="w-full" v-model="phone01Input" v-phone-mask :maxlength="15" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone02" initialValue="">
                    <FloatLabel>
                        <label for="phone02Input">Teléfono 2</label>
                        <InputText id="phone02Input" type="text" class="w-full" v-model="phone02Input" v-phone-mask :maxlength="15" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="record" initialValue="">
                    <FloatLabel>
                        <label for="record">Record</label>
                        <InputText id="record" type="text" class="w-full" v-model="recordInput" :maxlength="2" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address" initialValue="">
                    <FloatLabel>
                        <label for="addressInput">Dirección</label>
                        <InputText id="addressInput" type="text" class="w-full"  v-model="addressInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="emailInput" type="text" class="w-full" v-model="emailInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="instagram" initialValue="">
                    <FloatLabel>
                        <label for="instagramInput">Instagram</label>
                        <InputText id="instagramInput" type="text" class="w-full" v-model="instagramInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="otherRRSS" initialValue="">
                    <FloatLabel>
                        <label for="rrssInput">Otras Redes Sociales</label>
                        <InputText id="rrssInput" type="text" class="w-full"  v-model="otherRRSSInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="profilePhoto" initialValue="">
                    <FloatLabel>
                        <label for="perfilInput">Foto de Perfil</label>
                        <InputText id="perfilInput" type="text" class="w-full" v-model="profilePhotoInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="introduceVideo" initialValue="">
                    <FloatLabel>
                        <label for="videoInput">Video de Presentación</label>
                        <InputText id="videoInput" type="text" class="w-full" v-model="introduceVideoInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="bank" initialValue="">
                    <FloatLabel>
                        <label for="bankInput">Banco</label>
                        <InputText id="bancoInput" type="text" class="w-full" v-model="bankInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankAcount" initialValue="">
                    <FloatLabel>
                        <label for="acountInput">Número de Cuenta</label>
                        <InputText id="acountInput" type="text" class="w-full" v-model="bankAcountInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankpm" initialValue="">
                    <FloatLabel>
                        <label for="pmInput">Pago Movil</label>
                        <InputText id="pmInput" type="text" class="w-full" v-model="bankpmInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthday" initialValue="">
                    <FloatLabel>
                        <label for="birthday">Fecha de Nacimiento</label>
                        <DatePicker  name="birthday" fluid :disabled="blockInputs" v-model="birthdayInput" dateFormat="dd/mm/yy"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="gender" initialValue="">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="letter" optionValue="letter" placeholder="Género" class="w-full" v-model="genderInput" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="courtesy" initialValue="">
                    <FloatLabel>
                        <label for="courtesyInput">Cortesia</label>
                        <Select :options="courtesyOptions" optionLabel="letter" optionValue="letter" placeholder="Cortesia" v-model="courtesyInput" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>

                </FormField>
            </div>

            <div class="flex gap-2 mt-5" style="display:none;">
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" value="Pendiente" placeholder="" v-model="statusInput" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="directory">
                    <FloatLabel>
                        <label for="genderInput">Directorio</label>
                        <Select :options="publicOptions" optionLabel="letter" optionValue="letter" placeholder="Directorio" v-model="directoryInput" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="verify" >
                    <FloatLabel>
                        <label for="verify">Verificación</label>
                        <Select :options="verificatedOptions" optionLabel="letter" optionValue="letter" placeholder="Verificado" v-model="verifyInput" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Guardar" :disabled="blockInputs" class="w-full"/>
            </div>
        </Form>

        <template #footer>
            <Button @click="hideDialog" label="Cancelar" severity="secondary" />
        </template>
    </Dialog>

    <!-- * Modal Editar Medico -->
    <Dialog v-model:visible="visibleEdit" modal style="width: 70%" maximizable>
        <template #header>
            <div class="flex align-items-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user-doctor" size="2xl" />
                </div>
                <h1 style="display: inline;" class="ml-2">EDITAR MEDICO</h1>
            </div>
        </template>

        <Form v-slot="$form" :initialValues="editDoctor" @submit="onFormSubmitUp" >

            <div class="flex gap-2 align-items-center">            
                <FormField v-slot="$field" name="nationalityType">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" v-model="editDoctor.nationalityType" :disabled="blockInputsEdit"/>
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }} 
                    </Message>
                </FormField>
                <FormField v-slot="$field" name="identification">
                    <FloatLabel>
                        <InputText id="identification" placeholder="Cédula del Médico" type="text" v-model="editDoctor.identification" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            {{ $field.error.message }}
                        </Message>
                    </FloatLabel>
                    
                </FormField>
               
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name">
                    <FloatLabel>
                        <label for="nameInput">Nombre del Medico</label>
                        <InputText id="nameInput" type="text" class="w-full" v-model="editDoctor.name" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="lastname">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido del Medico</label>
                        <InputText id="lastnameInput" type="text" class="w-full" v-model="editDoctor.lastname" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="speciality">
                    <FloatLabel>
                        <label for="specialtyInput">Especialidad</label>
                        <!-- <Select id="specialtyInput" :options="specialities" optionLabel="name" optionValue="name" placeholder="Especialidad" class="w-full"  /> -->
                        <MultiSelect display="chip" :options="specialities" optionLabel="name" optionValue="name" placeholder="Especialidades" :maxSelectedLabels="2" class="w-full" v-model="specialityInput" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="cmv">
                    <FloatLabel>
                        <label for="cmvInput">CMV</label>
                        <InputText id="cmvInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="mpps">
                    <FloatLabel>
                        <label for="mppsInput">MPPS</label>
                        <InputText id="mppsInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="experience">
                    <FloatLabel>
                        <label for="experience">Años de Experiencia</label>
                        <InputText id="experience" type="text" class="w-full" :maxlength="2" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone01">
                    <FloatLabel>
                        <label for="phone01Input">Teléfono 1</label>
                        <InputText id="phone01Input" type="text" class="w-full" :maxlength="15" v-phone-mask :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone02">
                    <FloatLabel>
                        <label for="phone02Input">Teléfono 2</label>
                        <InputText id="phone02Input" type="text" class="w-full" :maxlength="15" v-phone-mask :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="record">
                    <FloatLabel>
                        <label for="record">Record</label>
                        <InputText id="record" type="text" class="w-full" :maxlength="2" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address">
                    <FloatLabel>
                        <label for="addressInput">Dirección</label>
                        <InputText id="addressInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="emailInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="instagram">
                    <FloatLabel>
                        <label for="instagramInput">Instagram</label>
                        <InputText id="instagramInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="otherRRSS">
                    <FloatLabel>
                        <label for="rrssInput">Otras Redes Sociales</label>
                        <InputText id="rrssInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="profilePhoto">
                    <FloatLabel>
                        <label for="perfilInput">Foto de Perfil</label>
                        <InputText id="perfilInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="introduceVideo">
                    <FloatLabel>
                        <label for="videoInput">Video de Presentación</label>
                        <InputText id="videoInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="bank">
                    <FloatLabel>
                        <label for="bankInput">Banco</label>
                        <InputText id="bancoInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankAcount">
                    <FloatLabel>
                        <label for="acountInput">Número de Cuenta</label>
                        <InputText id="acountInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankpm">
                    <FloatLabel>
                        <label for="pmInput">Pago Movil</label>
                        <InputText id="pmInput" type="text" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthday">
                    <FloatLabel>
                        <label for="birthday">Fecha de Nacimiento</label>
                        <DatePicker id="birthday" name="birthday" fluid  v-model="birthdayInput" dateFormat="dd/mm/yy" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="gender">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="letter" optionValue="letter" placeholder="Género" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="courtesy">
                    <FloatLabel>
                        <label for="courtesyInput">Cortesia</label>
                        <Select :options="courtesyOptions" optionLabel="letter" optionValue="letter" value="Activo" placeholder="" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>

                </FormField>
            </div>
            
            <div class="flex gap-2 mt-5" v-if="editDoctor.summary">
                <FormField class="flex-1" v-slot="$field" name="summary" >
                    <FloatLabel>
                        <Textarea name="summary" autoResize rows="5" cols="30" :disabled="blockInputsEdit"/>
                        <label for="summary">Resumen de perfil</label>
                    </FloatLabel>
                </FormField>
            </div>
            <!-- DOCUMENTOS-->

            <div class="flex gap-2 mt-5 mb-3">
                <div class="docs-doctor" v-if="editDoctor.cedulaDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.cedulaDoc)"/>
                    <label>Cédula </label>
                    <label>de identidad</label>
                </div>
                <div class="docs-doctor" v-if="editDoctor.rifDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.rifDoc)"/>
                    <label>RIF</label>
                </div>
                <div class="docs-doctor" v-if="editDoctor.curriculumDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.curriculumDoc)"/>
                    <label>Curriculum</label>
                </div>
                <div class="docs-doctor" v-if="editDoctor.tituloDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.tituloDoc)"/>
                    <label>Título</label>
                </div>
                <div class="docs-doctor" v-if="editDoctor.photoDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.photoDoc)"/>
                    <label>Foto</label>
                </div>
                <div class="docs-doctor" v-if="editDoctor.otherDoc">
                    <Button icon="pi pi-file-check" severity="secondary" variant="text" rounded aria-label="Bookmark" @click="viewFile(editDoctor.otherDoc)"/>
                    <label>Otro documento</label>
                </div>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" value="Pendiente" placeholder="" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="directory">
                    <FloatLabel>
                        <label for="genderInput">Directorio</label>
                        <Select :options="publicOptions" optionLabel="letter" optionValue="letter" placeholder="Directorio" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="verify" >
                    <FloatLabel>
                        <label for="verify">Verificación</label>
                        <Select :options="verificatedOptions" optionLabel="letter" optionValue="letter" placeholder="Verificado" class="w-full" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>

            <div class="flex gap-2 mt-5">
                <Button type="submit" label="Actualizar" class="w-full" :disabled="blockInputsEdit"/>
            </div>
        </Form>

        <template #footer>
            <Button @click="editBtn" label="Editar" v-show="btnEdit"/>
            <Button @click="hideDialog" label="Cancelar" severity="secondary" />
        </template>
    </Dialog>
</template>

<style>
.active {
    background-color: var(--welfare) !important;
}

.inactive {
    background-color: var(--shadow) !important;
}

.pending {
    background-color: var(--hope) !important;
}

.suspended {
    background-color: var(--danger) !important;
}

.center-container {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center;    /* Centra verticalmente */
  height: 100vh;          /* Ocupa el alto completo de la ventana para centrado en la página */
  width: 100vw;           /* Ocupa el ancho completo de la ventana */
  /* Si el spinner está dentro de un contenedor más pequeño, ajusta height y width a ese contenedor */
}

textarea {
  width: 100%;
  resize: none;

}

.docs-doctor{
    display: grid; 
    place-items: center;
    margin: 15px;
    font-size: 12px;
    
}
</style>