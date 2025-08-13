<!-- <script setup>
import PageUnderConstruction from '@/components/PageUnderConstruction.vue'

</script>

<template>
    <PageUnderConstruction title="Blog" />
</template> -->

<template>
  <div>
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Cerca..."
      @input="filterItems"
    />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    // La lista completa degli elementi
    const items = ref([
      { id: 1, name: 'Mela' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Arancia' },
      { id: 4, name: 'Uva' },
      { id: 5, name: 'Mango' },
    ]);

    // Il termine di ricerca digitato dall'utente
    const searchTerm = ref('');

    // Computed property per filtrare gli elementi
    const filteredItems = computed(() => {
      if (!searchTerm.value) {
        return items.value; // Se il campo di ricerca è vuoto, mostra tutti gli elementi
      }
      const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
      return items.value.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

    return {
      searchTerm,
      filteredItems,
    };
  },
};
</script>

<style scoped>
/* Stili di base per l'esempio */
div {
  font-family: Arial, sans-serif;
  padding: 20px;
}
input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding e border nel width */
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>