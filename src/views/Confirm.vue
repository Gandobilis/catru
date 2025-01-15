<script setup>
import {ref, computed, onMounted} from 'vue';
import useUser from "/src/composables/useUser.js";
import {useRoute, useRouter} from "vue-router";
import MobileIcon from "/src/assets/icons/mobileIcon.vue";

const {
  continueAction,
  isContinueEnabled,
  code,
  startCountdown,
  countdown,
  resendCode,
  isResendEnabled,
  otpError,
  failed,
  visitLink,
} = useUser();

const router = useRouter();
const pageLoaded = ref(false);
const route = useRoute();

const uuid = route.params.uuid;

const checkFailed = async () => {
  await visitLink(uuid);
  if (failed.value) {
    await router.push('/not-found');
  } else {
    pageLoaded.value = true;
  }
};

checkFailed();

const handleInput = (event, index) => {
  let value = event.target.value;

  value = value.replace(/\D/g, '');

  if (value.length > 1) {
    value = value.charAt(0);
  }

  if (value) {
    code.value[index] = value;

    if (index < 3) {
      event.target.nextElementSibling?.focus();
    }
  } else {
    code.value[index] = '';
  }

  event.target.value = code.value[index];
};

const handleBackspace = (event, index) => {
  if (event.key === 'Backspace' && code.value[index] === '') {
    if (index > 0) {
      code.value[index - 1] = '';
      event.target.previousElementSibling?.focus();
    }
  }
};

const resendButtonFill = computed(() => {
  const percentage = ((60 - countdown.value) / 60) * 100;
  return `linear-gradient(to right, #1C5285 ${percentage}%, #D0D5DD ${percentage}%)`;
});

onMounted(() => {
  startCountdown();
});
</script>

<template>
  <div class="w-full flex flex-col gap-12 items-center">
    <mobile-icon class="-mb-5"/>

    <p class="text-primary-blue text-center md:text-3xl text-2xl font-mtavruli">
      გთხოვთ შეიყვანეთ ერთჯერადი დადასტურების კოდი
    </p>

    <p class="text-placeholder-grey md:text-lg text-sm font-mrglovani">
      ერთჯერადი დადასტურების კოდი გამოგზავნილია თქვენს მობილურ ტელეფონზე +995 59* ** ** *0
    </p>

    <p class="md:text-lg text-sm font-mrglovani text-primary-blue">
      {{ ` ${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}` }}
    </p>

    <div class="flex justify-center gap-4">
      <input
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          type="text"
          maxlength="1"
          class="border border-gray-300 w-12 h-12 text-center text-xl rounded-md"
          @input="handleInput($event, index)"
          @keydown="handleBackspace($event, index)"
          @keypress="event => { if (!/^\d$/.test(event.key)) event.preventDefault(); }"
      />
    </div>

    <span class="text-xs text-secondary-button-default" v-if="otpError" v-text="otpError"/>

    <div class="flex justify-center gap-4">
      <button
          class="rounded-xl p-3 md:text-lg text-sm text-white bg-primary-blue font-mtavruli hover:transition"
          :style="{ background: resendButtonFill }"
          @click="resendCode"
          :disabled="!isResendEnabled">
        თავიდან გაგზავნა
      </button>

      <button
          class="rounded-xl p-3 md:text-lg text-sm text-white bg-primary-blue font-mtavruli hover:transition"
          :class="isContinueEnabled ? 'bg-primary-blue' : 'bg-stroke-grey'"
          :disabled="!isContinueEnabled"
          @click="continueAction(uuid)">
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
