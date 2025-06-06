<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const items = ref([
    {
        label: 'Inicio',
        route: '/'
    },
    {
        label: 'Servicio',
        route: '/services'
    },
    {
        label: 'Planes',
        route: '/plans'
    },
    {
        label: 'Directorio',
        route: '/directory'
    },
    {
        label: 'Blog',
        route: '/blog'
    },
    {
        label: 'Contacto',
        route: '/contact'
    }
])


</script>

<template>

    <Menubar v-if="!userStore.isLoggedIn" :model="items" class="flex-1">
        <template #item="{ item }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom class="no-underline">
                <a v-ripple :href="href" @click="navigate"
                    class="hover:underline decoration-emerald-500 p-2 text-white">
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <!-- <template #end>
            <RouterLink to="/login" class="hover:underline hover:decoration-emerald-500 p-2 text-white no-underline">
                Iniciar Sesión
            </RouterLink>
        </template> -->
    </Menubar>


    <Menubar v-if="userStore.isLoggedIn" class="flex-1">
        <template #end>
            <RouterLink to="#" class="hover:underline hover:decoration-emerald-500 p-2 text-white no-underline">
                <span @click="userStore.logout">Salir</span>
            </RouterLink>
        </template>
    </Menubar>
</template>