<!-- coigo generado por deepseek revisr -->
<template>
    <div class="la-trinidad-background">
        <div class="la-trinidad-content">
            <slot></slot> <!-- Para el contenido interno -->
            <img src="../assets/logo-large.svg" alt="La Trinidad" style="width: 100%; height: auto;" />
            <div class="text-white flex align-items-start flex-column gap-2 mt-4 ml-8">
                <div>DESCUBRE NUESTRO PLAN DE AFILIACION</div>
                <div>Recibe multiples beneficios</div>
                <div>Totalmente GRATIS!</div>
            </div>
            <div class="flex mt-4">
                <Button severity="success" class="ml-8">Whatsapp</Button>
                <InputText class="mx-2" placeholder="Escribe tu numeo de Whatsapp" />
                <Button severity="success">Enviar</Button>
            </div>
        </div>
        <div class="doctor-image">
            <img src="../assets/doctor-1.png" alt="Doctor" style="height: 100%;" />
        </div>
        <div class="semi-rombo"></div>
    </div>
</template>

<script>
export default {
    name: 'LaTrinidadBackground'
}
</script>

<style scoped>
/* En tu archivo de componentes o App.vue */
.la-trinidad-background {
    background: linear-gradient(135deg, #1a3a8f 0%, #0d6e6e 100%);
    color: white;
    min-height: 80vh;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.la-trinidad-background::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
}

.doctor-image {
    position: absolute;
    bottom: 0;
    right: 5vw;
    width: auto;
    height: 95%;
    z-index: 1;
}

.semi-rombo {
    width: 50vw;
    height: 0;
    border-right: 100px solid transparent;
    border-bottom: 150px solid rgba(255, 255, 255, 0.1);
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
    max-width: 600px;
    padding: 2rem;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
</style>