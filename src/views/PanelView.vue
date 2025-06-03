<script setup>
import { reactive } from 'vue';

const items = reactive([
    {
        icon: 'fa-solid fa-user-injured',
        label: 'Pacientes',
        active: true,
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
        to: ''
    },

])

const setActive = (index) => {
    items.forEach((item, i) => {
        item.active = i === index;
    });
}


</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-2 h-screen-left">
            <div class="bg-vitality h-full">
                <div v-for="(item, index) in items" :key="index" @click="setActive(index)"
                    :class="{ 'active-menu-item': item.active }" class="cursor-pointer">
                    <RouterLink :to="`/${item.to}`"
                        class="flex flex-column align-items-center justify-content-start p-3 text-white ">
                        <font-awesome-icon :icon="item.icon" size="2xl"/>
                        <span>{{ item.label }}</span>
                    </RouterLink>
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