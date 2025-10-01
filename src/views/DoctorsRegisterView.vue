<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSpecialities, findByDoctorId, saveDoctor, findByIdDoctor } from '/src/firebase/doctors'
import { listBanks } from '/src/stores/list'
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();


// import { z } from 'zod';

// Objeto reactivo para almacenar todos los datos del doctor
// const doctorData = ref({
//     informacionBasica: { nombreCompleto: '' },
//     datosProfesionales: { especialidad: '' },
//     datosBancarios: { numeroDeCuenta: '' },
//     documentacion: { cedulaProfesional: '' }
// });

var specialities = ref([])
var banks = ref([])

let blockInputs = ref(true)
const error = ref(null)
const activeStep = ref(0); 

var doctorFind = ref(null)

const idIdentification = ref('')
const tituloDoc = ref(null);
const tituloPostDoc = ref(null);
const otherDoc = ref(null);

const doctorData = reactive({
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
})

const disabled = ref(true)

const onSubmit = async () => {
    console.log("Form Works!", doctorData)     
    var sv = saveDoctor(doctorData);
    if(sv){
      blockInputs.value = true
      goToStep(6)
      toast.add({ severity: 'success', summary: '', detail: 'Guardado con éxito.!', life: 3000 });

    }
}

onMounted(async () => {
    specialities.value = await getSpecialities()
    banks.value = listBanks;

})

const checkDoctor = async () => {
        if(idIdentification.value.length >= 8){
            try {
                doctorFind.value = await findByIdDoctor(idIdentification.value)
                console.log('--->',doctorFind.value)
                if (doctorFind.value == false){
                    blockInputs.value = false
                    toast.add({ severity: 'info', summary: '¡VERIFICACIÓN!', detail: 'Cédula verificada con exito.', life: 4000 });
                    
                }else{
                    toast.add({ severity: 'error', summary: '¡ALERTA!', detail: 'La cédula ingresada ya existe para un medico.', life: 4000 });

                }
            } catch (err) {
                error.value = err.message;
            } 
        }
}

const onTituloSelected = (event) => {
  tituloDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Documento agregado con exito.!', life: 3000 });

}

const onTituloPostSelected = (event) => {
  tituloPostDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Documento agregado con exito.!', life: 3000 });

}

const onOtherDocSelected = (event) => {
  otherDoc.value = event.target.files[0]
  toast.add({ severity: 'info', summary: 'Archivo', detail: 'Documento agregado con exito.!', life: 3000 });

}

const goToStep = (stepIndex) => {
    activeStep.value = stepIndex
    console.log(stepIndex)
}

</script>
<template>
    <form @submit.prevent="onSubmit" :doctorData>
        <Stepper value="1" v-model:value="activeStep">
            <StepList>
                <Step value="1">BIENVENIDA</Step>
                <Step value="2" :disabled="blockInputs">Datos Básicos</Step>
                <Step value="3" :disabled="blockInputs">Datos Profesionales</Step>
                <Step value="4" :disabled="blockInputs">Datos Bancarios</Step>
                <Step value="5" :disabled="blockInputs">Documentación</Step>
                <Step value="6" :disabled="true">Fin</Step>
            </StepList>

            <StepPanels class="bg-shadow">
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <img alt="user header" src="../assets/logo-large-blue.svg" class="h-48" />
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">¡Gracias por tu interés en unirte a nuestro Directorio Médico!
                            </h2>
                            <h2>Llenar este formulario te tomará solo unos minutos. Al ser parte de nuestra red, no solo
                                aumentarás tu visibilidad, sino que también te conectarás con una comunidad más amplia
                                de pacientes que buscan profesionales como tú."</h2>
                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10">
                                <Button label="¡Comencemos!" icon="pi pi-arrow-right" iconPos="right"
                                    @click="activateCallback('2')" />
                            </div>
                        </template>
                    </Card>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="2">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <h1 class="mt-10">DATOS BASICOS</h1>
                            <div class="bg-vitality h-2"></div>
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">Necesitamos algunos datos básicos para identificar tu perfil
                            </h2>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="cedula">Cedula de Identidad</label>
                                <InputText id="identification" v-model="idIdentification" placeholder="V0000000"/>
                                <Button label="Validar y continuar" @click="checkDoctor" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Nombres</label>
                                <InputText id="name" v-model="doctorData.name" :disabled="blockInputs" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="lastname">Apellidos</label>
                                <InputText id="lastname" v-model="doctorData.lastname" :disabled="blockInputs" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="address">Direccion Fiscal</label>
                                <InputText id="address" v-model="doctorData.address" :disabled="blockInputs" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="phone01">Telefono</label>
                                <InputText id="phone01" v-model="doctorData.phone01" v-phone-mask :maxlength="15" :disabled="blockInputs" />
                            </div>

                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('1')" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="activateCallback('3')" :disabled="blockInputs"/>
                            </div>
                        </template>
                    </Card>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="3">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <h1 class="mt-10">DATOS PROFESIONALES</h1>
                            <div class="bg-vitality h-2"></div>
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">Comparte tus datos profesionales para que los pacientes te
                                encuentren fácilmente.</h2>
                            <h3>Si un dato no aplica, puedes dejarlo en blanco</h3>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="cmv">Colegio de Medicos</label>
                                <InputText id="cmv" v-model="doctorData.cmv" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="mppps">Ministerio del PPP la Salud</label>
                                <InputText id="mppps" v-model="doctorData.mppps" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="speciality">Especialidad</label>
                                <!-- <InputText id="lastname" v-model="doctorData.lastname" /> -->
                                <MultiSelect name="speciality" display="chip" :options="specialities" optionLabel="name" optionValue="name" :maxSelectedLabels="4" class="w-full"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="phoneInstitution">Telefono de Consultorio (opcional)</label>
                                <InputText id="phoneInstitution" v-model="doctorData.phoneInstitution" v-phone-mask :maxlength="15"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="email">Correo Electronico</label>
                                <InputText id="email" v-model="doctorData.email" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <p class="font-bold">Si lo deseas puedes escribir una breve reseña de quien eres
                                    como Medico</p>
                                <label for="summary">Perfil del Medico</label>
                                <Textarea name="summary" v-model="doctorData.summary" autoResize rows="5" cols="30" />
                            </div>

                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('2')" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="activateCallback('4')" />
                            </div>
                        </template>
                    </Card>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="4">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <h1 class="mt-10">DATOS BANCARIOS</h1>
                            <div class="bg-vitality h-2"></div>
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">Esta información es opcional, pero es necesaria para que podamos
                                procesar cualquier pago o transacción relacionada con nuestros servicios</h2>
                            <h3>Si un dato no aplica, puedes dejarlo en blanco</h3>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="cedula">Nombre del Banco</label>
                                <Select id="bank" v-model="doctorData.bank" :options="listBanks" optionLabel="name" optionValue="name" />
                                <!-- <InputText id="nombreCompleto" v-model="nombreCompleto" :class="{ 'p-invalid': errors.nombreCompleto }" /> -->
                                <!-- <small class="p-error">{{ errors.nombreCompleto || '&nbsp;' }}</small> -->
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="bankAcount">Numero de Cuenta</label>
                                <InputText id="bankAcount" v-model="doctorData.bankAcount" maxlength="20"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="bankpm">Telefono asociado a pago movil</label>
                                <InputText id="bankpm" v-model="doctorData.bankpm" v-phone-mask :maxlength="15"/>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('3')" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="activateCallback('5')" />
                            </div>
                        </template>
                    </Card>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="5">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <h1 class="mt-10">DOCUMENTACION</h1>
                            <div class="bg-vitality h-2"></div>
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">Adjuntar tus documentos es opcional, pero te permite obtener un
                                distintivo de Perfil Verificado en nuestro directorio. Esto genera mayor confianza en
                                los pacientes y te diferencia de otros profesionales</h2>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="titulo">Titulo Unversitario Pre Grado</label>
                                <input type="file" id="titulo" @change="onTituloSelected" accept="image/*, application/pdf"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="titulopost">Titulo Unversitario Post Grado</label>
                                <input type="file" id="titulopost" @change="onTituloPostSelected" accept="image/*, application/pdf"/>
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="titulopost">Otro</label>
                                <input type="file" id="titulopost" @change="onOtherDocSelected" accept="image/*, application/pdf"/>

                            </div>
                        </template>
                        <template #footer>
                            <div class="flex justify-between pt-6">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('4')" />
                                <!-- <Button label="ver paso 6" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('6')" /> -->
                                <Button label="Enviar Registro" icon="pi pi-check" type="submit" />
                            </div>
                        </template>
                    </Card>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="6">
                    <Card class="flex-auto flex items-center font-medium">
                        <template #header>
                            <h1 class="mt-10">Finalmente</h1>
                            <div class="bg-vitality h-2"></div>
                        </template>
                        <template #content class=" bg-shadow">
                            <h2 class="text-2xl mb-3">Estimado/a Dr./Dra. [Apellido del médico]</h2>
                            <p>En nombre de la UNIDAD QUIRURGICA LA TRINIDAD, c.a. queremos darte la bienvenida a
                                nuestra plataforma. Estamos encantados de que te hayas unido a nuestra creciente
                                comunidad de profesionales de la salud. Para mantenerte al día de las últimas noticias,
                                debates y oportunidades, te invitamos a unirte a nuestro grupo de WhatsApp a través de
                                este enlace:
                            </p>
                            <Button label="Unete a nuestra Comunidad de Whatsapp" variant="link" />
                            <h2>¡Esperamos verte allí!</h2>
                        </template>
                        <template #footer>
                            <img alt="user header" src="../assets/logo-large-blue.svg" class="h-48 mx-auto my-10" />
                        </template>
                    </Card>
                </StepPanel>
            </StepPanels>
        </Stepper>
    </form>
    
</template>

<style>

input[type="file"]::file-selector-button {
  background-color: #004a87; /* Green background */
  color: white; /* White text */
  padding: 10px 15px; /* Padding for the button */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
}
</style>