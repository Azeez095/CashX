<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h1 class="font-medium text-3xl">Financial Insight</h1>
            <span>Keep track of your budget and transaction history.</span>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10 text-center">
            <div class="bg-[#141414] min-h-[200px] grid grid-cols-1 justify-center items-center rounded-[10px]">
                <div class="px-4 flex lg:justify-center sm:text-2xl lg:text-4xl">
                    <div class="flex flex-col gap-2 text-white w-full">
                        Total Budget Amount
                        <h3 class=" text-white font-bold">#500, 000</h3>
                    </div>
                </div>
                <div class="p-4 grid grid-cols-2 gap-2 text-center">
                    <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                        Total Weekly Budget Amount
                        <h3 class="text-wxl text-white font-bold text-center">#80, 000</h3>
                    </div>
                    <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                        Total Monthly Budget Amount
                        <h3 class="text-wxl text-white font-bold">#40, 000</h3>
                    </div>
                </div>
            </div>

            <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4">
                Budget Chart
                <AppChart :data="chartBudgetData" :options="chartBudgetOptions" />
            </div>
            <div class="bg-[#141414] min-h-[200px] grid grid-cols-1 justify-center items-center rounded-[10px]">
                <div class="px-4 flex lg:justify-centerr">
                    <div class="flex flex-col gap-4 text-white w-full text-4xl font-bold">
                        Total Balance
                        <h1 class="flex flex-col gap-2 text-white">#40, 000</h1>
                    </div>
                </div>
                <div class="p-4 grid grid-cols-2 gap-2 text-center ">
                    <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                        Total Income
                        <h3 class="text-wxl text-white font-bold">#80, 000</h3>
                    </div>
                    <div class="flex flex-col gap-2 text-white border border-white h-full p-4 rounded-[10px]">
                        Total Money Spent
                        <h3 class="text-wxl text-white font-bold">#40, 000</h3>
                    </div>
                </div>
            </div>
            <div class="flex flex-col bg-white rounded-[20px] p-4 gap-4">
                Total Income against Total Money Spent
                <AppChart :data="chartTransactionData" :options="chartTransactionOptions" />
            </div>
        </div>
    </div>
</template>

<script setup>
import AppChart from '@/components/AppChart.vue';

const chartBudgetData = {
    labels: ["Housing", "Groceries", "Transportation", "Entertainment"],
    datasets: [
        {
            label: 'Monthly Budget Allocation',
            data: [40, 25, 20, 15],
            backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#e91e63"]
        }
    ]
};


const chartBudgetOptions = {
    animation: {
        duration: 1000,
    },
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                color: "#141414"
            }
        }
    }
}

const chartTransactionData = {
    labels: ["Income", "Expenses"],
    datasets: [
        {
            label: 'Transaction Overview',
            data: [70, 30],
            backgroundColor: ["#4caf50", "#f44336"]
        }
    ]
};



const chartTransactionOptions = {
    animation: {
        duration: 1000,
    },
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                color: "#141414"
            }
        }
    }
}
</script>
