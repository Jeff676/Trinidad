<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { getAllUsers, saveUser, existUser, getDocument, updateUser } from '/src/firebase/users'
import { useUserStore } from '/src/stores/user';

const userStore = useUserStore();
const toast = useToast();
var users = ref([])
const error = ref(null)
const load = ref(false);
let blockInputs = ref(true)
const selectedUser = ref()
const visible = ref(false)
const visibleEdit = ref(false)

var editUser = reactive([])
var document = ref()

const nameInput = ref('')
const lastnameInput = ref('')
const emailInput = ref('')
const phoneInput = ref('')
const typeInput = ref('')
const passwordInput = ref('')
const passwordConfirmInput = ref('')
const statusInput = ref('')

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const showDialog = () => {
    visible.value = true
    blockInputs.value = true
    clearForm()
}

const hideDialog = () => {
    visible.value = false
    visibleEdit.value = false
    
}  

const onRowSelect = (event) => {
    console.log('***', event)
    visibleEdit.value = true

    editUser = event.data
    getDocumentUser()
}

// *** Dialg New User *** //

// ** Reglas de validacion para el formulario de nuevo usuario ** //
const resolver = zodResolver(
    z.object({
        name: z.string().min(1, { message: 'El nombre es requerido' }),
        lastname: z.string().min(1, { message: 'El apellido es requerido' }),
        email: z.string().min(1, { message: 'El email es requerido' }),
        type: z.string().min(1, { message: 'El tipo de usuario es requerido' }),
        phone: z.string().min(1, { message: 'El telefono es requerido' }),
        password: z.string().min(1, { message: 'La contraseña es requerida' }),
        passwordConfirm: z.string().min(1, { message: 'Confirma la contraseña' }),
        status: z.string(),

    })
);

const initialValues = reactive({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    type: '',
    password: '',
    passwordConfirm: '',
    status: 'Activo',

})

const typeUsersOptions = ref([
    { letter: 'Administrativo' },
    { letter: 'Médico' },
    { letter: 'Maestro' },
])

const statusOptions = ref([
    { letter: 'Activo' },
    { letter: 'Inactivo' },
    { letter: 'Suspendido' },
])


const onFormSubmit = async ({ valid, values }) => {
    console.log('valid:', valid)
    console.log('values:', values)

    if (valid) {
        console.log('Form submitted with values:', values)
        console.log("guardar")
        try{
            //VALIDAR QUE EL USUARIO EXISTE
            var exist = await existUser(values.email)
            console.log(exist)

            if(exist >= 1){
                toast.add({ severity: 'warn', summary: '', detail: '¡El email ingresado ya existe para otro usuario.!', life: 3000 });

            }else{
                var sv = await saveUser(values);
                if(sv){
                    await userStore.createUser(emailInput.value, passwordInput.value)
                    toast.add({ severity: 'success', summary: '', detail: '¡Guardado con éxito.!', life: 3000 });
                }
            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Error al guardar', detail: '¡Ha ocurrido un error.!', life: 3000 });
        }
        users.value = await getAllUsers()

    } else {
        console.log('Form is invalid')
    }
}

const onFormSubmitUp = async ({ valid, values }) => {
    console.log('valid:', valid)
    console.log('values:', values)

    if (valid) {
        console.log('Form submitted with values:', values)
        console.log("guardar")
        try{
            //VALIDAR QUE EL USUARIO EXISTE
            var exist = await existUser(values.email)
            console.log(exist)

            if(exist == 0){
                toast.add({ severity: 'warn', summary: '', detail: '¡El email ingresado no existe.!', life: 3000 });

            }else{
                var up = await updateUser(values, document);
                if(up){
                    toast.add({ severity: 'success', summary: '', detail: 'Actualizado con éxito.!', life: 3000 });
                }
                visibleEdit.value = false

            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Error al actualizar', detail: '¡Ha ocurrido un error.!', life: 3000 });
        }
        users.value = await getAllUsers()

    } else {
        console.log('Form is invalid')
    }
}

const getUsers = async () => {
    load.value = true;
    try {
    users.value = await getAllUsers()
    if (!users.ok) {
        throw new Error('Network response was not ok');
    }
    } catch (err) {
        error.value = err.message;
    } finally {
        load.value = false;
    }
}

const activeUser = (value) => {
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

const clearForm = () =>{
    nameInput.value = ''
    lastnameInput.value = ''
    emailInput.value = ''
    phoneInput.value = ''
    typeInput.value = ''
    passwordInput.value = ''
    passwordConfirmInput.value = ''
    statusInput.value = ''
}

const getDocumentUser = async () => {
    document = await getDocument(editUser.email)

}

onMounted(async () => {
   getUsers()

})
</script>

<template>
    <div>
        <DataTable v-model:filters="filters" filterDisplay="row" :value="users" paginator
            :rows-per-page-options="[5, 10, 25]" :rows="10" stripedRows sortField="name" selectionMode="single"
            v-model:selection="selectedUser" @row-select="onRowSelect" :sortOrder="1"
            :globalFilterFields="['name', 'lastname', 'email', 'phone', 'type', 'status']">
            <template #header>
                <div class="flex justify-content-between">
                    <div class="flex align-items-center gap-2">
                        <div
                            class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                            <font-awesome-icon icon="user" size="2xl" />
                        </div>
                        <h1 style="display: inline;" class="ml-2">USUARIOS</h1>
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
                            <span>Nuevo Usuario</span>
                        </Button>
                    </div>
                </div>
            </template>
            <Column field="name" header="Nombre" sortable></Column>
            <Column field="lastname" header="Apellido" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="phone" header="Teléfono" sortable></Column>
            <Column field="type" header="Tipo usuario" sortable></Column>
            <Column field="status" header="Estatus" sortable>
                <template #body="{ data }">
                    <Badge :value="data.status" size="large" class="w-full" :class="activeUser(data.status)" />
                </template>
            </Column>
            <template #empty>
                <div class="text-center">
                    <ProgressSpinner v-if="load"/>
                </div>
            </template>           
        </DataTable>
    </div>

    <!-- * Modal Nuevo Usuario -->
    <Dialog v-model:visible="visible" modal style="width: 70%" maximizable>
        <template #header>
            <div class="flex align-items-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user" size="2xl" />
                </div>
                <h1 style="display: inline;" class="ml-2">NUEVO USUARIO</h1>
            </div>
        </template>

        <Form v-slot="$field" :initialValues @submit="onFormSubmit" :resolver>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name" initialValue="">
                    <FloatLabel>
                        <label for="nameInput">Nombre</label>
                        <InputText id="name" type="text" class="w-full" v-model="nameInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="lastname" initialValue="">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido</label>
                        <InputText id="lastname" type="text" class="w-full" v-model="lastnameInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email" initialValue="">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="email" type="text" class="w-full" v-model="emailInput" autocomplete="off"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>               
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone" initialValue="">
                    <FloatLabel>
                        <label for="phoneInput">Telefono</label>
                        <InputText id="phone" type="text" class="w-full" v-model="phoneInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="type" initialValue="">
                    <FloatLabel>
                        <label for="typeInput">Tipo de Usuario</label>
                        <Select id="type" :options="typeUsersOptions" optionLabel="letter" optionValue="letter" placeholder="Tipo de Usuario" class="w-full" v-model="typeInput"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="password" initialValue="">
                    <FloatLabel>
                        <label for="passwordInput">Contraseña</label>
                        <Password id="password" class="w-full" v-model="passwordInput" toggleMask autocomplete="off" fluid/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="passwordConfirm" initialValue="">
                    <FloatLabel>
                        <label for="passwordConfirmInput">Confirmar Contraseña</label>
                        <Password id="passwordConfirm" class="w-full" v-model="passwordConfirmInput" toggleMask autocomplete="off" fluid/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5" style="display:none;">
                <FormField class="flex-1" v-slot="$field" name="status">
                    <FloatLabel>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" placeholder="Estatus" class="w-full"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" >
                    
                </FormField>
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Guardar" class="w-full"/>
            </div>
        </Form>
        <template #footer>
            <Button @click="hideDialog" label="Cancelar" severity="secondary" />
        </template>
    </Dialog>

    <!-- * Modal Editar Usuario -->
    <Dialog v-model:visible="visibleEdit" modal style="width: 70%" maximizable>
        <template #header>
            <div class="flex align-items-center gap-2">
                <div
                    class="bg-vitality text-white border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                    <font-awesome-icon icon="user" size="2xl" />
                </div>
                <h1 style="display: inline;" class="ml-2">EDITAR USUARIO</h1>
            </div>
        </template>

        <Form v-slot="$field" :initialValues="editUser" @submit="onFormSubmitUp" :resolver>

            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="name">
                    <FloatLabel>
                        <label for="nameInput">Nombre</label>
                        <InputText id="name" type="text" class="w-full" v-model="editUser.name" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="lastname">
                    <FloatLabel>
                        <label for="lastnameInput">Apellido</label>
                        <InputText id="lastname" type="text" class="w-full" v-model="lastnameInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="email">
                    <FloatLabel>
                        <label for="emailInput">Email</label>
                        <InputText id="email" type="text" class="w-full" v-model="emailInput" autocomplete="off"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>               
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="phone">
                    <FloatLabel>
                        <label for="phoneInput">Telefono</label>
                        <InputText id="phone" type="text" class="w-full" v-model="phoneInput" />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="type">
                    <FloatLabel>
                        <label for="typeInput">Tipo de Usuario</label>
                        <Select id="type" :options="typeUsersOptions" optionLabel="letter" optionValue="letter" placeholder="Tipo de Usuario" class="w-full" v-model="typeInput"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="password" >
                    <FloatLabel>
                        <label for="passwordInput">Contraseña</label>
                        <Password id="password" class="w-full" v-model="passwordInput" toggleMask autocomplete="off" fluid disabled />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" name="passwordConfirm" >
                    <FloatLabel>
                        <label for="passwordConfirmInput">Confirmar Contraseña</label>
                        <Password id="passwordConfirm" class="w-full" v-model="passwordConfirmInput" toggleMask autocomplete="off" fluid disabled />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
            </div>
            <div class="flex gap-2 mt-5">
                <FormField class="flex-1" v-slot="$field" name="status" >
                    <FloatLabel>
                        <Select :options="statusOptions" optionLabel="letter" optionValue="letter" placeholder="Estatus" class="w-full"/>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                            $field.error?.message }}</Message>
                    </FloatLabel>
                </FormField>
                <FormField class="flex-1" v-slot="$field" >
                    
                </FormField>
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="submit" label="Actualizar" class="w-full"/>
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