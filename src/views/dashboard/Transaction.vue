<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div @click="closeMenu" class="flex flex-col gap-6 scroll-container relative p-4">
    <div class="flex flex-col gap-2 text-left">
      <h1 class="font-medium text-xl md:text-3xl mb-4">
        Transaction Management
      </h1>
      <span class="text-sm md:text-base"
        >Welcome! Simplify your financial management by creating, editing, and
        deleting transactions to stay on top of your spending.</span
      >
    </div>
    <div class="flex flex-col mb-4 gap-6 lg:gap-10 text-md md:text-base">
      <div class="flex justify-center items-center mt-6 md:mt-[40px]">
        <Btn @click="toggleModal(null, 'add')">
          <img src="@/assets/icons/Add.svg" alt="add" />
          Add transaction
        </Btn>
      </div>
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 rounded-lg w-[100%] text-center"
      >
        <div
          class="bg-custom-dark col-span-2 md:col-span-1 text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-xm md:lg font-semibold">Balance</h3>
          <p class="text-xm md-[14px] font-bold">
            <!-- Conditional rendering for Balance -->
            #{{
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
        <div
          class="bg-custom-dark text-custom-light p-2 md:p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-sm md:text-lg font-semibold">Income</h3>
          <p class="text-sm md:text-[14px] font-bold text-[#4bc0c0]">
            <!-- Conditional rendering for Total Income -->
            #{{
              insightSummary.totalIncomeAmount
                ? insightSummary.totalIncomeAmount.toLocaleString()
                : "0"
            }}
          </p>
        </div>
        <div
          class="bg-custom-dark text-custom-light p-4 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
        >
          <h3 class="text-sm md:text-lg font-semibold">Expenses</h3>
          <p class="text-sm md:text-[14px] font-bold text-[#ff6384]">
            <!-- Conditional rendering for Total Expenses -->
            #{{
              insightSummary.totalExpensesAmount
                ? insightSummary.totalExpensesAmount.toLocaleString()
                : "0"
            }}
          </p>
        </div>
      </div>
      <div class="flex gap-4 items-center mb-4 mt-4">
        <label
          for="filter-category"
          class="font-medium text-sm md:text-base pl-2"
          >Filter by Category:</label
        >
        <select
          id="filter-category"
          v-model="selectedCategory"
          class="p-2 rounded-md border bg-white text-sm md:text-md"
        >
          <option value="">All Categories</option>
          <option
            v-for="category in availableCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
      <div>
        <h2
          v-if="filteredTransactions.length > 0"
          class="font-medium pl-2 lg:my-[-20px]"
        >
          {{ filteredTransactions.length }} transactions found
        </h2>
        <div v-else class="pl-2 mt-9">
          <h2 class="font-medium text-center">
            No transaction is available, add a transaction
          </h2>
        </div>
      </div>
      <div class="flex flex-col gap-4 relative">
        <div
          v-for="(transaction, index) in paginatedFilteredTransactions"
          :key="index"
          class="w-full p-2 md:p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 justify-between bg-white rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div class="flex flex-col items-start gap-1">
            <span class="text-sm md:text-md font-semibold"> Amount</span>
            <span
              class="text-sm md:text-[14px]"
              :class="{
                'text-red-500 font-semibold': transaction.type === 'expense',
                'text-green-500 font-semibold': transaction.type === 'income',
              }"
            >
              #{{ transaction.amount.toLocaleString() }}
            </span>
          </div>
          <div class="flex flex-col items-start gap-1 capitalize">
            <span class="text-sm md:text-md font-semibold">Category</span>
            <span class="text-sm md:text-[14px]">{{
              transaction.category
            }}</span>
          </div>
          <div
            class="hidden md:flex flex-col items-start gap-1 text-sm md:text-md"
          >
            <span class="font-semibold">Narration</span>
            <div class="truncate w-full md:text-[14px]">
              {{ transaction.narration }}
            </div>
          </div>
          <div
            class="hidden lg:flex flex-col items-start gap-1 text-sm md:text-md"
          >
            <span class="font-semibold">Date Created</span>
            <div class="truncate w-full md:text-[14px]">
              {{ formatDate(transaction.createdAt) }}
            </div>
          </div>

          <div class="flex justify-end">
            <img
              @click.stop.prevent="openMenu(transaction)"
              class="cursor-pointer"
              src="@/assets/icons/action.svg"
              alt="action"
            />
            <div
              v-if="transaction.isOpen"
              class="item-menu w-[100px] lg:w-[200px] top-8 hover:cursor-pointer text-custom-dark text-sm md:text-md lg:top-10 z-50 absolute"
            >
              <div @click="toggleModal(transaction, 'view')" class="px-4 py-2">
                View
              </div>
              <div @click="toggleModal(transaction, 'edit')" class="px-4 py-2">
                Edit
              </div>
              <div
                @click.stop.prevent="openDeleteModal(transaction._id)"
                class="px-4 py-2 text-red-800"
              >
                Delete
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-6 text-sm md:text-base">
        <Btn
          :disabled="
            currentPage === 1 || filteredTransactions.length <= pageSize
          "
          @click="changePage(currentPage - 1)"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentPage === 1 || filteredTransactions.length <= pageSize,
            'cursor-pointer': !(
              currentPage === 1 || filteredTransactions.length <= pageSize
            ),
          }"
        >
          Previous
        </Btn>

        <span>Page {{ currentPage }} of {{ totalFilteredPages }}</span>

        <Btn
          :disabled="
            currentPage === totalFilteredPages ||
            filteredTransactions.length <= pageSize
          "
          @click="changePage(currentPage + 1)"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentPage === totalFilteredPages ||
              filteredTransactions.length <= pageSize,
            'cursor-pointer': !(
              currentPage === totalFilteredPages ||
              filteredTransactions.length <= pageSize
            ),
          }"
        >
          <span class="px-4">Next</span>
        </Btn>
      </div>
    </div>
  </div>

  <!-- Add Transaction Modal -->
  <Modal :isOpen="addModalIsOpen" position="left" class="bg-custom-dark">
    <form
      @submit.prevent="addTransaction"
      class=" w-[100%] lg:w-[600px] bg-[#fafafa] py-5 px-8 flex flex-col gap-10 overflow-y-scroll h-[100vh] absolute z-50"
    >
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl">Add New Transaction</h1>
        <span>Add new transaction to keep track of your spending.</span>
      </div>
      <div class="flex flex-col gap-7">
        <Input
          label="Type"
          required
          type="select"
          :selectArray="typeArray"
          v-model="formData.type"
          name="type"
          id="type"
          placeholder="Select a type"
        ></Input>
        <Input
          v-if="formData.type !== 'income'"
          label="Budget"
          required
          type="select"
          :selectArray="budgetTitles"
          v-model="selectedBudget"
          name="budget_id"
          id="budget_id"
          placeholder="Select a budget"
        ></Input>
        <span v-if="budgetTitles.length === 0" class="text-red-500">
          No budgets available. <RouterLink to="/dashboard/budget">Add a new budget <span class="underline text-custom-dark">Here</span></RouterLink>
        </span>
        <Input
          label="Category"
          required
          type="select"
          :selectArray="filteredCategoryArray"
          v-model="formData.category"
          name="category"
          id="category"
          placeholder="Select a category"
        ></Input>
        <Input
          label="Transaction Amount"
          required
          type="number"
          name="amount"
          id="amount"
          v-model="formData.amount"
          placeholder="Enter transaction amount"
        ></Input>

        <Input
          label="Narration"
          type="textarea"
          required
          name="narration"
          id="narration"
          v-model="formData.narration"
          placeholder="Enter a narration"
        ></Input>
      </div>
      <div class="flex justify-between gap-4">
        <Btn variant="outline" @click="toggleModal(null, 'add')">Cancel</Btn>
        <Btn type="submit"
          :disabled="loading || !isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': loading || !isFormValid }"
        >
          <span v-if="loading">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
            </span>
            Adding
          </span>
          <span v-else>Add Transaction</span>
        </Btn>
      </div>
    </form>
  </Modal>
  <!-- View Transaction Modal -->
  <Modal :isOpen="viewModalIsOpen">
    <div
      class="w-full max-w-lg rounded-3xl bg-gray-50 shadow-xl py-10 px-8 flex flex-col gap-10"
    >
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-xl md:text-2xl font-bold text-blue-900">
          Transaction Details
        </h2>
        <p class="text-gray-500 text-sm">
          Review the details of the selected transaction below.
        </p>
      </div>

      <!-- Transaction Data -->
      <div
        v-if="currentTransaction"
        class="flex flex-col gap-6 text-md md:text-lg"
      >
        <!-- Transaction Amount -->
        <div class="flex justify-between items-center">
          <h4 class="text-md md:text-lg font-medium text-gray-700">Amount</h4>
          <span
            class="text-md md:text-lg"
            :class="{
              'text-red-500 font-semibold':
                currentTransaction.type === 'expense',
              'text-green-500 font-semibold':
                currentTransaction.type === 'income',
            }"
          >
            #{{ currentTransaction.amount.toLocaleString() }}
          </span>
        </div>
        <!-- Category -->
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-700">Category</h4>
          <span class="text-blue-900 font-bold">
            {{ currentTransaction.category }}
          </span>
        </div>
        <!-- Narration -->
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-700">Narration</h4>
          <span class="text-blue-900 font-bold">
            {{ currentTransaction.narration }}
          </span>
        </div>
        <!-- Type -->
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-700">Type</h4>
          <span class="text-blue-900 font-bold">
            {{ currentTransaction.type }}
          </span>
        </div>
        <!-- Date Created -->
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-700">Date Created</h4>
          <span class="text-blue-900 font-bold">
            {{ formatDate(currentTransaction.createdAt) }}
          </span>
        </div>
        <!-- Date Updated -->
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-700">Date Updated</h4>
          <span class="text-blue-900 font-bold">
            {{ formatDate(currentTransaction.updatedAt) }}
          </span>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex justify-end gap-4">
        <Btn
          @click="toggleModal(null, 'view')"
          class="w-32 bg-blue-900 text-white font-medium py-2 rounded-lg"
        >
          <span class="text-bold">Close</span>
        </Btn>
      </div>
    </div>
  </Modal>

  <Modal :isOpen="editModalIsOpen" position="left">
    <form
      @submit.prevent="editTransaction"
      class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10"
    >
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl">Edit Your Transaction</h1>
        <span
          >Edit your budget to keep track of your spending and stay
          up-to-date.</span
        >
      </div>
      <div class="flex flex-col gap-7">
        <Input
          label="Transaction Amount"
          required
          type="number"
          name="amount"
          id="amount"
          v-model="editTransactionData.amount"
          placeholder="Enter transaction amount"
        ></Input>

        <Input
          label="Type"
          required
          type="select"
          :selectArray="typeArray"
          v-model="editTransactionData.type"
          name="type"
          id="type"
          placeholder="Select a type"
          :isDisabled="true"
        ></Input>

        <Input
          label="Category"
          required
          type="select"
          :selectArray="filteredCategoryArray"
          v-model="editTransactionData.category"
          name="category"
          id="category"
          placeholder="Select a category"
        ></Input>
        <Input
          label="Narration"
          required
          type="textarea"
          name="narration"
          id="narration"
          v-model="editTransactionData.narration"
          placeholder="Enter a narration"
        ></Input>
      </div>
      <div class="flex justify-between gap-4">
        <Btn variant="outline" @click="toggleModal(null, 'edit')">Cancel </Btn>
        <Btn
          type="submit"
          :disabled="loading"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <span v-if="loading">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
            </span>
            Updating
          </span>
          <span v-else>Update</span>
        </Btn>
      </div>
    </form>
  </Modal>
  <ConfirmationModal
    v-if="isDeleteModalOpen"
    :isOpen="isDeleteModalOpen"
    title="Delete Budget"
    message="Are you sure you want to delete this budget? This action cannot be undone."
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :loading="loading"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Btn from "@/components/Btn.vue";
import Input from "@/components/Input.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import Modal from "@/components/Modal.vue";
import { toast } from "vue3-toastify";

const viewModalIsOpen = ref(false);
const currentTransaction = ref(null);
const editTransactionData = ref();
const editModalIsOpen = ref(false);
const isDeleteModalOpen = ref(false);
const transactionToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(4);
const selectedCategory = ref("");
const store = useStore();
const typeArray = ref(["income", "expense"]);
const addModalIsOpen = ref(false);
const selectedBudget = ref("");


const transactions = computed(() => store.getters.allTransactions);
const insightSummary = computed(
  () => store.getters["insight/getInsightsSummary"]
);

const loading = ref(false);
const formData = ref({
  amount: "",
  category: "",
  narration: "",
  type: "",
  budget_id: "",
});
const budgets = computed(() => store.getters["allBudgets"]);
const filteredBudgets = computed(() =>
  budgets.value.filter(
    (budget) => !transactions.value.some((transaction) => transaction.budget_id === budget._id)
  )
);
const budgetTitles = computed(() =>
  filteredBudgets.value.map(
    (budget) => `${budget.title} (₦${budget.total_amount})`
)
);
watch(selectedBudget, (newTitleWithAmount) => {
  if (formData.value.type !== "income") {
    const title = newTitleWithAmount.split(" (")[0]; // Extract title
    const selected = filteredBudgets.value.find((budget) => budget.title === title);
    formData.value.budget_id = selected ? selected._id : "";
  }
});
watch(
  () => formData.value.type,
  (newType) => {
    if (newType === "income") {
      formData.value.budget_id = "67602f75c0c07b1d4dcd4efe"; // Fixed budget_id for income
    } else {
      formData.value.budget_id = "";
    }
  }
);


const totalFilteredPages = computed(() => {
  const filteredLength = filteredTransactions.value.length;
  return filteredLength > 0 ? Math.ceil(filteredLength / pageSize.value) : 1;
});

const filteredCategoryArray = computed(() => {
  return formData.value.type === "income"
    ? ["Salary", "Other Income"]
    : ["Home", "Misc", "Others"];
});
const availableCategories = computed(() =>
  Array.from(new Set(transactions.value.map((t) => t.category)))
);

const filteredTransactions = computed(() =>
  selectedCategory.value
    ? transactions.value.filter((t) => t.category === selectedCategory.value)
    : transactions.value
);

watch(
  () => formData.value.type,
  (newType) => {
    if (newType) {
      formData.value.category = "";
    }
  }
);

const paginatedFilteredTransactions = computed(() => {
  const filteredLength = filteredTransactions.value.length;
  if (filteredLength === 0) return []; // If no filtered transactions, return empty array

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  // Ensure currentPage stays within bounds
  if (start >= filteredLength) {
    currentPage.value = Math.max(1, Math.ceil(filteredLength / pageSize.value));
  }

  return filteredTransactions.value.slice(start, end);
});


const changePage = (page) => {
  if (page > 0 && page <= totalFilteredPages.value) {
    currentPage.value = page;
  }
};

const toggleModal = (data, modal) => {
  if (modal === "add") {
    addModalIsOpen.value = !addModalIsOpen.value;
  } else if (modal === "view") {
    currentTransaction.value = data;
    viewModalIsOpen.value = !viewModalIsOpen.value;
  } else if (modal === "edit") {
    if (data) {
      editTransactionData.value = { ...data };
      formData.value.type = data.type || ""; // Ensure type is set for category filter
      formData.value.category = data.category;
    }
    editModalIsOpen.value = !editModalIsOpen.value;
  }
};

const isFormValid = computed(() => {
  return formData.value.type && formData.value.category && formData.value.amount > 0;
});
const addTransaction = async () => {
  loading.value = true;
  const transactionData = {
    amount: formData.value.amount,
    category: formData.value.category,
    narration: formData.value.narration,
    type: formData.value.type,
    budget_id: formData.value.budget_id,
  };
  selectedBudget.value = "";

  try {
    if (budgetTitles.value.length === 1) {
      formData.value.budget_id = budgetTitles.value[0].id;
    }
    else if (formData.value.type !== 'income' && !formData.value.budget_id) {
    toast.error("Please select a budget for this transaction.", { position: "top-center", autoClose: 1000 });
    return; // Stop the function from proceeding if no budget is selected
  }
    // Dispatch the action to add the transaction
    const message = await store.dispatch("addTransaction", transactionData);
    await store.dispatch("insight/fetchInsightsSummary");

    // Show success toast
    toast.success(message, { position: "top-center", autoClose: 1000 });

    // Reset form data after adding the transaction
    formData.value = {
      amount: "",
      category: "",
      narration: "",
      type: "",
      budget_id: "",
    };
    addModalIsOpen.value = false;
  } catch (error) {
    toast.error(error.message, { position: "top-center", autoClose: 1000 });
  }
  loading.value = false;
};

const openMenu = (transaction) => {
  transaction.isOpen = !transaction.isOpen;
};

const closeMenu = () => {
  transactions.value.forEach((transaction) => {
    transaction.isOpen = false;
  });
};

const openDeleteModal = (transactionId) => {
  isDeleteModalOpen.value = true;
  transactionToDelete.value = transactionId;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    // Dispatch the action to remove the transaction
    const message = await store.dispatch(
      "removeTransaction",
      transactionToDelete.value
    );
    await store.dispatch("insight/fetchInsightsSummary");

    // Show success toast
    toast.success(message, { position: "top-center", autoClose: 1000 });

    // Close the delete modal and reset the transaction to delete
    isDeleteModalOpen.value = false;
    transactionToDelete.value = null;
  } catch (error) {
    // Show error toast if deleting the transaction fails
    toast.error(error.message, { position: "top-center", autoClose: 1000 });
  }
  loading.value = false;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  transactionToDelete.value = null;
};

const editTransaction = async () => {
  loading.value = true;
  try {
    const message = await store.dispatch("editTransaction", {
      id: editTransactionData.value._id,
      transaction: editTransactionData.value,
    });
    await store.dispatch("insight/fetchInsightsSummary");

    // Close the modal after successful edit
    editModalIsOpen.value = false;

    // Show success toast
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
    });
  } catch (error) {
    // Show error toast
    toast.error(
      error.message || "Failed to update transaction. Please try again.",
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
      }
    );
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  store.dispatch("viewAllTransactions");
  store.dispatch("insight/fetchInsightsSummary");
  store.dispatch("viewAllBudgets");
});
</script>

<style scoped>
.item:hover {
  cursor: pointer;
}

.item-menu {
  position: absolute;
  right: 0;
  top: -30px;
  background-color: white;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px -4px #14141410;
  box-shadow: 0px 16px 32px -4px #14141430;
}
</style>
