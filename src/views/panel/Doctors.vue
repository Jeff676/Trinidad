<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { getSpecialities, findByDoctorId } from '/src/firebase/doctors'

var doctorFind = ref([])
var specialities = ref([])
const error = ref(null);
const idInput = ref('')
const nationalityType = ref()

// Estos datos deben ser reemplazados por una llamada a la API
const doctors = ref([
    {
        name: 'Dr. Juan Pérez',
        specialty: 'Cardiología',
        email: 'juanperez@mail.com',
        phone: '123456789',
        directory: false,
        record: 8,
        status: 'pendiente',
    },
    {
        name: 'Dra. María López',
        specialty: 'Pediatría',
        email: 'marialopez@mail.com',
        phone: '987654321',
        directory: false,
        record: 5,
        status: 'inactivo',
    },
    {
        name: 'Dr. Carlos García',
        specialty: 'Dermatología',
        email: 'cgarcia@mail.com',
        phone: '456789123',
        directory: true,
        record: 10,
        status: 'activo',
    }
])


// Reglas de filtrado en la tabla
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    specialty: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const visible = ref(false)
const showDialog = () => {
    visible.value = true
    blockInputs.value = true
}
const hideDialog = () => {
    visible.value = false
    blockInputs.value = true
}

const activeDoctor = (value) => {
    switch (value) {
        case 'activo':
            return 'active'
        case 'inactivo':
            return 'inactive'
        case 'suspendido':
            return 'suspended'
        default:
            return 'pending'
    }
}

const selectedDoctor = ref()
var editDoctor = reactive([])
const visibleEdit = ref(false)

const onRowSelect = (event) => {
    editDoctor = event.data
    visibleEdit.value = true
    console.log('Selected doctor:', editDoctor.name) //Eliminar para produccion
}

const initialValues = reactive({
    id: '',
    idInput: '',
    nationalityType: 'V',
    name: '',
    lastName: '',
    cmv: '',
    mpps: '',
    specialty: {},
    phone01: '',
    phone02: '',
    address: '',
    email: '',
    instagram: '',
    otherRRSS: '',
    profilePhoto: '',
    introduceVideo: '',
    status: 'pendiente',
    bankAcount: [
        {
            bank: '',
            accountNumber: '',
            accountType: '',
            accountHolder: '',
        }
    ],
    birthday: null,
    gender: 'Fem',
    country: '',
    state: '',
    city: '',
    details: '',
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
const selectValue = ref(null)


// *** Dialg New Doctor *** //

// ** Reglas de validacion para el formulario de nuevo medico ** //
const resolver = zodResolver(
    z.object({
        nationalityType: z.string().length(1, { message: "Debe ser exactamente un caracter" }),
        idInput: z.string().min(8, { message: 'La cedula es requerida' }),
        name: z.string().min(1, { message: 'El nombre es requerido' }),
        lastname: z.string().min(1, { message: 'El apellido es requerido' }),
    })
);

// Desactivar inputs al iniciar el formulario
let blockInputs = ref(true)
let blockVerify = ref(false)
// Desbloquear inputs al verificar la cedula
const checkDoctor = async () => {
    var nationality = nationalityType.value ? nationalityType.value : 'V'
    try {
        doctorFind.value = await findByDoctorId(nationality, idInput.value)
        console.log(doctorFind.value)
        if (doctorFind.value == 0) {
            blockInputs.value = false
            blockVerify.value = true
        }
    } catch (err) {
        error.value = err.message;
    } 

}
const all = async () => {
    loadDoctors.value = true;
      try {
        doctors.value = await getDoctors()
        if (!doctors.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loadDoctors.value = false;
      }
};

// Manejar el evento de submit del formulario
const onFormSubmit = ({ valid, values }) => {
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        blockInputs.value = true

    } else {
        console.log('Form is invalid')
    }
}

onMounted(async () => {
    specialities.value = await getSpecialities()
})
 

</script>


<template>
    <div>
        <DataTable v-model:filters="filters" filterDisplay="row" :value="doctors" paginator
            :rows-per-page-options="[5, 10, 25]" :rows="10" stripedRows sortField="name" selectionMode="single"
            v-model:selection="selectedDoctor" @row-select="onRowSelect" :sortOrder="1"
            :globalFilterFields="['name', 'specialty', 'phone', 'email']">
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
            <Column field="specialty" header="Especialidad" sortable></Column>
            <Column field="phone" header="Teléfono"></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="record" header="Record" sortable>
                <template #body="{ data }">
                    <Badge :value="data.record" size="large" class="bg-vitality" />
                </template>
            </Column>
            <Column field="directory" header="Directorio" sortable>
                <template #body="{ data }">
                    <div class="card flex justify-center">
                        <Badge value="Publicado" v-if="data.directory" size="large" class="active w-full" />
                        <Badge value="No Publicado" v-else size="large" class="inactive w-full" />
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

        <Form :initialValues @submit="onFormSubmit" class="" :resolver>
            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType" v-model="nationalityType">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" v-model="nationalityType" :disabled="blockVerify"/>
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="idInput" initialValue="">
                    <FloatLabel>
                        <InputText id="idInput" placeholder="Cédula del Médico" type="text" v-model="idInput" :disabled="blockVerify"/>
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

                <FormField class="flex-1" v-slot="$field" name="specialty" initialValue="">
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
                <FormField class="flex-1" v-slot="$field" name="instagramInput" initialValue="">
                    <FloatLabel>
                        <label for="instagramInput">Instagram</label>
                        <InputText id="instagramInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="rrssInput" initialValue="">
                    <FloatLabel>
                        <label for="rrssInput">Otras Redes Sociales</label>
                        <InputText id="rrssInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="perfilInput" initialValue="">
                    <FloatLabel>
                        <label for="perfilInput">Foto de Perfil</label>
                        <InputText id="perfilInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="videoInput" initialValue="">
                    <FloatLabel>
                        <label for="videoInput">Video de Presentación</label>
                        <InputText id="videoInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="bankInput" initialValue="">
                    <FloatLabel>
                        <label for="bankInput">Banco</label>
                        <InputText id="bancoInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="acountInput" initialValue="">
                    <FloatLabel>
                        <label for="acountInput">Número de Cuenta</label>
                        <InputText id="acountInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="pmInput" initialValue="">
                    <FloatLabel>
                        <label for="pmInput">Pago Movil</label>
                        <InputText id="pmInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthInput" initialValue="">
                    <FloatLabel>
                        <label for="birthInput">Fecha de Nacimiento</label>
                        <DatePicker id="birthInput" name="birthInput" fluid :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="genderInput" initialValue="">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="letter" optionValue="letter" placeholder="Género" class="w-full" :disabled="blockInputs"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="courtesyInput" initialValue="">
                    <FloatLabel>
                        <label for="courtesyInput">Cortesia</label>
                        <InputText id="courtesyInput" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>

                </FormField>
            </div>

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Guardar" :disabled="blockInputs" class="w-full" />
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

        <!-- ! importante -->
        <!-- TODO: Agregar funcion de editar en la base de datos -->
        <!-- TODO: Agregar validaciones -->
        <Form v-slot="$form" :initialValues="editDoctor" @submit="" class="flex flex-column gap-4 w-full sm:w-56">
            <div class="flex flex-column gap-5">
                <div class="flex-1 mt-5">
                    <FloatLabel>
                        <InputText id="nameInput" name="name" type="text" class="w-full" v-model="editDoctor.name" />
                        <label for="nameInput">Nombre del Medico</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex-1">
                    <FloatLabel>
                        <InputText id="ageInput" name="age" type="text" class="w-full" v-model="editDoctor.age" />
                        <label for="ageInput">Edad</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex-1">
                    <FloatLabel>
                        <InputText id="statusInput" name="status" type="text" class="w-full"
                            v-model="editDoctor.status" />
                        <label for="statusInput">Estatus</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
            </div>
        </Form>
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