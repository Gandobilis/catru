<script setup>
import { ref } from 'vue';
import useUser from "../composables/useUser.js";
import CartuIcon from "../assets/icons/cartuIcon.vue";


const {isChecked,acceptForm } = useUser();





</script>

<template>

  <div class="flex flex-col w-full gap-12 font-mtavruli">
    <header>
      <cartu-icon/>
    </header>
    <p class="text-primary-blue text-center font-bold">
      თანხმობა პერსონალური <br /> მონაცემების დამუშავებაზე
    </p>
    <hr class="text-placeholder-grey " />

    <p class="text-sm font-mrglovani">
      &nbsp;მე, <span class="text-primary-blue font-mrglovani">ილონა ქერდიყოშვილი</span>(პირადი ნომერი <span class="text-primary-blue font-mrglovani">00112233441</span>),
      თანხმობას ვაცხადებ, რომ სს”ბანკი ქართუ”-მ ერთჯერადად გამოითხოვოს და მიიღოს საქართველოს ფინანსთა სამინისტროს შემოსავლების სამსახურის მონაცემთა ერთიან ელექტრონულ ბაზაში
      ჩემზე არსებული ნებისმიერი სახის ინფორმაცია, რომელიც დაკავშირებულია ჩემს შემოსავლებთან. ჩემთვის ცნობილია და თანხმობას ვაცხადებ, რომ მონაცემთა
      დამუშავების მიზანია: ჩემი გადახდისუნარიანობის შეფასება სესხის გაცემამდე. მე თანახმა ვარ ბანკმა მიღებული ინფორმაცია დაამუშავოს, შეინახოს და გამოიყენოს
      ჩემტან სახელშეკრულებო ურთიერთობის დამყარების ან მასზე უარის თქმის შემთხვევაში.
      <br />&nbsp;მოცემული თანხმობის მოქმედების ვადაა 1(ერთი) თვე მისი გაცემიდან.
    </p>
    <hr class="text-placeholder-grey " />

    <div class="flex gap-1.5 items-center">
      <input  type="checkbox" v-model="isChecked" class="w-[14px] h-[14px] appearance-none border  rounded custom-checkbox" />
      <p class="text-sm">ვეთანხმები</p>
    </div>

    <div class="w-full flex justify-end gap-4">
      <button class="px-2 rounded-md pt-2.5 pb-1.5 text-sm text-white bg-secondary-button-default font-mtavruli hover:bg-secondary-button-hover hover:transition">
        უარყოფა
      </button>

      <button
          @click="acceptForm"
          :disabled="!isChecked"
      class="px-2 rounded-md pt-2.5 pb-1.5 text-sm text-white bg-primary-blue font-mtavruli hover:transition"
      :class="!isChecked ? 'bg-stroke-grey !text-placeholder-grey cursor-not-allowed' : ''">
      დადასტურება
      </button>
    </div>
  </div>
</template>
