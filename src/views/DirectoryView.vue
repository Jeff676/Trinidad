<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getDoctors, getSpecialities, getDoctorsFind, searchDirectory } from '../firebase/doctors'
import PageUnderConstruction from '@/components/PageUnderConstruction.vue'


var doctors = ref([])
var specialities = ref([])
const search = ref(null);
const loadDoctors = ref(false);
const error = ref(null);
const visibleShow = ref(false)
const selectSpeciality = ref()
var arrSpeciality = ref([])

onMounted(async () => {
    all()
    specialities.value = await getSpecialities()

    arrSpeciality.value.push( {name: 'Todas'})
    specialities.value.forEach((speciality, index) => {
        arrSpeciality.value.push({name: speciality.name})

    });
})

const showDialog = () => {
    visibleShow.value = true
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

const schedule = async (gender, name, lastname, speciality) => {
    var gen = genDoctor(gender)

    window.open('https://api.whatsapp.com/send?phone=584165017110&text=Hola.! Quisiera agendar una cita de  '
                + speciality.charAt(0).toUpperCase() + speciality.slice(1) +' con ' 
                + gen  + ' ' 
                + name.charAt(0).toUpperCase() + name.slice(1) + ' ' 
                + lastname.charAt(0).toUpperCase() + lastname.slice(1)
            ,'_blank');
};


const auxDoctor = (value) => {
    switch (value) {
        case 'Femenino':
            return 'DRA. '
        default:
            return 'DR. '
    }
    
}

const genDoctor = (value) => {
    switch (value) {
        case 'Femenino':
            return 'la Dra. '
        default:
            return 'el Dr. '
    }
    
}

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

const searchFilter = async () => {
    loadDoctors.value = true;
    try {
        if(search.value == ''){
            doctors.value = await getDoctors()
        }else{
            doctors.value = await searchDirectory(search.value)
        }
        if (!doctors.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loadDoctors.value = false;
    }
};

const allDoctorsParamMovil = async (event) => {
    // selectSpeciality.value = event;
    console.log(selectSpeciality.value)
    loadDoctors.value = true;
    if(selectSpeciality.value == 'Todas'){
        all();
    }else{
        allDoctorsParam(selectSpeciality.value)
    }
    
};

</script>

<template>
    <div class="p-4 flex justify-content-between">
        <div class="flex align-items-center gap-2 somos">
            <h1>DIRECTORIO MEDICO</h1>
        </div>
        <div class="flex align-items-center gap-2 search-directory">
            <IconField>
                <InputIcon>
                    <font-awesome-icon icon="magnifying-glass" />
                </InputIcon>
                <InputText placeholder="Buscar" v-on:keyup="searchFilter()" v-model="search"/>
            </IconField>
        </div>
    </div>

    <div class="flex align-items-center gap-2 flex search-movil mr-4 ml-4">
        <IconField style="width: 100%;">
            <InputIcon>
                <font-awesome-icon icon="magnifying-glass" />
            </InputIcon>
            <InputText placeholder="Buscar" v-on:keyup="searchFilter()" v-model="search" style="width: 100%;"/>
        </IconField>
    </div>

    <div class="search-directory">
        <div class="flex somos text-center">
            <Button v-if="specialities.length != 0"severity="" v-on:click="all" style="background: #fbfbfb; color: #004A87; border: #cbcbcb; width: 15%; margin-left: 5px; margin-right: 5px; font-size:12px; box-shadow: 3px 3px rgba(0,0,0,0.2);">TODAS</Button>
            <Button v-for="(speciality, index) in specialities" :key="index" severity="" v-on:click="allDoctorsParam( speciality.name )" style="    background: #fbfbfb; color: #004A87; border: #cbcbcb; width: 15%; margin-left: 5px; margin-right: 5px; font-size:12px; box-shadow: 3px 3px rgba(0,0,0,0.2);">{{ speciality.name.toUpperCase() }}</Button>
        </div>
    </div>
    
    <div class="search-movil m-4">
        <div class="flex somos text-center">
            <FormField v-slot="$field" name="" style="width: 100%;">
                <IconField >
                    <InputIcon>
                        <font-awesome-icon icon="filter" />
                    </InputIcon>
                    <Select :options="arrSpeciality" checkmark :highlightOnSelect="false" optionLabel="name" optionValue="name" style="width: 100%;" @change="allDoctorsParamMovil($event)" v-model="selectSpeciality"/>
                </IconField>
            </FormField>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos">
            <h2>Los médicos de La Unidad Quirúrgica La Trinidad son profesionales confiables </h2></br>
            <h2>con experiencia certificada que estan dispuesto para su mejor atención </h2></br>
            <div class="p-3"><h1><label style="border-bottom: 6px solid green;">AGENDA UNA CONSULTA</label></h1></div></br></br>
            <h2>Haciendo click en el Icono <font-awesome-icon :icon="['fas', 'calendar-check']" style="height: 30px;"/></h2>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos">
            <ProgressSpinner v-if="loadDoctors"/>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos" v-if="doctors.length == 0 && !loadDoctors">
            <h2><i>No hay resultados para mostrar.</i></h2>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <Card v-for="(doctor, index) in doctors" :key="index" style="overflow: hidden; background: rgba(0, 74, 135, 0.3); border-radius: 24px; margin: 0 auto;">
            <template #content class="">
                <div class="flex">
                    <div style="position: absolute;">
                        <h2> {{ auxDoctor(doctor.gender) + doctor.name.toUpperCase() }}</h2>
                        <h2>{{ doctor.lastname.toUpperCase() }}</h2>
                        <p v-for="(speciality, index) in doctor.speciality"> {{ speciality.name }}</p>
                        <p class="experiencia">
                            <font-awesome-icon :icon="['fas', 'clock']" style="width: 30px;"/>{{ doctor.experience ?  doctor.experience : 1}} años+
                        </p>
                    </div>
                    <div class="img-doctor">
                        <img :src="`${doctor.profilePhoto}`" alt="Doctor">
                    </div>
                </div>
                <div class="text-center content-buttons">
                    <Button class="p-3" label="Ver más" icon="pi pi-video" severity="secondary" style="margin-right: 10px;" @click="showDialog"></Button>
                    <Button class="p-3" label="Agendar" icon="pi pi-calendar" iconPos="right" severity="success" v-on:click="schedule(doctor.gender,doctor.name,doctor.lastname,doctor.speciality)"></Button>
                </div>
                
            </template>
        </Card>
    </div>

    <Dialog v-model:visible="visibleShow" modal style="width: 70%" maximizable>
         <template #header>
            <div class=" align-items-center gap-2">
                <img src="../assets/logo-large-blue.svg" alt="La Trinidad Logo" class="mx-auto w-3/5 md:w-1/5 mb-1" />
                <h1 style="display: inline;" class="ml-2">Sección en construccion</h1>

            </div>
        </template> 
    </Dialog>

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
