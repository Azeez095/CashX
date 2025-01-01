<template>
  <div class="bg-custom-dark text-custom-light p-6 lg:p-10 flex flex-col gap-4 lg:gap-8 w-screen min-h-[100vh]">
    <h1 class="text-4xl logo justify-self-start align-self-start">CashX</h1>
    <div class="flex gap-10 justify-center">
      <div class="flex flex-col gap-6 lg:gap-10 w-[100%] xl:w-[500px] mt-10">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold">Get Started Now</h1>
          <span>Enter your details to access your account</span>
        </div>

        <form class="flex flex-col gap-6 mt-8" @submit.prevent="login">
          <AppInput class="my-3"
            label="Email address"
            required
            type="email"
            v-model="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
          />
          <AppInput class="mb-3"
            label="Password"
            required
            type="password"
            :min="8"
            v-model="password"
            name="password"
            id="password"
            placeholder="min 8 chars"
          />
          <AppInput class="mb-3"
            label="I agree to the Terms & Privacy"
            type="checkbox"
            v-model="checkbox"
            name="checkbox"
            id="checkbox"
            placeholder="min 8 chars"
          />
          <AppBtn :disabled="isLoading || isLoginDisabled || loginDisabled" type="submit" variant="secondary" :class="{ 'opacity-60 cursor-not-allowed': isLoading || isLoginDisabled || loginDisabled}">
            <template v-if="isLoading">
              <img
                src="@/assets/icons/Loading.svg"
                alt="Loading..."
                class="w-5 h-5 inline-block mr-2 animate-spin"
              />
              Logging in...
            </template>
            <template v-else>
              Log in
            </template>
          </AppBtn>
        </form>
        <div>
          Don't have an account? <a class="underline hover:text-blue-300" href="/signup">Sign up</a>
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
import AppInput from "@/components/AppInput.vue";
import AppBtn from "@/components/AppBtn.vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed } from "vue";

const store = useStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const loginDisabled = ref(false)
const checkbox = ref(false);
const error = ref("");
const isLoading = ref(false); // Track the loading state

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isPasswordValid = computed(() => password.value.length >= 8);

const isLoginDisabled = computed(
  () => !isEmailValid.value || !isPasswordValid.value || !checkbox.value || isLoading.value
);
// Login method
const login = async () => {
  if (isLoading.value) return; // Prevent multiple requests

  try {
    isLoading.value = true; // Start loading
    const message = await store.dispatch("login", {
      email: email.value,
      password: password.value,
    });

    // Clear any previous error messages
    error.value = "";

    // Show success toast
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
    });

    loginDisabled.value = true

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  } catch (err) {
    error.value = err.message;

    // Show error toast (ensure only one message appears)
    if (!toast.isActive("loginError")) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "loginError", // Add a unique ID to prevent duplicate toasts
      });
    }
  } finally {
    isLoading.value = false; // Reset loading state
  }
};
</script>

