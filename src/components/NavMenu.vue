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
    <Menubar v-if="!userStore.isLoggedIn" :model="items"
        class="justify-content-end align-items-center nav-ppl border-round-top-lg my-0">
        <template #item="{ item }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom
                class="text-white no-underline" style="margin-left: 20px; font-size: 24px;">
                <a v-ripple :href="href" @click="navigate">
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Menubar>

    <nav v-if="userStore.isLoggedIn"
        class="col-12 flex justify-content-end align-items-center nav-ppl border-round-top-lg my-0">
        <div class="flex gap-3 align-items-center m-0">
            <RouterLink to="/panel" class="text-white no-underline" style="margin-left: 20px; font-size: 24px;">Panel
            </RouterLink>
            <RouterLink to="/doctors" class="text-white no-underline" style="margin-left: 20px; font-size: 24px;">
                Doctores
            </RouterLink>
            <RouterLink to="#" class="text-white no-underline" style="margin-left: 20px; font-size: 24px;">
                <span @click="userStore.logout">Salir</span>
            </RouterLink>
        </div>
    </nav>
</template>