<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { getAllPatients, findByPatientId, savePatient, updatePatient, getDocument } from '/src/firebase/patients'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(false);
const error = ref(null);
var document = ref()
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

const initialValues = reactive({
    nationality: { letter: 'V' },
    identification: '',
    name: '',
    nationalityType: 'V',
    birthday: null,
    size: 1.6,
    gender: '',
    weigth: 1,
    address: '',
    country: '',
    state: '',
    city: '',
    phone: '',
    phone2: '',
    email: '',
    profesion: '',
    waitForAdmitt: false,
    admitted: false,
    status: ''
})

const blockInputs = ref(true)
let blockInputsEdit = ref(true)
let blockVerify = ref(false)
let btnEdit = ref(true)

// TODO: Define validations
const resolver = zodResolver(
    z.object({
        nationalityType: z.string().length(1, { message: "Debe ser exactamente un caracter" }),
        identification: z.string().min(8, { message: 'La cedula es requerida' }),
        name: z.string().min(1, { message: 'El nombre es requerido' }),
        phone: z.string(),
        phone2: z.string(),
        email: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        birthday: z.string(),
        size: z.string(),
        weigth: z.string(),
        gender: z.string(),
        profesion: z.string(),
        status: z.string().min(1, { message: 'El estatus es requerido' }),
    })
)

var patients = ref([])
var patientFind = ref([])
const selectedPatient = ref()
const filters = ref(
    {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        age: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    }
);

const statuses = ref(['UCI', 'Hospitalizado', 'En Espera', 'No Ingresado'])


const onFormSubmit = async ({ valid, values }) => {
    console.log(values)
    if (valid) {
        console.log('Form submitted with values:', values)
        // Aquí puedes manejar el envío del formulario, como hacer una solicitud a la API
        visible.value = false
        blockInputs.value = true
        try {
            var sv = await savePatient(values);
            if (sv) {
                toast.add({ severity: 'success', summary: '', detail: 'Guardado con éxito.!', life: 3000 });
            }
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        patients.value = await getAllPatients();
        blockVerify.value = false
        idInput.value = ''

    } else {
        console.log('Form is invalid')
    }
}

const edad = (birthdayDate) => {

    if (!birthdayDate) {
        return ''; // Si no hay fecha, no hay edad
    }

    const hoy = new Date()
    const fechaNac = convertDdMmYyToDate(birthdayDate)

    let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    // Si el mes actual es menor que el mes de nacimiento, o si es el mismo mes pero
    // el día actual es menor que el día de nacimiento, entonces la persona aún no
    // ha cumplido años este año.
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edadCalculada--;
    }

    return edadCalculada;
};

const convertDdMmYyToDate = (dateString) => {
    // Asegúrate de que el año tenga 4 dígitos (yy -> yyyy)
    // Por ejemplo, si es "23" se asume "2023", si es "99" se asume "1999"
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses en JavaScript son de 0 a 11
    let year = parseInt(parts[2], 10);

    // Ajuste para años de 2 dígitos (ej. "24" -> "2024", "98" -> "1998")
    if (year < 100) {
        year += 2000; // Asume el siglo 21
        if (year > new Date().getFullYear() + 10) { // Si el año ajustado es muy lejano en el futuro, asume siglo 20
            year -= 100;
        }
    }

    return new Date(year, month, day);
};

// Computada para formatear la fecha a dd/mm/yyyy
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
        blockInputs.value = true
        try {
            var up = await updatePatient(values, document);
            if (up) {
                toast.add({ severity: 'success', summary: '', detail: 'Actualizado con éxito.!', life: 3000 });
            }
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: 'Ha ocurrido un error.!', life: 3000 });
        }
        patients.value = await getAllPatients();
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

const genderOptions = ref([
    { icon: 'person', value: 'Masculino' },
    { icon: 'person-dress', value: 'Femenino' },
])

const statusOptions = ref([
    { letter: 'UCI' },
    { letter: 'Hospitalizado' },
    { letter: 'En Espera' },
    { letter: 'No ingresado' }
])

onMounted(async () => {
    getPatiens()

});

const getPatiens = async () => {
    load.value = true;
    try {
        patients.value = await getAllPatients()
        if (!patients.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        load.value = false;
    }
};

const getSeverity = (status) => {
    switch (status) {
        case 'UCI':
            return 'danger';
        case 'Hospitalizado':
            return 'admited';
        case 'En Espera':
            return 'waiting';
        case 'No ingresado':
            return 'inactive';
    }
};

const visible = ref(false);
const showDialog = () => {
    visible.value = true;
    blockInputs.value = true
    clearForm()
    blockInputsEdit.value = true
}
const hideDialog = () => {
    visible.value = false;
    visible.value = false
    visibleEdit.value = false
    blockInputs.value = true
    blockInputsEdit.value = true
    blockVerify.value = false
    identification.value = ''
    idInput.value = ''
    blockInputsEdit.value = true
}

const editBtn = () => {
    blockInputsEdit.value = false
}

const checkPatient = async () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
    }, 3000);
    // Esta funcion se encarga de verificar si el paciente ya existe en la base de datos
    var nationality = nationalityType.value ? nationalityType.value : 'V'
    if (idInput.value != '') {

        patientFind.value = await findByPatientId(nationality, idInput.value)
        console.log('--->', patientFind.value)
        if (patientFind.value == false) {
            blockInputs.value = false
            blockVerify.value = true
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
const visibleEdit = ref(false)

const onRowSelect = (event) => {
    editPatient = event.data
    visibleEdit.value = true
    blockInputsEdit.value = true
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
            blockInputsEdit.value = false
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
    birthdayInput.value = ''
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

</script>

<template>
    <div>
        <DataTable v-model:filters="filters" filterDisplay="row" :value="patients" paginator
            :rows-per-page-options="[5, 10, 25]" :rows="10" stripedRows sortField="name" selectionMode="single"
            v-model:selection="selectedPatient" @row-select="onRowSelect" :sortOrder="1"
            :globalFilterFields="['name', 'identification', 'status']">
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex align-items-center gap-2">
                        <div
                            class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                            <font-awesome-icon icon="user-injured" size="2xl" />
                        </div>
                        <h1 style="display: inline;" class="ml-2">PACIENTES</h1>
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
                            <span>Nuevo Paciente</span>
                        </Button>
                    </div>
                </div>
            </template>
            <Column header="Cedula de Identidad" sortField="name" filterField="name" filterMatchMode="contains" sortable
                style="width: 25%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.nationalityType + data.identification }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Nombre y Apellido" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 25%">
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
            <Column header="Edad" sortable sortField="age" filterField="age" filterMatchMode="contains"
                :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="width: 10%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ edad(data.birthday) }}</span>
                    </div>
                </template>
            </Column>
            <Column field="status" header="Estatus" sortable filterMatchMode="equals" style="width: 20%">
                <template #body="{ data }">
                    <Tag :value="data.status" :class="getSeverity(data.status)" class="w-full" />
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

    <!-- * NUEVO PACIENTE -->
    <Dialog v-model:visible="visible" modal style="width: 70%" maximizable>
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user-injured" size="2xl" />
                </div>
                <span class="font-bold whitespace-nowrap text-2xl">Nuevo Paciente</span>
            </div>
        </template>

        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">

            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType" initialValue="V">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter"
                        v-model="nationalityType" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="identification" initialValue="">
                    <InputText placeholder="Cedula del Paciente" type="text" v-model="idInput" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <Button label="Verificar" @click="checkPatient" />

            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name" initialValue="">
                    <FloatLabel>
                        <InputText id="nameInput" name="name" type="text" class="w-full" v-model="nameInput"
                            :disabled="blockInputs" />
                        <label for="nameInput">Nombre del Paciente</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone" initialValue="">
                    <FloatLabel>
                        <InputText name="phone" type="text" inputId="phoneInput" class="w-full" v-model="phoneInput"
                            :disabled="blockInputs" />
                        <label for="phoneInput">Telefono Principal</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone2" initialValue="">
                    <FloatLabel>
                        <label for="phone2Input">Telefono Secundario</label>
                        <InputText name="phone2" type="text" class="w-full" :disabled="blockInputs"
                            v-model="phone2Input" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Correo Electronico</label>
                        <InputText name="email" type="text" class="w-full" inputId="emailInput" v-model="emailInput"
                            :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address" initialValue="">
                    <FloatLabel>
                        <label for="addressInput">Direccion</label>
                        <InputText name="address" type="text" inputId="addressInput" fluid v-model="addressInput"
                            :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="city" initialValue="">
                    <FloatLabel>
                        <InputText name="city" type="text" inputId="cityInput" class="w-full" v-model="cityInput"
                            :disabled="blockInputs" />
                        <label for="cityInput">Ciudad</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="state" initialValue="">
                    <FloatLabel>
                        <label for="stateInput">Estado</label>
                        <InputText name="state" type="text" class="w-full" :disabled="blockInputs"
                            v-model="stateInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="country" initialValue="">
                    <FloatLabel>
                        <label for="countryInput">Pais</label>
                        <InputText name="country" type="text" class="w-full" inputId="countryInput"
                            v-model="countryInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="birthday" initialValue="">
                    <FloatLabel>
                        <label for="birthday" class="block">Fecha de Nacimiento</label>
                        <DatePicker id="birthday" name="birthday" fluid class="w-full" v-model="birthdayInput"
                            dateFormat="dd/mm/yy" :disabled="blockInputs" />
                        <Message v-if="$form?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="size" initialValue="">
                    <FloatLabel>
                        <label for="sizeInput" class="block"> Estatura </label>
                        <InputNumber name="size" inputId="sizeInput" mode="decimal" showButtons :min="0.4" :max="2.5"
                            :step="0.1" class="w-full" v-model="sizeInput" :disabled="blockInputs" />
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="weigth" initialValue="">
                    <FloatLabel>
                        <label for="weigthInput" class="block"> Peso </label>
                        <InputNumber name="weigth" inputId="weigthInput" mode="decimal" showButtons :min="1" :max="400"
                            :step="1" class="w-full" v-model="weigthInput" :disabled="blockInputs" />
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="gender" initialValue="">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="value" optionValue="value" placeholder="Género"
                            class="w-full" v-model="genderInput" :disabled="blockInputs" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="profesion" initialValue="">
                    <FloatLabel>
                        <label for="profesionInput">Profesion</label>
                        <InputText name="profesion" type="text" inputId="profesionInput" fluid v-model="profesionInput"
                            :disabled="blockInputs" />
                        <Message v-if="$form.profesion?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.profesion.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" placeholder="Estatus"
                            class="w-full" v-model="statusInput" :disabled="blockInputs" />
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
            <Button label="Cancelar" @click="hideDialog" severity="secondary" />
        </template>

    </Dialog>

    <Dialog v-model:visible="visibleEdit" modal style="width: 70%" maximizable>
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user-injured" size="2xl" />
                </div>
                <span class="font-bold whitespace-nowrap text-2xl">Editar Paciente</span>
            </div>
        </template>

        <!-- ! importante -->
        <!-- TODO: Agregar funcion de editar en la base de datos -->
        <!-- TODO: Agregar validaciones -->
        <Form v-slot="$form" :initialValues="editPatient" @submit="onFormSubmitUp">

            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter"
                        v-model="editPatient.nationalityType" :disabled="blockInputsEdit" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="identification">
                    <InputText placeholder="Cedula del Paciente" type="text" v-model="editPatient.identification"
                        :disabled="blockInputsEdit" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <!-- <Button label="Verificar" @click="checkPatient" /> -->

            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name">
                    <FloatLabel>
                        <InputText id="nameInput" name="name" type="text" class="w-full" v-model="editPatient.name"
                            :disabled="blockInputsEdit" />
                        <label for="nameInput">Nombre del Paciente</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone">
                    <FloatLabel>
                        <InputText name="phone" type="text" inputId="phoneInput" class="w-full"
                            v-model="editPatient.phone" :disabled="blockInputsEdit" />
                        <label for="phoneInput">Telefono Principal</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="phone2">
                    <FloatLabel>
                        <label for="phone2Input">Telefono Secundario</label>
                        <InputText name="phone2" type="text" class="w-full" v-model="editPatient.phone2"
                            :disabled="blockInputsEdit" />
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
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="address">
                    <FloatLabel>
                        <label for="addressInput">Direccion</label>
                        <InputText name="address" type="text" inputId="addressInput" fluid v-model="editPatient.address"
                            :disabled="blockInputsEdit" />
                        <Message v-if="$form.address?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.address.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="city">
                    <FloatLabel>
                        <InputText name="city" type="text" inputId="cityInput" class="w-full" v-model="editPatient.city"
                            :disabled="blockInputsEdit" />
                        <label for="cityInput">Ciudad</label>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="state">
                    <FloatLabel>
                        <label for="stateInput">Estado</label>
                        <InputText name="state" type="text" class="w-full" v-model="editPatient.state"
                            :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="country">
                    <FloatLabel>
                        <label for="countryInput">Pais</label>
                        <InputText name="country" type="text" class="w-full" inputId="countryInput"
                            v-model="editPatient.country" :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">

                <FormField class="flex-1" v-slot="$field" name="birthday">
                    <FloatLabel>
                        <label for="birthday" class="block">Fecha de Nacimiento</label>
                        <DatePicker id="birthday" name="birthday" fluid class="w-full" v-model="birthdayInput"
                            dateFormat="dd/mm/yy" :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>


                <FormField class="flex-1" v-slot="$field" name="size">
                    <FloatLabel>
                        <label for="sizeInput" class="block"> Estatura </label>
                        <InputNumber name="size" inputId="sizeInput" mode="decimal" showButtons :min="0.4" :max="2.5"
                            placeholder="Estatura" :step="0.1" class="w-full" v-model="editPatient.size"
                            :disabled="blockInputsEdit" />
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="weigth">
                    <FloatLabel>
                        <label for="weigthInput" class="block"> Peso </label>
                        <InputNumber name="weigth" inputId="weigthInput" mode="decimal" showButtons :min="1" :max="400"
                            placeholder="Peso" :step="1" class="w-full" v-model="editPatient.weigth"
                            :disabled="blockInputsEdit" />
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="gender">
                    <FloatLabel>
                        <label for="genderInput">Género</label>
                        <Select :options="genderOptions" optionLabel="value" optionValue="value" placeholder="Género"
                            class="w-full" :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="profesion">
                    <FloatLabel>
                        <label for="profesionInput">Profesion</label>
                        <InputText name="profesion" type="text" inputId="profesionInput" fluid
                            :disabled="blockInputsEdit" />
                        <Message v-if="$form.profesion?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.profesion.error?.message }}</Message>
                    </FloatLabel>
                </FormField>

                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <label for="estatusInput">Estatus</label>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" placeholder="Estatus"
                            class="w-full" :disabled="blockInputsEdit" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>

            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Actualizar" class="w-full" :disabled="blockInputsEdit" />
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
