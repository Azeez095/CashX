<template>
    <div class="bg-custom-dark min-h-screen hidden lg:block min-w-[350px]  border-r border-r-[#E5E5E5]">
        <div class="p-8 flex flex-col gap-10 ">
            <h1 class="sm:text-custom-light text-4xl text-center font-extrabold">CashX</h1>
            <div class="flex gap-4 items-center">
                <div class="w-[60px] h-[60px] rounded-full bg-custom-light"></div>
                <div class="flex flex-col gap-1 text-custom-light">
                    <h2 class="font-medium">{{ user?.name }}</h2>
                    <span class="text-sm cursor-pointer">Edit Profile</span>
                </div>
            </div>
            <div class="flex flex-col gap-5">
                <router-link to="/dashboard/financial-insight"
                    class="py-4 px-5 w-full font-medium flex items-center gap-2 rounded-[30px] text-custom-light"
                    exact-active-class="active_link">
                    <img class="h-6 w-6" src="@/assets/icons/insight.svg" alt="">
                    Financial Insights
                </router-link>
                <router-link to="/dashboard/budget"
                    class="py-4 px-5 w-full flex font-medium items-center gap-2 rounded-[30px] text-custom-light"
                    exact-active-class="active_link">
                    <img class="h-6 w-6" src="@/assets/icons/budget.svg" alt="">
                    Budget
                </router-link>
                <router-link to="/dashboard/transaction"
                    class="py-4 px-5 w-full font-medium flex items-center gap-2 rounded-[30px] text-custom-light"
                    exact-active-class="active_link">
                    <img class="h-6 w-6" src="@/assets/icons/transaction.svg" alt="">
                    Transaction
                </router-link>
            </div>
            <router-link to="/login" class="py-4 px-5 w-full font-medium flex items-center gap-2 rounded-[30px] text-custom-light">
              <AppBtn type="button" variant="secondary" class="w-full">Log out</AppBtn>
            </router-link>
        </div>
    </div>
    <div class="py-3 lg:hidden bg-white border-0 px-4 flex items-center justify-between sticky top-0 z-50">
        <h1 class="text-4xl text-center font-extrabold logo">CashX</h1>
        <img @click="toggleMenu" class="w-8 h-8" src="@/assets/icons/hamburger.svg" alt="hamburger">
    </div>
    <div v-if="isOpen" @click="toggleMenu" class="modal_overlay bg-custom-dark lg:hidden">
        <div @click.stop.prevent class="h-screen relative w-[78%] bg-white">
        <div class="p-6 flex flex-col gap-10">
            <h1 class="text-4xl text-center font-extrabold">CashX</h1>
            <div class="flex gap-4 items-center">
                <div class="w-[60px] h-[60px] rounded-full bg-[#141414]"></div>
                <div class="flex flex-col gap-1">
                    <h2 class="font-medium">{{ user?.name }}</h2>
                    <span class="text-sm cursor-pointer">Edit Profile</span>
                </div>
            </div>
            <div class="flex flex-col bg-custom-light gap-5">
                <router-link to="/dashboard/financial-insight"
                    class="py-4 px-5 w-full font-medium flex items-center gap-2 rounded-[30px] text-custom-dark bg-gray-300"
                    exact-active-class="active_link"
                    @click="toggleMenu">
                    <img class="h-6 w-6" src="@/assets/icons/insight.svg" alt="">
                    Financial Insights
                </router-link>
                <router-link to="/dashboard/budget"
                    class="py-4 px-5 w-full flex font-medium items-center gap-2 rounded-[30px] text-custom-dark bg-gray-300"
                    exact-active-class="active_link"
                    @click="toggleMenu">
                    <img class="h-6 w-6" src="@/assets/icons/budget.svg" alt="">
                    Budget
                </router-link>
                <router-link to="/dashboard/transaction"
                    class="py-4 bg-custom-light px-5 w-full font-medium flex items-center gap-2 rounded-[30px] text-custom-dark bg-gray-300"
                    exact-active-class="active_link"
                    @click="toggleMenu">
                    <img class="h-6 w-6" src="@/assets/icons/transaction.svg" alt="">
                    Transaction
                </router-link>

            </div>

                <AppBtn type="button" variant="primary" class="w-full" @click="logout">Log out</AppBtn>

        </div>
        </div>

    </div>

</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import AppBtn from './AppBtn.vue';
const store = useStore();

const isOpen = ref(false);
const user = computed(() => store.state.auth.user)
const toggleMenu = () => {
    isOpen.value = !isOpen.value
}
const logout = () => {
    store.dispatch('logout')
}
console.log(user)
</script>

<style scoped>
.active_link {
    background: #141414;
    font-weight: 600;
    color: white;
}
</style>
