<script setup>
import { onMounted, reactive, ref } from 'vue'

import { getDoctors } from '../firebase/doctors'

var doctors = ref([])

onMounted(async () => {
    doctors.value = await getDoctors()
})
</script>

<template>
    <h1>
        Directory Page
    </h1>

    {{ doctors }}
</template>