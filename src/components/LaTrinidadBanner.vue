<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const doctorsBanner = [
    {
        id: 1,
        name: 'Dra. Yelitza Rondon',
        specialty: 'Medicina General',
        image: 'Dra-Yelitza-Rondon.png',
        socialMedia: '@DraYelitzaRondon'
    },
    {
        id: 2,
        name: 'Dra. Efigenia Farias',
        specialty: 'Otorrinolaringología',
        image: 'Dra-Efigenia-Farias.png',
        socialMedia: '@DraEfigeniaFarias'
    },
    {
        id: 3,
        name: 'Dra. Genesis Rivero',
        specialty: 'Medicina General',
        image: 'Dra-Genesis-Rivero.png',
        socialMedia: '@DraGenesisRivero'
    },
    {
        id: 4,
        name: 'Dra. Marielbys Guerra',
        specialty: 'Medicina General',
        image: 'Dra-Marielbys-Guerra.png',
        socialMedia: '@DraMarielbysGuerra'
    },
]

const items = ref(doctorsBanner)
const currentItem = ref([])
const currentIndex = ref(0)
const intervalId = ref(null)
const show = ref(false)

const selectRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.value.length)
    currentIndex.value = randomIndex
    currentItem.value = items.value[randomIndex]
    show.value = true // Mostrar el medico
    setTimeout(() => {
        show.value = false // Ocultar el medico después de 29.5 segundos
    }, 29500) // 29.5 segundos
}

const startInterval = () => {
    intervalId.value = setInterval(selectRandomItem, 30000) // 30 segundos
}

const clearIntervals = () => {
    if (intervalId.value) clearInterval(intervalId.value)
}

// Hooks del ciclo de vida
onMounted(() => {
    selectRandomItem()
    startInterval()
})

onBeforeUnmount(() => {
    clearIntervals()
})

</script>

<template>
    <div class="la-trinidad-background grid w-full">
        <div class="grid p-0">
            <div class="grid grid-cols-1 md:grid-cols-3">
                <div class="la-trinidad-content flex flex-col col-span-2 mx-4 md:mx-10 mt-10 mb-30">
                    <!-- <slot></slot>
                    Para el contenido interno -->
                    <img src="../assets/logo-large.svg" alt="La Trinidad Logo" style="width: 70%; height: auto;" />
                    <div class="flex flex-col mt-4 pl-10 w-full justify-start text-white">
                        <div>DESCUBRE NUESTRO PLAN DE AFILIACION</div>
                        <div>Recibe multiples beneficios</div>
                        <div>Totalmente GRATIS!</div>
                    </div>
                    <div class="flex justify-start my-4 pl-10">
                        <Button severity="success" class="hidden md:block">Whatsapp</Button>
                    </div>
                </div>
                <div class="p-0" style="min-height: 500px;">
                    <div class="doctor-image fadeinright animation-duration-1000 flex flex-column justify-center"
                        v-if="show">
                        <img :src="`../../public/${currentItem.image}`" alt="Doctor"
                            style="position:absolute; bottom: 0; max-height: 100%;" />
                        <div class="directory-link">
                            <a href="#">{{ currentItem.name }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slogan ml-10">
            <span>
                Somos Tu Aliado en Salud!
            </span>
            <div class="semi-rombo"></div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.la-trinidad-background {
    background: linear-gradient(135deg, #1a3a8f 0%, #0d6e6e 100%);
    color: white;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 15px 15px;
}

.la-trinidad-background::before {
    content: "";
    position: absolute;
    top: -25%;
    left: -25%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
}

.doctor-image {
    position: relative;
    height: 100%;
    z-index: 1;
}

.directory-link {
    position: absolute;
    bottom: 10vh;
    right: 5vw;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    z-index: 2;
    background-color: #1f993d;
    border-radius: 15px;
    padding: 1rem 1.5rem;
    cursor: pointer;
}

.directory-link>a {
    color: white;
    text-decoration: none;
}

.slogan {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 2rem;
    color: white;
    z-index: 5;
    border-radius: 15px;
    padding: 2rem 1.5rem;
}

.semi-rombo {
    width: 50vw;
    height: 0;
    border-right: 75px solid transparent;
    border-bottom: 100px solid rgba(255, 255, 255, 0.1);
    position: absolute;
    bottom: 0;
    left: 0;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.la-trinidad-content {
    position: relative;
    z-index: 1;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
</style>