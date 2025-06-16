<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { getSpecialities, getAllDoctors, findByDoctorId, saveDoctor, updateDoctor } from '/src/firebase/doctors'
import { useConfirm } from "primevue/useconfirm";

var doctorFind = ref([])
var specialities = ref([])
var doctors = ref([])
const error = ref(null);
const idInput = ref('')
const nationalityType = ref()
const status = ref()

// Reglas de filtrado en la tabla
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    speciality: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone01: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const visible = ref(false)
const showDialog = () => {
    visible.value = true
    blockInputs.value = true
}
const hideDialog = () => {
    visible.value = false
    visibleEdit.value = false
    blockInputs.value = true
    blockVerify.value = false
    identification.value = ''
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
var editDoctor = reactive([])
const visibleEdit = ref(false)

const onRowSelect = (event) => {
    console.log('***', event)
    editDoctor = event.data
    visibleEdit.value = true
    console.log('Selected doctor:', editDoctor.name) //Eliminar para produccion
}

const initialValues = reactive({
    id: '',
    identification: '',
    nationalityType: 'V',
    name: '',
    lastName: '',
    cmv: '',
    mpps: '',
    speciality: '',
    phone01: '',
    phone02: '',
    address: '',
    email: '',
    instagram: '',
    otherRRSS: '',
    profilePhoto: '',
    introduceVideo: '',
    status: 'pendiente',
    bank: '',
    bankAcount: '',
    bankpm: '',
    birthday: null,
    gender: '',
    courtesy: '',
    status: 'Pendiente',
    details: '',
    directory: 'No publicado',
    verify: 'No verificado'
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
        speciality: z.string().min(1, { message: "Seleccione una especialidad" }),
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
        gender: z.string().min(1, { message: "Seleccione una género" }),
        courtesy: z.string(),

        status: z.literal('Pendiente').optional(),
        directory: z.string(),
        verify: z.string(),
    })
);

// Desactivar inputs al iniciar el formulario
let blockInputs = ref(true)
let blockVerify = ref(false)
// Desbloquear inputs al verificar la cedula
const checkDoctor = async () => {
    var nationality = nationalityType.value ? nationalityType.value : 'V'
        if(idInput.value.length >= 8){
            try {
                doctorFind.value = await findByDoctorId(nationality, idInput.value)
                console.log('-->',doctorFind.value.length)
                if (doctorFind.value != false) {
                    blockInputs.value = false
                    blockVerify.value = true
                }
                if (doctorFind.value.length == 1){
                    editDoctor = doctorFind.value[0]
                    
                    console.log('-->', doctorFind.value[0].value)
                    console.log('-->>', editDoctor)
                    msgConfirm()
                }
            } catch (err) {
                error.value = err.message;
            } 
        }
}


// Manejar el evento de submit del formulario
const onFormSubmit = async ({ valid, values }) => {
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        blockInputs.value = true
        console.log("guardar")
        saveDoctor(values);
        doctors.value = await getAllDoctors();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

const onFormSubmitUp = async ({ valid, values }) => {
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        blockInputs.value = true
        console.log("actualizar")
        updateDoctor(values);
        doctors.value = await getAllDoctors();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

onMounted(async () => {
    specialities.value = await getSpecialities()
    doctors.value = await getAllDoctors()

})

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

        },
        reject: () => {
            visible.value = false
        }
    });
};

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
            <Column field="speciality" header="Especialidad" sortable></Column>
            <Column field="phone01" header="Teléfono"></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="verify" header="Verificado" sortable>
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
                    <Badge :value="data.experience ? data.experience : 0" size="large" class="bg-vitality" />
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

        <Form :initialValues @submit="onFormSubmit" :resolver>

            <div class="flex gap-2 align-items-center">            
                <FormField v-slot="$field" name="nationalityType">
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
                        <InputText id="nameInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="lastname" initialValue="">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido del Medico</label>
                        <InputText id="lastnameInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="speciality" initialValue="">
                    <FloatLabel>
                        <label for="specialtyInput">Especialidad</label>
                        <Select id="specialtyInput" :options="specialities" optionLabel="name" optionValue="name" placeholder="Especialidad" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="cmv" initialValue="">
                    <FloatLabel>
                        <label for="cmvInput">CMV</label>
                        <InputText id="cmvInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="mpps" initialValue="">
                    <FloatLabel>
                        <label for="mppsInput">MPPS</label>
                        <InputText id="mppsInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="experience" initialValue="">
                    <FloatLabel>
                        <label for="experience">Años de Experiencia</label>
                        <InputText id="experience" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone01" initialValue="">
                    <FloatLabel>
                        <label for="phone01Input">Teléfono 1</label>
                        <InputText id="phone01Input" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone02" initialValue="">
                    <FloatLabel>
                        <label for="phone02Input">Teléfono 2</label>
                        <InputText id="phone02Input" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="record" initialValue="">
                    <FloatLabel>
                        <label for="record">Record</label>
                        <InputText id="record" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address" initialValue="">
                    <FloatLabel>
                        <label for="addressInput">Dirección</label>
                        <InputText id="addressInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="emailInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="instagram" initialValue="">
                    <FloatLabel>
                        <label for="instagramInput">Instagram</label>
                        <InputText id="instagramInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="otherRRSS" initialValue="">
                    <FloatLabel>
                        <label for="rrssInput">Otras Redes Sociales</label>
                        <InputText id="rrssInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="profilePhoto" initialValue="">
                    <FloatLabel>
                        <label for="perfilInput">Foto de Perfil</label>
                        <InputText id="perfilInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="introduceVideo" initialValue="">
                    <FloatLabel>
                        <label for="videoInput">Video de Presentación</label>
                        <InputText id="videoInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="bank" initialValue="">
                    <FloatLabel>
                        <label for="bankInput">Banco</label>
                        <InputText id="bancoInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankAcount" initialValue="">
                    <FloatLabel>
                        <label for="acountInput">Número de Cuenta</label>
                        <InputText id="acountInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankpm" initialValue="">
                    <FloatLabel>
                        <label for="pmInput">Pago Movil</label>
                        <InputText id="pmInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthday" initialValue="">
                    <FloatLabel>
                        <label for="birthInput">Fecha de Nacimiento</label>
                        <DatePicker id="birthInput" name="birthInput" fluid :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="gender" initialValue="">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="letter" optionValue="letter" placeholder="Género" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="courtesy" initialValue="">
                    <FloatLabel>
                        <label for="courtesyInput">Cortesia</label>
                        <InputText id="courtesyInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>

                </FormField>
            </div>

            <div class="flex gap-2 mt-5" style="display:none;">
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" v-model="status" value="Pendiente" placeholder="" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="directory">
                    <FloatLabel>
                        <label for="genderInput">Directorio</label>
                        <Select :options="publicOptions" optionLabel="letter" optionValue="letter" placeholder="Directorio" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="verify" >
                    <FloatLabel>
                        <label for="verify">Verificación</label>
                        <Select :options="verificatedOptions" optionLabel="letter" optionValue="letter" placeholder="Verificado" class="w-full" :disabled="blockInputs"/>
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
            <Button @click="hideDialog" label="Cancelar" :disabled="blockInputs" severity="secondary" />
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
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" v-model="editDoctor.nationalityType"/>
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>
                <FormField v-slot="$field" name="identification" initialValue="">
                    <FloatLabel>
                        <InputText id="identification" placeholder="Cédula del Médico" type="text" v-model="editDoctor.idInput"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            {{ $field.error.message }}
                        </Message>
                    </FloatLabel>
                    
                </FormField>
                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <!-- <Button label="Verificar" @click="checkDoctor" :disabled="blockVerify"/> -->
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name" initialValue="">
                    <FloatLabel>
                        <label for="nameInput">Nombre del Medico</label>
                        <InputText id="nameInput" type="text" class="w-full" v-model="editDoctor.name"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="lastname" initialValue="">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido del Medico</label>
                        <InputText id="lastnameInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="speciality" initialValue="">
                    <FloatLabel>
                        <label for="specialtyInput">Especialidad</label>
                        <Select id="specialtyInput" :options="specialities" optionLabel="name" optionValue="name" placeholder="Especialidad" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="cmv" initialValue="">
                    <FloatLabel>
                        <label for="cmvInput">CMV</label>
                        <InputText id="cmvInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="mpps" initialValue="">
                    <FloatLabel>
                        <label for="mppsInput">MPPS</label>
                        <InputText id="mppsInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="experience" initialValue="">
                    <FloatLabel>
                        <label for="experience">Años de Experiencia</label>
                        <InputText id="experience" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone01" initialValue="">
                    <FloatLabel>
                        <label for="phone01Input">Teléfono 1</label>
                        <InputText id="phone01Input" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone02" initialValue="">
                    <FloatLabel>
                        <label for="phone02Input">Teléfono 2</label>
                        <InputText id="phone02Input" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="record" initialValue="">
                    <FloatLabel>
                        <label for="record">Record</label>
                        <InputText id="record" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address" initialValue="">
                    <FloatLabel>
                        <label for="addressInput">Dirección</label>
                        <InputText id="addressInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="emailInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="instagram" initialValue="">
                    <FloatLabel>
                        <label for="instagramInput">Instagram</label>
                        <InputText id="instagramInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="otherRRSS" initialValue="">
                    <FloatLabel>
                        <label for="rrssInput">Otras Redes Sociales</label>
                        <InputText id="rrssInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="profilePhoto" initialValue="">
                    <FloatLabel>
                        <label for="perfilInput">Foto de Perfil</label>
                        <InputText id="perfilInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="introduceVideo" initialValue="">
                    <FloatLabel>
                        <label for="videoInput">Video de Presentación</label>
                        <InputText id="videoInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="bank" initialValue="">
                    <FloatLabel>
                        <label for="bankInput">Banco</label>
                        <InputText id="bancoInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankAcount" initialValue="">
                    <FloatLabel>
                        <label for="acountInput">Número de Cuenta</label>
                        <InputText id="acountInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="bankpm" initialValue="">
                    <FloatLabel>
                        <label for="pmInput">Pago Movil</label>
                        <InputText id="pmInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthday" initialValue="">
                    <FloatLabel>
                        <label for="birthInput">Fecha de Nacimiento</label>
                        <DatePicker id="birthInput" name="birthInput" fluid  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="gender" initialValue="">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="letter" optionValue="letter" placeholder="Género" class="w-full" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="courtesy" initialValue="">
                    <FloatLabel>
                        <label for="courtesyInput">Cortesia</label>
                        <InputText id="courtesyInput" type="text" class="w-full"  />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>

                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" v-model="status" value="Pendiente" placeholder="" class="w-full"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="directory">
                    <FloatLabel>
                        <label for="genderInput">Directorio</label>
                        <Select :options="publicOptions" optionLabel="letter" optionValue="letter" placeholder="Directorio" class="w-full"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="verify" >
                    <FloatLabel>
                        <label for="verify">Verificación</label>
                        <Select :options="verificatedOptions" optionLabel="letter" optionValue="letter" placeholder="Verificado" class="w-full" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                
            </div>

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Actualizar"  class="w-full"/>
            </div>
        </Form>

        <template #footer>
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
</style>