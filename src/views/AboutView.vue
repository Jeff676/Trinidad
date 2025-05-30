<script setup>
import Odometer from '@/components/Odometer.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">About Us</h1>
    <p class="text-lg mb-8">We are a team of dedicated professionals committed to providing the best service.</p>
    <Odometer :number="6078" />
  </div>

</template>
