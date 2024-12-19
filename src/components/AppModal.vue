<template>
    <div v-if="isOpen" class="modal_overlay">
        <div class="flex" :class="position">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String,
    default: 'center'
  }
});


</script>

<style scoped>
.center {
    height: 100vh;
    align-items: center;
    justify-content: center;
}

.left {
    justify-content: flex-end;
}

@media only screen and (max-width: 640px) {
  .left {
    width: 100%;
}
}
</style>
