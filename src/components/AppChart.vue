<template>
    <div>
      <canvas ref="chartCanvas" class="max-h-[400px]"></canvas>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  });
  const chartCanvas = ref(null);
  let chartInstance = null;
  onMounted(() => {
    if (chartCanvas.value) {
      chartInstance = new Chart(chartCanvas.value, {
        type: "pie",
        data: props.data,
        options: props.options,
      });
    }
  });
  onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
  });
  </script>