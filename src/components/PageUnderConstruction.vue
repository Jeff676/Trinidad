<script setup>
// define pros
const props = defineProps(['title'])

const schedule = async () => {
    window.open('https://wa.link/zqzhuo', '_blank');
};

</script>
<template>
    <div class="w-full p-5 text-center text-lg/8 md:text-2xl pt-20 relative overflow-hidden mt-5">
        <img src="../assets/logo-large-blue.svg" alt="La Trinidad Logo" class="mx-auto w-3/5 md:w-1/5 mb-1" />
        <div class="bg-hope w-70 h-2 mx-auto mb-4"></div>
        <div class="text-white bg-hope rounded w-1/4 m-auto p-5 my-5 text-3xl md:text-6xl title-const">{{ props.title }}</div>
        <div class="border-4 border-sky-800 mx-2 md:mx-60 rounded-4xl p-5">
            Pagina en Construcción
            <div class="text-white bg-vitality rounded w-1/4 m-auto my-2 title-const">Muy PRONTO</div>
            tendremos nuevos servicios para UD.<Br /><Br />
            <span>Contáctenos </span>
            <Button severity="success" v-on:click="schedule">Whatsapp</Button>


        </div>
        <div class="w-1/5 h-40 bg-vitality rounded-4xl absolute"
            style="top: 5vh; left:-10%; transform: rotate(-60deg);">
        </div>
        <div class="w-1/8 h-80 bg-hope rounded-4xl absolute" style="bottom:0; right:-10%;">
        </div>
    </div>
</template>
