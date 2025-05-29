<script setup>
import { onMounted, reactive, ref } from 'vue'

import { getDoctors, getSpecialities, getDoctorsFind } from '../firebase/doctors'

var doctors = ref([])
var specialities = ref([])
const search = ref(null);
const loadDoctors = ref(false);
const error = ref(null);

onMounted(async () => {
    doctors.value = await getDoctors()
    specialities.value = await getSpecialities()
})

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


const allDoctorsParam = async (speciality) => {
      loadDoctors.value = true;
      try {
        doctors.value = await getDoctorsFind(speciality)
        if (!doctors.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loadDoctors.value = false;
      }
    };

</script>

<template>

    <div class="p-4 flex justify-content-between">
        <div class="flex align-items-center gap-2 somos">
            <h1>DIRECTORIO MEDICO</h1>
        </div>
        <div class="flex align-items-center gap-2">
            <IconField>
                <InputIcon>
                    <font-awesome-icon icon="magnifying-glass" />
                </InputIcon>
                <InputText  placeholder="Buscar" />
            </IconField>
        </div>
    </div>

    <div class="">
        <div class="flex somos text-center">
            <Button v-if="specialities.length != 0"severity="secondary" v-on:click="all" style="width: 60%; margin-left: 10px; margin-right: 10px;">TODAS</Button>
            <Button v-for="(speciality, index) in specialities" :key="index" severity="secondary" v-on:click="allDoctorsParam( speciality.name )" style="width: 60%; margin-left: 10px; margin-right: 10px;">{{ speciality.name.toUpperCase() }}</Button>
        </div>
    </div>
    
    <div class="">
        <div class="col-12 p-3 text-center somos">
            <h2>Los médicos de La Unidad Quirúrgica La Trinidad son profesionales confiables </h2></br>
            <h2>con experiencia certificada que estan dispuesto para su mejor atención </h2></br>
            <h1>AGENDA UNA CONSULTA </h1></br>
            <h2>Haciendo click en el Icono <font-awesome-icon :icon="['fas', 'calendar-check']" style="height: 30px;"/></h2>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos">
            <ProgressSpinner v-if="loadDoctors"/>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos" v-if="doctors.length == 0">
            <h2><i>No hay resultados para mostrar.</i></h2>
        </div>
    </div>

    <div  class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card v-for="(doctor, index) in doctors" :key="index" style="overflow: hidden; background: rgba(0, 74, 135, 0.3); border-radius: 24px; margin: 0 auto;">
            <template #content class="">
                <div class="flex">
                    <div>
                        <h3>DR. {{ doctor.name.toUpperCase() }}</h3>
                        <h3>{{ doctor.lastname.toUpperCase() }}</h3>
                        <p>{{ doctor.speciality.toUpperCase() }}</p>
                        <p class="experiencia">
                            <font-awesome-icon :icon="['fas', 'clock']" style="width: 30px;"/>{{ doctor.experience.toUpperCase() }}
                        </p>
                    </div>
                    <div>
                        <img :src="`../../public/Dra-Marielbys-Guerra.png`" alt="" style="width: 100%; height: 100%;">
                    </div>
                </div>
                <div class="text-center content-buttons">
                    <Button class="p-3" label="Ver más" icon="pi pi-video" severity="secondary" style="margin-right: 10px;"></Button>
                    <Button class="p-3" label="Agendar" icon="pi pi-calendar" iconPos="right" severity="success"></Button>
                </div>
                
            </template>
        </Card>
    </div>

    <!-- <div class="p-4">
        <div v-for="(doctor, index) in doctors" :key="index" class="col-12 md:col-6 lg:col-3 somos">
            <Card style="overflow: hidden; background: rgba(0, 74, 135, 0.3); border-radius: 24px; margin: 0 auto;">
                <template #content class="flex flex-column align-items-center">
                    <div class="flex">
                        <div>
                            <h3>DR. {{ doctor.name.toUpperCase() }}</h3>
                            <h3>{{ doctor.lastname.toUpperCase() }}</h3>
                            <p>{{ doctor.speciality.toUpperCase() }}</p>
                            <p class="experiencia">
                                <font-awesome-icon :icon="['fas', 'clock']" style="width: 30px;"/>{{ doctor.experience.toUpperCase() }}
                            </p>
                        </div>
                        <div>
                            <img :src="`../../public/Dra-Marielbys-Guerra.png`" alt="" style="width: 100%; height: 100%;">
                        </div>
                    </div>
                    <div class="text-center content-buttons">
                        <Button class="p-3" label="Ver más" icon="pi pi-video" severity="secondary" style="margin-right: 10px;"></Button>
                        <Button class="p-3" label="Agendar" icon="pi pi-calendar" iconPos="right" severity="success"></Button>
                    </div>
                    
                </template>
            </Card>
        </div>        
    </div> -->

</template>

<style>
.content-buttons{
    display: flex;
    justify-content: center;
    align-items: center;
    height:80px;
    border: 1px solid white;
    position: relative;
    overflow: hidden;
    position: relative;
    z-index: 1;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.experiencia{
    display: flex;
    align-items: center;
}
</style>
