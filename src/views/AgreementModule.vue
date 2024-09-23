<script setup>

import Hr from "../components/Hr.vue";
</script>

<template>
  <div class="flex flex-col p-3 border-2 border-black rounded-xl">

    <h1 class="text-2xl font-bold text-center">თანხმობის მოდული</h1>
    <Hr/>

    <div class="flex flex-col gap-4 pt-2">
      <h2 class="text-xl font-medium">თანხმობის ფორმა</h2>

      <form class="flex gap-6 font-medium">
        <div class="flex gap-1">
          <input type="radio" name="radio-1" class="radio" checked="checked" />
          <p>თანხმობის მატერიალური ფორმა</p>
        </div>
        <div class="flex gap-1">
          <input type="radio" name="radio-1" class="radio" />
          <p>თანხმობის ელექტრონული ფორმა</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-4 pt-2">
      <h2 class="text-xl font-medium">კლიენტის ტიპი</h2>

      <form class="flex gap-6 font-medium">
        <div class="flex gap-1 w-full">
          <input type="radio" name="radio-1" class="radio" checked="checked" />
          <p>ფიზიკური პირი</p>
        </div>
        <div class="flex gap-1 w-full">
          <input type="radio" name="radio-1" class="radio" />
          <p>იურიდიული პირი</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-2 pt-5 pb-2">
      <h2 class="font-medium">კლიენტის ნომერი / პირადი ნომერი</h2>
      <div class="flex gap-5">
        <input type="number"
               placeholder="XXXXXXX..."
               class="text-xl input input-bordered font-medium border-black focus:outline-black focus:border-black w-2/3" />
        <button class="btn btn-neutral w-1/3 text-white">შემოწმება</button>
      </div>
    </div>
    <Hr/>

    <div class="flex flex-col">
      <h2 class="font-medium text-xl mb-3">კლიენტის მონაცემები</h2>

      <div class="flex gap-5 pb-2">
        <div class="flex flex-col gap-2 w-1/2">
          <h2 class="font-medium">კლიენტის სახელი, გვარი</h2>
          <input :disabled="true"
                 class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-black focus:border-black w-full"
                 type="number" >
        </div>

        <div class="flex flex-col gap-2 w-1/2">
          <h2 class="font-medium">პირადი ნომერი</h2>
          <input :disabled="true"

                 class="disabled:text-gray-900 input input-bordered font-medium border-black focus:outline-black focus:border-black w-full"
                 type="number" >
        </div>
      </div>
    </div>
    <Hr/>

    <div class="flex flex-col gap-4 py-2">
      <h2 class="text-xl font-medium">თანხმობის ტექსტი</h2>

      <form class="flex gap-6 font-medium">
        <div class="flex gap-1 w-full">
          <input type="radio" name="radio-1" class="radio" checked="checked" />
          <p>ქართული</p>
        </div>
        <div class="flex gap-1 w-full">
          <input type="radio" name="radio-1" class="radio" />
          <p>ინგლისური</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex flex-col gap-4 py-2">
      <h2 class="text-xl font-medium">თანხმობის ფორმა</h2>

      <form class="flex gap-6 font-medium">
        <div class="flex gap-1 w-full">
          <input type="checkbox" checked="checked" class="checkbox" />
          <p>საკრე. ბიურო მიღება</p>
        </div>
        <div class="flex gap-1 w-full">
          <input type="checkbox" checked="checked" class="checkbox" />
          <p>საკრე. ბიურო მიწოდება</p>
        </div>
      </form>
    </div>
    <Hr/>

    <div class="flex justify-between">
      <button class="btn btn-neutral w-1/3 text-white">ბეჭდვა</button>
      <button class="btn btn-error w-1/3  text-white">გაუქმება</button>
    </div>
    <Hr/>

  </div>
</template>
