<script setup>
import { ref, computed, onMounted } from 'vue'
import LaTrinidadBanner from '@/components/LaTrinidadBanner.vue';
import Odometer from '@/components/Odometer.vue';

const cards = [
  {
    icon: 'comment-dollar',
    content: 'Conoce Nuestros planes de financiamiento y adquiere tu servicio de salud pagando en cuotas y sin interes',
    buttonLabel: 'Planes',
  },
  {
    icon: 'book-medical',
    content: 'Explora nuestro directorio de medicos Especialistas y selecciona la consulta que se adapte a tu necesidad',
    buttonLabel: 'Directorio',
  },
  {
    icon: 'calendar-days',
    content: 'Reserva una cita con solo hacer click en el boton, paga tu consulta en linea y evita largas esperas',
    buttonLabel: 'Reservas',
  },
  {
    icon: 'heart-pulse',
    content: 'Nueva Unidad de Cardiologia, Consulta cardiologica especializada, mapa, holter, eco cardiograma',
    buttonLabel: 'Cardiologia',
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
    text: 'Excelente Servicio, muy buena atencion, todo el personal fue muy amable en mi estadia, desde el vigilante hasta el especialista...',
    patient: 'Paciente Feliz',
    icon: 'face-smile-beam',
  },
  {
    text: 'El servicio fue excelente, el personal muy amable y atento a mis necesidades. Me sentí muy bien atendido.',
    patient: 'Paciente Satisfecho',
    icon: 'face-smile-beam',
  },
  {
    text: 'La atención fue excepcional, me hicieron sentir como en casa. Recomiendo este lugar al 100%.',
    patient: 'Paciente Contento',
    icon: 'face-smile-beam',
  },
  {
    text: 'El equipo médico es muy profesional y atento. Me sentí seguro durante todo el proceso.',
    patient: 'Paciente Agradecido',
    icon: 'face-smile-beam',
  },
  {
    text: 'La calidad del servicio es inigualable. Definitivamente volveré para futuras consultas.',
    patient: 'Paciente Recurrente',
    icon: 'face-smile-beam',
  },
  {
    text: 'Me encantó la atención personalizada que recibí. Me hicieron sentir especial.',
    patient: 'Paciente Especial',
    icon: 'face-smile-beam',
  },
]


</script>

<template>
  <div class="flex flex-col">
    <LaTrinidad-banner />

    <!-- <InputNumber v-model="pos" inputId="minmax-buttons" mode="decimal" showButtons :min="-360" :max="0" fluid
    :step="40" /> -->

    <div class="flex justify-around w-full bg-welfare p-5 gap-5 rounded-xl mt-1">
      <Card class="w-1/3">
        <template #content>
          <div class="flex w-full text-3xl text-vitality justify-center mb-3">
            Cirugias Realizadas
          </div>
          <div class="w-full h-2 mb-5 bg-hope"></div>
          <!-- ! hltml odometer -->
          <div class="flex w-full justify-center bg-vitality rounded-xl p-5">
            <Odometer number="1789" class="text-white" />
          </div>
          <!-- ! hltml odometer -->
        </template>
      </Card>
      <Card class="w-1/3">
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
      <Card class="w-1/3">
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
            <div class="h-80 w-full bg-hope rounded-3xl outline-2 outline-offset-2 outline-stone-200"></div>
            <div class="flex flex-col h-60 justify-around p-6 text-white absolute top-15">
              <font-awesome-icon icon="face-smile-beam" size="2xl" />
              <span class="text-center"> {{ slotProps.data.text }} </span>
              <div class="text-end w-full">{{ slotProps.data.patient }}.</div>
            </div>
          </div>

        </template>
      </Carousel>
    </div>


  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-5 m-5">
    <div v-for="(card, index) in cards" :key="index" class="my-5 p-10 rounded-lg shadow-lg shadow-indigo-500/50">
      <div class="text-center mb-5">
        <font-awesome-icon :icon="card.icon" class="text-6xl text-welfare" />
      </div>
      <h3>{{ card.content }}</h3>
      <button class="button-ppl">{{ card.buttonLabel }}</button>
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
      <div class="hidden md:block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi iure perferendis
        illum vel ex enim
        laboriosam
        natus incidunt deleniti quidem pariatur, iusto architecto asperiores expedita soluta? Magni omnis molestiae
        voluptatibus.</div>
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
      <div class="hidden md:block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi iure perferendis
        illum vel ex enim
        laboriosam
        natus incidunt deleniti quidem pariatur, iusto architecto asperiores expedita soluta? Magni omnis molestiae
        voluptatibus.</div>
    </div>
    <div class="md:col-start-2 col-span-3 md:col-span-2 rounded-xl flex flex-col p-10 shadow-lg shadow-indigo-500/50">
      <div class="text-vitality text-2xl">UCI Neonatal</div>
      <div class="w-20 h-2 mb-5 bg-hope"></div>
      <div class="hidden md:block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi iure perferendis
        illum vel ex enim
        laboriosam
        natus incidunt deleniti quidem pariatur, iusto architecto asperiores expedita soluta? Magni omnis molestiae
        voluptatibus.</div>
    </div>
    <div class="col-span-3 md:col-span-2 rounded-xl p-2 inset-shadow-sm">
      <img src="../assets/UCIN-1.jpg" alt="" class="rounded-xl">
    </div>
  </div>


  <!-- <div class="grid">
      <div class="col-12 text-center somos">
        <img src="../assets/nurse_1.png" alt="" class="w-3">
        <h2>Nuestro Equipo de Medicos Residentes Está Listo para Atenderte</h2>
        <h2>
          <RouterLink to="/directory" class="text-white no-underline">Conocelos Aqui...</RouterLink>
        </h2>
      </div>
    </div> -->

  <!-- <div class="grid">
      <div class="col-12 md:col-6 lg:col-6">
        <div class="p-0 text-center">
          <img src="../assets/nurse_1.png" alt="" class="w-6">
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-6">
        <div class="p-6 somos">
          <h1>Enfermería</h1>
          <h2>Contamos con un selecto equipo </h2>
          <h2>de enfermería, siempre dispuesto </h2>
          <h2>a atenderte con la atención que</h2>
          <h2>siempre nos ha caracterizado.</h2>
          <br>
          <h2>¿Quieres ser parte del equipo? </h2>
          <h2><a href="">Conoce como, click aqui</a></h2>
        </div>
      </div>
    </div> -->
</template>
