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
                            <div v-if="budget.isOpen" class="item-menu w-[100px] lg:w-[200px] top-5 lg:top-10 bg-[#F8FAFC] text-custom-dark">
                                <div @click="toggleModal(budget, 'view')" class="px-4 py-2">View</div>
                                <div @click="toggleModal(budget, 'edit')" class="px-4 py-2">Edit</div>
                                <div @click.stop.prevent="deleteBudget(budget._id)" class="px-4 py-2 text-red-800">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <AppModal :isOpen="addModalIsOpen" position="left">
        <form @submit.prevent="addBudget" class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
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
        <form @submit.prevent="" class="h-screen w-[100%] lg:w-[600px] bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl">Edit Your Budget</h1>
                <span>Edit your budget to keep track of your spending and stay up-to-date.</span>
            </div>
            <div class="flex flex-col gap-7">
                <AppInput label="Title" required name="title" id="title" v-model="editBudgetData.title" placeholder="Enter budget title"></AppInput>
                <AppInput label="Amount" required type="number" name="amount" id="amount" v-model="editBudgetData.amount" placeholder="Enter budget amount"></AppInput>
                <AppInput label="Duration" required type="select" :selectArray="durationArray" v-model="editBudgetData.duration" name="duration" id="duration" placeholder="Select a duration"></AppInput>
            </div>
            <div class="flex justify-center gap-4">
                <AppBtn variant="outline" @click="toggleModal(null, 'edit')">Cancel</AppBtn>
                <AppBtn type="submit">Update</AppBtn>
            </div>
        </form>
    </AppModal>
    <AppModal :isOpen="viewModalIsOpen">
        <div class="w-[100%] lg:w-[600px] rounded-3xl bg-[#fafafa] py-10 px-8 flex flex-col gap-10">
            <div class="flex flex-col gap-7">
                <div class="flex flex-col gap-2">
                    <h4 class="text-xl">Title</h4>
                    <span>{{ viewBudgetData.title }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <h4 class="text-xl">Budget Amount</h4>
                    <span>{{ viewBudgetData.amount.toLocaleString() }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <h4 class="text-xl">Duration</h4>
                    <span>{{ viewBudgetData.duration }}</span>
                </div>
            </div>
            <div class="flex justify-center gap-4">
                <AppBtn @click="toggleModal(null, 'view')">Close</AppBtn>
            </div>
        </div>
    </AppModal>
</template>

<script setup>
import AppBtn from '@/components/AppBtn.vue';
import AppInput from '@/components/AppInput.vue';
import AppModal from '@/components/AppModal.vue';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const durationArray = ref(["weekly", "monthly"]);

const store = useStore();
const addModalIsOpen = ref(false);
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
const viewBudgetData = ref();
const editBudgetData = ref();
const viewModalIsOpen = ref(false);
const editModalIsOpen = ref(false);

const budgets = computed(()=> store.getters['allBudgets']);

const toggleModal = (data, modal) => {
    if(modal === 'edit') {
        editBudgetData.value = data;
        editModalIsOpen.value = !editModalIsOpen.value;
    } else if (modal === 'view') {
        viewBudgetData.value = data;
        viewModalIsOpen.value = !viewModalIsOpen.value;
    } else if (modal === 'add') {
        formData.value = {...initialFormData}
        addModalIsOpen.value = !addModalIsOpen.value
    }
}

const addBudget = () => {
    store.dispatch('addBudget', formData.value)
    formData.value = {...initialFormData}
    addModalIsOpen.value = !addModalIsOpen.value
}

const openMenu = (item) => {
    active.value = budgets.value.filter((item) => item.isOpen)[0];
    if(active.value) {
        active.value.isOpen = false;
    }
    item.isOpen = true
}

const closeMenu = () => {
    active.value = budgets.value.filter((item) => item.isOpen)[0];
    if(active.value) {
        active.value.isOpen = false;
    }
}

const deleteBudget = (id) => {
    store.dispatch('removeBudget', id)
}

onMounted(() => store.dispatch('viewAllBudgets'))

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
  z-index: 99999;
}

.item-menu:hover{
    cursor: pointer;
}


</style>
