<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col lg:flex-row bg-custom-light">
    <SideBar></SideBar>
    <div class="py-2 px-4 w-full lg:h-screen overflow-auto scroll-container">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/SideBar.vue";
</script>
