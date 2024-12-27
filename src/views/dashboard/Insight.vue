<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">Financial Insight</h1>
          <span>Keep track of your budget and transaction history.</span>
      </div>

      <div v-if="isLoading" class="text-center">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10 text-center">
              <div class="bg-custom-dark min-h-[200px] grid grid-cols-1 justify-center items-center rounded-[10px]">
                  <div class="px-4 flex lg:justify-center sm:text-2xl lg:text-3xl">
                      <div class="flex flex-col gap-2 text-white w-full">
                          Total Budget Amount
                          <h3 class="text-white font-bold">#{{ summary.remainingBudget || 0 }}</h3>
                      </div>
                  </div>
                  <div class="p-4 grid grid-cols-1 gap-2 text-center">
                      <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                          Total Weekly Budget Amount
                          <h3 class="text-wxl text-white font-bold">#80,000</h3>
                      </div>
                      <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                          Total Monthly Budget Amount
                          <h3 class="text-wxl text-white font-bold">#40,000</h3>
                      </div>
                  </div>
              </div>

              <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4">
                  Budget Chart
                  <AppChart :data="chartBudgetData" :options="chartBudgetOptions" />
              </div>
              <div class="bg-custom-dark min-h-[200px] grid grid-cols-1 justify-center items-center rounded-[10px]">
                  <div class="px-4 flex lg:justify-center">
                      <div class="flex flex-col gap-4 text-white w-full sm:text-2xl lg:text-3xl font-bold">
                          Total Balance
                          <h1 class="flex flex-col gap-2 text-white">#{{ totalBalance || 0 }}</h1>
                      </div>
                  </div>
                  <div class="p-4 grid grid-cols-1 gap-2 text-center">
                      <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                          Total Income
                          <h3 class="text-wxl text-white font-bold">#{{ summary.totalIncomeAmount || 0 }}</h3>
                      </div>
                      <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                          Total Money Spent
                          <h3 class="text-wxl text-white font-bold">#{{ summary.totalExpensesAmount || 0 }}</h3>
                      </div>
                  </div>
              </div>
              <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4">
                  Total Income against Total Money Spent
                  <AppChart :data="chartTransactionData" :options="chartTransactionOptions" />
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import AppChart from "@/components/AppChart.vue";

const store = useStore();

// Fetch summary data from the store
const summary = computed(() => store.getters["insight/getSummary"] || {});
const isLoading = computed(() => store.getters["insight/isLoading"]);
const error = computed(() => store.getters["insight/errorMessage"]);

onMounted(() => {
  store.dispatch("insight/fetchSummary");
});

// Dynamic chart data
const chartBudgetData = computed(() => ({
  labels: summary.value.topSpendingCategories?.map((cat) => cat.category) || [],
  datasets: [
      {
          label: "Top Spending Categories",
          data: summary.value.topSpendingCategories?.map((cat) => cat.amount) || [],
          backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#e91e63"],
      },
  ],
}));

const chartBudgetOptions = {
  animation: {
      duration: 1000,
  },
  responsive: true,
  plugins: {
      legend: {
          display: true,
          position: "bottom",
          labels: {
              color: "#141414",
          },
      },
  },
};

const chartTransactionData = computed(() => ({
  labels: ["Income", "Expenses"],
  datasets: [
      {
          label: "Transaction Overview",
          data: [
              summary.value.totalIncomeAmount || 0,
              summary.value.totalExpensesAmount || 0,
          ],
          backgroundColor: ["#4caf50", "#f44336"],
      },
  ],
}));

const totalBalance = computed(() => summary.value.totalIncomeAmount - summary.value.totalExpensesAmount);

const chartTransactionOptions = {
  animation: {
      duration: 1000,
  },
  responsive: true,
  plugins: {
      legend: {
          display: true,
          position: "bottom",
          labels: {
              color: "#141414",
          },
      },
  },
};
</script>
