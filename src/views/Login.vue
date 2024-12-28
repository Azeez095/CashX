<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="bg-custom-dark text-custom-light p-6 lg:p-10 flex flex-col gap-4 lg:gap-8 w-screen h-screen  ">
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
          <AppBtn type="submit" variant="secondary">Log in</AppBtn>
          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>
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
  import { toast } from 'vue3-toastify';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { ref } from 'vue';

const store = useStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const checkbox = ref(false);
const error = ref('')

// Login method
const login = async () => {
  try {
    await store.dispatch('login', {
      email: email.value,
      password: password.value,
    });
    // Clear any previous error messages
    error.value = '';

    // Show success toast
    toast.success("Login successful! Redirecting...", {
      position: "top-right",
      autoClose: 3000, // Auto closes after 3 seconds
      hideProgressBar: false,
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  } catch (e) {
    toast.error("Invalid email or password. Please try again.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
    });
  }
};


</script>

<style scoped>
.logo {
  font-weight: 800;
}
</style>
