<script setup>
import { onMounted, reactive, ref } from 'vue'

import { getDoctors, getSpecialities } from '../firebase/doctors'

var doctors = ref([])
var specialities = ref([])

onMounted(async () => {
    doctors.value = await getDoctors()
    specialities.value = await getSpecialities()
})
</script>

<template>
    <h1>
        DIRECTORIO MEDICO
    </h1>

    {{ doctors }}
</template>