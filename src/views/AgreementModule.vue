<script setup>
import Hr from "../components/Hr.vue";
import useUser from "../composables/useUser.js";
import useLeg from "../composables/useLeg.js";

const {company, tax, loadingLeg, error, getCompany, clientName, tax_number, legPearson, legPearsonTax} = useLeg();

const {
  disabled,
  formType,
  clientType,
  notification,
  personalNumber,
  formLang,
  user,
  editable,
  loading,
  nameSurname,
  _personalNumber,
  isNameSurnameValid,
  isPersonalNumberValid,
  selectFormType,
  _selectFormType,
  getUser
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
  <div class="flex flex-col p-3 border-2 border-black rounded-xl max-w-2xl">

    <h1 class="text-2xl font-bold text-center">თანხმობის მოდული</h1>
    <Hr/>

    <div class="flex flex-col gap-4 pt-2">
      <h2 class="text-xl font-medium">თანხმობის ფორმა</h2>

      <form class="flex gap-6 font-medium items-center">
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" class="radio radio-sm" value="MT" checked v-model="formType"/>
          <p>თანხმობის მატერიალური ფორმა</p>
        </div>
        <div class="flex gap-1 items-center">
          <input type="radio" name="MT-EL" class="radio radio-sm" value="EL" v-model="formType"/>
          <p>თანხმობის ელექტრონული ფორმა</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-4 pt-2">
      <h2 class="text-xl font-medium">კლიენტის ტიპი</h2>

      <form class="flex gap-6 font-medium items-center">
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="IND-LEG" class="radio radio-sm" value="IND" v-model="clientType" checked/>
          <p>ფიზიკური პირი</p>
        </div>
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="IND-LEG" class="radio radio-sm" value="LEG" v-model="clientType"/>
          <p>იურიდიული პირი</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-2 pt-5 pb-2">
      <h2 v-if="clientType==='LEG'" class="font-medium">კლიენტის ნომერი / საიდენტიფიკაციო ნომერი</h2>
      <h2 v-if="clientType==='IND'" class="font-medium">კლიენტის ნომერი / პირადი ნომერი</h2>
      <div v-if="clientType==='IND'" class="flex gap-5">
        <input type="number"
               v-model="personalNumber"
               placeholder="XXXXXXX..."
               class="text-lg input input-bordered font-medium border-black focus:outline-none focus:border-black w-2/3"/>
        <button class="btn btn-neutral w-1/3 text-white" @click="getUser" v-if="!loading">შემოწმება</button>
        <button v-else class="btn btn-neutral w-1/3 text-white"><span class="loading loading-spinner loading-sm"></span>
        </button>
      </div>
      <div v-if="clientType==='LEG'" class="flex gap-5">
        <input type="number"
               v-model="tax"
               placeholder="XXXXXXX..."
               class="text-lg input input-bordered font-medium border-black focus:outline-none focus:border-black w-2/3"/>
        <button class="btn btn-neutral w-1/3 text-white" @click="getCompany" v-if="!loadingLeg">შემოწმება</button>
        <button v-else class="btn btn-neutral w-1/3 text-white"><span class="loading loading-spinner loading-sm"></span>
        </button>
      </div>
    </div>
    <Hr/>

    <div class="flex flex-col">
      <h2 class="font-medium text-xl mb-3">კლიენტის მონაცემები
      </h2>
      <div v-if="clientType==='IND'" class="flex gap-5 pb-2">
        <div class="flex flex-col gap-2 w-1/2">
          <h2 class="font-medium">კლიენტის სახელი, გვარი</h2>
          <input disabled
                 :value="user?.nameSurname"
                 class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                 type="text" v-if="!editable">
          <input v-else
                 v-model="nameSurname"
                 class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                 type="text">
        </div>

        <div class="flex flex-col gap-2 w-1/2">
          <h2 class="font-medium">პირადი ნომერი</h2>
          <input disabled
                 :value="user?.personalNumber"
                 class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                 type="number" v-if="!editable">
          <input v-else
                 v-model="_personalNumber"
                 class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                 type="number">
        </div>
      </div>
      <!--      იურიდიული პირი-->
      <div v-if="clientType==='LEG'" class="flex flex-col gap-5 pb-2">
        <!-- First Row -->
        <div class="flex gap-5 w-full">
          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="font-medium">კლიენტის დასახელება</h2>
            <input disabled
                   :value="company?.clientName"
                   class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="clientName"
                   class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="font-medium">საიდენტიფიკაციო ნომერი</h2>
            <input disabled
                   :value="company?.tax_number"
                   class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="number" v-if="!editable">
            <input v-else
                   v-model="tax_number"
                   class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="number">
          </div>
        </div>

        <!-- Second Row -->
        <div class="flex gap-5 w-full">
          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="font-medium">უფლებამოსილი პირი (უფ.პ)</h2>
            <input disabled
                   :value="company?.legPearson"
                   class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="text" v-if="!editable">
            <input v-else
                   v-model="legPearson"
                   class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="text">
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <h2 class="font-medium">უფ.პ პირადი ნომერი</h2>
            <input disabled
                   :value="company?.legPearsonTax"
                   class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="number" v-if="!editable">
            <input v-else
                   v-model="legPearsonTax"
                   class="input input-bordered font-medium border-black focus:outline-none focus:border-black w-full"
                   type="number">
          </div>
        </div>
      </div>

      <!--      იურიდიული პირი-->

    </div>
    <Hr/>

    <div class="flex flex-col gap-4 py-2">
      <h2 class="text-xl font-medium">თანხმობის ტექსტი</h2>

      <form class="flex gap-6 font-medium items-center">
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="GE-EN" value="GE" v-model="formLang" class="radio radio-sm" checked/>
          <p>ქართული</p>
        </div>
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="GE-EN" value="EN" v-model="formLang" class="radio radio-sm"/>
          <p>ინგლისური</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-4 py-2">
      <h2 class="text-xl font-medium">აირჩიეთ თანხმობის ფორმა</h2>

      <form class="flex gap-3 font-medium items-center">
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="CB-RS" value="CB-REC" v-model="selectFormType" checked class="radio radio-sm"/>
          <p>საკრე. ბიურო მიღება</p>
        </div>
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="CB-RS" value="CB-SEN" v-model="selectFormType" class="radio radio-sm"/>
          <p>საკრე. ბიურო მიწოდება</p>
        </div>
        <div class="flex gap-1 w-full items-center">
          <input type="radio" name="CB-RS" value="RS-REC" v-model="selectFormType" class="radio radio-sm"/>
          <p>შემოსავლების სამსახური</p>
        </div>
      </form>
    </div>
    <Hr/>
    <div class="flex flex-col gap-y-2.5 mx-4 h-16">
      <span v-for="(type, index) in _selectFormType" :key="index" v-text="type"/>
    </div>
    <Hr/>
    <div class="flex justify-between">

      <button class="btn btn-neutral w-1/3 text-white"
              :disabled="disabled()"
              @click="prt"
      >ბეჭდვა
      </button>
      <button class="btn btn-error w-1/3  text-white" onclick="window.close()">გაუქმება</button>
    </div>
    <Hr/>

    <div class="flex justify-between items-center" v-if="notification">
      <span class="font-medium">შეტყობინება:</span>
      <span v-text="notification"/>
    </div>
  </div>
</template>
