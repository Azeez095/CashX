<template>
  <div class="flex flex-col justify-center items-center">
  <div class="flex flex-col z-20 w-full md:w-[70vw]">
    <div
      class="flex flex-col md:flex-row mt-0 md:mb-7 md:justify-between md:items-center"
    >
      <h1 class="font-medium text-xl md:text-3xl items-start mb-4 md:mb-0">
        Dashboard
      </h1>
      <router-link to="/dashboard/transaction">
        <div
          class="flex text-md md:text-base justify-center items-center bg-custom-light text-custom-dark"
        >
          <button
            class="border border-custom-dark border-2 rounded-xl md:rounded-full flex hover:bg-gray-200 px-2 md:px-4 mb-4 md:mb-0 semi-bold justify-center items-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img src="@/assets/icons/AddBlack.svg" alt="add" />
            <span class="py-1 md:py-3 mx-auto">Add transaction</span>
          </button>
        </div>
      </router-link>
    </div>
    <div >
      <!-- Insights Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
        <!-- Total Income Card -->
        <div
          class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-xl font-semibold">Income</h3>
          <p class="text-xl font-bold text-[#4bc0c0]">
            <!-- Conditional rendering for Total Income -->
            ₦{{
              insightSummary.totalIncomeAmount
                ? insightSummary.totalIncomeAmount.toLocaleString()
                : "0"
            }}
          </p>
        </div>

        <!-- Total Expenses Card -->
        <div
          class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-xl font-semibold">Expenses</h3>
          <p class="text-xl font-bold text-[#ff6384]">
            <!-- Conditional rendering for Total Expenses -->
            ₦{{
              insightSummary.totalExpensesAmount
                ? insightSummary.totalExpensesAmount.toLocaleString()
                : "0"
            }}
          </p>
        </div>

        <!-- Balance Card -->
        <div
          class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-xl font-semibold">Balance</h3>
          <p class="text-xl font-bold">
            <!-- Conditional rendering for Balance -->
            ₦{{
              insightSummary.totalIncomeAmount &&
              insightSummary.totalExpensesAmount
                ? (
                    insightSummary.totalIncomeAmount -
                    insightSummary.totalExpensesAmount
                  ).toLocaleString()
                : "0"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Bar Chart -->
    <div
      class="bg-gray-300 p-0 w-full h-[40vh] border rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
    >
      <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        class="w-full sm:w-[100vw]"
      />
    </div>

    <div
      class="flex flex-col md:flex-row md:justify-between md:w-full h-auto bg-custom-dark mt-4 pt-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
    >
      <div
        class="bg-custom-dark p-0 w-full bg-custom-dark sm:h-auto md:h-[40vh] flex justify-center items-center"
      >
        <Doughnut
          id="doughnut-chart-id"
          :options="doughnutOptions"
          :data="processedDoughnutData"
          class="w-full h-auto max-w-[400px] max-h-[400px] bg-custom-dark text-custom-light"
        />
      </div>

      <div
        class="flex flex-col md:w-1/2 bg-custom-dark text-custom-light mt-4 md:mt-0 md:pl-[20px] text-center md:text-left"
      >
        <h1 class="text-xl md:text-2xl md:mt-0">Top Spending Categories</h1>
        <!-- Check if topSpendingCategories is not empty before looping -->
        <div class="md:mt-[60px]">
          <div
            v-if="topSpendingCategories.length > 0"
            v-for="(category, index) in topSpendingCategories"
            :key="index"
            class="p-1 md:p-3 text-center md:text-left"
          >
            <span
              class="inline-block w-4 h-4"
              :style="{
                backgroundColor:
                  processedDoughnutData.datasets[0].backgroundColor[index],
              }"
            ></span>
            <span class="font-bold m-2 md:m-4 text-left">{{
              category.category
            }}</span>
            <span class="font-normal text-gray-400 m-4"
              >{{ calculatePercentage(category.amount) }}%</span
            >
          </div>

          <!-- Show a message if there are no categories -->
          <div v-else class="text-center md:text-left">
            <p class="text-sm md:text-base">
              No spending data available, please add transaction.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-gray-200 border rounded-lg py-2">
      <div class="flex justify-between">
        <h2 class="text-md md:text-xl font-bold mb-4 pl-3 pt-3">
          Recent Transactions
        </h2>
        <router-link to="/dashboard/transaction">
          <h3 class="font-semibold mb-4 pl-3 pt-3 text-md md:text-lg">
            View All >
          </h3>
        </router-link>
      </div>
      <div
        v-if="topTransactions.length > 0"
        v-for="(transaction, index) in topTransactions"
        :key="index"
        class="flex justify-between items-center p-3 mb-2 border-b border-gray-600 text-sm md:text-md lg:text-md"
      >
        <div class="flex flex-col">
          <span class="font-bold">{{ transaction.category }}</span>
          <span class="text-gray-400 font-semibold">
            {{ formatDate(transaction.createdAt) }}</span
          >
          <span class="text-gray-400 font-semibold">{{
            transaction.narration
          }}</span>
        </div>
        <!-- Conditionally apply green for positive amounts -->
        <div
          class="font-bold"
          :class="{
            'text-green-500':
              transaction.category === 'Salary' ||
              transaction.category === 'Other Income',
            'text-red-500':
              transaction.category !== 'Salary' &&
              transaction.category !== 'Other Income',
          }"
        >
          {{
            transaction.category === "Salary" ||
            transaction.category === "Other Income"
              ? "+"
              : "-"
          }}
          #{{ transaction.amount.toLocaleString() }}
        </div>
      </div>

      <!-- Show a message if there are no transactions -->
      <div v-else class="text-center text-sm md:text-base pb-4">
        <p>No transactions available.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, computed, ref, watch } from "vue";
import { Bar, Doughnut } from "vue-chartjs";
import { Chart } from "chart.js";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const store = useStore();
const isLoading = ref(true);

const transactions = computed(() => store.getters["insight/getTransactions"]);
const monthlyInsights = computed(
  () => store.getters["insight/getMonthlyInsights"]
);
const insightSummary = computed(
  () => store.getters["insight/getInsightsSummary"]
);

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const chartData = ref({
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Income",
      data: Array(12).fill(0), // Default data, will be overwritten
      backgroundColor: "rgba(75, 192, 192, 0.8)", // Green for income
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      stack: "stack1", // Stack configuration
    },
    {
      label: "Expenses",
      data: Array(12).fill(0), // Default data, will be overwritten
      backgroundColor: "rgba(255, 99, 132, 0.8)", // Red for expenses
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
      stack: "stack1", // Stack configuration
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow the chart to resize dynamically
  plugins: {
    title: {
      display: true,
      text: "Your transactions this year", // Title text
      font: {
        size: 18, // Font size of the title
        weight: "bold", // Make the font bold
      },
      padding: {
        top: 20, // Padding from the top
        bottom: 0, // Padding at the bottom
      },
    },
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    y: {
      stacked: true, // Enable stacking
    },
  },
};

// Watcher for updating chart data when monthlyInsights is updated
watch(
  monthlyInsights,
  (newInsights) => {
    const insights = Array.isArray(newInsights) ? newInsights : [];

    const incomeData = Array(12).fill(0);
    const expensesData = Array(12).fill(0);

    insights.forEach((insight) => {
      const monthIndex = parseInt(insight.monthYear.split("-")[1], 10) - 1;
      incomeData[monthIndex] = insight.income;
      expensesData[monthIndex] = insight.expenses;
    });

    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: incomeData,
        },
        {
          ...chartData.value.datasets[1],
          data: expensesData,
        },
      ],
    };

    isLoading.value = false;
  },
  { immediate: true }
);

// Doughnut Chart Data and Options
const doughnutData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#9966FF", "#36A2EB", "#4BC0C0"],
      hoverBackgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
      ],
      hoverBorderColor: "transparent",
      hoverBorderWidth: 0,
    },
  ],
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0,
    margin: 0,
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: true,
      labels: {
        color: "white", // Change legend text color to white if needed
      },
    },
    title: {
      display: true,
      text: "Transactions",
      color: "white", // Set title text color to white
      font: {
        size: 18,
        weight: "bold",
      },
      padding: {
        top: 0,
        bottom: 0,
      },
      margin: 0,
    },
    centerText: {
      display: true,
      text: "Your Text Here", // Example text
      color: "white",
      textAlign: "center", // Center text color
    },
  },
};

// Custom Plugin for Center Text
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, chartArea } = chart;
    const { top, bottom, left, right } = chartArea;
    const { width, height } = chart;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const centerTextOptions = chart.options.plugins.centerText || {};
    // Read the centerText options
    const text = centerTextOptions.text || "";
    const color = centerTextOptions.color || "#ffffff";
    const display = centerTextOptions.display;
    const fontSize = centerTextOptions.fontSize || 14;

    if (display) {
      ctx.save();
      ctx.font = `${fontSize}px sans-serif`; // Font size can be dynamic
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    }
  },
};

// Register the plugin globally
Chart.register(centerTextPlugin);

// Watch for insightSummary updates to update doughnut chart data
watch(
  insightSummary,
  (newSummary) => {
    if (newSummary && newSummary.topSpendingCategories) {
      const categories = newSummary.topSpendingCategories.map(
        (cat) => cat.category
      );
      const amounts = newSummary.topSpendingCategories.map((cat) => cat.amount);
      const totalSpending = amounts.reduce((sum, amount) => sum + amount, 0);

      doughnutData.value = {
        labels: categories,
        datasets: [
          {
            data: amounts,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      };

      // Display total spending in the center
      doughnutOptions.plugins.centerText = {
        display: true,
        text: `Total: ${totalSpending}`,
        color: "white",
      };
    }
  },
  { immediate: true }
);
const processedDoughnutData = computed(() => {
  const hasData = doughnutData.value.datasets[0]?.data.some(
    (value) => value > 0
  );

  // If no data, return a fallback dataset
  if (!hasData) {
    return {
      labels: ["No Transaction Available"],
      datasets: [
        {
          data: [1], // Dummy value to show an empty chart
          backgroundColor: ["#E5E5E5"], // Neutral color for "No Data"
        },
      ],
    };
  }

  // Return the actual data
  return doughnutData.value;
});
//Display data in Doughnut template
const topSpendingCategories = computed(() => {
  return insightSummary.value.topSpendingCategories || [];
});
console.log(topSpendingCategories.value);

const totalExpenses = computed(() => {
  return insightSummary.value.totalExpensesAmount || 0;
});

// Function to calculate the percentage
const calculatePercentage = (categoryAmount) => {
  if (totalExpenses.value === 0) return 0; // Avoid division by zero
  return ((categoryAmount / totalExpenses.value) * 100).toFixed(2); // Calculate percentage
};

// Watch for insightSummary updates to debug or reprocess data
watch(insightSummary, (newSummary) => {});

const topTransactions = computed(() => {
  return transactions.value.slice().reverse().slice(0, 5);
});

onMounted(() => {
  store.dispatch("insight/fetchMonthlyInsights");
  store.dispatch("insight/fetchTransactions");
  store.dispatch("insight/fetchInsightsSummary");
});
</script>

<style scoped></style>
