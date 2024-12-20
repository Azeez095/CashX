<template>
  <div class="flex flex-col gap-1 " :class="{ 'checkbox': type === 'checkbox' } ">
    <label :for="id">{{ label }}</label>
    <input v-if="type !== 'select' && type !== 'textarea'" :type="showPassword ? 'text' : type" :name="name" :id="id"
      :placeholder="placeholder" :minlength="type === 'password' ? min : undefined" :required=required
      v-model="inputValue" autocomplete />
    <div v-if="type === 'password'" class="relative">
      <img @click="toggleVisibility" class="absolute cursor-pointer right-3 top-[-35px]" src="@/assets/icons/hidden.svg"
        alt="">
    </div>
    <textarea rows="4" :required="required" v-if="type === 'textarea'" :name="name" :id="id"
      :placeholder="placeholder"></textarea>
    <div @click.prevent="toggleDropdown" ref="dropdownContainer" v-if="type === 'select'" class="relative">
      <input :name="name" :id="id" :required="required" :placeholder="placeholder" readonly v-model="inputValue">
      <img class="absolute cursor-pointer top-3 right-4" src="@/assets/icons/dropdown.svg" alt="dropdown">
      <div v-if="showDropdown" class="dropdown_box">
        <div @click="selectItem('')" class="py-3 px-4 hover:bg-[#F5F5F5] cursor-pointer">--Select--</div>
        <div v-for="(item, index) in selectArray" :key="index" class="py-3 px-4 hover:bg-[#F5F5F5] cursor-pointer"
          @click="selectItem(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
  label: {
    type: String,
    default: "",
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  id: {
    type: String,
    default: "",
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: [String, Number],
    default: 0,
  },
  modelValue: {
    type: [String, Boolean],
    default: "",
    required: true,
  },
  selectArray: {
    type: Array,
  }
});

const showPassword = ref(false);
const showDropdown = ref(false);

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const toggleVisibility = () => {
  showPassword.value = !showPassword.value
}
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectItem = (item) => {
  toggleDropdown
  emit('update:modelValue', item);
}

const dropdownContainer = ref(null);

const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped>
input,
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid gray;
  border-radius: 20px;
  outline: none;
  color:black;
  background-color: #F8FAFC;
}
input::placeholder{
  color:black
}
input:hover {
  box-shadow: 0 4px 8px rgb(226, 226, 104, 0.2);
  border: 1px solid #2563EB;
  cursor: pointer;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  /* 20px */
  height: 20px;
  border-radius: 4px;
  padding: 0;
  background-color: white;
  position: relative;
}

input[type="checkbox"]:checked {
  background-color: #141414;
  border-color: #141414;
}

input[type="checkbox"]:checked::after {
  content: "✓";
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
}

.dropdown_box {
  position: absolute;
  width: 100%;
  background-color: white;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px -4px #14141410;
  box-shadow: 0px 16px 32px -4px #14141430;
  z-index: 99999;
}
</style>
