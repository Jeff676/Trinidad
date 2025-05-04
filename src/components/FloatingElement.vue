<template>
  <div ref="floatingElement" class="floating-element" :class="{ 'is-scrolling': isScrolling }">
    <!-- Contenido de tu elemento aquí -->
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const floatingElement = ref(null)
const isScrolling = ref(false)
let scrollTimeout = null
let initialAnimationTimeout = null
let resetPositionTimeout = null

const moveToCenter = () => {
  floatingElement.value.style.transition = 'transform 0.5s ease-out'
  floatingElement.value.style.transform = 'translateY(-20vh)'
}

const handleScroll = () => {
  if (!isScrolling.value) {
    isScrolling.value = true
    floatingElement.value.style.transition = 'transform 0.2s ease-out'
  }

  // Mover el elemento con el scroll
  const scrollY = window.scrollY || window.pageYOffset
  floatingElement.value.style.transform = `translate(-50%, calc(-50% + ${scrollY}px))`

  // Reiniciar el timeout cada vez que hay scroll
  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
    // Después de 2 segundos sin scroll, volver al centro
    resetPositionTimeout = setTimeout(() => {
      moveToCenter()
    }, 2000)
  }, 200)
}

// Animación inicial
onMounted(() => {
  // Posición inicial en la parte inferior
  floatingElement.value.style.transform = 'translate(-50%, 100%)'

  // Después de un breve retraso para que se aplique la posición inicial
  setTimeout(() => {
    // Subir a la mitad de la pantalla después de 5 segundos
    initialAnimationTimeout = setTimeout(() => {
      moveToCenter()
    }, 5000)
  }, 50)

  // Configurar el event listener para el scroll
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(scrollTimeout)
  clearTimeout(initialAnimationTimeout)
  clearTimeout(resetPositionTimeout)
})
</script>

<style scoped>
.floating-element {
  position: fixed;
  right: 5%;
  bottom: 0;
  z-index: 1000;
  transform: translate(0, 150%);
  transition: transform 0.5s ease-out;
}

.floating-element.is-scrolling {
  transition: transform 0.2s ease-out;
}
</style>