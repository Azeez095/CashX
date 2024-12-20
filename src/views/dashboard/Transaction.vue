<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div @click="closeMenu" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2 text-center">
            <h1 class="font-medium text-3xl">Transaction Management</h1>
            <span>Welcome! Easily create, edit, and delete transactions to manage your finances and keep track of your spending.</span>
        </div>
            <div class="flex flex-col mb-4 gap-6 lg:gap-10">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-semibold">Transaction</h2>
                    <AppBtn @click="toggleModal(null, 'add')">
                        <img src="@/assets/icons/Add.svg" alt="add">
                        Add transaction
                    </AppBtn>
                </div>
                <h2 class="font-medium pl-2 lg:my-[-20px]">{{ transactions.length }} total transaction</h2>
                <div class="flex flex-col gap-4">
                    <div v-for="(transaction, index) in transactions" :key="index" class="w-full p-8 grid grid-cols-3 item lg:grid-cols-4 gap-4 justify-between bg-white rounded-3xl">
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-[12px]">Transaction Amount</span>
                            #{{ transaction.amount.toLocaleString() }}
                        </div>
                        <div class="flex flex-col items-start gap-1 capitalize">
                            <span class="text-[12px]">Category</span>
                            {{ transaction.category }}
                        </div>
                        <div class="hidden lg:flex flex-col items-start gap-1">
                            <span class="text-[12px]">Narration</span>
                            <div class="truncate w-full">{{ transaction.narration }}</div>
                        </div>
                        <div class="flex justify-end relative">
                            <img @click.stop.prevent="openMenu(transaction)" class="cursor-pointer" src="@/assets/icons/action.svg" alt="action">
                            <div v-if="transaction.isOpen" class="item-menu w-[100px] lg:w-[200px] top-8 lg:top-10">
                                <div @click="toggleModal(transaction, 'view')" class="px-4 py-2">View</div>
                                <div @click="toggleModal(transaction, 'edit')" class="px-4 py-2">Edit</div>
                                <div @click.stop.prevent="deleteTransaction(transaction.id)" class="px-4 py-2 text-red-800">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
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
            <div class="flex justify-center gap-4">
                <AppBtn variant="outline" @click="toggleModal(null, 'add')">Cancel</AppBtn>
                <AppBtn type="submit">Add Transaction</AppBtn>
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
                <AppInput label="Amount" required type="number" name="amount" id="amount" v-model="editTransactionData.amount" placeholder="Enter transaction amount"></AppInput>
                <AppInput label="Duration" required type="select" :selectArray="categoryArray" v-model="editTransactionData.category" name="category" id="category" placeholder="Select a category"></AppInput>
                <AppInput label="Narration" required type="textarea" name="narration" id="narration" v-model="editTransactionData.narration" placeholder="Enter a narration"></AppInput>
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
                    <h4 class="text-xl">Budget Amount</h4>
                    <span>{{ viewTransactionData.amount.toLocaleString() }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <h4 class="text-xl">Duration</h4>
                    <span>{{ viewTransactionData.category }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <h4 class="text-xl">Narration</h4>
                    <span>{{ viewTransactionData.narration }}</span>
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const categoryArray = ref(["Income", "Spending"]);

const store = useStore();
const addModalIsOpen = ref(false);
const active = ref();
const initialFormData = ref({
    amount: '',
    category: '',
    narration: '',
    isOpen: false
});
let formData = ref({
    amount: '',
    category: '',
    narration: '',
    isOpen: false
});
const viewTransactionData = ref();
const editTransactionData = ref();
const viewModalIsOpen = ref(false);
const editModalIsOpen = ref(false);

const transactions = computed(()=> store.state.transaction.transactions);

const toggleModal = (data, modal) => {
    if(modal === 'edit') {
        editTransactionData.value = data;
        editModalIsOpen.value = !editModalIsOpen.value;
    } else if (modal === 'view') {
        viewTransactionData.value = data;
        viewModalIsOpen.value = !viewModalIsOpen.value;
    } else if (modal === 'add') {
        formData.value = {...initialFormData}
        addModalIsOpen.value = !addModalIsOpen.value
    }
}

const addTransaction = () => {
    store.dispatch('addTransaction', formData.value)
    formData.value = {...initialFormData}
    addModalIsOpen.value = !addModalIsOpen.value
}

const openMenu = (item) => {
    active.value = transactions.value.filter((item) => item.isOpen)[0];
    if(active.value) {
        active.value.isOpen = false;
    }
    item.isOpen = true
}

const closeMenu = () => {
    active.value = transactions.value.filter((item) => item.isOpen)[0];
    if(active.value) {
        active.value.isOpen = false;
    }
}

const deleteTransaction = (id) => {
    store.dispatch('removeTransaction', id)
}

</script>

<style scoped>
.item:hover {
    cursor: pointer;
}

.item-menu {
    position: absolute;
    right: 0;
  background-color: white;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px -4px #14141410;
  box-shadow: 0px 16px 32px -4px #14141430;
  z-index: 99999;
}
</style>
