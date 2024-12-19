<template>
  <div>
    <button
    :class="variant"
      class="p-2 px-3 flex items-center gap-1 justify-center text-center font-medium w-full hover:opacity-90 rounded-[30px]"
      :type="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<style scoped>
.primary {
    background: #F8FAFC;
    color: #1E293B;
}
.primary:hover{
    background: lightblue;
    color:#1E293B ;
}

.outline {
  outline-style: auto;
}
</style>
