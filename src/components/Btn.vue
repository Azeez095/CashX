<template>
  <div>
    <button
      :class="variant"
      class="p-2 px-3 flex items-center gap-1 justify-center text-center font-medium w-full hover:opacity-90 rounded-[10px]"
      :type="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

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
  backgroundColor: {
    type: String,
    default: "white",
  },
  textColor: {
    type: String,
    default: "white",
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
  background-color: #1e293b;
  color: white;
}
.secondary {
  background-color: white;
  color: #1e293b;
}
.secondary:hover {
  background: white;
  color: #94a3b8;
}

.primary:hover {
  background: lightblue;
  color: #1e293b;
}

.outline {
  background: red;
  outline: none;
  transition: all 0.3s ease-in-out;
}
.outline:hover {
  background: #dc2626;
}
</style>
