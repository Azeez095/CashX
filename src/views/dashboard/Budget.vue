<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="bg-custom-light text-black p-4" @click="closeMenu">
    <div class="flex flex-col gap-2 text-left">
      <h1 class="font-medium text-xl md:text-3xl mb-4">Budget Management</h1>
      <span class="text-sm md:text-base">Welcome! Effortlessly manage your finances by creating, editing, and
        deleting budgets while keeping track of your expenses.</span>
    </div>
    <div class="flex flex-col mb-4 gap-6 lg:gap-10 text-md md:text-base">
      <div class="flex items-center justify-center mt-6 md:mt-[40px]">
        <Btn @click="toggleModal(null, 'add')" variant="primary">
          <img src="@/assets/icons/Add.svg" alt="add" />
          Add budget
        </Btn>
      </div>
      <div>
        <h2 v-if="budgets.length > 0" class="font-medium px-2 lg:my-[-20px]">
          {{ budgets.length }} total budget
        </h2>
        <div v-else class="px-2 mt-9">
          <h2 class="font-medium text-center">
            No budget is available, add a budget
          </h2>
        </div>
      </div>
      <div class="flex flex-col justify-between gap-4">
        <div v-for="(budget, index) in paginatedBudgets" :key="index"
          class="bg-gray-200 border border-custom-light mx-0 mb-1 max-w-full py-6 px-2 md:px-4 md:p-8 grid grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 justify-between items-center rounded-3xl transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
          <div class="flex flex-col items-start gap-1 capitalize">
            <span class="text-sm md:text-md font-semibold">Title</span>
            <div class="w-full truncate text-sm md:text-[14px]">
              {{ budget.title }}
            </div>
          </div>
          <div class="flex md:flex flex-col items-start gap-1 text-sm md:text-lg">
            <span class="text-sm md:text-md font-semibold">Amount</span>
            <span class="text-sm md:text-[14px] truncate w-[60px] md:w-full">#{{ budget.total_amount.toLocaleString() }}
            </span>
          </div>
          <div class="hidden lg:flex flex-col items-start gap-1 text-sm md:text-[14px]">
            <span class="text-sm md:text-md font-semibold">Duration</span>
            {{ budget.duration }}
          </div>
          <div class="flex flex-col items-start gap-1 text-sm md:text-[14px]">
            <span class="text-sm md:text-md font-semibold">Status</span>
            <div class="flex items-center gap-2">
              <span :class="{
                'bg-green-500': isCompleted(budget._id),
                'bg-red-500': !isCompleted(budget._id),
              }" class="w-2 h-2 rounded-full"></span>
              <span class="truncate w-[60px] md:w-full">{{
                isCompleted(budget._id) ? "Completed" : "Pending"
              }}</span>
            </div>
          </div>
          <div class="flex justify-end">
            <img @click.stop.prevent="openMenu(budget)" class="cursor-pointer" src="@/assets/icons/action.svg"
              alt="action" />
            <div v-if="budget.isOpen"
              class="item-menu w-[100px] lg:w-[200px] top-5 lg:top-10 bg-[#F8FAFC] text-custom-dark text-sm md:text-md z-40">
              <div @click="toggleModal(budget, 'view')" class="px-4 py-2">
                View
              </div>
              <div @click="toggleModal(budget, 'edit')" class="px-4 py-2">
                Edit
              </div>
              <div @click.stop.prevent="openDeleteModal(budget._id)" class="px-4 py-2 text-red-800">
                Delete
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-4 items-center mt-6 text-sm md:text-base">
        <Btn :disabled="currentPage === 1 || totalItems <= pageSize" @click="changePage(currentPage - 1)" :class="{
          'opacity-50 cursor-not-allowed':
            currentPage === 1 || totalItems <= pageSize,
          'cursor-pointer': !(currentPage === 1 || totalItems <= pageSize),
        }">
          Prev
        </Btn>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <Btn :disabled="currentPage === totalPages || totalItems <= pageSize" @click="changePage(currentPage + 1)"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentPage === totalPages || totalItems <= pageSize,
            'cursor-pointer': !(
              currentPage === totalPages || totalItems <= pageSize
            ),
          }">
          <span>Next</span>
        </Btn>
      </div>
    </div>
  </div>
  <Modal :isOpen="addModalIsOpen" position="center">
    <form @submit.prevent="addBudget"
      class="sm:h-[screen] md:h-[70%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
      <div class="flex flex-col gap-2 text-center">
        <h1 class="text-3xl">Add New Budget</h1>
        <span>Add new budget to keep track of your spending.</span>
      </div>
      <div class="flex flex-col gap-7">
        <Input label="Title" required name="title" id="title" v-model="formData.title"
          placeholder="Enter budget title"></Input>
        <Input label="Amount" required type="number" name="amount" id="amount" v-model="formData.total_amount"
          placeholder="Enter budget amount"></Input>
        <Input label="Duration" required type="select" :selectArray="durationArray" v-model="formData.duration"
          name="duration" id="duration" placeholder="Select a duration"></Input>
      </div>
      <div class="flex justify-end gap-4">
        <Btn variant="outline" @click="toggleModal(null, 'add')" class=":hover:bg-red-600"><span class="px-5">Cancel</span></Btn>
        <Btn type="submit" :disabled="loading" :class="{ 'opacity-50 cursor-not-allowed': loading }">
          <span v-if="loading">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status" aria-label="loading">
            </span>
            Adding
          </span>
          <span v-else>Add Budget</span>
        </Btn>
      </div>
    </form>
  </Modal>

  <Modal :isOpen="editModalIsOpen" position="left" mx="auto">
    <form @submit.prevent="editBudget"
      class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10 justify-center">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl">Edit Your Budget</h1>
        <span>Edit your budget to keep track of your spending and stay
          up-to-date.</span>
      </div>
      <div class="flex flex-col gap-7">
        <Input label="Title" required name="title" id="title" v-model="editBudgetData.title"
          placeholder="Enter budget title" />
        <Input label="Amount" required type="number" name="amount" id="amount" v-model="editBudgetData.total_amount"
          placeholder="Enter budget amount" />
        <Input label="Duration" required type="select" :selectArray="durationArray" v-model="editBudgetData.duration"
          name="duration" id="duration" placeholder="Select a duration" />
      </div>
      <div class="flex justify-end gap-4">
        <Btn variant="outline" @click="toggleModal(null, 'edit')">Cancel</Btn>
        <Btn type="submit" :disabled="loading" :class="{ 'opacity-50 cursor-not-allowed': loading }">
          <span v-if="loading">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status" aria-label="loading">
            </span>
            Updating
          </span>
          <span v-else>Update</span>
        </Btn>
      </div>
    </form>
  </Modal>

  <Modal :isOpen="viewModalIsOpen">
    <div class="w-full max-w-lg rounded-3xl bg-white shadow-lg py-8 px-6 flex flex-col gap-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-800">Budget Details</h2>
        <p class="text-gray-500">View the details of the selected budget.</p>
      </div>

      <div v-if="viewBudgetData" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold">Title</h4>
          <span class="text-lg text-gray-500 font-medium">
            {{ viewBudgetData.title }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold ">Budget Amount</h4>
          <span class="text-lg text-gray-500 font-medium">
            {{ viewBudgetData.total_amount.toLocaleString() }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold">Duration</h4>
          <span class="text-lg text-gray-500 font-medium">
            {{ viewBudgetData.duration }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold">Date Created</h4>
          <span class="text-lg text-gray-500 font-medium">
            {{ formatDate(viewBudgetData.createdAt) }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold ">Date Updated</h4>
          <span class="text-lg text-gray-500 font-medium">
            {{ formatDate(viewBudgetData.updatedAt) }}
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <Btn @click="toggleModal(null, 'view')" class="w-32"> Close </Btn>
      </div>
    </div>
  </Modal>

  <ConfirmationModal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="Delete Budget"
    message="Are you sure you want to delete this budget? This action cannot be undone." @confirm="confirmDelete"
    @cancel="cancelDelete" :loading="loading" />
</template>

<script setup>
import Btn from "@/components/Btn.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import Input from "@/components/Input.vue";
import Modal from "@/components/Modal.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify"; // Import the toast function

const durationArray = ref(["weekly", "monthly"]);

const store = useStore();
const addModalIsOpen = ref(false);
const isDeleteModalOpen = ref(false);
const budgetToDelete = ref(null);
const active = ref();
const loading = ref(false);
const initialFormData = ref({
  title: "",
  total_amount: "",
  duration: "",
});
let formData = ref({
  title: "",
  total_amount: "",
  duration: "",
});
const viewBudgetData = ref(null);
const editBudgetData = ref();
const viewModalIsOpen = ref(false);
const editModalIsOpen = ref(false);
const currentPage = ref(1);
const pageSize = ref(4);
const totalItems = computed(() => budgets.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const budgets = computed(() => store.getters["allBudgets"]);
const transactions = computed(() => store.getters.allTransactions);

const paginatedBudgets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return budgets.value.slice(start, end);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const toggleModal = (data, modal) => {
  if (modal === "edit") {
    if (data) {
      editBudgetData.value = { ...data };
    }
    editModalIsOpen.value = !editModalIsOpen.value;
  } else if (modal === "view") {
    if (data) {
      store.dispatch("getBudget", data._id).then((budget) => {
        viewBudgetData.value = budget;
        viewModalIsOpen.value = !viewModalIsOpen.value;
      });
    } else {
      viewModalIsOpen.value = !viewModalIsOpen.value;
    }
  } else if (modal === "add") {
    formData.value = { ...initialFormData };
    addModalIsOpen.value = !addModalIsOpen.value;
  }
};

const addBudget = async () => {
  loading.value = true;

  try {
    const message = await store.dispatch("addBudget", formData.value);

    // Show success toast
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
    });
    formData.value = { ...initialFormData };
    addModalIsOpen.value = false;
  } catch (error) {

    toast.error(error.message, {
      position: "top-center", autoClose: 1000, hideProgressBar: false,
    });
  } finally {
    loading.value = false;
  }
};

const isCompleted = (budgetId) => {
  return transactions.value.some(
    (transaction) => transaction.budget_id === budgetId
  );
};

const openMenu = (item) => {
  active.value = budgets.value.filter((item) => item.isOpen)[0];
  if (active.value) {
    active.value.isOpen = false;
  }
  item.isOpen = true;
};

const closeMenu = () => {
  active.value = budgets.value.filter((item) => item.isOpen)[0];
  if (active.value) {
    active.value.isOpen = false;
  }
};

const openDeleteModal = (budgetId) => {
  isDeleteModalOpen.value = true;
  budgetToDelete.value = budgetId;
};

const confirmDelete = async () => {
  loading.value = true;

  try {
    const message = await store.dispatch("removeBudget", budgetToDelete.value);
    toast.success(message, {
      position: "top-center", autoClose: 1000, hideProgressBar: false,
    });

    isDeleteModalOpen.value = false;
    budgetToDelete.value = null;
  } catch (error) {
    toast.error(error.message, {
      position: "top-center", autoClose: 2000, hideProgressBar: false,
    });
  } finally {
    loading.value = false;
  }
};


const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  budgetToDelete.value = null;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const editBudget = async () => {
  loading.value = true;
  try {
    const message = await store.dispatch("editBudget", {
      id: editBudgetData.value._id,
      budget: editBudgetData.value,
    });

    toast.success(message, {
      position: "top-center", autoClose: 2000, hideProgressBar: false,
    });

    editModalIsOpen.value = false;
  } catch (error) {
    toast.error(error.message, {
      position: "top-center", autoClose: 2000, hideProgressBar: false,
    });
  }
  loading.value = false;
};

onMounted(() => {
  store.dispatch("viewAllBudgets");
  store.dispatch("viewAllTransactions");
});
</script>

<style scoped>
.item:hover {
  cursor: pointer;
}

.item-menu {
  position: absolute;
  top: -15px;
  right: 0;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px -4px #14141410;
  box-shadow: 0px 16px 32px -4px #14141430;
}

.item-menu:hover {
  cursor: pointer;
}
</style>
