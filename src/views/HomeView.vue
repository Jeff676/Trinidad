<script setup>

const cards = [
  {
    icon: 'user-injured',
    content: 'Content for card 1',
    buttonLabel: 'Button 1',
  },
  {
    icon: 'user-injured',
    content: 'Content for card 2',
    buttonLabel: 'Button 2',
  },
  {
    icon: 'user-injured',
    content: 'Content for card 3',
    buttonLabel: 'Button 3',
  },
  {
    icon: 'user-injured',
    content: 'Content for card 4',
    buttonLabel: 'Button 4',
  },
];

</script>

<template>
  <div class="grid grid-nogutter">
    <div class="col-12 grid grid-nogutter bg-primary border-round-bottom-lg">
      <div class="col-8">
        <div class="text-start p-3">
          <img src="../assets/logo-large.svg" alt="Logo" class="w-8">
        </div>
        <div class="ml-8 text-white">
          <h2>DESCUBRE NUESTRO PLAN DE AFILIACION</h2>
          <h3>Recibe multiples beneficios</h3>
          <h3>Totalmente GRATIS!</h3>
        </div>
        <div class="flex">
          <Button severity="success" class="ml-8">Whatsapp</Button>
          <InputText class="mx-2" placeholder="Escribe tu numeo de Whatsapp" />
          <Button severity="success">Enviar</Button>
        </div>
        <div class="m-8">Somos su Aliado en el cuidado de su Salud!</div>
      </div>
      <div class="col-4 ">
        <!-- <div class="bg-blue-300 h-full">3</div> -->
        <div class="p-3 flex align-items-end min-h-full">
          <img src="../assets/doctor-1.png" alt="Logo" class="w-full">
        </div>
      </div>
    </div>

    <div class="col-12 p-8 text-center">
      <h2>En La Unidad Quirúrgica La Trinidad nos dedicamos a brindar servicios de salud integrales con los más altos
        estándares de calidad. Contamos con tecnología de vanguardia, un equipo médico altamente calificado y un enfoque
        centrado en el bienestar del paciente</h2>
    </div>


    <div class="col-12 flex justify-content-center">
      <Card v-for="(card, index) in cards" :key="index" class="m-2">
        <template #content class="flex flex-column align-items-center">
          <font-awesome-icon :icon="card.icon" size="2xl" />
          <p>{{ card.content }}</p>
          <Button severity="success">{{ card.buttonLabel }}</Button>
        </template>
      </Card>
    </div>
  </div>
</template>
