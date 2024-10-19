<script setup>
import Hr from "../components/Hr.vue";
import useUser from "../composables/useUser.js";
import useLeg from "../composables/useLeg.js";
import useNotification from "../composables/useNotification.js";

const {
  company,
  tax,
  loadingLeg,
  error,
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
  isNameSurnameValid,
  isPersonalNumberValid,
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
</script>
<style>
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

}
</style>
<template>
  <div class="flex flex-col p-4 shadow-xl rounded-lg w-[600px] border border-stroke-grey">
    <h1 class="pb-3 text-primary-blue font-mtavruli text-center">თანხმობის მოდული</h1>

    <Hr/>

    <div class="flex flex-col gap-y-3.5 py-3.5">
      <p class="text-sm">თანხმობის ფორმა</p>
      <form class="flex font-medium justify-between items-center">
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" value="MT" checked v-model="formType"/>
          <p class="text-xs whitespace-nowrap">თანხმობის მატერიალური ფორმა</p>
        </div>
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" value="EL" v-model="formType"/>
          <p class="text-xs whitespace-nowrap">თანხმობის ელექტრონული ფორმა</p>
        </div>
      </form>
    </div>
    <Hr/>


    <div class="flex flex-col  gap-y-3.5 py-3.5">
      <h2 class="text-sm">კლიენტის ტიპი</h2>

      <form class="flex gap-[181px] font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="IND-LEG" value="IND" v-model="clientType" checked/>
          <p class="text-xs">ფიზიკური პირი</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="IND-LEG" value="LEG" v-model="clientType"/>
          <p class="text-xs">იურიდიული პირი</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-y-1.5 py-3.5">
      <h2 v-if="clientType==='LEG'" class="text-sm">კლიენტის ნომერი / საიდენტიფიკაციო ნომერი</h2>
      <h2 v-if="clientType==='IND'" class="text-sm">კლიენტის ნომერი / პირადი ნომერი</h2>
      <div v-if="clientType==='IND'" class="flex gap-x-4">
        <input type="number"
               v-model="personalNumber"
               placeholder="შეიყვანეთ იდენტიფიკატორი"
               :class="{'border-secondary-button-default': notification}"
               class="text-sm font-bpg input input-bordered font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD] focus:outline-none focus:border focus:border-primary-blue w-[75%]" />
        <button class="hover:bg-primary-button-hover hover:transition pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white" @click="getUser"
                v-if="!loading">შემოწმება
        </button>
        <button v-else class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white"><span
            class="loading loading-spinner loading-sm"></span>
        </button>
      </div>

      <div v-else-if="clientType==='LEG'" class="flex gap-x-4">
        <input type="number"
               v-model="tax"
               placeholder="შეიყვანეთ იდენტიფიკატორი"
               :class="{'border-secondary-button-default': notification}"
               class="text-sm font-bpg input input-bordered font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD] focus:outline-none w-[75%]"/>
        <button class="hover:bg-primary-button-hover hover:transition pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white" @click="getCompany"
                v-if="!loadingLeg">შემოწმება
        </button>
        <button v-else class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white"><span
            class="loading loading-spinner loading-sm"></span>
        </button>
      </div>

      <span class="text-xs text-secondary-button-default" v-if="notification" v-text="notification"/>
    </div>
    <Hr/>

    <div class="flex flex-col py-3.5">
      <div v-if="clientType==='IND'" class="grid grid-cols-2 grid-rows-2 gap-4">
        <div :class="['flex flex-col gap-2' ]">
          <h2 class="text-sm font-medium">კლიენტის სახელი</h2>
          <input disabled
                 :value="user?.name"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="nameSurname"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="text">
        </div>

        <div :class="['flex flex-col gap-2']">
          <h2 class="text-sm font-medium">კლიენტის გვარი</h2>
          <input disabled
                 :value="user?.surname"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="nameSurname"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="text">
        </div>

        <div :class="['flex flex-col gap-2']">
          <h2 class="text-sm font-medium">პირადი ნომერი</h2>
          <input disabled
                 :value="user?.personalNumber"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="number" v-if="!editable">
          <input v-else
                 v-model="_personalNumber"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="number"
                 :maxlength="9"
                 @input="_personalNumber = _personalNumber?.toString().slice(0, 11)">
        </div>


        <div v-if="formType==='EL'" class="flex flex-col gap-2">
          <h2 class="text-sm font-medium">მობილური ტელეფონი</h2>
          <input disabled
                 :value="user?.phone_number"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="_phone_number"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                 type="number"
                 :maxlength="9"
                 @input="_phone_number = _phone_number?.toString().slice(0, 9)">
        </div>
      </div>


      <!--      იურიდიული პირი-->
      <div v-if="clientType==='LEG'" class="flex flex-col gap-4 pb-2">
        <!-- First Row -->
        <div class="flex gap-4 w-full">
          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-sm font-medium">კლიენტის დასახელება</h2>
            <input disabled
                   :value="company?.clientName"
                   class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="clientName"
                   class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-sm font-medium">საიდენტიფიკაციო ნომერი</h2>
            <input disabled
                   :value="company?.tax_number"
                   class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                   type="number" v-if="!editable">
            <input v-else
                   v-model="tax_number"
                   class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-lg input input-bordered font-medium  focus:outline-none  w-full"
                   type="number"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
          </div>
        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium ">უფლებამოსილი პირი (უფ.პ)</h2>
            <input
                :value="company?.legPearson"
                class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPearson"
                   class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს პირადი ნომერი</h2>
            <input
                :value="company?.legPearsonTax"
                class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPearsonTax"
                   class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text">

          </div>

          <div v-if="formType==='EL'" class="flex flex-col gap-2">
            <h2 class="text-sm font-medium">უფ.პ-ს მობილური</h2>
            <input
                :value="company?.phone_number"
                class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPersonPhone"
                   class="font-medium placeholder-[#98A2B3] rounded-lg border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
          </div>


        </div>
      </div>

      <!--      იურიდიული პირი-->

    </div>
    <Hr/>

    <div class="flex flex-col gap-3.5 py-3.5">
      <h2 class="text-sm">თანხმობის ტექსტი</h2>

      <form class="flex gap-x-[225px] font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="GE-EN" value="GE" v-model="formLang" checked/>
          <p class="text-xs">ქართული</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="GE-EN" value="EN" v-model="formLang"/>
          <p class="text-xs">ინგლისური</p>
        </div>
      </form>
    </div>
    <Hr/>


    <div class="flex flex-col gap-3.5 py-3.5">
      <h2 class="text-sm">აირჩიეთ თანხმობის ფორმა</h2>

      <form v-if="clientType==='IND'" class="flex justify-between font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormType" checked/>
          <p class="text-xs whitespace-nowrap">საკრ. ბიურო - მიღება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormType"/>
          <p class="text-xs whitespace-nowrap">საკრ. ბიურო - მიწოდება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="RS-REC" v-model="selectFormType"/>
          <p class="text-xs whitespace-nowrap">შემოსავლების სამსახური</p>
        </div>
      </form>

      <form v-if="clientType==='LEG'" class="flex gap-x-[145px] font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormTypeLeg" checked/>
          <p class="text-xs whitespace-nowrap">საკრ. ბიურო - მიღება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormTypeLeg"/>
          <p class="text-xs whitespace-nowrap">საკრ. ბიურო - მიწოდება</p>
        </div>

      </form>


    </div>
    <Hr/>
    <div class="flex flex-col gap-3.5 py-4">
      <span v-if="clientType==='IND'" class=" font-medium text-xs" v-for="(type, index) in _selectFormType" :key="index"
            v-text="type"/>
      <span v-if="clientType==='LEG'" class=" font-medium text-xs" v-for="(type, index) in _selectFormTypeLeg" :key="index"
            v-text="type"/>

    </div>
    <Hr/>
    <div class="flex justify-end gap-[22px] py-4 h-20">

      <button class="pt-1 text-sm bg-secondary-button-default hover:transition hover:bg-secondary-button-hover rounded-lg w-[23%] font-mtavruli text-white" onclick="window.close()">გაუქმება
      </button>
      <button v-if="formType==='MT' && clientType ==='IND'"
              class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white"
              :disabled="disabled()"
              @click="prt"
      >ბეჭდვა
      </button>

      <button v-else-if="formType==='EL' && clientType ==='IND'"
              class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white hover:bg-primary-button-hover hover:transition"
              :class="{'bg-stroke-grey text-placeholder-grey': disabled()}"
              :disabled="disabled()"
              @click="sendSms"
      >გაგზავნა
      </button>


      <button v-if="formType==='MT' && clientType ==='LEG'"
              class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white"
              :disabled="disabledLeg()"
              @click="prt"
      >ბეჭდვა
      </button>
      <button v-if="formType==='EL' && clientType ==='LEG'"
              class="pt-1 text-sm bg-primary-blue rounded-lg w-[23%] font-mtavruli text-white"
              :disabled="disabledLeg()"
              @click="prt"
      >გაგზავნა
      </button>

    </div>
    <Hr v-if="false"/> <!--ლოგიკა დასამატებელია-->
  </div>
</template>
