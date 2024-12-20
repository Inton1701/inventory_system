<template>
  <div class="login-page">
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-lg border-0 rounded">
            <div class="text-center mt-3">
              <img
                src="/img/logo.png"
                alt="Logo"
                class="img-fluid"
                style="width: 300px; height: 100px;"
              />
            </div>
            <div class="card-header text-center text-white">
              <h4 class="m-0">Welcome Back</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    id="email"
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div class="mb-3 pass-group">
                  <label for="password" class="form-label">Password</label>
                  <input
                    :type="isPasswordVisible ? 'text' : 'password'"
                    class="form-control form-control-lg"
                    id="password"
                    v-model="password"
                    placeholder="Enter your password"
                    required
                  />
                  <font-awesome-icon
                    :icon="isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'"
                    @click="togglePassword()"
                    class="toggle-password fa-xs mt-3"
                    style="font-size: 8px;"
                  />
                </div>
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div class="card-footer text-center text-muted"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import Swal from "sweetalert2";

  export default {
    setup() {
      const email = ref("");
      const password = ref("");
      const router = useRouter();
      const isPasswordVisible = ref(false);
      const togglePassword = () => {
        isPasswordVisible.value = !isPasswordVisible.value;
      };
      const login = async () => {
        try {
          const response = await axios.post("http://localhost:4000/api/login", {
            email: email.value,
            password: password.value,
          });

          const { token, role, user, id, emails, image } = response.data;

          // Store token and role in local storage
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("user", user);
          localStorage.setItem("id", id);
          localStorage.setItem("emails", emails);
          localStorage.setItem("image", image);

          // Show success notification
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            timer: 1500,
            showConfirmButton: false,
          });

          // Redirect based on role
          if (role === "Admin") {
            router.push("/dashboard");
          } else if (role === "Cashier") {
            router.push("/pos");
          }
        } catch (error) {
          // Show error notification
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.response?.data?.message || "An error occurred during login",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      };

      return {
        email,
        password,
        login,
        togglePassword,
        isPasswordVisible,
      };
    },
  };
</script>

<style scoped>
.login-page {
  background-color: #0bbf64;
  min-height: 100vh; /* Ensure the page takes full height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
