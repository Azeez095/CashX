<template>
  <div
    class="bg-custom-dark text-custom-light p-6 lg:p-10 min-h-screen flex flex-col gap-2 lg:gap-8 w-screen"
  >
    <h1 class="text-4xl text-custom-light logo">CashX</h1>
    <div class="flex gap-10 justify-center">
      <div class="flex flex-col gap-6 lg:gap-10 w-[100%] xl:w-[500px] mt-10">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold">Get Started Now</h1>
          <span>Enter your details to join us.</span>
        </div>
        <form
          class="text-custom-light flex flex-col gap-6"
          @submit.prevent="signUp"
        >
          <AppInput
            label="User Name"
            type="text"
            required
            v-model="userName"
            name="userName"
            id="userName"
            placeholder="Enter a user name"
          />
          <AppInput
            label="Email address"
            type="email"
            required
            v-model="email"
            name="email"
            id="email"
            placeholder="Enter an email address"
          />
          <AppInput
            label="Password"
            type="password"
            required
            v-model="password"
            :min="8"
            name="password"
            id="password"
            placeholder="min 8 chars"
          />
          <AppInput
            label="I agree to the Terms & Privacy"
            type="checkbox"
            v-model="checkbox"
            name="checkbox"
            id="checkbox"
          />
          <AppBtn :disabled="isLoading || isSignupDisabled" type="submit" variant="secondary" :class="{'opacity-50 cursor-not-allowed': isLoading || isSignupDisabled}">
            <template v-if="isLoading">
              <img src="@/assets/icons/Loading.svg" alt=""
              class="w-5 h-5 inline-block mr-2 animate-spin"/>
              Signing up
            </template>
            <template v-else>Sign up</template>
          </AppBtn>
        </form>
        <div>
          Have an account?
          <a class="hover:text-blue-300 underline" href="/login">Log in</a>
        </div>
      </div>
      <img
        class="rounded-2xl hidden lg:flex h-[80vh] w-[490px] xl:w-fit"
        src="@/assets/images/auth-banner.png"
        alt="home-banner"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // Import useRouter for navigation
import AppInput from "@/components/AppInput.vue";
import AppBtn from "@/components/AppBtn.vue";
import { toast } from "vue3-toastify"; // Import toast directly from vue3-toastify

const userName = ref("");
const email = ref("");
const password = ref("");
const checkbox = ref(false);
const isLoading = ref(false); // Loading state
const store = useStore();
const router = useRouter(); // Initialize the router

// Track if a toast is already displayed
let toastDisplayed = false;
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isPasswordValid = computed(() => password.value.length >= 8);

const isSignupDisabled = computed(
  () => !isEmailValid.value || !isPasswordValid.value || !checkbox.value || isLoading.value
);

// Sign-up function
const signUp = async () => {
  if (isLoading.value) return; // Prevent multiple clicks

  try {
    isLoading.value = true; // Start loading

    // Dispatch the signup action
    const signUpResponse = await store.dispatch("signup", {
      username: userName.value,
      email: email.value,
      password: password.value,
    });

    // Show success toast
    toast.success(signUpResponse, {
      position: "top-center",
      autoClose: 3000, // Toast auto closes after 5 seconds
      hideProgressBar: false,
    });

    // Redirect to login page after toast
    setTimeout(() => {
      router.push("/login"); // Navigate to the login page
    }, 3000); // Wait for 5 seconds before redirecting
  } catch (error) {
    if (!toastDisplayed) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
      });
      toastDisplayed = true; // Prevent duplicate error toasts
      setTimeout(() => (toastDisplayed = false), 5000); // Reset after toast duration
    }
  } finally {
    isLoading.value = false; // End loading
  }
};
</script>

<style scoped>
.logo {
  font-weight: 800;
}
</style>

