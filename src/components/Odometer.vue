<script setup>
import { ref, computed, onMounted } from 'vue'
// define pros
const props = defineProps(['number'])

// Init
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]



// Number to Digits
function numberToDigits(number) {
    // Convert the number to a string
    const numberAsString = String(number);

    // Create an empty array to store the digits
    const digitArray = [];

    // Iterate over each character (digit) in the string
    for (let i = 0; i < numberAsString.length; i++) {
        // Convert each character back to a number and add it to the array
        digitArray.push(Number(numberAsString[i]));
    }

    return digitArray;
}

const digits = numberToDigits(props.number)

let pos1 = ref(0)
let styleDimanic1 = computed(() => ({
    transform: `translateY(${pos1.value}px)`,
    transition: 'transform 1s ease-in-out',
}))

let pos2 = ref(0)
let styleDimanic2 = computed(() => ({
    transform: `translateY(${pos2.value}px)`,
    transition: 'transform 1s ease-in-out',
}))

let pos3 = ref(0)
let styleDimanic3 = computed(() => ({
    transform: `translateY(${pos3.value}px)`,
    transition: 'transform 1s ease-in-out',
}))

let pos4 = ref(0)
let styleDimanic4 = computed(() => ({
    transform: `translateY(${pos4.value}px)`,
    transition: 'transform 1s ease-in-out',
}))




onMounted(() => {
    setTimeout(() => {
        const clear1 = digits[0] * -40
        const clear2 = digits[1] * -40
        const clear3 = digits[2] * -40
        const clear4 = digits[3] * -40

        if (clear1 != 0 || clear1 == NaN) {
            function moveNumber1() {
                pos1.value -= 40
                if (pos1.value == clear1) {
                    clearInterval(miIntervalo1)
                }
            }
            const miIntervalo1 = setInterval(moveNumber1, 100)
        }

        if (clear2 != 0) {
            function moveNumber2() {
                pos2.value -= 40
                if (pos2.value == clear2) {
                    clearInterval(miIntervalo2)
                }
            }
            const miIntervalo2 = setInterval(moveNumber2, 100)
        }

        if (clear3 != 0) {
            function moveNumber3() {
                pos3.value -= 40
                if (pos3.value == clear3) {
                    clearInterval(miIntervalo3)
                }
            }
            const miIntervalo3 = setInterval(moveNumber3, 100)
        }

        if (clear4 != 0) {
            function moveNumber4() {
                pos4.value -= 40
                if (pos4.value == clear4) {
                    clearInterval(miIntervalo4)
                }
            }
            const miIntervalo4 = setInterval(moveNumber4, 100)
        }

    }, 2000)
})

</script>

<template>
    <div class="flex gap-1">
        <div class="flex flex-col gap-1 max-w-max h-10 overflow-hidden ">
            <div v-for="number1 in numbers" class="text-3xl flex" :style="styleDimanic1">
                {{ number1 }}
            </div>
        </div>
        <div class="flex flex-col gap-1 max-w-max h-10 overflow-hidden ">
            <div v-for="number2 in numbers" class="text-3xl flex" :style="styleDimanic2">
                {{ number2 }}
            </div>
        </div>
        <div class="flex flex-col gap-1 max-w-max h-10 overflow-hidden ">
            <div v-for="number3 in numbers" class="text-3xl flex" :style="styleDimanic3">
                {{ number3 }}
            </div>
        </div>
        <div class="flex flex-col gap-1 max-w-max h-10 overflow-hidden ">
            <div v-for="number4 in numbers" class="text-3xl flex" :style="styleDimanic4">
                {{ number4 }}
            </div>
        </div>
    </div>
</template>