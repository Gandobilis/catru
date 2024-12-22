<script setup>

import SuccessIcon from "../assets/icons/successIcon.vue";
</script>

<template>


  <div class="flex flex-col w-full md:gap-12 gap-9 items-center  font-mtavruli " >
    <success-icon class="md:w-24 h-24"/>
    <p class="text-custom-green text-center font-bold md:text-3xl">თანხმობის ფორმა გაიგზავნა ბანკში წარმატებით</p>

    <button
        class="rounded-xl p-3 px-10 md:text-lg text-sm text-white bg-primary-blue font-mtavruli hover:transition"
    >
      დასრულება
    </button>
  </div>
</template>
