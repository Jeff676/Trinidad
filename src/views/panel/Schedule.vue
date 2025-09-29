<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { getScheduleToday, getSpecialities, getDoctorsFind, findByPatientId} from '/src/firebase/schedules'

import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { getDoctors } from '/src/firebase/doctors'

const toast = useToast();
const loading = ref(false);
const error = ref(null);
var document = ref()
var schedules = ref([])

var doctors = ref([])
var specialitySelected = ref()
var specialities = ref([])
var patients = ref([])
var patientFind = ref([])

const selectedSchedule= ref()

const idInput = ref('')
const nationalityType = ref()
const nameInput = ref('')
const birthdayInput = ref('')
const sizeInput = ref(1.6)
const genderInput = ref('')
const weigthInput = ref(1)
const addressInput = ref('')
const countryInput = ref('')
const stateInput = ref('')
const cityInput = ref('')
const phoneInput = ref('')
const phone2Input = ref('')
const emailInput = ref('')
const profesionInput = ref('')
const statusInput = ref('')
const load = ref(false);

const scheduleValues = reactive({
  identification: '',
  patient: '',
  date: null,
  doctor: '',
  typeSchedule: '',
  speciality: [],
  status: ''

})

const resolverSchedule = zodResolver(
    z.object({
      date: z.preprocess((val) => {
            if (val === '' || val === null) {
                return null;
            }
            return new Date(val);
        }, z.union([z.date(), z.null().refine((val) => val !== null, { message: 'La fecha de cita es requerida.' })])),
      doctor: z.string().min(1, { message: "Debe seleccionar un doctor" }),
      typeSchedule: z.string().min(1, { message: "Debe seleccionar un tipo de agenda" }),
      speciality: z
            .array(
                z.object({
                    name: z.string().min(1, 'Seleccione una especialidad.')
                })
            )
            .min(1, 'Seleccione una especialidad.'),
    })
)

const filters = ref(
    {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        age: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    }
);


const onFormSubmit = async ({ valid, values }) => {
    console.log(values)
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        try {
            var sv = await savePatient(values);
            if (sv) {
                toast.add({ severity: 'success', summary: '', detail: 'Guardado con éxito.!', life: 3000 });
            }
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        patients.value = await getAll();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

const dateFormatDDMMYYYY = () => {

    if (birthdayInput.value) {
        console.log('birthdayInput', birthdayInput.value)
        const dia = String(birthdayInput.value.getDate()).padStart(2, '0');
        const mes = String(birthdayInput.value.getMonth() + 1).padStart(2, '0'); // Meses son de 0-11
        const año = birthdayInput.value.getFullYear();
        console.log(`${dia}/${mes}/${año}`)
        return `${dia}/${mes}/${año}`;
    }
    return '';
};

const onFormSubmitUp = async ({ valid, values }) => {
    console.log(values)
    console.log(dateFormatDDMMYYYY())
    values.birthday = dateFormatDDMMYYYY()
    console.log('birthday', values.birthday)
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visibleEdit.value = false
        try {
            var up = await updatePatient(values, document);
            if (up) {
                toast.add({ severity: 'success', summary: '', detail: 'Actualizado con éxito.!', life: 3000 });
            }
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        patients.value = await getScheduleToday();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

const nationalityOptions = ref([
    { letter: 'V' },
    { letter: 'E' },
])


onMounted(async () => {
    getSchedule()
    specialities.value = await getSpecialities()

});

const getSchedule = async () => {
    load.value = true;
    try {
        schedules.value = await getScheduleToday()
        if (!schedules.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        load.value = false;
    }
};

const visible = ref(false);
const showDialog = () => {
    visible.value = true;
    clearForm()
}
const hideDialog = () => {
    visible.value = false;
    visible.value = false
    visibleEdit.value = false
    identification.value = ''
    idInput.value = ''
}


const editBtn = () => {
   
}

const checkPatient = async () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
    }, 3000);
    console.log('-->',idInput.value)
    console.log('-->',nationalityType.value)
    // Esta funcion se encarga de verificar si el paciente ya existe en la base de datos
    var nationality = nationalityType.value ? nationalityType.value : 'V'
    if (idInput.value != '') {

        patientFind.value = await findByPatientId(nationality, idInput.value)
        console.log('--->', patientFind.value)
        if (patientFind.value == false) {
            
        }
        if (patientFind.value.length == 1) {
            editPatient = patientFind.value[0]
            getDocumentPatient()
            msgConfirm()
            birthdayInput.value = editPatient.birthday
        }

    }
}

var editPatient = reactive([])
var schedulePatient = reactive([])

const visibleEdit = ref(false)
const schedule = ref(false)

const onRowSelect = (event) => {
    editPatient = event.data
    visibleEdit.value = true
    btnEdit.value = true
    getDocumentPatient()

}

const getDocumentPatient = async () => {
    document = await getDocument(editPatient.nationalityType, editPatient.identification)

}

const confirm = useConfirm();

const msgConfirm = () => {
    confirm.require({
        message: 'La cédula ingresada ya existe para un paciente. ¿Desea editar su información?',
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
            btnEdit.value = false

        },
        reject: () => {
            visible.value = false
        }
    });
};

const clearForm = () => {
    idInput.value = ''
    nameInput.value = ''
    birthdayInput.value = null,
    sizeInput.value = 1.6
    genderInput.value = ''
    weigthInput.value = 1
    addressInput.value = ''
    countryInput.value = ''
    stateInput.value = ''
    cityInput.value = ''
    phoneInput.value = ''
    phone2Input.value = ''
    emailInput.value = ''
    profesionInput.value = ''
}

const specialityChange  = () => {
  
    alert(`El valor ha cambiado a: ${specialitySelected.value}`)
    doctors.value  = getDoctorsFind(specialitySelected.value)
    console.log(doctors.value)


}

const onFormSubmitSchedule = async ({ valid, values }) => {
  console.log('valid', valid)
  console.log('values', values)
}

const typeScheduleOptions = ref([
    { letter: 'Consulta' },
    { letter: 'Control' },
    { letter: 'Revisión de exámenes' },
])

</script>

<template>
    <div>
        <DataTable v-model:filters="filters" filterDisplay="row" :value="patients" paginator
            :rows-per-page-options="[5, 10, 25]" :rows="10" stripedRows sortField="name" selectionMode="single"
            v-model:selection="selectedSchedule" @row-select="onRowSelect" :sortOrder="1"
            :globalFilterFields="['name', 'identification', 'status']">
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex align-items-center gap-2">
                        <div
                        class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                        <font-awesome-icon icon="calendar-days" size="2xl" />
                    </div>
                    <h1 style="display: inline;" class="ml-2">CITAS</h1>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <IconField>
                            <InputIcon>
                                <FontAwesomeIcon icon="fa-magnifying-glass" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar" />
                        </IconField>
                        <Button rounded @click="showDialog">
                            <font-awesome-icon icon="plus" size="xl" />
                            <span>Agendar Cita</span>
                        </Button>
                        <Button rounded @click="showDialog">
                            <font-awesome-icon icon="filter" size="xl" />
                            <span>Filtrar</span>
                        </Button>
                    </div>
                </div>
            </template>
            <Column header="Paciente" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 20%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.name }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Teléfono" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 20%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.phone }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Doctor" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 20%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.phone }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Especialidad" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 20%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.phone }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Fecha" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 10%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.phone }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Acciones" sortField="name" filterField="name" filterMatchMode="contains" sortable
                style="width: 5%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Button icon="pi pi-calendar" aria-label="Agendar" v-on:click="showSchedule(data)"/>
                    </div>
                </template>
            </Column>
            <template #empty>
                <div class="text-center">
                    <ProgressSpinner v-if="load" />
                </div>
                <!-- No hay resultados para mostrar. -->
            </template>
        </DataTable>
    </div>

    <!-- * NUEVO CITA -->
    <Dialog v-model:visible="visible" modal style="width: 60%" maximizable>
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="fa-calendar-days" size="2xl" />
                </div>
                <span class="font-bold whitespace-nowrap text-2xl">Nueva Cita</span>
            </div>
        </template>

        <Form v-slot="$form" :scheduleValues :resolverSchedule @submit="onFormSubmit">
            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType" initialValue="V">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" 
                    v-model="nationalityType"/>
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="identification">
                    <InputText placeholder="Cedula del Paciente" type="text" v-model="idInput" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <Button label="Buscar" @click="checkPatient" />

            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone" initialValue="">
                    <FloatLabel>
                        <InputText name="phone" type="text" class="w-full" :readonly="true"/>
                        <label for="phoneInput">Nombre del Paciente</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone2" initialValue="">
                    <FloatLabel>
                        <label for="phone2Input">Telefono</label>
                        <InputText name="phone2" type="text" class="w-full" :readonly="true"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Estatus</label>
                        <InputText name="email" type="text" class="w-full" :readonly="true" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <br> 
            <hr>
            <br>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="typeSchedule" initialValue="">
                    <FloatLabel>
                        <label>Tipo de cita</label>
                        <Select :options="typeScheduleOptions" optionLabel="letter" optionValue="letter" placeholder="Tipo de cita"
                            class="w-full" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="date" initialValue="">
                    <FloatLabel>
                        <label for="date" class="block">Fecha de la cita</label>
                        <DatePicker id="date" name="date" fluid class="w-full" v-model="birthdayInput"
                            dateFormat="dd/mm/yy" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="speciality" initialValue="">
                    <FloatLabel>
                        <label for="">Especialidad</label>
                        <Select :options="specialities" optionLabel="name" optionValue="name" placeholder="Especialidad" 
                        class="w-full" v-model="specialitySelected" @change="specialityChange"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="doctor">
                    <FloatLabel>
                        <label for="doctor">Doctor</label>
                        <Select :options="doctors" optionLabel="name" placeholder="Doctor" class="w-full" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Guardar" class="w-full" />
            </div>

        </Form>

        <template #footer>
            <Button label="Cancelar" @click="hideDialog" severity="secondary" />
        </template>

    </Dialog>

    <Dialog v-model:visible="visibleEdit" modal style="width: 70%" maximizable>
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="fa-calendar-days" size="2xl" />
                </div>
                <span class="font-bold whitespace-nowrap text-2xl">Editar Cita</span>
            </div>
        </template>

        <!-- ! importante -->
        <!-- TODO: Agregar funcion de editar en la base de datos -->
        <!-- TODO: Agregar validaciones -->
        <Form v-slot="$form" :initialValues="editPatient" @submit="onFormSubmitUp">

            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter"
                        v-model="editPatient.nationalityType" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="identification">
                    <InputText placeholder="Cedula del Paciente" type="text" v-model="editPatient.identification" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <!-- <Button label="Verificar" @click="checkPatient" /> -->

            </div>

            <!-- <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone">
                    <FloatLabel>
                        <InputText name="phone" type="text" inputId="phoneInput" class="w-full" v-model="editPatient.phone" v-phone-mask :maxlength="15" :disabled="blockInputsEdit"/>
                        <label for="phoneInput">Telefono Principal</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone2">
                    <FloatLabel>
                        <label for="phone2Input">Telefono Secundario</label>
                        <InputText name="phone2" type="text" class="w-full"  v-model="editPatient.phone2" v-phone-mask :maxlength="15" :disabled="blockInputsEdit"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="email">
                    <FloatLabel>
                        <label for="emailInput">Correo Electronico</label>
                        <InputText name="email" type="text" class="w-full" inputId="emailInput"
                            v-model="editPatient.email" :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div> -->

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Actualizar" class="w-full" />
            </div>
        </Form>
        <template #footer>
            <Button @click="" label="Ver Historia" />
            <Button @click="editBtn" label="Editar" v-show="btnEdit" />
            <Button @click="hideDialog" label="Cancelar" severity="secondary" />
        </template>
    </Dialog>

</template>

<style scoped>
.waiting {
    background-color: var(--welfare) !important;
}

.inactive {
    background-color: var(--shadow) !important;
}

.admited {
    background-color: var(--hope) !important;
}

.danger {
    background-color: var(--danger) !important;
}
</style>
