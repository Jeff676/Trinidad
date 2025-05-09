<script setup>
import LaTrinidadBanner from '@/components/LaTrinidadBanner.vue';

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

</script>

<template>

  <div class="grid grid-nogutter">
    <LaTrinidad-banner />

    <div class="col-12 p-8 text-center somos">
      <h2>En La Unidad Quirúrgica La Trinidad nos dedicamos a brindar servicios de </h2></br>
      <h2>salud integrales con los más altos estándares de calidad. Contamos con </h2></br>
      <h2>tecnología de vanguardia, un equipo médico altamente calificado y un </h2></br>
      <h2>enfoque centrado en el bienestar del paciente</h2>
    </div>

    <div class="col-12 flex justify-content-center">
      <div v-for="(card, index) in cards" :key="index" class="col-3 somos p-6">
        <font-awesome-icon :icon="card.icon" size="2xl" />
        <h3>{{ card.content }}</h3>
        <button class="button-ppl">{{ card.buttonLabel }}</button>
      </div>
    </div>

    <div class="col-12 p-8 text-center somos testimonials">
      <h2>Excelente Servicio, muy buena atencion, todo el personal fue muy amable en mi </h2>
      <h2>estadia, desde el vigilante hasta el especialista...</h2>
      <br>
      <h2 class="text-right">Paciente Feliz</h2>

    </div>

    <div class="col-12 grid">
      <div class="col-12 text-center somos">
        <img src="../assets/nurse_1.png" alt="" class="w-3">
        <h2>Nuestro Equipo de Medicos Residentes Está Listo para Atenderte</h2>
        <h2>
          <RouterLink to="/directory" class="text-white no-underline">Conocelos Aqui...</RouterLink>
        </h2>
      </div>
    </div>

    <div class="col-12 grid">
      <div class="col-6 text-center">
        <img src="../assets/nurse_1.png" alt="" class="w-6">
      </div>
      <div class="col-6 somos">
        <div class="p-6">
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

    </div>


  </div>
</template>
