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
const selectSpeciality = ref('Todas')
var arrSpeciality = ref([])


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

    window.open('https://api.whatsapp.com/send?phone=584165017110&text=Hola.! Quisiera agendar una cita con '
        + gen + ' '
        + name.charAt(0).toUpperCase() + name.slice(1) + ' '
        + lastname.charAt(0).toUpperCase() + lastname.slice(1)
        , '_blank');
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
    if (!search.value) {
        doctors.value = await getDoctors()

    }
    const lowerCaseSearchTerm = search.value.toLowerCase();
    doctors.value = await getDoctors()
    doctors.value = doctors.value.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm)
        || item.lastname.toLowerCase().includes(lowerCaseSearchTerm)
        || item.speciality.some(speciality => speciality.toLowerCase().includes(lowerCaseSearchTerm))
    );
};

const allDoctorsParamMovil = async (event) => {
    // selectSpeciality.value = event;
    console.log(selectSpeciality.value)
    loadDoctors.value = true;
    if (selectSpeciality.value == 'Todas' || selectSpeciality.value == 'TODAS') {
        all();
    } else {
        allDoctorsParam(selectSpeciality.value)
    }

};



// ** IMAGENES DE PRUEBA **
const rutasImgPerfilPrueba = [
    'MEDICO0.webp',
    'MEDICO1.webp',
    'MEDICO2.webp',
    'MEDICO3.webp',
    'MEDICO4.webp',
]


const getImageUrl = (imageName) => {
    // `import.meta.url` es la URL del módulo actual.
    // `../assets/${imageName}` es la ruta relativa desde este archivo al asset.
    return new URL(`../assets/${imageName}`, import.meta.url).href;
};

// ** FIN IMAGENES DE PRUEBA **



onMounted(async () => {
    all()
    specialities.value = await getSpecialities()

    arrSpeciality.value.push({ name: 'Todas' })
    specialities.value.forEach((speciality, index) => {
        arrSpeciality.value.push({ name: speciality.name })

    });

    // Asignar imágenes de perfil de prueba a los doctores
    doctors.value = doctors.value.map((doctor, index) => {
        // doctor.profilePhoto = rutasImgPerfilPrueba[index % rutasImgPerfilPrueba.length]
        // return { ...doctor, profilePhoto: rutasImgPerfilPrueba[index] }
        const nombreDeArchivo = rutasImgPerfilPrueba[index % rutasImgPerfilPrueba.length];
        return {
            ...doctor, profilePhoto: getImageUrl(nombreDeArchivo) // Asignamos la URL resuelta
        };
    })
    // Fin Asignar imágenes de perfil de prueba a los doctores

    console.log(doctors.value)
})

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
                <InputText placeholder="Buscar" v-on:keyup="searchFilter()" v-model="search" />
            </IconField>
        </div>
    </div>

    <div class="flex align-items-center gap-2 flex search-movil mr-4 ml-4">
        <IconField style="width: 100%;">
            <InputIcon>
                <font-awesome-icon icon="magnifying-glass" />
            </InputIcon>
            <InputText placeholder="Buscar" v-on:keyup="searchFilter()" v-model="search" style="width: 100%;" />
        </IconField>
    </div>

    <div class="search-directory">
        <div class="flex somos text-center">
            <Button v-if="specialities.length != 0" severity="" v-on:click="all"
                style="background: #fbfbfb; color: #004A87; border: #cbcbcb; width: 15%; margin-left: 5px; margin-right: 5px; font-size:12px; box-shadow: 3px 3px rgba(0,0,0,0.2);">TODAS</Button>
            <Button v-for="(speciality, index) in specialities" :key="index" severity=""
                v-on:click="allDoctorsParam(speciality.name)"
                style="    background: #fbfbfb; color: #004A87; border: #cbcbcb; width: 15%; margin-left: 5px; margin-right: 5px; font-size:12px; box-shadow: 3px 3px rgba(0,0,0,0.2);">{{
                    speciality.name.toUpperCase() }}</Button>
        </div>
    </div>

    <div class="search-movil m-4">
        <div class="flex somos">
            <FormField v-slot="$field" name="" style="width: 100%;">
                <label for="">Especialidades</label>
                <IconField>
                    <Select :options="arrSpeciality" checkmark :highlightOnSelect="false" optionLabel="name"
                        optionValue="name" style="width: 100%;" @change="allDoctorsParamMovil($event)"
                        v-model="selectSpeciality"/>
                </IconField>
            </FormField>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos">
            <h2>Los médicos de La Unidad Quirúrgica La Trinidad son profesionales confiables </h2></br>
            <h2>con experiencia certificada que estan dispuesto para su mejor atención </h2></br>
            <div class="p-3">
                <h1><label style="border-bottom: 6px solid green;">AGENDA UNA CONSULTA</label></h1>
            </div></br></br>
            <h2>Haciendo click en el Icono <font-awesome-icon :icon="['fas', 'calendar-check']" style="height: 30px;" />
            </h2>
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos">
            <ProgressSpinner v-if="loadDoctors" />
        </div>
    </div>

    <div class="">
        <div class="col-12 p-3 text-center somos" v-if="doctors.length == 0 && !loadDoctors">
            <h2><i>No hay resultados para mostrar.</i></h2>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <Card v-for="(doctor, index) in doctors" :key="index"
            style="background: rgba(0, 74, 135, 0.3); border-radius: 24px; margin: 0 auto; width: 100%; position: relative; overflow: hidden;">

            <!-- IMAGEN DE PERFIL - TODAS LA IMAGENES DEBEN CUMPLIR CON EL MANUAL -->
            <template #header>
                <div>
                    <img :src="doctor.profilePhoto" :alt="doctor.profilePhoto" />
                </div>
            </template>

            <template #title>
                <div class=" relative -top-12 w-full p-8 rounded-xl shadow-2xl
                     /* 💡 CLAVE: Fondo semi-transparente */
                    backdrop-blur-lg /* 💡 CLAVE: Aplica BLUR al FONDO */
                    border border-white/50 /* Borde sutil para efecto 'cristal' */
                ">
                    <h2 class="text-gray-900 font-extrabold text-2xl text-center"> {{ auxDoctor(doctor.gender) +
                        doctor.name.toUpperCase() }} <br /> {{
                            doctor.lastname.toUpperCase()
                        }} <font-awesome-icon :icon="['fas', 'circle-check']" v-if="doctor.verify == 'Verificado'" class="text-blue-500" />
                    </h2>
                </div>

            </template>

            <!-- PERFIL DEL MEDICO -->
            <template #content>

                <div class="relative -top-5 flex flex-col gap-2">
                    <p v-for="(speciality, index) in doctor.speciality"> 
                        <font-awesome-icon :icon="['fas', 'building-columns']" /> {{ speciality }}</p>

                    <p v-if="doctor.work_schedule" ><font-awesome-icon :icon="['fas', 'calendar-days']" />
                        <!-- REEMPLAAR POR EL HORARIO REAL -->
                        Lunes 8am - 5pm</p>

                    <p v-if="doctor.address"><font-awesome-icon :icon="['fas', 'location-dot']" />
                        <!-- REEMPLAAR POR INFORMACION REAL REAL -->
                        Unidad Quirurgica La Trinidad Consultorio 15
                    </p>

                    <p><font-awesome-icon :icon="['fas', 'clock']" />{{
                        doctor.experience ? doctor.experience : 1 }} años+
                    </p>
                </div>
            </template>

            <template #footer class="relative -top-5">
                <div class="text-center content-buttons absolute bottom-0">
                    <Button class="p-3" label="Ver más" icon="pi pi-video" severity="secondary"
                        style="margin-right: 10px;" @click="showDialog"></Button>
                    <Button class="p-3" label="Agendar" icon="pi pi-calendar" iconPos="right" severity="success"
                        v-on:click="schedule(doctor.gender, doctor.name, doctor.lastname, doctor.speciality)"></Button>
                </div>
            </template>
        </Card>
    </div>

    <Dialog v-model:visible="visibleShow" modal style="width: 80%" maximizable>
        <template #header>
            <div class=" align-items-center gap-2">
                <h1 style="display: inline;" class="ml-2">Sección en construccion</h1>
            </div>
        </template>
    </Dialog>

</template>

<style>
.content-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
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

</style>
