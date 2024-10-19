<script setup>
import Hr from "../components/Hr.vue";
import useUser from "../composables/useUser.js";
import useLeg from "../composables/useLeg.js";
import useNotification from "../composables/useNotification.js";

const {company, tax, loadingLeg, error, getCompany, clientName, tax_number, legPearson, legPearsonTax, disabledLeg, legPersonPhone} = useLeg();
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
  <div class="flex flex-col p-5 pt-0 shadow-2xl rounded-2xl w-[500px]">

    <h1 class="py-4 text-[#1C5285] font-nino font-bold text-center">თანხმობის მოდული</h1>

    <Hr/>


    <div class="flex flex-col gap-[22px]   py-[22px]">
      <h2 class="text-xl font-bpg font-semibold">თანხმობის ფორმა</h2>

      <form class="flex gap-6 font-medium justify-between items-center">
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" class="radio-xs " value="MT" checked v-model="formType"/>
          <p>თანხმობის მატერიალური ფორმა</p>
        </div>
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" class="radio-xs" value="EL" v-model="formType"/>
          <p>თანხმობის ელექტრონული ფორმა</p>
        </div>
      </form>
    </div>
    <Hr/>


    <div class="flex flex-col gap-[22px] py-[22px]">
      <h2 class="text-xl font-bpg font-semibold">კლიენტის ტიპი</h2>

      <form class="flex gap-6 justify-between font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="IND-LEG" class=" radio-xs" value="IND" v-model="clientType" checked/>
          <p>ფიზიკური პირი</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="IND-LEG" class=" radio-xs" value="LEG" v-model="clientType"/>
          <p>იურიდიული პირი</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-[10px] py-[22px]">
      <h2 v-if="clientType==='LEG'" class="text-lg font-medium">კლიენტის ნომერი / საიდენტიფიკაციო ნომერი</h2>
      <h2 v-if="clientType==='IND'" class="text-lg font-medium">კლიენტის ნომერი / პირადი ნომერი</h2>
      <div v-if="clientType==='IND'" class="flex gap-5">
        <input type="number"
               v-model="personalNumber"
               placeholder="შეიყვანეთ იდენტიფიკატორი"
               class="font-bpg input input-bordered font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD] focus:outline-none  w-[75%]"/>
        <button class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[23%] font-bpg text-white" @click="getUser" v-if="!loading">შემოწმება</button>
        <button v-else class="btn btn-neutral w-[23%] rounded-xl text-white"><span class="loading loading-spinner loading-sm"></span>
        </button>
      </div>

      <div v-if="clientType==='LEG'" class="flex gap-5">
        <input type="number"
               v-model="tax"
               placeholder="შეიყვანეთ იდენტიფიკატორი"
               class="font-bpg input input-bordered font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD] focus:outline-none  w-[75%]"/>
        <button class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[23%] font-bpg text-white" @click="getCompany" v-if="!loadingLeg">შემოწმება</button>
        <button v-else class="btn btn-neutral w-[23%] rounded-xl text-white"><span class="loading loading-spinner loading-sm"></span>
        </button>
      </div>
    </div>
    <Hr/>

    <div class="flex flex-col gap-[20px] py-[22px]">
      <div v-if="clientType==='IND'" class="flex xs  justify-between gap-5 pb-2">
        <div :class="['flex flex-col gap-2', formType==='MT'?'w-1/2':'w-[30%]' ]">
          <h2 class="text-lg font-medium">კლიენტის სახელი, გვარი</h2>
          <input disabled
                 :value="user?.nameSurname"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="nameSurname"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="text">
        </div>


        <div :class="['flex flex-col gap-2', formType==='MT'?'w-1/2':'w-[30%]' ]">
          <h2 class="text-lg font-medium">პირადი ნომერი</h2>
          <input disabled
                 :value="user?.personalNumber"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="number" v-if="!editable">
          <input v-else
                 v-model="_personalNumber"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="number"
                 :maxlength="9"
                 @input="_personalNumber = _personalNumber?.toString().slice(0, 11)">
        </div>


        <div v-if="formType==='EL'" class="flex flex-col gap-2 w-[30%]">
          <h2 class="text-lg font-medium">მობილური (SMS)</h2>
          <input disabled
                 :value="user?.phone_number"
                 class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="_phone_number"
                 class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                 type="number"
                 :maxlength="9"
                 @input="_phone_number = _phone_number?.toString().slice(0, 9)">
        </div>
      </div>


      <!--      იურიდიული პირი-->
      <div v-if="clientType==='LEG'" class="flex flex-col gap-5 pb-2">
        <!-- First Row -->
        <div class="flex gap-5 w-full">
          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-lg font-medium">კლიენტის დასახელება</h2>
            <input disabled
                   :value="company?.clientName"
                   class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="clientName"
                   class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-lg font-medium">საიდენტიფიკაციო ნომერი</h2>
            <input disabled
                   :value="company?.tax_number"
                   class="disabled:text-gray-900 border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                   type="number"  v-if="!editable">
            <input v-else
                   v-model="tax_number"
                   class="border-[#D0D5DD] placeholder-[#98A2B3] rounded-xl input input-bordered font-medium  focus:outline-none  w-full"
                   type="number"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
          </div>
        </div>

        <!-- Second Row -->
        <div class="flex gap-5 w-full">
          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-lg font-medium ">უფლებამოსილი პირი (უფ.პ)</h2>
            <input
                   :value="company?.legPearson"
                   class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="legPearson"
                   class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="text-lg font-medium">უფ.პ პირადი ნომერი</h2>
            <input
                   :value="company?.legPearsonTax"
                   class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="legPearsonTax"
                   class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text">

          </div>

          <div v-if="formType==='EL'" class="flex flex-col gap-2 w-1/2">
            <h2 class="text-lg font-medium">უფ.პ მობილური (SMS)</h2>
            <input
                :value="company?.phone_number"
                class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                type="text" v-if="!editable">
            <input v-else
                   v-model="legPersonPhone"
                   class="font-medium placeholder-[#98A2B3] rounded-xl border-[#D0D5DD]  input input-bordered focus:outline-none  w-full"
                   type="text"
                   :maxlength="9"
                   @input="tax_number = tax_number?.toString().slice(0, 9)">
          </div>




        </div>
      </div>

      <!--      იურიდიული პირი-->

    </div>
    <Hr/>

    <div class="flex flex-col gap-[22px] py-[22px]">
      <h2 class="text-xl font-bpg font-semibold">თანხმობის ტექსტი</h2>

      <form class="flex gap-6 justify-between font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="GE-EN" value="GE" v-model="formLang" class=" radio-xs" checked/>
          <p>ქართული</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="GE-EN" value="EN" v-model="formLang" class=" radio-xs"/>
          <p>ინგლისური</p>
        </div>
      </form>
    </div>
    <Hr/>



    <div class="flex flex-col gap-[22px] py-[22px]">
      <h2 class="text-xl font-bpg font-semibold">აირჩიეთ თანხმობის ფორმა</h2>

      <form v-if="clientType==='IND'" class="flex gap-16 justify-between font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormType" checked class=" radio-xs"/>
          <p>საკრე. ბიურო მიღება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormType" class=" radio-xs"/>
          <p>საკრე. ბიურო მიწოდება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="RS-REC" v-model="selectFormType" class=" radio-xs"/>
          <p>შემოსავლების სამსახური</p>
        </div>
      </form>

      <form v-if="clientType==='LEG'" class="flex  justify-between font-medium items-center">
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormTypeLeg" checked class=" radio-xs"/>
          <p>საკრე. ბიურო მიღება</p>
        </div>
        <div class="flex gap-1  items-center">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormTypeLeg" class=" radio-xs"/>
          <p>საკრე. ბიურო მიწოდება</p>
        </div>

      </form>


    </div>
    <Hr/>
    <div class="flex flex-col gap-[22px] py-[22px]">
      <span v-if="clientType==='IND'"  class=" font-medium" v-for="(type, index) in _selectFormType" :key="index" v-text="type"/>
      <span v-if="clientType==='LEG'" class=" font-medium" v-for="(type, index) in _selectFormTypeLeg" :key="index" v-text="type"/>

    </div>
    <Hr/>
    <div class="flex justify-end gap-[22px] py-[22px]">

      <button class="btn btn-error bg-[#ED1C24] rounded-xl w-[20%]  text-white" onclick="window.close()">გაუქმება</button>
      <button v-if="formType==='MT' && clientType ==='IND'" class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[20%] text-white"
              :disabled="disabled()"
              @click="prt"
      >ბეჭდვა
      </button>

      <button v-else-if="formType==='EL' && clientType ==='IND'" class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[20%] text-white"
              :disabled="disabled()"
              @click="sendSms"
      >გაგზავნა
      </button>



      <button v-if="formType==='MT' && clientType ==='LEG'" class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[20%] text-white"
              :disabled="disabledLeg()"
              @click="prt"
      >ბეჭდვა
      </button>
      <button v-if="formType==='EL' && clientType ==='LEG'" class="btn btn-neutral bg-[#1C5285]  rounded-xl w-[20%] text-white"
              :disabled="disabledLeg()"
              @click="prt"
      >გაგზავნა
      </button>

    </div>
    <Hr/>

    <div class="flex justify-between items-center" v-if="notification">
      <span class="font-semibold">შეტყობინება:</span>
      <span class="font-medium" v-text="notification"/>
    </div>
  </div>
</template>
