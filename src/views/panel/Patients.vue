<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const initialValues = reactive({
    nationality: { letter: 'V' },
    patientId: '',
    name: '',
    nationalityType: 'V',
    birthday: null,
    size: 1.6,
    gender: 'Fem',
    weigth: 0,
    address: '',
    country: '',
    state: '',
    city: '',
    phone: '',
    phone2: '',
    email: '',
    profesion: '',
    waitForAdmitt: false,
    admitted: false
})

const blockInputs = ref(true)

// TODO: Define validations
const resolver = ({ values }) => {
    const errors = {}


    if (!values.name) {
        errors.name = [{ message: 'Nombre del Paciente es Requerido' }]
    }

    return {
        errors
    }
}

const patients = ref([
    { name: 'Juan Perez', id: '12345678', age: 30, status: 'UCI', country: { name: 'Venezuela', code: 'VE' }, representative: { name: 'Amy Elsner', image: 'amyelsner.png' } },
    { name: 'Maria Gomez', id: '87654321', age: 25, status: 'Hospitalizado', country: { name: 'Colombia', code: 'CO' }, representative: { name: 'Anna Fali', image: 'annafali.png' } },
    { name: 'Carlos Sanchez', id: '23456789', age: 40, status: 'En Espera', country: { name: 'Mexico', code: 'MX' }, representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' } },
])
const selectedPatient = ref()
const filters = ref(
    {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    }
);
const newPatient = ref({
    name: '',
    id: '',
    age: '',
    status: ''
})

const statuses = ref(['UCI', 'Hospitalizado', 'En Espera', 'No Ingresado'])

const onFormSubmit = async ({ states }) => {
    console.log('Form submitted with values:', states);
}

const nationalityOptions = ref([
    { letter: 'V' },
    { letter: 'E' },
])

const genderOptions = ref([
    { icon: 'person', value: 'male' },
    { icon: 'person-dress', value: 'female' },
])

const doctors = ref([
    { name: 'Dra Maria Perez' },
    { name: 'Dr Jose Gonzalez' },
])

onMounted(() => {
    // CustomerService.getCustomersSmall().then((data) => (customers.value = data));
    console.log('Customers data loaded')
});

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
}
const hideDialog = () => {
    visible.value = false;
}

const checkPatient = () => {
    // Esta funcion se encarga de verificar si el paciente ya existe en la base de datos
    blockInputs.value = false
}

var editPatient = reactive([])
const visibleEdit = ref(false)

const onRowSelect = (event) => {
    editPatient = event.data
    visibleEdit.value = true
    console.log('Selected patient:', editPatient.name) //Eliminar para produccion
}

</script>

<template>
    <div class="card">
        <DataTable v-model:filters="filters" :value="patients" stateStorage="session" stateKey="dt-state-demo-session"
            paginator :rows="5" selectionMode="single" v-model:selection="selectedPatient" @row-select="onRowSelect"
            dataKey="id" :globalFilterFields="['name', 'country.name', 'representative.name', 'status']"
            tableStyle="min-width: 50rem">
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
                            <InputText v-model="filters['global'].value" placeholder="Global Search" />
                        </IconField>
                        <Button rounded @click="showDialog">
                            <font-awesome-icon icon="plus" size="xl" />
                            <span>Nuevo Paciente</span>
                        </Button>
                    </div>
                </div>
            </template>
            <Column field="id" header="Cedula de Identidad" sortable style="width: 25%">
            </Column>
            <Column header="Nombre y Apellido" sortable sortField="name" filterField="name" filterMatchMode="contains"
                style="width: 25%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.name }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Edad" sortable sortField="representative.name" filterField="representative"
                :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="width: 25%">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.age }}</span>
                    </div>
                </template>
            </Column>
            <Column field="status" header="Estatus" sortable filterMatchMode="equals" style="width: 25%">
                <template #body="{ data }">
                    <Tag :value="data.status" :class="getSeverity(data.status)" class="w-full" />
                </template>
            </Column>
            <template #empty> Paciente no encontrado </template>
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
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit"
            class="flex flex-column gap-4 w-full sm:w-56">

            <div class="flex gap-2 align-items-center">
                <FormField v-slot="$field" name="nationalityType" initialValue="V">
                    <Select :options="nationalityOptions" optionLabel="letter" optionValue="letter" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField v-slot="$field" name="patientId" initialValue="">
                    <InputText placeholder="Cedula del Paciente" type="text" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!-- TODO: -->
                <!-- * Validar que la cedula no exista en la base de datos antes de crear un nuevo paciente -->
                <Button label="Verificar" @click="checkPatient" />

            </div>

            <div class="flex">
                <div class="flex-1">
                    <FloatLabel>
                        <InputText id="nameInput" name="name" type="text" class="w-full" :disabled="blockInputs" />
                        <label for="nameInput">Nombre del Paciente</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
            </div>

            <div class="flex">
                <div class="flex flex-column flex-1 gap-1">
                    <FloatLabel>
                        <InputText name="phone" type="text" inputId="phoneInput" class="w-full"
                            :disabled="blockInputs" />
                        <label for="phoneInput">Telefono Principal</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex flex-column flex-1 gap-1 ml-2">
                    <FloatLabel>
                        <label for="phone2Input">Telefono Secundario</label>
                        <InputText name="phone2" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex flex-column flex-1 gap-1 ml-2">
                    <FloatLabel>
                        <label for="emailInput">Correo Electronico</label>
                        <InputText name="email" type="text" class="w-full" inputId="emailInput"
                            :disabled="blockInputs" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
            </div>


            <div class="flex flex-column gap-1">
                <FloatLabel>
                    <label for="addressInput">Direccion</label>
                    <InputText name="address" type="text" inputId="addressInput" fluid :disabled="blockInputs" />
                    <Message v-if="$form.address?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.address.error?.message }}</Message>
                </FloatLabel>
            </div>

            <div class="flex">
                <div class="flex flex-column flex-1 gap-1">
                    <FloatLabel>
                        <InputText name="city" type="text" inputId="cityInput" class="w-full" :disabled="blockInputs" />
                        <label for="cityInput">Ciudad</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex flex-column flex-1 gap-1 ml-2">
                    <FloatLabel>
                        <label for="stateInput">Estado</label>
                        <InputText name="state" type="text" class="w-full" :disabled="blockInputs" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex flex-column flex-1 gap-1 ml-2">
                    <FloatLabel>
                        <label for="countryInput">Pais</label>
                        <InputText name="country" type="text" class="w-full" inputId="countryInput"
                            :disabled="blockInputs" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
            </div>

            <div class="flex align-items-center">
                <div class="flex-col gap-1">
                    <label for="birthdayInput">Fecha de Nacimiento</label> <!-- Fix text color -->
                    <DatePicker name="birthday" inputId="birthdayInput" fluid dateFormat="dd/mm/yy"
                        :disabled="blockInputs" />
                    <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">{{
                        $form.date.error?.message }}</Message>
                </div>

                <div class="flex-col ml-2">
                    <label for="sizeInput" class="block"> Estatura </label>
                    <InputNumber name="size" inputId="sizeInput" mode="decimal" showButtons :min="0.4" :max="2.5"
                        :step="0.1" :disabled="blockInputs" />
                </div>

                <div class="flex-col ml-2">
                    <label for="weigthInput" class="block"> Peso </label>
                    <InputNumber name="weigth" inputId="weigthInput" mode="decimal" showButtons :min="1" :max="400"
                        :step="1" :disabled="blockInputs" />
                </div>

                <div class="flex-col ml-2">
                    <label for="genderInput" class="block mb-1"> Genero </label>
                    <SelectButton name="gender" :options="genderOptions" optionLabel="value" dataKey="value"
                        aria-labelledby="custom" inputId="genderInput" :disabled="blockInputs">
                        <template #option="slotProps">
                            <font-awesome-icon :icon="slotProps.option.icon" />
                        </template>
                    </SelectButton>
                </div>
            </div>

            <div class="flex flex-column gap-1">
                <FloatLabel>
                    <label for="profesionInput">Profesion</label>
                    <InputText name="profesion" type="text" inputId="profesionInput" fluid :disabled="blockInputs" />
                    <Message v-if="$form.profesion?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.profesion.error?.message }}</Message>
                </FloatLabel>
            </div>

            <Button type="submit" severity="primary" label="Guardar" :disabled="blockInputs" />
        </Form>

        <template #footer>
            <Button label="Cancelar" @click="hideDialog" severity="secondary" />
        </template>

    </Dialog>

    <Dialog v-model:visible="visibleEdit" modal style="width: 70%" maximizable>
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <Button rounded variant="outlined" disabled>
                    <font-awesome-icon icon="user-injured" size="2xl" />
                </Button>
                <span class="font-bold whitespace-nowrap text-2xl">Editar Paciente</span>
            </div>
        </template>

        <!-- ! importante -->
        <!-- TODO: Agregar funcion de editar en la base de datos -->
        <!-- TODO: Agregar validaciones -->
        <Form v-slot="$form" :initialValues="editPatient" @submit="" class="flex flex-column gap-4 w-full sm:w-56">
            <div class="flex flex-column gap-5">
                <div class="flex-1 mt-5">
                    <FloatLabel>
                        <InputText id="nameInput" name="name" type="text" class="w-full" v-model="editPatient.name" />
                        <label for="nameInput">Nombre del Paciente</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex-1">
                    <FloatLabel>
                        <InputText id="ageInput" name="age" type="text" class="w-full" v-model="editPatient.age" />
                        <label for="ageInput">Edad</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
                <div class="flex-1">
                    <FloatLabel>
                        <InputText id="statusInput" name="status" type="text" class="w-full"
                            v-model="editPatient.status" />
                        <label for="statusInput">Estatus</label>
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error?.message }}</Message>
                    </FloatLabel>
                </div>
            </div>
        </Form>
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
