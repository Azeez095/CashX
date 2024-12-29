<template>
  <div class="w-full">
    <!-- Bar Chart -->
    <div class="bg-gray-300 p-0 w-full">
      <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        class="w-full h-[40vh] sm:w-[100vw]"
      />
    </div>

    <!-- Doughnut Chart -->
     <div class="flex flex-row justify-between">
    <div class="bg-gray-300 mt-8 p-0  sm:w-[100vw] md:w-[50%] bg-custom-dark">
      <Doughnut
        id="doughnut-chart-id"
        :options="doughnutOptions"
        :data="doughnutData"
        class="sm:w-[100vw] md:max-w-[50vw] h-[40vh] bg-custom-dark text-custom-light"
      />
    </div>
    <div>
      <div>
        <span class="text-2xl">Spending</span>
        <div>
          <span>entertainment</span>
          <span>50%</span>
        </div>
      </div>
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

const transactions = computed(() => store.getters['dashboard/getTransactions']);
const monthlyInsights = computed(() => store.getters['dashboard/getMonthlyInsights']);
const insightSummary = computed(() => store.getters['dashboard/getInsightsSummary']);


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
        top: 0, // Padding from the top
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
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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


onMounted(() => {
  store.dispatch('dashboard/fetchMonthlyInsights');
  store.dispatch('dashboard/fetchTransactions');
  store.dispatch('dashboard/fetchInsightsSummary');
});
</script>
