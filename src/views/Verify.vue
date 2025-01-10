<script setup>
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUser from "../composables/useUser.js";

const route = useRoute();
const router = useRouter();  // Initialize router
const uuid = route.params.uuid;
const pageLoaded = ref(false);

const { isChecked, acceptForm, visitLink, failed, visitLinkResponse, smsError } = useUser();

const checkFailed = async () => {
  await visitLink(uuid);
  if (failed.value) {
    await router.push('/not-found');  // Redirect to not-found page
  } else {
    pageLoaded.value = true;
  }
};

checkFailed();
</script>



<template>
  <div v-if="pageLoaded" class="flex flex-col w-full gap-12 font-mtavruli">
    <p class="text-primary-blue text-center md:text-3xl text-2xl font-mtavruli">
      თანხმობა პერსონალური <br/> მონაცემების დამუშავებაზე
    </p>

    <div class="w-full flex items-center justify-center">
      <div class="flex flex-col gap-12 md:w-1/2 w-full">
        <hr class="text-placeholder-grey"/>

        <p class="md:text-lg text-sm font-mrglovani">
          &nbsp;მე, <span class="text-primary-blue font-mrglovani">{{visitLinkResponse?.fullName}} </span> (პირადი ნომერი <span class="text-primary-blue font-mrglovani">{{visitLinkResponse?.idNum}}</span>),
          თანხმობას ვაცხადებ, რომ სს”ბანკი ქართუ”-მ ერთჯერადად გამოითხოვოს და მიიღოს საქართველოს ფინანსთა სამინისტროს შემოსავლების სამსახურის მონაცემთა ერთიან ელექტრონულ ბაზაში
          ჩემზე არსებული ნებისმიერი სახის ინფორმაცია, რომელიც დაკავშირებულია ჩემს შემოსავლებთან. ჩემთვის ცნობილია და თანხმობას ვაცხადებ, რომ მონაცემთა
          დამუშავების მიზანია: ჩემი გადახდისუნარიანობის შეფასება სესხის გაცემამდე. მე თანახმა ვარ ბანკმა მიღებული ინფორმაცია დაამუშავოს, შეინახოს და გამოიყენოს
          ჩემტან სახელშეკრულებო ურთიერთობის დამყარების ან მასზე უარის თქმის შემთხვევაში.
          <br />&nbsp;მოცემული თანხმობის მოქმედების ვადაა 1 (ერთი) თვე მისი გაცემიდან.
        </p>
        <hr class="text-placeholder-grey"/>

        <div class="flex gap-1.5 items-center">
          <input type="checkbox" v-model="isChecked"
                 class="md:w-[20px] md:h-[20px] w-14px h-14px appearance-none border rounded custom-checkbox"/>
          <p class="md:text-lg text-sm">ვეთანხმები</p>
        </div>

        <span class="text-xs text-secondary-button-default" v-if="smsError" v-text="smsError"/>

        <div class="w-full flex md:justify-end justify-center gap-4">
          <button
              class="rounded-xl p-3 md:text-lg text-sm text-white bg-secondary-button-default font-mtavruli hover:bg-secondary-button-hover hover:transition">
            უარყოფა
          </button>

          <button
              @click="acceptForm(uuid)"
              :disabled="!isChecked"
              class="rounded-xl p-3 md:text-lg text-sm text-white bg-primary-blue font-mtavruli hover:transition"
              :class="!isChecked ? 'bg-stroke-grey !text-placeholder-grey cursor-not-allowed' : ''">
            დადასტურება
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
