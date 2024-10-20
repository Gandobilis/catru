<script setup>
import { ref, computed, onMounted } from 'vue';

// Create a reactive array to store the values of the 4 inputs
const code = ref(['', '', '', '']);

// Timer state
const countdown = ref(60);
const isResendEnabled = ref(false);

// Function to start the countdown timer
const startCountdown = () => {
  countdown.value = 60;
  isResendEnabled.value = false;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
      isResendEnabled.value = true;
    }
  }, 1000);
};

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

    // Move focus to the next input if not the last field
    if (index < 3) {
      event.target.nextElementSibling.focus();
    }
  } else {
    // If input is not a digit, clear the field
    code.value[index] = '';
  }
};

// Function to handle backspace key press
const handleBackspace = (event, index) => {
  if (event.key === 'Backspace' && code.value[index] === '') {
    // Move focus to the previous input if not the first field
    if (index > 0) {
      code.value[index - 1] = '';
      event.target.previousElementSibling.focus();
    }
  }
};

// Function to resend the code
const resendCode = () => {
  if (isResendEnabled.value) {
    startCountdown();
    // Add logic here to resend the verification code if necessary
    console.log('Resending code...');
  }
};

// Function to handle the "გაგრძელება" button click
const continueAction = () => {
  if (isContinueEnabled.value) {
    console.log('დადასტურება button pressed.');
  }
};

// Computed property to check if all fields are filled
const isContinueEnabled = computed(() => code.value.every(digit => digit !== ''));

// Computed property to calculate the button's background fill percentage
const resendButtonFill = computed(() => {
  const percentage = ((60 - countdown.value) / 60) * 100;
  return `linear-gradient(to right, #1C5285 ${percentage}%, #D0D5DD ${percentage}%)`;
});
</script>

<template>
  <div class="w-full flex flex-col gap-12">
    <p class="text-primary-blue text-center font-bold">
      გთხოვთ შეიყვანეთ ერთჯერადი დადასტურების კოდი
    </p>

    <p class="text-placeholder-grey text-sm text-center">
      ერთჯერადი დადასტურების კოდი გამოგზავნილია თქვენს მობილურ ტელეფონზე +995 59* ** ** *0
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

    <p class="text-center text-sm text-placeholder-grey">
      {{ countdown > 0 ? `კოდი ხელმისაწვდომი გახდება ${countdown} წამში` : 'ახლა შეგიძლიათ ხელახლა გამოგზავნოთ კოდი' }}
    </p>

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
