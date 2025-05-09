<script setup>
import { onMounted, reactive, ref } from 'vue'

import { getDoctors, getSpecialities, getDoctorsFind } from '../firebase/doctors'

var doctors = ref([])
var specialities = ref([])
const search = ref(null);

onMounted(async () => {
    doctors.value = await getDoctors()
    specialities.value = await getSpecialities()
})

const all = async () => {
    doctors.value = await getDoctors()
}
const allDoctorsParam = async (speciality) => {
    console.log(speciality)
    doctors.value = await getDoctorsFind(speciality)
}
</script>

<template>

    <div class="grid">
        <div class="col-12 md:col-8 lg:col-8">
            <div class="">
                <h1>DIRECTORIO MEDICO</h1>
            </div>
        </div>
        <div class="col-12 md:col-4 lg:col-4">
            <div class="text-center p-3 ">
                <IconField class="p-1">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="search" placeholder="Buscar..." autocomplete="off" style="width: 90%;"/>
                </IconField>
            </div>
        </div>
        
    </div>

    <div class="grid">
        <div class="col-12 md:col-4 lg:col-1 somos text-center">
            <Button severity="secondary" v-on:click="all" style="width: 90%;">TODAS</Button>
        </div>
        <div v-for="(speciality, index) in specialities" :key="index" class="col-12 md:col-4 lg:col-1 somos text-center">
            <Button severity="secondary" v-on:click="allDoctorsParam( speciality.name )" style="width: 90%;">{{ speciality.name.toUpperCase() }}</Button>
        </div>
    </div>
    
    <div class="grid">
        <div class="col-12 p-3 text-center somos">
            <h2>Los médicos de La Unidad Quirúrgica La Trinidad son profesionales confiables </h2></br>
            <h2>con experiencia certificada que estan dispuesto para su mejor atención </h2></br>
            <h1>AGENDA UNA CONSULTA </h1></br>
            <h2>Haciendo click en el Icono <font-awesome-icon :icon="['fas', 'calendar-check']" style="height: 30px;"/></h2>
        </div>
    </div>

    <div class="grid">
        <div class="col-12 p-3 text-center somos">
            <ProgressSpinner v-if="doctors.length == 0"/>
        </div>
    </div>

    <div class="grid">
        <div class="col-12 p-3 text-center somos" v-if="doctors.length == 0">
            <h2><i>No hay resultados para mostrar.</i></h2>
        </div>
    </div>

    <div class="grid p-4">
        <div v-for="(doctor, index) in doctors" :key="index" class="col-12 md:col-6 lg:col-3 somos">
            <Card style="overflow: hidden; background: rgba(0, 74, 135, 0.3); border-radius: 24px; margin: 0 auto;">
                <template #content class="flex flex-column align-items-center">
                    <!-- <img :src="`../../public/Dra-Marielbys-Guerra.png`" alt="" style="width: 50px; height: 60px;"> -->
                    <div class="flex">
                        <div>
                            <h3>DR. {{ doctor.name.toUpperCase() }}</h3>
                            <h3>{{ doctor.lastname.toUpperCase() }}</h3>
                            <p>{{ doctor.speciality.toUpperCase() }}</p>
                            <p><font-awesome-icon :icon="['fas', 'clock']" style="width: 20px;"/>{{ doctor.experience.toUpperCase() }}</p>
                        </div>
                        <div>
                            <img :src="`../../public/Dra-Marielbys-Guerra.png`" alt="" style="width: 100%; height: 100%;">
                        </div>
                    </div>
                    <div class="text-center">
                        <Button class="p-3" label="Ver más" icon="pi pi-user" severity="secondary"></Button>
                        <Button class="p-3" label="Agendar" icon="pi pi-check" iconPos="right" severity="success"></Button>
                    </div>
                    
                </template>
            </Card>
        </div>        
    </div>

</template>
