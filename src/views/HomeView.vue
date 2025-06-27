<script setup>
import { ref } from 'vue'
import LaTrinidadBanner from '@/components/LaTrinidadBanner.vue';
import Odometer from '@/components/Odometer.vue'
import Router from '@/router'

const cards = [
  {
    icon: 'comment-dollar',
    content: 'Conoce Nuestros planes de financiamiento y adquiere tu servicio de salud pagando en cuotas y sin interes',
    buttonLabel: 'Planes',
    to: 'plans',
  },
  {
    icon: 'book-medical',
    content: 'Explora nuestro directorio de medicos Especialistas y selecciona la consulta que se adapte a tu necesidad',
    buttonLabel: 'Directorio',
    to: 'directory',
  },
  {
    icon: 'calendar-days',
    content: 'Reserva una cita con solo hacer click en el boton, paga tu consulta en linea y evita largas esperas',
    buttonLabel: 'Reservas',
    to: 'services',
  },
  {
    icon: 'heart-pulse',
    content: 'Nueva Unidad de Cardiologia, Consulta cardiologica especializada, mapa, holter, eco cardiograma',
    buttonLabel: 'Cardiologia',
    to: 'services',
  },
];

// Seting up the carousel items
const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
])

const testimonials = [
  {
    text: 'Buenas tardes Super espectacular y muy agradecida por su atencion, 100% recomendada...',
    patient: 'Jennire',
    icon: 'face-smile-beam',
  },
  {
    text: 'Quiero expresar mis mas sincero agradecimiento por el paoyo excepcional que nos brindó su clinica. Realmente Apreciamos la capacidad de respuesta y la voluntad de su equipo de trabajo pa ir mas alla de su labor...',
    patient: 'Valeria Accettura',
    icon: 'face-smile-beam',
  },
  {
    text: ' mi cesarea fue de lo mejor. Hace pocas horas y aca estoy super feliz y tranquila gracias a todo el equipo.',
    patient: 'Milita',
    icon: 'face-smile-beam',
  },
  {
    text: 'Mi cesarea tambien fue en la trinidad y todo fue excelente. La Dra Anahil un 1000/10 y el trato de la enfermeras es una maravilla, todos son muy amables y serviciales',
    patient: 'mrosales97',
  },
  {
    text: 'Muchas Gracias por todo, los medicos y las enfermeras super profesionales y atentos muy buen servicio, agradecida',
    patient: ''
  },
  {
    text: 'La seguridad la sentí desde que entré a la clínica.. el personal en todos los ámbitos son seres maravillosos que hacen la estadía del paciente como si estuviera en casa.. realmente mil bendiciones a todos y agradecida por la oportunidad de dedicarme esa cirugía tal laboriosa y los más grande mí exitosa..🙌🙌',
    patient: 'Amarilis Mujica'
  },
  {
    text: 'Su Servicio fue exepcional y merece reconocimiento para todo el equipo medico, administrativo y obrero. Trasnmita mi gratitudpor su arduo trabajo. Saludos Cordiales',
    patient: 'Valeria Accettura',
    icon: 'face-smile-beam',
  },

]

const goTo = (route) => {
  Router.push({ name: route })
}


</script>

<template>
  <div class="flex flex-col">
    <LaTrinidad-banner />

    <!-- <InputNumber v-model="pos" inputId="minmax-buttons" mode="decimal" showButtons :min="-360" :max="0" fluid
    :step="40" /> -->

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 justify-around w-full bg-welfare p-5 rounded-xl mt-1">
      <Card class="w-full">
        <template #content>
          <div class="flex w-full text-3xl text-vitality justify-center mb-3">
            Cirugias Realizadas
          </div>
          <div class="w-full h-2 mb-5 bg-hope"></div>
          <!-- ! hltml odometer -->
          <div class="flex w-full justify-center bg-vitality rounded-xl p-5">
            <Odometer number="0014" class="text-white" /><span class="text-white text-3xl ml-1">mil+</span>
          </div>
          <!-- ! hltml odometer -->
        </template>
      </Card>
      <Card class="">
        <template #content>
          <div class="flex w-full text-3xl text-vitality justify-center mb-3">
            Medicos de Cortesia
          </div>
          <div class="w-full h-2 mb-5 bg-hope"></div>
          <!-- ! hltml odometer -->
          <div class="flex w-full justify-center bg-vitality rounded-xl p-5">
            <Odometer number="0535" class="text-white" />
          </div>
          <!-- ! hltml odometer -->
        </template>
      </Card>
      <Card class="">
        <template #content>
          <div class="flex w-full text-3xl text-vitality justify-center mb-3">
            Años de Servicio
          </div>
          <div class="w-full h-2 mb-5 bg-hope"></div>
          <!-- ! hltml odometer -->
          <div class="flex w-full justify-center bg-vitality rounded-xl p-5">
            <Odometer number="0027" class="text-white" />
          </div>
          <!-- ! hltml odometer -->
        </template>
      </Card>
    </div>

    <div class="w-full p-5 text-center text-lg/8 md:text-2xl py-20 relative overflow-hidden mt-5">
      <img src="../assets/logo-large-blue.svg" alt="La Trinidad Logo" class="mx-auto w-3/5 md:w-1/5 mb-1" />
      <div class="bg-hope w-70 h-2 mx-auto mb-4"></div>
      <div class="border-4 border-sky-800 mx-2 md:mx-60 rounded-4xl p-5">
        Nos dedicamos a brindar servicios de salud integrales con los más altos
        estándares de calidad. Contamos con tecnología de vanguardia, un equipo médico altamente calificado y un
        enfoque centrado en el bienestar <br /><br /> Nuestros pacientes lo confirman:
      </div>
      <div class="w-1/5 h-40 bg-vitality rounded-4xl absolute" style="top: 5vh; left:-10%; transform: rotate(-60deg);">

      </div>
      <div class="w-1/8 h-80 bg-hope rounded-4xl absolute" style="bottom:0; right:-10%;">
      </div>
    </div>

    <div class="bg-vitality w-full py-10">
      <Carousel :value="testimonials" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular
        :autoplayInterval="3000">
        <template #item="slotProps">

          <div class="h-80 m-10 relative">
            <div class="h-80 w-full bg-life rounded-3xl outline-2 outline-offset-2 outline-stone-200"></div>
            <div class="flex flex-col h-60 justify-around p-6 text-white absolute top-15 card-testimonials testimonial-scll">
              <!-- <font-awesome-icon icon="face-smile-beam" size="2xl" /> -->
              <span class="text-center">Testimonio</span>
              <span class="text-center">"{{ slotProps.data.text }}" </span>
              <div class="text-end w-full">{{ slotProps.data.patient }}.</div>
            </div>
          </div>

        </template>
      </Carousel>
    </div>


  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-5 m-5">
    <div v-for="(card, index) in cards" :key="index"
      class="my-5 p-10 rounded-lg shadow-lg shadow-indigo-500/50 flex flex-col justify-between">
      <div class="text-center mb-5">
        <font-awesome-icon :icon="card.icon" class="text-6xl text-welfare" />
      </div>
      <h3>{{ card.content }}</h3>
      <Button class="bg-vitality w-full" @click="goTo(card.to)">{{ card.buttonLabel }}</Button>
    </div>
  </div>



  <div class="flex flex-col md:w-8/10 text-white m-auto mb-5 bg-vitality rounded-xl m-5">
    <div class="text-4xl text-center">Nuestra Infraestructura</div>
    <div class="text-2xl text-center">Respalda Su Seguridad</div>
    <div class="w-1/2 h-2 mb-5 bg-hope m-auto"></div>
  </div>
  <div class="grid grid-cols-6 gap-5">
    <div class="md:col-start-2 col-span-3 md:col-span-2 rounded-xl flex flex-col p-10 shadow-lg shadow-indigo-500/50">
      <div class="text-vitality text-2xl">Moderna Area Quirugica</div>
      <div class="w-20 h-2 mb-5 bg-hope"></div>
      <div class="hidden md:block">Nuestra área quirúrgica posee dos pabellones de 30 m² cada uno, equipados con
        tecnología de vanguardia para procedimientos seguros y eficientes.
        Contamos con confortables áreas de recuperación, sistemas de gases medicinales y respaldo eléctrico
        ininterrumpido.
        Todo bajo estrictas normativas, asegurando máxima esterilidad y seguridad en cada intervención.</div>
    </div>
    <div class="col-span-3 md:col-span-2 rounded-xl p-2 inset-shadow-sm">
      <img src="../assets/pabellon-1.jpg" alt="" class="rounded-xl">
    </div>
    <div class="md:col-start-2 col-span-3 md:col-span-2 rounded-xl p-2 inset-shadow-sm">
      <img src="../assets/UCI-1.jpg" alt="" class="rounded-xl">
    </div>
    <div class="md:col-start-4 col-span-3 md:col-span-2 rounded-xl flex flex-col p-10 shadow-lg shadow-indigo-500/50">
      <div class="text-vitality text-2xl">Unidad de Cuidados Intensivos</div>
      <div class="w-20 h-2 mb-5 bg-hope"></div>
      <div class="hidden md:block">Nuestra área de Cuidados Intensivos está equipada con tecnología de vanguardia para
        el
        monitoreo y soporte de pacientes críticos. Contamos con un equipo de enfermería altamente especializado y
        médicos
        especialistas en medicina crítica.
        Todo bajo el liderazgo del Dr. Eugenio Desaya, un referente con más de 30 años de experiencia en medicina
        crítica,
        garantizando la mejor atención para cada paciente.</div>
    </div>
    <div class="md:col-start-2 col-span-3 md:col-span-2 rounded-xl flex flex-col p-10 shadow-lg shadow-indigo-500/50">
      <div class="text-vitality text-2xl">UCI Neonatal</div>
      <div class="w-20 h-2 mb-5 bg-hope"></div>
      <div class="hidden md:block">Nuestra Unidad de Cuidados Intensivos Neonatales está equipada con tecnología de
        vanguardia para ofrecer la mejor atención a los recién nacidos que requieren cuidados especiales.
        Contamos con un talento humano altamente calificado, integrado por médicos y enfermeras especialistas, todos
        bajo
        la dirección de la Dra. Alessandra Marotta, garantizando el bienestar y la recuperación de nuestros pequeños
        pacientes.</div>
    </div>
    <div class="col-span-3 md:col-span-2 rounded-xl p-2 inset-shadow-sm">
      <img src="../../public/UCIN1.svg" alt="" class="rounded-xl">
    </div>
  </div>

</template>
