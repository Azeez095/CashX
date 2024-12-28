<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div @click="closeMenu" class="flex flex-col gap-6">
      <div class="flex flex-col gap-2 text-center">
          <h1 class="font-medium text-3xl">Transaction Management</h1>
          <span>Welcome! Easily create, edit, and delete transactions to manage your finances and keep track of your spending.</span>
      </div>
      <div class="flex flex-col mb-4 gap-6 lg:gap-10">
          <div class="flex justify-center items-center">
              <AppBtn @click="toggleModal(null, 'add')">
                  <img src="@/assets/icons/Add.svg" alt="add">
                  Add transaction
              </AppBtn>
          </div>
          <h2 class="font-medium pl-2 lg:my-[-20px]">{{ totalItems }} total transaction</h2>
          <div class="flex flex-col gap-4">
            <div
              v-for="(transaction, index) in paginatedTransactions"
              :key="index"
              class="w-full p-8 grid grid-cols-3 item lg:grid-cols-4 gap-4 justify-between bg-white rounded-3xl"
            >
                  <div class="flex flex-col items-start gap-1">
                      <span class="text-[12px] font-bold">Transaction Amount</span>
                      #{{ transaction.amount.toLocaleString() }}
                  </div>
                  <div class="flex flex-col items-start gap-1 capitalize">
                      <span class="text-[12px] font-bold">Category</span>
                      {{ transaction.category }}
                  </div>
                  <div class="hidden lg:flex flex-col items-start gap-1">
                      <span class="text-[12px] font-bold">Narration</span>
                      <div class="truncate w-full">{{ transaction.narration }}</div>
                  </div>
                  <div class="flex justify-end relative">
                      <img @click.stop.prevent="openMenu(transaction)" class="cursor-pointer" src="@/assets/icons/action.svg" alt="action">
                      <div v-if="transaction.isOpen" class="item-menu w-[100px] lg:w-[200px] top-8 lg:top-10 z-40">
                          <div @click="toggleModal(transaction, 'view')" class="px-4 py-2">View</div>
                          <div @click="toggleModal(transaction, 'edit')" class="px-4 py-2">Edit</div>
                          <div @click.stop.prevent="openDeleteModal(transaction._id)" class="px-4 py-2 text-red-800">Delete</div>
                      </div>
                  </div>
              </div>
          </div>
        <div class="flex justify-between items-center mt-6">
          <AppBtn :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</AppBtn>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <AppBtn :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</AppBtn>
        </div>
      </div>
  </div>

  <!-- Add Transaction Modal -->
  <AppModal :isOpen="addModalIsOpen" position="left">
      <form @submit.prevent="addTransaction" class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
          <div class="flex flex-col gap-2">
              <h1 class="text-3xl">Add New Transaction</h1>
              <span>Add new transaction to keep track of your spending.</span>
          </div>
          <div class="flex flex-col gap-7">
              <AppInput label="Transaction Amount" required type="number" name="amount" id="amount" v-model="formData.amount" placeholder="Enter transaction amount"></AppInput>
              <AppInput label="Category" required type="select" :selectArray="categoryArray" v-model="formData.category" name="category" id="category" placeholder="Select a category"></AppInput>
              <AppInput label="Narration" required type="textarea" name="narration" id="narration" v-model="formData.narration" placeholder="Enter a narration"></AppInput>
          </div>
          <div class="flex justify-between gap-4">
              <AppBtn variant="outline" @click="toggleModal(null, 'add')">Cancel</AppBtn>
              <AppBtn type="submit">Add Transaction</AppBtn>
          </div>
      </form>
  </AppModal>
  <!-- View Transaction Modal -->
  <AppModal :isOpen="viewModalIsOpen">
  <div class="w-full max-w-lg rounded-3xl bg-gray-50 shadow-xl py-10 px-8 flex flex-col gap-10">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-4xl font-bold text-blue-900">Transaction Details</h2>
      <p class="text-gray-500 text-sm">Review the details of the selected transaction below.</p>
    </div>

    <!-- Transaction Data -->
    <div v-if="currentTransaction" class="flex flex-col gap-6">
      <!-- Transaction Amount -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Transaction Amount</h4>
        <span class="text-lg text-blue-900 font-bold">
          ${{ currentTransaction.amount }}
        </span>
      </div>
      <!-- Category -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Category</h4>
        <span class="text-lg text-blue-900 font-bold">
          {{ currentTransaction.category }}
        </span>
      </div>
      <!-- Narration -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Narration</h4>
        <span class="text-lg text-blue-900 font-bold">
          {{ currentTransaction.narration }}
        </span>
      </div>
      <!-- Type -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Type</h4>
        <span class="text-lg text-blue-900 font-bold">
          {{ currentTransaction.type }}
        </span>
      </div>
      <!-- Date Created -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Date Created</h4>
        <span class="text-lg text-blue-900 font-bold">
          {{ currentTransaction.createdAt }}
        </span>
      </div>
      <!-- Date Updated -->
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-medium text-gray-700">Date Updated</h4>
        <span class="text-lg text-blue-900 font-bold">
          {{ currentTransaction.updatedAt }}
        </span>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-end gap-4">
      <AppBtn
        @click="toggleModal(null, 'view')"
        class="w-32 bg-blue-900 text-white font-medium py-2 rounded-lg">
        <span class="text-bold">Close</span>
      </AppBtn>
    </div>
  </div>
</AppModal>


  <AppModal :isOpen="editModalIsOpen" position="left">
      <form @submit.prevent="editTransaction" class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl">Edit Your Transaction</h1>
          <span>Edit your budget to keep track of your spending and stay up-to-date.</span>
        </div>
        <div class="flex flex-col gap-7">
          <AppInput label="Transaction Amount" required type="number" name="amount" id="amount" v-model="editTransactionData.amount" placeholder="Enter transaction amount"></AppInput>
          <AppInput label="Category" required type="select" :selectArray="categoryArray" v-model="editTransactionData.category" name="category" id="category" placeholder="Select a category"></AppInput>
          <AppInput label="Narration" required type="textarea" name="narration" id="narration" v-model="editTransactionData.narration" placeholder="Enter a narration"></AppInput>
        </div>
        <div class="flex justify-between gap-4">
          <AppBtn variant="outline" @click="toggleModal(null, 'edit')">Cancel</AppBtn>
          <AppBtn type="submit">Update</AppBtn>
        </div>
      </form>
  </AppModal>
  <ConfirmationModal
  v-if="isDeleteModalOpen"
  :isOpen="isDeleteModalOpen"
  title="Delete Budget"
  message="Are you sure you want to delete this budget? This action cannot be undone."
  @confirm="confirmDelete"
  @cancel="cancelDelete"
    />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import AppBtn from '@/components/AppBtn.vue';
import AppInput from '@/components/AppInput.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import AppModal from '@/components/AppModal.vue';
import { toast } from 'vue3-toastify';


const viewModalIsOpen = ref(false);
const currentTransaction = ref(null)
const editTransactionData = ref();
const editModalIsOpen = ref(false);
const isDeleteModalOpen = ref(false);
const transactionToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(4);
const totalItems = computed(() => transactions.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const store = useStore();
const categoryArray = ref(["income", "spending"]);
const transactions = computed(() => store.getters.allTransactions);
const addModalIsOpen = ref(false);

const formData = ref({
amount: '',
category: '',
narration: '',
type: '', // Default to 'income' for the new transaction
budget_id: '67602feec0c07b1d4dcd4f00', // Example budget ID (can be dynamic)
});

watch(
  () => formData.value.category,
  (newCategory) => {
    if (newCategory === 'income') {
      formData.value.type = 'income';
    } else if (newCategory === 'spending') {
      formData.value.type = 'expense';
    } else {
      formData.value.type = '';
    }
  }
);
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return transactions.value.slice(start, end);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};


const toggleModal = (data, modal) => {
if (modal === 'add') {
  addModalIsOpen.value = !addModalIsOpen.value;
}
else if (modal === 'view') {
    currentTransaction.value = data;
    viewModalIsOpen.value = !viewModalIsOpen.value;
  }
else if (modal === "edit") {
  if (data) {
    editTransactionData.value = { ...data };
  }
  editModalIsOpen.value = !editModalIsOpen.value;
  }
};

const addTransaction = async () => {
  const transactionData = {
    amount: formData.value.amount,
    category: formData.value.category,
    narration: formData.value.narration,
    type: formData.value.type,
    budget_id: formData.value.budget_id,
  };

  try {
    // Dispatch the action to add the transaction
    const message = await store.dispatch('addTransaction', transactionData);

    // Show success toast
    toast.success(message,
    { position: "top-center",
      autoClose: 1000,
    });

    // Reset form data after adding the transaction
    formData.value = { amount: '', category: '', narration: '', type: 'income', budget_id: '67602feec0c07b1d4dcd4f00' };
    addModalIsOpen.value = false;
  } catch (error) {
      toast.error
      (error.message,
      { position: "top-center",
         autoClose: 1000,
       });

  }
};




const openMenu = (transaction) => {
transaction.isOpen = !transaction.isOpen;
};

const closeMenu = () => {
transactions.value.forEach(transaction => {
  transaction.isOpen = false;
});
};

const openDeleteModal = (transactionId) => {
  isDeleteModalOpen.value = true;
  transactionToDelete.value = transactionId;
};

const confirmDelete = async () => {
  try {
    // Dispatch the action to remove the transaction
    const message = await store.dispatch("removeTransaction", transactionToDelete.value);

    // Show success toast
    toast.success(message,
    { position: "top-center",
      autoClose: 1000,
     });

    // Close the delete modal and reset the transaction to delete
    isDeleteModalOpen.value = false;
    transactionToDelete.value = null;
  } catch (error) {
    // Show error toast if deleting the transaction fails
    toast.error(error.message,
    { position: "top-center",
      autoClose: 1000,
     });
  }
};


const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  transactionToDelete.value = null;
};

const editTransaction = async () => {
  try {
    const message = await store.dispatch("editTransaction", {
      id: editTransactionData.value._id,
      transaction: editTransactionData.value,
    });

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
  }
};

onMounted(() => {
  store.dispatch('viewAllTransactions');
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
