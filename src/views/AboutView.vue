<script setup>
import LaTrinidadBanner from '@/components/LaTrinidadBanner.vue';

</script>

<template>
  <LaTrinidadBanner>
  </LaTrinidadBanner>

  <div class="about">

    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
