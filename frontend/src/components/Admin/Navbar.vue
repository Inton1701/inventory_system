<template>
  <div class="main-wrapper">
    <div class="header">
      <div class="header-left active" style="border-right: none">
        <a href="#" class="logo logo-normal">
          <img src="assets/img/logo.png" alt />
        </a>
      </div>
      <a id="mobile_btn" class="mobile_btn" href="#sidebar">
        <span class="bar-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </a>
      <ul class="nav user-menu">
        <li class="nav-item nav-searchinputs"></li>
        <li class="nav-item dropdown has-arrow main-drop">
          <a
            href="javascript:void(0);"
            class="dropdown-toggle nav-link userset"
            data-bs-toggle="dropdown"
          >
            <span class="user-info">
              <span class="user-detail">
                <span class="user-name">{{ user }}</span>
                <span class="user-role">{{ role }}</span>
              </span>
            </span>
          </a>
          <div class="dropdown-menu menu-drop-user">
            <div class="profilename">
              <a class="dropdown-item logout pb-0" href="#" @click="logout"
                ><img
                  src="assets/img/icons/log-out.svg"
                  class="me-2"
                  alt="img"
                />Logout</a
              >
            </div>
          </div>
        </li>
      </ul>

      <div class="dropdown mobile-user-menu">
        <a
          href="javascript:void(0);"
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          ><i class="fa fa-ellipsis-v"></i
        ></a>
        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="general-settings.html">Settings</a>
          <a class="dropdown-item" href="/">Logout</a>
        </div>
      </div>
    </div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-inner">
        <div class="sidebar-menu">
          <ul>
            <li class="submenu-open">
              <h6 class="submenu-hdr">Main</h6>
              <ul>
                <li>
                  <router-link
                    to="/dashboard"
                    :class="{ 'active-link': $route.path === '/dashboard' }"
                  >
                    <i data-feather="grid"></i><span>Admin Dashboard</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="submenu-open">
              <h6 class="submenu-hdr">Inventory</h6>
              <ul>
                <li>
                  <router-link
                    to="/products"
                    :class="{ 'active-link': $route.path === '/products' }"
                  >
                    <i data-feather="box"></i><span>Products</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/create-product"
                    :class="{
                      'active-link': $route.path === '/create-product',
                    }"
                  >
                    <i data-feather="plus-square"></i
                    ><span>Create Product</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/manage-stocks"
                    :class="{ 'active-link': $route.path === '/manage-stocks' }"
                  >
                    <i data-feather="package"></i><span>Manage Stock</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/category"
                    :class="{ 'active-link': $route.path === '/category' }"
                  >
                    <i data-feather="codepen"></i><span>Category</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="submenu-open">
              <h6 class="submenu-hdr">Sales</h6>
              <ul>
                <li>
                  <router-link
                    to="transactions"
                    :class="{ 'active-link': $route.path === '/transactions' }"
                  >
                    <i data-feather="file-text"></i><span>Transactions</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="returns"
                    :class="{ 'active-link': $route.path === '/returns' }"
                  >
                    <i data-feather="copy"></i><span>Sales Return</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="voids"
                    :class="{ 'active-link': $route.path === '/voids' }"
                  >
                    <i data-feather="alert-octagon"></i><span>Voids</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="pos"
                    :class="{ 'active-link': $route.path === '/pos' }"
                  >
                    <i data-feather="hard-drive"></i><span>POS</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="submenu-open">
              <h6 class="submenu-hdr">Peoples</h6>
              <ul>
                <li>
                  <router-link
                    to="staffs"
                    :class="{ 'active-link': $route.path === '/staffs' }"
                  >
                    <i data-feather="users"></i><span>Staffs</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="submenu-open">
              <h6 class="submenu-hdr">Settings</h6>
              <ul>
                <li>
                  <a href="#" @click="logout">
                    <i data-feather="log-out"></i><span>Logout</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import feather from "feather-icons";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "Navbar",
  setup() {
    const imageURL = process.env.VUE_APP_IMAGE_URL;
    const apiURL = process.env.VUE_APP_URL;
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const image = localStorage.getItem("image");
    const router = useRouter();

    const logout = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your account.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userId = localStorage.getItem("id");
            const response = await axios.patch(`${apiURL}/logout/${userId}`);
            if (response.data.success) {
              // Clear local storage
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("id");
              localStorage.removeItem("user");
              localStorage.removeItem("emails");
              localStorage.removeItem("image");
              // Redirect to home
              router.push("/");

              Swal.fire(
                "Logged Out",
                "You have been successfully logged out.",
                "success"
              );
            } else {
              Swal.fire(
                "Logged Out",
                "An error occurred during logout",
                "error"
              );
              router.push("/");
            }
          } catch (error) {
            Swal.fire("Error", "An error occurred during logout", "error");
            console.log(error);
          }
        }
      });
    };

    onMounted(() => {
      feather.replace();
    });

    return {
      user,
      logout,
      role,
      imageURL,
      image,
    };
  },
};
</script>

<style scoped>
.header {
  background-color: #0bbf64 !important;
  color: white !important;
}
.header span {
  color: white !important;
}
.sidebar {
  overflow-y: auto;
  max-height: 100vh;
  max-width: 15vw;
  background-color: #0bbf64 !important;
  transition: background-color 0.3s ease;
}
.sidebar h6 {
  font-weight: 900 !important;
  letter-spacing: 2px !important;
}
.active-link {
  background-color: #2c9a52;
  font-weight: bold;
  padding: 1rem !important;
  min-width: 11vw;
  color: #f5f5f5 !important;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.active-link:hover {
  background-color: #248c47;
}

.active-link span {
  color: #f5f5f5 !important;
}

.sidebar-menu a:hover {
  background-color: #248c47;
  color: #fff !important;
}

.sidebar .user-info:hover {
  color: #f5f5f5 !important; /* Ensure the user's name color is clear during hover */
}

.sidebar-menu i {
  color: #f5f5f5 !important;
}
.sidebar-menu span {
  color: #f5f5f5 !important;
}

.sidebar-menu a {
  color: #f5f5f5 !important;
  transition: color 0.3s ease;
}

.sidebar-menu a:hover {
  color: #fff; /* Link color change on hover */
}

/* Hover effect for sidebar links */
.sidebar-menu i:hover {
  color: #fff !important;
}

.navbar-active {
  color: #fff !important;
}

.sidebar-menu .active-link i,
.sidebar-menu .active-link span {
  color: #f5f5f5;
}
</style>
