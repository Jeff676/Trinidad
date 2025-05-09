<script setup>
import { onMounted, reactive, ref } from 'vue'

import { getDoctors, getSpecialities } from '../firebase/doctors'

var doctors = ref([])
var specialities = ref([])

onMounted(async () => {
    doctors.value = await getDoctors()
    specialities.value = await getSpecialities()
})
</script>

<template>
    <div class="grid grid-nogutter somos">
        <div class="col-4">
            <h1>DIRECTORIO MEDICO</h1>
        </div>
        <div class="col-4"></div>
        <div class="col-4">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText id="over_label" autocomplete="off" />
            </IconField>
        </div>
    </div>
    <div class="col-12 flex">
        <div class="col-1 somos text-center">
            <Button severity="secondary" >TODAS</Button>
        </div>
        <div v-for="(speciality, index) in specialities" :key="index" class="col-1 somos text-center">
            <Button severity="secondary" >{{ speciality.name.toUpperCase() }}</Button>
        </div>
    </div>

    <div class="col-12 p-3 text-center somos">
      <h2>Los médicos de La Unidad Quirúrgica La Trinidad son profesionales confiables </h2></br>
      <h2>con experiencia certificada que estan dispuesto para su mejor atención </h2></br>
      <h1>AGENDA UNA CONSULTA </h1></br>
      
      <h2>Haciendo click en el Icono <font-awesome-icon :icon="['fas', 'calendar-check']" style="height: 30px;"/></h2>
    </div>

    <div class="col-12 flex">
        <div v-for="(doctor, index) in doctors" :key="index" class="col-3 somos">
            <Card style="width: 25rem; overflow: hidden; background: #b1c7da; border-radius: 20px;">
                <template #content class="flex flex-column align-items-center">
                    <img src="../assets/nurse-1.png" alt="">
                    <div style="background-image: url('../assets/DrFernandoColmenares.png')">
                        <h3>DR. {{ doctor.name.toUpperCase() }}</h3>
                        <h3>{{ doctor.lastname.toUpperCase() }}</h3>
                        <p>{{ doctor.speciality.toUpperCase() }}</p>
                        <p>{{ doctor.experience.toUpperCase() }}</p>
                        <p><font-awesome-icon :icon="['fas', 'clock']" style="width: 20px;"/> 5</p>
                    </div>
                    <Button label="Ver más" icon="pi pi-user" severity="secondary"></Button>
                    <Button label="Agendar" icon="pi pi-check" iconPos="right" severity="success"></Button>
                </template>
            </Card>
        </div>

    </div>
</template>