<script setup>
import { ref, computed, onMounted } from 'vue';
import useUser from "../composables/useUser.js";
import MobileIcon from "../assets/icons/mobileIcon.vue";
const {continueAction,isContinueEnabled , code, startCountdown, countdown, resendCode, isResendEnabled} = useUser();
// Create a reactive array to store the values of the 4 inputs

// Timer state

// Function to start the countdown timer


// Run the timer when the component is mounted
onMounted(() => {
  startCountdown();
});

// Function to handle input changes
const handleInput = (event, index) => {
  const value = event.target.value;

  // Allow only digits
  if (/^\d$/.test(value)) {
    code.value[index] = value;

    if (index < 3) {
      event.target.nextElementSibling.focus();
    }
  } else {
    code.value[index] = '';
  }
};

const handleBackspace = (event, index) => {
  if (event.key === 'Backspace' && code.value[index] === '') {
    if (index > 0) {
      code.value[index - 1] = '';
      event.target.previousElementSibling.focus();
    }
  }
};

const resendButtonFill = computed(() => {
  const percentage = ((60 - countdown.value) / 60) * 100;
  return `linear-gradient(to right, #1C5285 ${percentage}%, #D0D5DD ${percentage}%)`;
});
</script>

<template>
  <div class="w-full flex flex-col gap-10 items-center">
    <mobile-icon class="-mb-5"/>
    <p class="text-primary-blue text-center font-bold">
      გთხოვთ შეიყვანეთ ერთჯერადი დადასტურების კოდი
    </p>

    <p class="text-placeholder-grey text-sm text-center">
      ერთჯერადი დადასტურების კოდი გამოგზავნილია თქვენს მობილურ ტელეფონზე +995 59* ** ** *0
    </p>
    <p class="text-center text-sm text-primary-blue">
      {{ ` ${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}` }}
    </p>
    <div class="flex justify-center gap-4">
      <input
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          type="number"
          maxlength="1"
          class="border border-gray-300 w-12 h-12 text-center text-xl rounded-md"
          @input="handleInput($event, index)"
          @keydown="handleBackspace($event, index)"
      />
    </div>


    <div class="flex justify-center gap-4">
      <button
          class="px-2 rounded-md pt-2.5 pb-1.5 text-sm text-white bg-primary-blue font-mtavruli hover:transition"
          :style="{ background: resendButtonFill }"
          @click="resendCode"
          :disabled="!isResendEnabled"
      >
        თავიდან გაგზავნა
      </button>

      <button
          class="px-2 rounded-md pt-2.5 pb-1.5 text-sm text-white bg-primary-blue font-mtavruli hover:transition"
          :class="isContinueEnabled ? 'bg-primary-blue' : 'bg-stroke-grey'"
          :disabled="!isContinueEnabled"
          @click="continueAction"
      >
        ბანკში გაგზავნა
      </button>
    </div>
  </div>
</template>

<style scoped>
input {
  outline: none;
}
button:disabled {
  cursor: not-allowed;
}
</style>
