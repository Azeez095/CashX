<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="bg-custom-light text-black " @click="closeMenu" >
        <div class="flex flex-col gap-2 text-center ">
            <h1 class="font-medium text-3xl">Budget Management</h1>
            <span>Welcome! Easily create, edit, and delete budgets to manage your finances and keep track of your spending.</span>
        </div>
            <div class="flex flex-col mb-4 gap-6 lg:gap-10">
                <div class="flex items-center justify-center mt-4">
                   <AppBtn @click="toggleModal(null, 'add')" variant="primary">
                        <img src="@/assets/icons/Add.svg" alt="add">
                        Add budget
                  </AppBtn>

                </div>
                <h2 class="font-medium px-2 lg:my-[-20px]">{{ budgets.length }} total budget</h2>
                <div class="flex flex-col  gap-4">
                    <div v-for="(budget, index) in budgets" :key="index" class="bg-gray-200 border border-custom-light mx-2 mb-1 max-w-full p-8 grid grid-cols-3 lg:grid-cols-4 gap-4 justify-between rounded-3xl transition-transform duration-300 hover:scale-105 hover:shadow-lg relative ">
                        <div class="flex  flex-col items-start gap-1 capitalize">
                            <span class="text-[12px]">Title</span>
                            <div class="w-full truncate">{{ budget.title }}</div>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-[12px]">Total Amount</span>
                            #{{ budget.total_amount.toLocaleString() }}
                        </div>
                        <div class="hidden lg:flex flex-col items-start gap-1 ">
                            <span class="text-[12px]">Duration</span>
                            {{ budget.duration }}
                        </div>
                        <div class="flex justify-end">
                            <img @click.stop.prevent="openMenu(budget)" class="cursor-pointer" src="@/assets/icons/action.svg" alt="action">
                            <div v-if="budget.isOpen" class="item-menu w-[100px] lg:w-[200px] top-5 lg:top-10 bg-[#F8FAFC] text-custom-dark z-40">
                                <div @click="toggleModal(budget, 'view')" class="px-4 py-2">View</div>
                                <div @click="toggleModal(budget, 'edit')" class="px-4 py-2">Edit</div>
                                <div @click.stop.prevent="openDeleteModal(budget._id)" class="px-4 py-2 text-red-800">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <AppModal :isOpen="addModalIsOpen" position="center">
        <form @submit.prevent="addBudget" class="sm:h-[screen] md:h-[70%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
            <div class="flex flex-col gap-2 text-center">
                <h1 class="text-3xl">Add New Budget</h1>
                <span>Add new budget to keep track of your spending.</span>
            </div>
            <div class="flex flex-col gap-7">
                <AppInput label="Title" required name="title" id="title" v-model="formData.title" placeholder="Enter budget title"></AppInput>
                <AppInput label="Amount" required type="number" name="amount" id="amount" v-model="formData.total_amount" placeholder="Enter budget amount"></AppInput>
                <AppInput label="Duration" required type="select" :selectArray="durationArray" v-model="formData.duration" name="duration" id="duration" placeholder="Select a duration"></AppInput>
            </div>
            <div class="flex justify-between gap-4">
                <AppBtn variant="outline" @click="toggleModal(null, 'add')" class=":hover:bg-red-600">Cancel</AppBtn>
                <AppBtn type="submit">Add Budget</AppBtn>
            </div>
        </form>
    </AppModal>
    <AppModal :isOpen="editModalIsOpen" position="left">
        <form @submit.prevent="editBudget" class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl">Edit Your Budget</h1>
            <span>Edit your budget to keep track of your spending and stay up-to-date.</span>
          </div>
          <div class="flex flex-col gap-7">
            <AppInput
              label="Title"
              required
              name="title"
              id="title"
              v-model="editBudgetData.title"
              placeholder="Enter budget title"
            />
            <AppInput
              label="Amount"
              required
              type="number"
              name="amount"
              id="amount"
              v-model="editBudgetData.total_amount"
              placeholder="Enter budget amount"
            />
            <AppInput
              label="Duration"
              required
              type="select"
              :selectArray="durationArray"
              v-model="editBudgetData.duration"
              name="duration"
              id="duration"
              placeholder="Select a duration"
            />
          </div>
          <div class="flex justify-between gap-4">
            <AppBtn variant="outline" @click="toggleModal(null, 'edit')">Cancel</AppBtn>
            <AppBtn type="submit">Update</AppBtn>
          </div>
        </form>
    </AppModal>

    <AppModal :isOpen="viewModalIsOpen">
  <div class="w-full max-w-lg rounded-3xl bg-white shadow-lg py-8 px-6 flex flex-col gap-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-800">Budget Details</h2>
      <p class="text-gray-500">View the details of the selected budget.</p>
    </div>

    <div v-if="viewBudgetData" class="flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold text-gray-600">Title</h4>
        <span class="text-lg text-gray-800 font-medium">
          {{ viewBudgetData.title }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold text-gray-600">Budget Amount</h4>
        <span class="text-lg text-gray-800 font-medium">
          {{ viewBudgetData.total_amount.toLocaleString() }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold text-gray-600">Duration</h4>
        <span class="text-lg text-gray-800 font-medium">
          {{ viewBudgetData.duration }}
        </span>
      </div>
    </div>

    <div class="flex justify-end gap-4">
      <AppBtn @click="toggleModal(null, 'view')" class="w-32">
        Close
      </AppBtn>
    </div>
  </div>
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
import AppBtn from '@/components/AppBtn.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import AppInput from '@/components/AppInput.vue';
import AppModal from '@/components/AppModal.vue';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify'; // Import the toast function

const durationArray = ref(["weekly", "monthly"]);

const store = useStore();
const addModalIsOpen = ref(false);
const isDeleteModalOpen = ref(false);
const budgetToDelete = ref(null);
const active = ref();
const initialFormData = ref({
    title: '',
    total_amount: '',
    duration: '',
});
let formData = ref({
    title: '',
    total_amount: '',
    duration: '',
});
const viewBudgetData = ref(null);
const editBudgetData = ref();
const viewModalIsOpen = ref(false);
const editModalIsOpen = ref(false);

const budgets = computed(() => store.getters['allBudgets']);

const toggleModal = (data, modal) => {
  if (modal === "edit") {
    if (data) {
      editBudgetData.value = { ...data }; // Pre-fill the form with existing budget data
    }
    editModalIsOpen.value = !editModalIsOpen.value;
  } else if (modal === "view") {
    if (data) {
      store.dispatch("getBudget", data._id).then((budget) => {
        viewBudgetData.value = budget; // Set the data to viewBudgetData
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

const addBudget = () => {
  store.dispatch('addBudget', formData.value)
    .then(() => {
      // Show success toast
      toast.success('Budget added successfully!', {
        position: 'top-right',
        autoClose: 5000, // Toast auto closes after 5 seconds
        hideProgressBar: false,
      });
      formData.value = { ...initialFormData };
      addModalIsOpen.value = !addModalIsOpen.value;
    })
    .catch((error) => {
      console.error("Error adding budget:", error);
      toast.error('Failed to add budget. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
      });
    });
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

const confirmDelete = () => {
  store
    .dispatch("removeBudget", budgetToDelete.value)
    .then(() => {
      // Show success toast
      toast.success("Budget deleted successfully!", {
        position: "top-right",
        autoClose: 5000, // Toast auto closes after 5 seconds
        hideProgressBar: false,
      });
      isDeleteModalOpen.value = false;
      budgetToDelete.value = null;
    })
    .catch((error) => {
      // Show error toast
      toast.error("Failed to delete budget. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    });
};


const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  budgetToDelete.value = null;
};

const editBudget = () => {
  store
    .dispatch("editBudget", { id: editBudgetData.value._id, budget: editBudgetData.value })
    .then(() => {
      // Show success toast
      toast.success('Budget updated successfully!', {
        position: 'top-right',
        autoClose: 5000, // Toast auto closes after 5 seconds
        hideProgressBar: false,
      });
      editModalIsOpen.value = false; // Close the modal after successful edit
    })
    .catch((error) => {
      console.error("Error updating budget:", error);
      toast.error('Failed to update budget. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
      });
    });
};

onMounted(() => store.dispatch('viewAllBudgets'));
</script>

<style scoped>
.item:hover {
    cursor: pointer;
}

.item-menu {
  position: absolute;
  top:-15px;
  right: 0;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px -4px #14141410;
  box-shadow: 0px 16px 32px -4px #14141430;

}

.item-menu:hover{
    cursor: pointer;
}


</style>
