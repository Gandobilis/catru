<script setup>
import useUser from "../composables/useUser.js";
import useLeg from "../composables/useLeg.js";
import useNotification from "../composables/useNotification.js";
import {computed} from "vue";

const {
  company,
  tax,
  loadingLeg,
  getCompany,
  clientName,
  tax_number,
  legPearson,
  legPearsonTax,
  disabledLeg,
  legPersonPhone
} = useLeg();
const {notification, editable, formType} = useNotification()
const {
  disabled,
  clientType,
  personalNumber,
  formLang,
  user,
  _phone_number,
  loading,
  nameSurname,
  _personalNumber,
  selectFormType,
  _selectFormType,
  _selectFormTypeLeg,
  selectFormTypeLeg,
  getUser,
  sendSms
} = useUser()

const prt = () => {
  window.print()
}

const buttonText = computed(() =>
    formType.value === 'MT' ? 'ბეჭდვა' : 'გაგზავნა'
);

const handleClick = () => {
  if (formType === 'EL' && clientType === 'IND') {
    sendSms()
  } else {
    prt()
  }
};

const identifier = computed({
  get() {
    return clientType.value === 'IND' ? personalNumber.value : tax.value
  },
  set(value) {
    if (clientType.value === 'IND') {
      personalNumber.value = value
    } else {
      tax.value = value
    }
  }
})

const placeholderText = computed(() => {
  return clientType.value === 'IND' ? 'შეიყვანეთ იდენტიფიკატორი' : 'შეიყვანეთ საგადასახადო კოდი'
})

const isLoading = computed(() => {
  return clientType.value === 'IND' ? loading.value : loadingLeg.value
})

const checkClient = () => {
  if (clientType.value === 'IND') {
    getUser()
  } else {
    getCompany()
  }
}
</script>

<template>
  <div class="flex flex-col rounded-lg border p-4 shadow-xl w-[600px] border-stroke-grey">
    <p class="pb-3 text-center text-primary-blue font-mtavruli">თანხმობის მოდული</p>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-3.5 py-3.5">
      <p class="text-sm">თანხმობის ფორმა</p>

      <form class="flex items-center justify-between font-medium">
        <div class="flex items-center gap-x-1">
          <input type="radio" name="MT-EL" value="MT" checked v-model="formType"/>

          <p class="whitespace-nowrap text-xs">თანხმობის მატერიალური ფორმა</p>
        </div>

        <div class="flex items-center gap-x-1">
          <input type="radio" name="MT-EL" value="EL" v-model="formType"/>

          <p class="whitespace-nowrap text-xs">თანხმობის ელექტრონული ფორმა</p>
        </div>
      </form>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-3.5 py-3.5">
      <p class="text-sm">კლიენტის ტიპი</p>

      <form class="flex items-center gap-[181px]">
        <div class="flex items-center gap-x-1">
          <input type="radio" name="IND-LEG" value="IND" v-model="clientType" checked/>

          <p class="text-xs">ფიზიკური პირი</p>
        </div>

        <div class="flex items-center gap-x-1">
          <input type="radio" name="IND-LEG" value="LEG" v-model="clientType"/>

          <p class="text-xs">იურიდიული პირი</p>
        </div>
      </form>
    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex flex-col gap-y-1.5 py-3.5">
      <p v-if="clientType==='LEG'" class="text-sm">კლიენტის ნომერი / საიდენტიფიკაციო ნომერი</p>

      <p v-else-if="clientType==='IND'" class="text-sm">კლიენტის ნომერი / პირადი ნომერი</p>

      <div class="flex gap-x-3.5">
        <input
            v-model="identifier"
            :placeholder="placeholderText"
            :class="{'border-secondary-button-default': notification}"
            class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey w-[75%] focus:outline-none"/>

        <button
            class="rounded-md pt-1 text-sm text-white bg-primary-blue w-[23%] font-mtavruli hover:bg-primary-button-hover hover:transition disabled:text-placeholder-grey disabled:bg-stroke-grey disabled:cursor-not-allowed"
            @click="checkClient"
            :disabled="!identifier"
            v-if="!isLoading">შემოწმება
        </button>

        <button v-else class="rounded-lg pt-1 text-sm text-white bg-primary-blue w-[23%] font-mtavruli">
          <span class="loading loading-spinner loading-sm"></span>
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
                 v-model="nameSurname"
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
                 v-model="nameSurname"
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
                 v-model="_personalNumber"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="number"
                 :maxlength="9"
                 @input="_personalNumber = _personalNumber?.toString().slice(0, 11)">
        </div>


        <div v-if="formType==='EL'" class="flex flex-col gap-2">
          <h2 class="text-sm font-medium">მობილური ტელეფონი</h2>
          <input disabled
                 :value="user?.phone_number"
                 class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="_phone_number"
                 class="rounded-md border p-2 text-xs border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
                 type="number"
                 :maxlength="9"
                 @input="_phone_number = _phone_number?.toString().slice(0, 9)">
        </div>
      </div>


      <!--      იურიდიული პირი-->
      <div v-if="clientType==='LEG'" class="flex flex-col gap-3.5">
        <!-- First Row -->
        <div class="flex w-full gap-3.5">
          <div class="flex w-1/2 flex-col gap-2">
            <h2 class="text-sm font-medium">კლიენტის დასახელება</h2>
            <input disabled
                   :value="company?.clientName"
                   class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="clientName"
                   class="rounded-md border border-placeholder-grey p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text">
          </div>

          <div class="flex w-1/2 flex-col gap-2">
            <h2 class="text-sm font-medium">საიდენტიფიკაციო ნომერი</h2>
            <input disabled
                   :value="company?.tax_number"
                   class="rounded-md p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="number" v-if="!editable">
            <input v-else
                   v-model="tax_number"
                   class="rounded-md border border-placeholder-grey p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="number"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
          </div>
        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფლებამოსილი პირი (უფ.პ)</h2>
            <input
                :value="company?.legPearson"
                class="rounded-md p-2 text-xs border border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPearson"
                   class="rounded-md border border-placeholder-grey p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text">
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს პირადი ნომერი</h2>
            <input
                :value="company?.legPearsonTax"
                class="rounded-md p-2 text-xs border border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPearsonTax"
                   class="rounded-md border border-placeholder-grey p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text">

          </div>

          <div v-if="formType==='EL'" class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს მობილური</h2>
            <input
                :value="company?.phone_number"
                class="rounded-md p-2 text-xs border border-placeholder-grey placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPersonPhone"
                   class="rounded-md  border border-placeholder-grey p-2 text-xs placeholder-placeholder-grey focus:outline-none disabled:text-placeholder-grey disabled:bg-disabled disabled:cursor-not-allowed"
                   type="text"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
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
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormType" checked/>
          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიღება</p>
        </div>
        <div class="flex items-center gap-1">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormType"/>
          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიწოდება</p>
        </div>
        <div class="flex items-center gap-1">
          <input type="radio" name="CB-RS" value="RS-REC" v-model="selectFormType"/>
          <p class="whitespace-nowrap text-xs">შემოსავლების სამსახური</p>
        </div>
      </form>

      <form v-if="clientType==='LEG'" class="flex items-center font-medium gap-x-[145px]">
        <div class="flex items-center gap-1">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormTypeLeg" checked/>
          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიღება</p>
        </div>
        <div class="flex items-center gap-1">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormTypeLeg"/>
          <p class="whitespace-nowrap text-xs">საკრ. ბიურო - მიწოდება</p>
        </div>

      </form>


    </div>
    <hr class="text-placeholder-grey"/>
    <div class="flex flex-col py-4 gap-3.5">
      <span v-if="clientType==='IND'" class="text-xs font-medium" v-for="(type, index) in _selectFormType" :key="index"
            v-text="type"/>
      <span v-if="clientType==='LEG'" class="text-xs font-medium" v-for="(type, index) in _selectFormTypeLeg"
            :key="index"
            v-text="type"/>

    </div>

    <hr class="text-placeholder-grey"/>

    <div class="flex justify-end pt-3.5 gap-x-3.5">
      <button
          class="w-20 rounded-md pt-3 pb-2 text-sm text-white bg-secondary-button-default font-mtavruli hover:bg-secondary-button-hover hover:transition">
        გაუქმება
      </button>

      <button
          class="send-print-button"
          :disabled="formType === 'MT' ? disabled()  : disabledLeg()"
          @click="handleClick"
          v-text="buttonText"
      />
    </div>

    <hr v-if="false"/> <!--ლოგიკა დასამატებელია-->
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
  @apply w-20 rounded-md pt-3 pb-2 text-sm text-white bg-primary-blue font-mtavruli hover:bg-primary-button-hover hover:transition disabled:text-placeholder-grey disabled:bg-stroke-grey disabled:cursor-not-allowed
}
</style>
