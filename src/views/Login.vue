<script setup>

import useAuth from "../composables/useAuth.js";

const {user, authError, login} = useAuth();
</script>

<template>
  <div class="flex flex-col w-full gap-12 font-mtavruli ">
    <div class="flex flex-col gap-10 items-center text-center">
      <p class=" text-primary-blue  md:text-3xl text-2xl font-mtavruli">სისტემაში შესვლა</p>

      <div class="md:w-[50%] w-full font-mrglovani flex flex-col gap-10">
        <div class="flex flex-col  text-start gap-3">
          <p class="md:text-xl">მომხმარებელი</p>

          <input
              required
              v-model="user.username"
              class="rounded-xl border p-3 md:text-lg text-sm border-placeholder-grey placeholder-placeholder-grey  focus:outline-none"/>
        </div>
        <div class="flex flex-col  text-start gap-3">
          <p class="md:text-xl">პაროლი</p>

          <input
              required
              v-model="user.password"
              type="password"
              class="rounded-xl border p-3 md:text-lg text-sm  border-placeholder-grey placeholder-placeholder-grey  focus:outline-none"/>
        </div>

        <span class="text-xs text-secondary-button-default" v-if="authError" v-text="authError"/>

        <button
            @click="login"
            class="rounded-xl p-3 md:text-lg text-sm text-white bg-primary-blue font-mtavruli hover:transition">
          შესვლა
        </button>
      </div>
    </div>
  </div>
</template>
