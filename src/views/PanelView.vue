<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { useConfirm } from "primevue/useconfirm";

const userStore = useUserStore();


var currentUser = ref([])
const nameUser = ref('')
var userLog = ref('')
const menu = reactive([])
var items = reactive([])

const itemsAdm = reactive([
    // {
    //     icon: 'fa-solid fa-chart-column',
    //     label: 'Panel',
    //     active: true,
    //     to: 'panel'
    // },
    {
        icon: 'fa-solid fa-calendar-days',
        label: 'Citas',
        active: false,
        to: 'schedule'
    },
    {
        icon: 'fa-solid fa-user-injured',
        label: 'Pacientes',
        active: false,
        to: 'patients'
    },
    {
        icon: 'fa-solid fa-user-doctor',
        label: 'Medicos',
        active: false,
        to: 'doctors'
    },
    {
        icon: 'fa-solid fa-user-nurse',
        label: 'Enfermeras',
        active: false,
        to: 'panel'
    },
    {
        icon: 'fa-solid fa-user',
        label: 'Usuarios',
        active: false,
        to: 'users'
    },

])

const itemsMed = reactive([
    {
        icon: 'fa-solid fa-user-injured',
        label: 'Pacientes',
        active: false,
        to: 'patients'
    },
    
    {
        icon: 'fa-solid fa-user-nurse',
        label: 'Citas',
        active: false,
        to: 'panel'
    },

])

const confirmSesion = useConfirm()

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

const setActive = (index) => {
    items.forEach((item, i) => {
        item.active = i === index;
    });
}

if(localStorage.type == 'Administrativo'){
    items = itemsAdm
}else if(localStorage.type == 'Medico'){
    items = itemsMed
}else{
    items = itemsMed
}

onMounted(() => {
    // Set the first item as active by default
    if (items.length > 0) {
        items[0].active = true;
    }
})

</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-2 h-screen-left">
            <div class="bg-vitality h-full">
                <div v-for="(item, index) in items" :key="index" @click="setActive(index)"
                    :class="{ 'active-menu-item': item.active }" class="cursor-pointer">
                    <RouterLink :to="`/${item.to}`" class="grid justify-content-start p-3 text-white ">
                        <div>
                            <font-awesome-icon :icon="item.icon" size="2xl" class="mr-3" />
                            <span>{{ item.label }}</span>
                        </div>
                    </RouterLink>
                </div>
                <div class="text-white p-3 cursor-pointer" @click="logOut">
                    <font-awesome-icon icon="fa-solid fa-person-walking-arrow-right" size="2xl" class="mr-3" />
                    <span>Salir</span>
                </div>
            </div>
        </div>
        <div class="col-span-10 h-screen-left">
            <div class="bg-life shadow-5 h-full">
                <RouterView />
            </div>
        </div>
    </div>

</template>

<style>
.h-screen-left {
    height: calc(100vh - 5rem);
}

.bg-vitality>div:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s;
}

.active-menu-item {
    position: relative;
}

.active-menu-item::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    width: 6px;
    background-color: var(--health);
    /* Verde */
    border-radius: 2px 0 0 2px;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-50%) translateX(10px);
    }

    to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }
}
</style>