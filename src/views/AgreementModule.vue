<script setup>
import useUser from "../composables/useUser.js";

const {
  formType,
  clientType,
  personalOrTaxNumber,
  newUser,
  _newUser,
  formLang,
  user,
  loading,
  selectFormType,
  _selectFormType,
  _selectFormTypeLeg,
  selectFormTypeLeg,
  getUser,
  notification,
  editable,
  handleClick,
  disabled,
  success,
} = useUser();
</script>

<template>
  <div class="flex flex-col rounded-lg border shadow-xl p-3.5 w-[600px] border-stroke-grey">
    <p class="text-center pb-2.5 text-primary-blue font-mtavruli">თანხმობის მოდული</p>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-3.5 py-3.5">
      <p class="text-sm">თანხმობის ფორმა</p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-1">
          <input type="radio" name="MT-EL" value="MT" checked v-model="formType"/>

          <p class="whitespace-nowrap text-xs">თანხმობის მატერიალური ფორმა</p>
        </div>

        <div class="flex items-center gap-x-1">
          <input type="radio" name="MT-EL" value="EL" v-model="formType"/>

          <p class="whitespace-nowrap text-xs">თანხმობის ელექტრონული ფორმა</p>
        </div>
      </div>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-3.5 py-3.5">
      <p class="text-sm">კლიენტის ტიპი</p>

      <div class="flex items-center gap-x-[185px]">
        <div class="flex items-center gap-x-1">
          <input type="radio" name="IND-LEG" value="IND" v-model="clientType" checked/>

          <p class="text-xs">ფიზიკური პირი</p>
        </div>

        <div class="flex items-center gap-x-1">
          <input type="radio" name="IND-LEG" value="LEG" v-model="clientType"/>

          <p class="text-xs">იურიდიული პირი</p>
        </div>
      </div>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-1.5 py-3.5">
      <p class="text-sm">კლიენტის ნომერი / {{ clientType === 'IND' ? 'პირადი ნომერი' : 'საიდენტიფიკაციო ნომერი' }}</p>


      <div class="flex gap-x-3.5">
        <input
            v-model="personalOrTaxNumber"
            placeholder="შეიყვანეთ იდენტიფიკატორი"
            :class="{'border-secondary-button-default': notification}"
            class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey w-[75%] focus:outline-none"/>

        <button
            class="rounded-md pt-1 text-sm text-white bg-primary-blue w-[23%] font-mtavruli hover:bg-primary-button-hover hover:transition disabled:text-placeholder-grey disabled:bg-stroke-grey disabled:cursor-not-allowed"
            @click="getUser"
            :disabled="!personalOrTaxNumber"
            v-if="!loading">შემოწმება
        </button>

        <button v-else class="rounded-md pt-1 text-sm text-white bg-primary-blue w-[23%] font-mtavruli">
          <span class="loading loading-spinner loading-sm"/>
        </button>
      </div>

      <span class="text-xs text-secondary-button-default" v-if="notification" v-text="notification"/>
    </div>
    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col py-3.5">
      <div v-if="clientType==='IND'" class="grid grid-cols-2 grid-rows-2 gap-3.5">
        <div :class="['flex flex-col gap-2' ]">
          <h2 class="text-sm font-medium">კლიენტის სახელი</h2>

          <input disabled
                 :value="user?.name"
                 class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                 type="text" v-if="!editable">

          <input v-else
                 v-model="newUser.name"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="text">
        </div>

        <div :class="['flex flex-col gap-2']">
          <h2 class="text-sm font-medium">კლიენტის გვარი</h2>

          <input disabled
                 :value="user?.surname"
                 class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                 type="text" v-if="!editable">

          <input v-else
                 v-model="newUser.surname"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="text">
        </div>

        <div :class="['flex flex-col gap-2']">
          <h2 class="text-sm font-medium">პირადი ნომერი</h2>

          <input disabled
                 :value="user?.personalNumber"
                 class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                 type="number" v-if="!editable">

          <input v-else
                 v-model="newUser.personalNumber"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="number"
                 :maxlength="9"
                 @input="newUser.personalNumber = newUser.personalNumber?.toString().slice(0, 11)">
        </div>


        <div v-if="formType==='EL'" class="flex flex-col gap-2">
          <h2 class="text-sm font-medium">მობილური ტელეფონი</h2>

          <input disabled
                 :value="user?.phoneNumber"
                 class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                 type="text" v-if="!editable">

          <input v-else
                 v-model="newUser.phoneNumber"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="number"
                 :maxlength="9"
                 @input="newUser.phoneNumber = newUser.phoneNumber?.toString().slice(0, 9)">
        </div>
      </div>


      <!--      იურიდიული პირი-->
      <div v-if="clientType==='LEG'" class="flex flex-col gap-3.5">
        <!-- First Row -->
        <div class="flex w-full gap-3.5">
          <div class="flex w-1/2 flex-col gap-2">
            <h2 class="text-sm font-medium">კლიენტის დასახელება</h2>

            <input disabled
                   :value="user?.clientName"
                   class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text" v-if="!editable">

            <input v-else
                   v-model="_newUser.clientName"
                   class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text">
          </div>

          <div class="flex w-1/2 flex-col gap-2">
            <h2 class="text-sm font-medium">საიდენტიფიკაციო ნომერი</h2>

            <input disabled
                   :value="user?.taxNumber"
                   class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="number" v-if="!editable">

            <input v-else
                   v-model="_newUser.taxNumber"
                   class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="number"
                   :maxlength="9"
                   @input="_newUser.taxNumber = _newUser.taxNumber?.toString().slice(0, 9)">
          </div>
        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფლებამოსილი პირი (უფ.პ)</h2>

            <input
                v-model="_newUser.legPerson"
                class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="text">
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს პირადი ნომერი</h2>

            <input
                v-model="_newUser.legPersonTax"
                class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="text">

          </div>

          <div v-if="formType==='EL'" class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს მობილური</h2>

            <input
                v-model="_newUser.phoneNumber"
                class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="number"
                :maxlength="9"
                @input="_newUser.phoneNumber = _newUser.phoneNumber?.toString().slice(0, 9)">
          </div>
        </div>
      </div>
      <!--      იურიდიული პირი-->

    </div>
    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-3.5 py-3.5">
      <h2 class="text-sm">თანხმობის ტექსტი</h2>

      <form class="flex items-center font-medium gap-x-[225px]">
        <div class="flex items-center gap-1">
          <input type="radio" name="GE-EN" value="GE" v-model="formLang" checked/>

          <p class="text-xs">ქართული</p>
        </div>

        <div class="flex items-center gap-1">
          <input type="radio" name="GE-EN" value="EN" v-model="formLang"/>

          <p class="text-xs">ინგლისური</p>
        </div>
      </form>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-3.5 py-3.5">
      <h2 class="text-sm">აირჩიეთ თანხმობის ფორმა</h2>

      <form v-if="clientType==='IND'" class="flex items-center justify-between font-medium">
        <div class="flex items-center gap-1">
          <input type="radio" name="CF_CB_RS" value="CF_CB_REC" v-model="selectFormType" checked/>

          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიღება</p>
        </div>

        <div class="flex items-center gap-1">
          <input type="radio" name="CF_CB_RS" value="CF_CB_SEN" v-model="selectFormType"/>

          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიწოდება</p>
        </div>

        <div class="flex items-center gap-1">
          <input type="radio" name="CF_CB_RS" value="CF_RS_REC" v-model="selectFormType"/>

          <p class="whitespace-nowrap text-xs">შემოსავლების სამსახური</p>
        </div>
      </form>

      <form v-if="clientType==='LEG'" class="flex items-center font-medium gap-x-[145px]">
        <div class="flex items-center gap-1">
          <input type="radio" name="CF_CB_RS" value="CF_CB_REC" v-model="selectFormTypeLeg" checked/>

          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიღება</p>
        </div>

        <div class="flex items-center gap-1">
          <input type="radio" name="CF_CB_RS" value="CF_CB_SEN" v-model="selectFormTypeLeg"/>

          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიწოდება</p>
        </div>
      </form>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col py-4 gap-3.5 h-[78px]">
      <span v-if="clientType==='IND'" class="text-xs font-medium" v-for="(type, index) in _selectFormType" :key="index"
            v-text="type"/>

      <span v-else class="text-xs font-medium" v-for="(type, index) in _selectFormTypeLeg"
            :key="index * 5" v-text="type"/>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex justify-between items-center pt-3.5 gap-x-3.5">
      <p v-if="success" class="text-primary-blue font-mtavruli text-xs">შეტყობინება: <span
          class="text-custom-green font-mtavruli" v-text="success"/></p>
      <div v-else/>

      <div class="flex gap-x-3.5">
        <button
            class="w-20 rounded-md pt-2.5 pb-1.5  text-sm text-white bg-secondary-button-default font-mtavruli hover:bg-secondary-button-hover hover:transition">
          გაუქმება
        </button>

        <button v-if="formType === 'MT'"
                class="send-print-button"
                :disabled="disabled"
                @click="handleClick"
                v-text="'ბეჭდვა'"/>
        <button v-else
                class="send-print-button"
                :disabled="disabled"
                @click="handleClick"
                v-text="'გაგზავნა'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.send-print-button {
  @apply w-20 rounded-md pt-2.5 pb-1.5 text-sm text-white bg-primary-blue font-mtavruli hover:bg-primary-button-hover hover:transition disabled:text-placeholder-grey disabled:bg-stroke-grey disabled:cursor-not-allowed
}
</style>
