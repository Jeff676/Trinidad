<script setup>
import { ref } from 'vue';
// import { z } from 'zod';

// Objeto reactivo para almacenar todos los datos del doctor
// const doctorData = ref({
//     informacionBasica: { nombreCompleto: '' },
//     datosProfesionales: { especialidad: '' },
//     datosBancarios: { numeroDeCuenta: '' },
//     documentacion: { cedulaProfesional: '' }
// });

const doctorData = ref({
    cedula: '',
    name: '',
    lastname: '',
    address: '',
    phone: '',
})

const disabled = ref(true)

const onSubmit = () => {
    console.log("Form Works!", doctorData)
}

</script>
<template>
    <form @submit.prevent="onSubmit">
        <Stepper value="1">
            <StepList>
                <Step value="1">BIENVENIDA</Step>
                <Step value="2">Datos Basicos</Step>
                <Step value="3">Datos Profesionales</Step>
                <Step value="4">Datos Bancarios</Step>
                <Step value="5">Documentacion</Step>
                <Step value="6">Fin</Step>
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
                                <InputText id="cedula" v-model="doctorData.cedula" />
                                <Button label="Validar y continuar" @click="disabled = false" />
                                <!-- <InputText id="nombreCompleto" v-model="nombreCompleto" :class="{ 'p-invalid': errors.nombreCompleto }" /> -->
                                <!-- <small class="p-error">{{ errors.nombreCompleto || '&nbsp;' }}</small> -->
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Nombres</label>
                                <InputText id="name" v-model="doctorData.name" :disabled="disabled" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="lastname">Apellidos</label>
                                <InputText id="lastname" v-model="doctorData.lastname" :disabled="disabled" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="address">Direccion Fiscal</label>
                                <InputText id="address" v-model="doctorData.address" :disabled="disabled" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="phone">Telefono</label>
                                <InputText id="phone" v-model="doctorData.phone" :disabled="disabled" />
                            </div>

                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('1')" />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                                    @click="activateCallback('3')" />
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
                                <label for="cedula">Colegio de Medicos</label>
                                <InputText id="cedula" v-model="doctorData.cedula" />
                                <!-- <InputText id="nombreCompleto" v-model="nombreCompleto" :class="{ 'p-invalid': errors.nombreCompleto }" /> -->
                                <!-- <small class="p-error">{{ errors.nombreCompleto || '&nbsp;' }}</small> -->
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Ministerio del PPP la Salud</label>
                                <InputText id="name" v-model="doctorData.name" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="lastname">Especialidad</label>
                                <InputText id="lastname" v-model="doctorData.lastname" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="address">Telefono de Consultorio (opcional)</label>
                                <InputText id="address" v-model="doctorData.address" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="phone">Correo Electronico</label>
                                <InputText id="phone" v-model="doctorData.phone" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <p class="font-bold">Si lo deseas puedes escribir una breve reseña de quien eres
                                    como Medico</p>
                                <label for="phone">Perfil del Medico</label>
                                <InputText id="phone" v-model="doctorData.phone" />
                            </div>

                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('2')" />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
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
                                <InputText id="cedula" v-model="doctorData.cedula" />
                                <!-- <InputText id="nombreCompleto" v-model="nombreCompleto" :class="{ 'p-invalid': errors.nombreCompleto }" /> -->
                                <!-- <small class="p-error">{{ errors.nombreCompleto || '&nbsp;' }}</small> -->
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Numero de Cuenta</label>
                                <InputText id="name" v-model="doctorData.name" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Telefono asociado a pago movil</label>
                                <InputText id="name" v-model="doctorData.name" />
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex justify-center mt-10 gap-5">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('3')" />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
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
                                <label for="cedula">Titulo Unversitario Pre Grado</label>
                                <InputText id="cedula" v-model="doctorData.cedula" />
                                <!-- <InputText id="nombreCompleto" v-model="nombreCompleto" :class="{ 'p-invalid': errors.nombreCompleto }" /> -->
                                <!-- <small class="p-error">{{ errors.nombreCompleto || '&nbsp;' }}</small> -->
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="name">Titulo Unversitario Post Grado</label>
                                <InputText id="name" v-model="doctorData.name" />
                            </div>
                            <div class="flex flex-col gap-2 mt-4">
                                <label for="lastname">Otro</label>
                                <InputText id="lastname" v-model="doctorData.lastname" />
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex justify-between pt-6">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('4')" />
                                <Button label="ver paso 6" severity="secondary" icon="pi pi-arrow-left"
                                    @click="activateCallback('6')" />
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