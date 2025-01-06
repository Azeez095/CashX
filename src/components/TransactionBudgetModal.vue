<template>
  <Modal :isOpen="isOpen" :position="position" class="bg-custom-dark">
    <form
      @submit.prevent="handleSubmit"
      class="w-[100%] lg:w-[600px] bg-[#fafafa] py-5 px-8 flex flex-col gap-10 overflow-y-scroll h-[100vh] absolute z-50"
    >
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl">{{ modalTitle }}</h1>
        <span>{{ modalDescription }}</span>
      </div>
      <div class="flex flex-col gap-7">
        <Input
          v-if="showTypeInput"
          label="Type"
          required
          type="select"
          :selectArray="typeArray"
          v-model="formData.type"
          name="type"
          id="type"
          placeholder="Select a type"
        ></Input>
        <Input
          v-if="showBudgetInput && formData.type !== 'income'"
          label="Budget"
          required
          type="select"
          :selectArray="budgetTitles"
          v-model="selectedBudget"
          name="budget_id"
          id="budget_id"
          placeholder="Select a budget"
        ></Input>
        <span v-if="budgetTitles.length === 0 && showBudgetInput" class="text-red-500">
          No budgets available.
          <RouterLink to="/dashboard/budget"
            >Add a new budget
            <span class="underline text-custom-dark">Here</span></RouterLink
          >
        </span>
        <Input
          v-if="showCategoryInput"
          label="Category"
          required
          type="select"
          :selectArray="filteredCategoryArray"
          v-model="formData.category"
          name="category"
          id="category"
          placeholder="Select a category"
        ></Input>
        <Input
          v-if="showAmountInput"
          label="Transaction Amount"
          required
          type="number"
          name="amount"
          id="amount"
          v-model="formData.amount"
          placeholder="Enter transaction amount"
        ></Input>
        <Input
          v-if="showNarrationInput"
          label="Narration"
          type="textarea"
          required
          name="narration"
          id="narration"
          v-model="formData.narration"
          placeholder="Enter a narration"
        ></Input>
      </div>
      <div class="flex justify-between gap-4">
        <Btn variant="outline" @click="handleCancel">Cancel</Btn>
        <Btn
          type="submit"
          :disabled="loading || !isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': loading || !isFormValid }"
        >
          <span v-if="loading">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
            </span>
            {{ loadingText }}
          </span>
          <span v-else>{{ submitButtonText }}</span>
        </Btn>
      </div>
    </form>
  </Modal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String,
      default: "left",
    },
    modalTitle: {
      type: String,
      default: "Modal Title",
    },
    modalDescription: {
      type: String,
      default: "Modal description here.",
    },
    typeArray: {
      type: Array,
      default: () => [],
    },
    budgetTitles: {
      type: Array,
      default: () => [],
    },
    filteredCategoryArray: {
      type: Array,
      default: () => [],
    },
    showTypeInput: {
      type: Boolean,
      default: true,
    },
    showBudgetInput: {
      type: Boolean,
      default: true,
    },
    showCategoryInput: {
      type: Boolean,
      default: true,
    },
    showAmountInput: {
      type: Boolean,
      default: true,
    },
    showNarrationInput: {
      type: Boolean,
      default: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    selectedBudget: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isFormValid: {
      type: Boolean,
      required: true,
    },
    submitButtonText: {
      type: String,
      default: "Submit",
    },
    loadingText: {
      type: String,
      default: "Submitting",
    },
  },
  emits: ["submit", "cancel"],
  methods: {
    handleSubmit() {
      this.$emit("submit");
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>
