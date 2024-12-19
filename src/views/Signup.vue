<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="bg-custom-dark text-custom-light h-screen p-6 lg:p-10  flex flex-col gap-2 lg:gap-8 w-screen">
      <h1 class="text-4xl text-custom-light logo">CashX</h1>
      <div class="flex gap-10 justify-center">
          <div class="flex flex-col gap-6 lg:gap-10 w-[100%] xl:w-[500px] mt-10">
              <div class="flex flex-col gap-2">
                  <h1 class="text-3xl font-bold">Get Started Now</h1>
                  <span>Enter your details to join us.</span>
              </div>
                  <form class="text-custom-light flex flex-col gap-6" @submit.prevent="signUp">
                      <AppInput label="User Name" type="text" required v-model="userName" name="userName" id="userName" placeholder="Enter a user name" />
                      <AppInput label="Email address" type="email" required v-model="email" name="email" id="email" placeholder="Enter a email address" />
                      <AppInput label="Password" type="password" required v-model="password" :min="8" name="password" id="password" placeholder="min 8 chars" />
                      <AppInput label="I agree to the Terms & Privacy" type="checkbox" v-model="checkbox" name="checkbox" id="checkbox" placeholder="min 8 chars" />
                        <AppBtn type="submit" variant="primary" >Sign up</AppBtn>
                  </form>
              <div>
                  Have an account? <a class="underline" href="/login">Log in</a>
              </div>
          </div>
          <img class="rounded-2xl hidden lg:flex h-[80vh] w-[490px] xl:w-fit" src="@/assets/images/auth-banner.png" alt="home-banner">
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import AppInput from "@/components/AppInput.vue";
  import AppBtn from "@/components/AppBtn.vue";

  const userName = ref('');
  const email = ref('');
  const password = ref('');
  const checkbox = ref(false);
  const router = useRouter();
  const store = useStore();

  // Sign-up function
  const signUp = async () => {
    console.log({ userName: userName.value, email: email.value, password: password.value });
    try {
      const response = await store.dispatch('signup', {
        userName: userName.value,
        email: email.value,
        password: password.value
      });
      router.push('/dashboard');

      if (response && response.data && response.data.token) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  </script>

  <style scoped>
  .logo {
      font-weight: 800;
  }

  </style>
