<template>
  <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">Welcome, {{ userName }}</h1>
          <span>Keep track of your budget and transaction history.</span>
      </div>

      <div v-if="isLoading" class="text-center">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else>
          <!-- Two-column grid layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">
              <!-- Recent Transactions Section -->
              <div class="bg-white p-4 rounded-[20px] shadow-md">
                  <h3 class="text-xl font-semibold">Recent Transactions</h3>
                  <ul class="space-y-2">
                      <li v-for="(transaction, index) in recentTransactions" :key="index" class="border-b pb-2">
                          <span class="font-semibold">{{ transaction.type }}</span>: #{{ transaction.amount }}
                      </li>
                  </ul>
              </div>

              <!-- Recent Budgets Section -->
              <div class="bg-white p-4 rounded-[20px] shadow-md">
                  <h3 class="text-xl font-semibold">Recent Budgets</h3>
                  <ul class="space-y-2">
                      <li v-for="(budget, index) in recentBudgets" :key="index" class="border-b pb-2">
                          <span class="font-semibold">{{ budget.category }}</span>: #{{ budget.amount }}
                      </li>
                  </ul>
              </div>
          </div>

          <!-- Retaining the chart for Total Income vs Total Balance -->
          <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4 mt-6">
              <h4>Total Income against Total Money Spent</h4>
              <AppChart :data="chartTransactionData" :options="chartTransactionOptions" />
          </div>

          <!-- New Bar Chart for Monthly Insights -->
          <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4 mt-6">
              <h4>Monthly Insights</h4>
              <AppChart :data="chartMonthlyData" :options="chartMonthlyOptions" />
          </div>
      </div>
  </div>
  <div class="bar-chart">
    <div class="bar"
         v-for="(value, index) in data"
         :key="index"
         :style="{ height: `${value}%` }">
      <span class="bar-label">{{ value }}%</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, computed } from "vue";
import { useStore } from "vuex";
import AppChart from "@/components/AppChart.vue";

const store = useStore();

// Fetch summary data from the store
const summary = computed(() => store.getters["insight/getSummary"] || {});
const isLoading = computed(() => store.getters["insight/isLoading"]);
const error = computed(() => store.getters["insight/errorMessage"]);
const data = [50, 80, 30, 60, 90];

// Fetch user name (can be fetched from a user store if available)
const userName = computed(() => "User");

// Fetch recent transactions and recent budgets from the store
const recentTransactions = computed(() => store.getters["insight/getRecentTransactions"] || []);
const recentBudgets = computed(() => store.getters["insight/getBudgets"] || []);

// Fetch monthly insights from the store
const monthlyInsights = computed(() => store.getters["insight/getMonthlyInsights"] || []);

// Dynamic chart data for Total Income against Total Balance
const chartTransactionData = computed(() => {
  if (!summary.value || !summary.value.totalIncomeAmount || !summary.value.totalExpensesAmount) {
    // Return empty chart data if the summary data is not ready
    return {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Transaction Overview",
          data: [0, 0],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    };
  }

  return {
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
  };
});

// Chart options for total income vs total spent
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

// Dynamic chart data for Monthly Insights
const chartMonthlyData = computed(() => {
  const labels = monthlyInsights.value.map(item => item.monthYear);
  const incomeData = monthlyInsights.value.map(item => item.income);
  const expenseData = monthlyInsights.value.map(item => item.expenses);

  return {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#4caf50",
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "#f44336",
      },
    ],
  };
});

const chartMonthlyOptions = {
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

// Fetch data when component is mounted
onBeforeMount(() => {
  store.dispatch("insight/fetchSummary");
  store.dispatch("insight/fetchBudgets");
  store.dispatch("insight/fetchRecentTransactions");
  store.dispatch("insight/fetchMonthlyInsights");
});

</script>
<style scoped>
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 300px;
  width: 100%;
  border: 1px solid #ccc;
}

.bar {
  width: 40px;
  background-color: #4CAF50;
  display: flex;
  justify-content: center;
  position: relative;
}

.bar-label {
  position: absolute;
  bottom: -25px;
  font-size: 12px;
  color: #333;
}
</style>
