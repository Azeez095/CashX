<template>
  <div class="flex flex-col z-20">
    <div class="w-full">
  <!-- Insights Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
    <!-- Total Income Card -->
    <div class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
      <h3 class="text-xl font-semibold ">Total Income</h3>
      <p class="text-xl font-bold text-[#4bc0c0]">
        <!-- Conditional rendering for Total Income -->
        {{ insightSummary.totalIncomeAmount ? insightSummary.totalIncomeAmount.toLocaleString() : 'No transaction available' }}
      </p>
    </div>

    <!-- Total Expenses Card -->
    <div class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
      <h3 class="text-xl font-semibold">Total Expenses</h3>
      <p class="text-xl font-bold text-[#ff6384]">
        <!-- Conditional rendering for Total Expenses -->
        {{ insightSummary.totalExpensesAmount ? insightSummary.totalExpensesAmount.toLocaleString() : 'No transaction available' }}
      </p>
    </div>

    <!-- Balance Card -->
    <div class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
      <h3 class="text-xl font-semibold">Balance</h3>
      <p class="text-xl font-bold">
        <!-- Conditional rendering for Balance -->
        {{ (insightSummary.totalIncomeAmount  && insightSummary.totalExpensesAmount) ?
            (insightSummary.totalIncomeAmount - insightSummary.totalExpensesAmount).toLocaleString() : 'No transaction available' }}
      </p>
    </div>
  </div>
</div>

    <!-- Bar Chart -->
    <div class="bg-gray-300 p-0 w-full h-[40vh] border rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
      <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        class="w-full  sm:w-[100vw] "
      />
    </div>

    <div class="md:grid grid-cols-2 md:w-[100%] bg-custom-dark mt-4 pt-4 border rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
      <div class="bg-gray-300 p-0 w-[100%] bg-custom-dark sm:h-auto md:h-[40vh] ">

        <Doughnut
          id="doughnut-chart-id"
          :options="doughnutOptions"
          :data="processedDoughnutData"
          class="sm:w-[100vw] sm:h-[30vh] md:w-[50%] md:h-[30vh] bg-custom-dark text-custom-light"
        />
      </div>

      <div class=" bg-custom-dark text-custom-light sm:h-auto md:w-[100%] mt-4 md:h-[40vh] md:pl-[20px]  flex flex-col md:text-left text-center md:pt-0 mb-4 md:mb-0">
        <h1 class="text-xl md:text-2xl md:mt-0">Spending</h1>
        <!-- Check if topSpendingCategories is not empty before looping -->
        <div class ="md:mt-[60px] ">
        <div v-if="topSpendingCategories.length > 0" v-for="(category, index) in topSpendingCategories" :key="index " class="p-1 md:p-3 text-center md:text-left" >
            <span
              class=" inline-block w-4 h-4"
              :style="{ backgroundColor: processedDoughnutData.datasets[0].backgroundColor[index] }"
            ></span>
            <span class="font-bold m-2 md:m-4 text-left">{{ category.category }}</span>
            <span class="font-normal text-gray-400 m-4">{{ calculatePercentage(category.amount) }}%</span>

        </div>

        <!-- Show a message if there are no categories -->
        <div v-else class="text-center md:text-left ">
          <p>No spending data available.</p>
        </div>
        </div>
      </div>
    </div>


    <div class="mt-8 bg-gray-200 border rounded-lg">
      <div class="flex justify-between">
      <h2 class="text-md md:text-xl font-bold mb-4 pl-3 pt-3 ">Recent Transactions</h2>
      <router-link to="/dashboard/transaction">
        <h3 class=" font-semibold mb-4 pl-3 pt-3 text-md md:text-lg">View All ></h3>
      </router-link>
      </div>
      <div
        v-if="topTransactions.length > 0"
        v-for="(transaction, index) in topTransactions"
        :key="index"
        class="flex justify-between items-center p-3 border-b border-gray-600 text-sm md:text-md lg:text-md"
      >
        <div class="flex flex-col">
          <span class="font-bold">{{ transaction.category }}</span>
          <span class="text-gray-400 font-semibold">{{ transaction.createdAt }}</span>
          <span class="text-gray-400 font-semibold">{{ transaction.narration }}</span>
        </div>
        <!-- Conditionally apply green for positive amounts -->
        <div
          class="font-bold"
          :class="{
            'text-green-500': transaction.category === 'Salary' || transaction.category === 'Other Income',
            'text-red-500': transaction.category !== 'Salary' && transaction.category !== 'Other Income'
          }"
        >
          {{ transaction.category === 'Salary' || transaction.category === 'Other Income' ? '+' : '-' }}
          {{ transaction.amount.toLocaleString() }}
        </div>
      </div>

      <!-- Show a message if there are no transactions -->
      <div v-else class="text-center md:text-left">
        <p>No transactions available.</p>
      </div>
    </div>

  </div>
</template>


<script setup>
import { useStore } from 'vuex';
import { onMounted, computed, ref, watch } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale, } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);


const store = useStore();
const isLoading = ref(true);

const transactions = computed(() => store.getters['insight/getTransactions']);
const monthlyInsights = computed(() => store.getters['insight/getMonthlyInsights']);
const insightSummary = computed(() => store.getters['insight/getInsightsSummary']);


const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Income',
      data: Array(12).fill(0), // Default data, will be overwritten
      backgroundColor: 'rgba(75, 192, 192, 0.8)', // Green for income
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      stack: 'stack1', // Stack configuration
    },
    {
      label: 'Expenses',
      data: Array(12).fill(0), // Default data, will be overwritten
      backgroundColor: 'rgba(255, 99, 132, 0.8)', // Red for expenses
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      stack: 'stack1', // Stack configuration
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow the chart to resize dynamically
  plugins: {
    title: {
      display: true,
      text: 'Your transactions this year', // Title text
      font: {
        size: 18, // Font size of the title
        weight: 'bold', // Make the font bold
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
      const monthIndex = parseInt(insight.monthYear.split('-')[1], 10) - 1;
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
      backgroundColor: ['#9966FF', '#36A2EB', '#4BC0C0',],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    },
  ],
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout:{
    padding: 0,
    margin: 0
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: true,
      labels: {
        color: 'white', // Change legend text color to white if needed
      },
    },
    title: {
      display: true,
      text: 'Transactions',
      color: 'white', // Set title text color to white
      font: {
        size: 18,
        weight: 'bold',
      },
      padding: {
        top: 0,
        bottom: 0,
      },
      margin: 0
    },
    centerText: {
      display: true,
      text: 'Your Text Here', // Example text
      color: 'white', // Center text color
    },
  },
};

// Custom Plugin for Center Text
ChartJS.register({
  id: 'centerText',
  beforeDraw(chart) {
    const { width } = chart;
    const { height } = chart;
    const centerTextOptions = chart.options.plugins.centerText || {};
    const ctx = chart.ctx;
    const text = chart.options.plugins.centerText?.text || '';
    const color = chart.options.plugins.centerText?.color || '#ffffff';
    const fontSize = 14;
    const offsetY = centerTextOptions.top || 0; // Add top offset

    if (text) {
      ctx.save();
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height /3 + offsetY);
      ctx.restore();
    }
  },
});


// Watch for insightSummary updates to update doughnut chart data
watch(
  insightSummary,
  (newSummary) => {
    if (newSummary && newSummary.topSpendingCategories) {
      const categories = newSummary.topSpendingCategories.map((cat) => cat.category);
      const amounts = newSummary.topSpendingCategories.map((cat) => cat.amount);
      const totalSpending = amounts.reduce((sum, amount) => sum + amount, 0);

      doughnutData.value = {
        labels: categories,
        datasets: [
          {
            data: amounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };

      // Display total spending in the center
      doughnutOptions.plugins.centerText = {
        display: true,
        text: `Total: ${totalSpending}`,
        color: 'white',
        top: 90,
      };
    }
  },
  { immediate: true }
);
const processedDoughnutData = computed(() => {
  const hasData = doughnutData.value.datasets[0]?.data.some((value) => value > 0);

  // If no data, return a fallback dataset
  if (!hasData) {
    return {
      labels: ['No Data'],
      datasets: [
        {
          data: [1], // Dummy value to show an empty chart
          backgroundColor: ['#E5E5E5'], // Neutral color for "No Data"
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
console.log(topSpendingCategories.value)

const totalExpenses = computed(() => {
  return insightSummary.value.totalExpensesAmount || 0;
});

// Function to calculate the percentage
const calculatePercentage = (categoryAmount) => {
  if (totalExpenses.value === 0) return 0; // Avoid division by zero
  return ((categoryAmount / totalExpenses.value) * 100).toFixed(2); // Calculate percentage
};

// Watch for insightSummary updates to debug or reprocess data
watch(insightSummary, (newSummary) => {
});

const topTransactions = computed(() => {
  return transactions.value.slice().reverse().slice(0, 5);
});

onMounted(() => {
  store.dispatch('insight/fetchMonthlyInsights');
  store.dispatch('insight/fetchTransactions');
  store.dispatch('insight/fetchInsightsSummary');
});
</script>

<style scoped>
</style>
