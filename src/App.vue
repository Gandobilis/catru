<script setup>
import {onMounted} from "vue";
import cookies from "vue-cookies";
import {useRouter} from "vue-router";

const router = useRouter();

onMounted(async () => {
});
</script>

<template>
  <div class="flex justify-center p-10">
    <router-view/>
  </div>
</template>
