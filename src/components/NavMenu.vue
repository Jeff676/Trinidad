<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user';
import { useConfirm } from "primevue/useconfirm";

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

const confirmSesion = useConfirm();
const logOut = () => {
    confirmSesion.require({
        message: '¿Desea cerrar la sesión?',
        header: 'Salir',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'No',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Sí'
        },
        accept: () => {
            console.log('logout')
            userStore.logout()
        },
        reject: () => {
        }
    });

}
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
                <span @click="logOut">Salir</span>
            </RouterLink>
        </template>
    </Menubar>    

</template>