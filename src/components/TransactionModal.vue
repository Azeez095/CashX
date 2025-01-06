<template>
  <div v-if="isOpen" class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[400px]">
      <h3 class="text-lg font-semibold mb-4">{{ modalTitle }}</h3>

      <!-- Add Transaction Form -->
      <div v-if="mode === 'add'">
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="amount" class="block text-sm font-semibold">Amount</label>
            <input
              type="number"
              v-model="form.amount"
              id="amount"
              required
              class="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-semibold">Category</label>
            <select
              v-model="form.category"
              id="category"
              required
              class="w-full p-2 mt-1 border rounded-md"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="narration" class="block text-sm font-semibold">Narration</label>
            <input
              type="text"
              v-model="form.narration"
              id="narration"
              class="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="closeModal" class="text-gray-500">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Add</button>
          </div>
        </form>
      </div>

      <!-- View Transaction Details -->
      <div v-if="mode === 'view'">
        <div class="mb-4">
          <p><strong>Amount:</strong> #{{ transaction.amount.toLocaleString() }}</p>
          <p><strong>Category:</strong> {{ transaction.category }}</p>
          <p><strong>Narration:</strong> {{ transaction.narration }}</p>
          <p><strong>Date:</strong> {{ formatDate(transaction.createdAt) }}</p>
        </div>
        <div class="flex justify-end">
          <button @click="closeModal" class="text-gray-500">Close</button>
        </div>
      </div>

      <!-- Edit Transaction Form -->
      <div v-if="mode === 'edit'">
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="amount" class="block text-sm font-semibold">Amount</label>
            <input
              type="number"
              v-model="form.amount"
              id="amount"
              required
              class="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-semibold">Category</label>
            <select
              v-model="form.category"
              id="category"
              required
              class="w-full p-2 mt-1 border rounded-md"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="narration" class="block text-sm font-semibold">Narration</label>
            <input
              type="text"
              v-model="form.narration"
              id="narration"
              class="w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="closeModal" class="text-gray-500">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

// Props passed down from parent component
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  transaction: {
    type: Object,
    default: () => ({})
  },
  closeModal: {
    type: Function,
    required: true
  },
  addTransaction: {
    type: Function,
    required: true
  },
  editTransaction: {
    type: Function,
    required: true
  },
  formatDate: {
    type: Function,
    required: true
  }
});

const mode = ref(''); // 'add', 'view', or 'edit'
const form = ref({
  amount: '',
  category: '',
  narration: ''
});

// Computed property for modal title
const modalTitle = computed(() => {
  if (mode.value === 'add') return 'Add Transaction';
  if (mode.value === 'view') return 'Transaction Details';
  if (mode.value === 'edit') return 'Edit Transaction';
  return '';
});

// Methods to handle modal actions
const openAddModal = () => {
  mode.value = 'add';
  form.value = { amount: '', category: '', narration: '' }; // Reset form for new transaction
};

const openViewModal = (transaction) => {
  mode.value = 'view';
  props.transaction = transaction;
};

const openEditModal = (transaction) => {
  mode.value = 'edit';
  props.transaction = transaction;
  form.value = { ...transaction }; // Populate form with current transaction details
};

const submitForm = () => {
  if (mode.value === 'add') {
    props.addTransaction(form.value);
  } else if (mode.value === 'edit') {
    props.editTransaction(form.value);
  }
  props.closeModal();
};
</script>
