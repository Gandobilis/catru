<script setup>
import { onMounted, ref, watch } from "vue";
import useUser from "../composables/useFilters.js";
import { DateTime } from "luxon";
import XIcon from "../assets/icons/xIcon.vue"; // Import Luxon for date formatting

// Fetch data using the composable
const { getData, data, currentPage, totalPages } = useUser();

// Initialize refs for filter fields
const status = ref("");
const formType = ref("");
const receiptDate = ref("");
const IDNumber = ref(""); // Add any other filter fields you need

// Watch for changes in any of the filter fields and call getData again with new filters
watch([status, formType, receiptDate, IDNumber], () => {
  const filters = {
    Status: status.value,
    FormType: formType.value,
    ReceiptDate: receiptDate.value,
    IDNumber: IDNumber.value
  };
  getData(filters);
}, { immediate: true });

const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle null or undefined dates
  return DateTime.fromISO(dateString).toFormat("MM-dd-yyyy"); // Format to 'month:day:year'
};

// Reset function to clear individual filters
const clearFilter = (filterName) => {
  switch (filterName) {
    case 'status':
      status.value = '';
      break;
    case 'formType':
      formType.value = '';
      break;
    case 'receiptDate':
      receiptDate.value = '';
      break;
    case 'IDNumber':
      IDNumber.value = '';
      break;
  }
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    getData(); // Fetch data for the new page
  }
};

onMounted(() => {
  getData(); // Initial data fetch without filters
});
</script>

<template>
  <div v-if="data" class="overflow-x-auto flex flex-col gap-12">
    <div class="w-full flex gap-24 justify-between">

      <!-- Display Active Filters Here -->
      <div class="flex gap-5">
        <div v-if="status" class="rounded-xl border p-3 md:text-lg gap-5 flex text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none">
          <span class="text-gray-700">{{ status }}</span>
          <button @click="clearFilter('status')" class="text-red-500"><x-icon/></button>
        </div>
        <div v-if="formType" class="rounded-xl border p-3 md:text-lg gap-5 flex text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none">
          <span class="text-gray-700">{{ formType }}</span>
          <button @click="clearFilter('formType')" class="text-red-500"><x-icon/></button>
        </div>
        <div v-if="receiptDate" class="rounded-xl border p-3 md:text-lg gap-5 flex text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none">
          <span class="text-gray-700"> {{ formatDate(receiptDate) }}</span>
          <button @click="clearFilter('receiptDate')" class="text-red-500"><x-icon/></button>
        </div>
        <div v-if="IDNumber" class="rounded-xl border p-3 md:text-lg gap-5 flex text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none">
          <span class="text-gray-700"> {{ IDNumber }}</span>
          <button @click="clearFilter('IDNumber')" class="text-red-500"><x-icon/></button>
        </div>
      </div>

      <div class="flex gap-3">
        <input
            v-model="IDNumber"
            type="number"
            placeholder="პირადი/კლიენტის ნომერი"
            class="rounded-xl border p-3 md:text-lg w-96 text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
        />
        <input
            v-model="status"
            placeholder="სტატუსი"
            class="rounded-xl border p-3 md:text-lg w-96 text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
        />

        <input
            v-model="receiptDate"
            type="date"
            placeholder="თარიღი"
            class="rounded-xl border p-3 md:text-lg w-96 text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none text-gray-500"
        />
        <input
            v-model="formType"
            placeholder="თანხმობის ტიპი"
            class="rounded-xl border p-3 md:text-lg w-96 text-sm border-placeholder-grey placeholder-placeholder-grey focus:outline-none"
        />
      </div>
    </div>

    <!-- Table for Displaying Filtered Data -->
    <table class="table-fixed w-full border-collapse border border-gray-300 text-sm text-center">
      <thead class="bg-blue-500 text-white">
      <tr class="bg-primary-blue">
        <th class="border border-gray-300 px-4 py-2" style="width: 150px; height: 50px;">კლიენტის მონაცემები</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 120px; height: 50px;">ფორმის დასახელება</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 120px; height: 50px;">ფორმის ვერსიის ნომერი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 100px; height: 50px;">ფორმის ID</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 150px; height: 50px;">თანხმობის ტიპი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 180px; height: 50px;">მაინიცირებელი მომხმარებლის მონაცემები</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 150px; height: 50px;">დადასტურების თარიღი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 150px; height: 50px;">უარყოფის თარიღი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 120px; height: 50px;">სტატუსი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 180px; height: 50px;">თანხმობის მიღების თარიღი</th>
        <th class="border border-gray-300 px-4 py-2" style="width: 200px; height: 50px;">მოქმედების ვადა</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in data" :key="user.id">
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.ClientName }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.consentTemplate.TemplateCode }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">Row 1</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.TemplateID }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.FormType }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.AuthorizedName }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">Row 1</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">Row 1</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ user?.Status }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ formatDate(user?.ReceiptDate) }}</td>
        <td class="border border-gray-300 px-4 py-2" style="height: 50px;">{{ formatDate(user?.ValidityDate) }}</td>
      </tr>
      </tbody>
    </table>


    <div class="mt-6 flex justify-center gap-4">
      <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        წინა გვერდი
      </button>
      <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
      <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        შემდეგი გვერდი
      </button>
    </div>
  </div>
</template>