<template>
  <div class="kiosk-container">
    <div class="kiosk-wrapper">
      <!-- Header -->
      <header class="kiosk-header">
        <h1 class="kiosk-title">Self-Service Kiosk</h1>
      </header>

      <!-- Main Content -->
      <div class="kiosk-layout">
        <!-- Products Section -->
        <div class="products-card">
          <h2 class="section-title">Products</h2>
          <div class="category-select">
            <select
              v-model="selectedCategory"
              @change="filterProducts"
              class="category-dropdown"
            >
              <option value="" disabled>Select Category</option>
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-item"
            >
              <div class="product-content">
                <div>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-price">${{ product.price.toFixed(2) }}</p>
                </div>
                <button @click="addToCart(product)" class="add-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="add-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Section -->
        <div class="cart-card">
          <div class="cart-header">
            <h2 class="section-title">Cart</h2>
            <span class="cart-badge">{{ cart.length }} items</span>
          </div>
          <div class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <div class="item-details">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
              <div class="item-price">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
              <button @click="removeFromCart(item)" class="remove-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="remove-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <div class="subtotal">
              <span>Subtotal</span>
              <span class="subtotal-amount">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <button
              @click="checkout"
              :disabled="cart.length === 0"
              class="checkout-button"
              :class="{ disabled: cart.length === 0 }"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const apiURL = process.env.VUE_APP_URL;
const products = ref([]);
const filteredProducts = ref([]);
const categories = ref([]);
const selectedCategory = ref("");
const cart = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiURL}/products_list`);
    products.value = response.data.products;
    filteredProducts.value = products.value;
    loading.value = false;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Failed to load products. Please try again later.";
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiURL}/get_category_list`);
    categories.value = response.data.categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories. Please try again later.";
  }
};

const filterProducts = () => {
  if (selectedCategory.value) {
    filteredProducts.value = products.value.filter(
      (product) => product.category === selectedCategory.value
    );
  } else {
    filteredProducts.value = products.value;
  }
};

const addToCart = (product) => {
  const existingItem = cart.value.find(
    (cartItem) => cartItem.id === product.id
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const removeFromCart = (item) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === item.id);
  if (index !== -1) {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity--;
    } else {
      cart.value.splice(index, 1);
    }
  }
};

const cartTotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const checkout = () => {
  console.log("Proceeding to checkout with items:", cart.value);
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>

<style scoped>
.kiosk-container {
  min-height: 100vh;
  background-color: #f8f9fc;
  padding: 1.5rem;
}

.kiosk-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.kiosk-header {
  margin-bottom: 2rem;
}

.kiosk-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e2a4a;
}

.kiosk-subtitle {
  color: #6b7280;
}

.kiosk-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .kiosk-layout {
    grid-template-columns: 2fr 1fr;
  }
}

.products-card,
.cart-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e2a4a;
  margin-bottom: 1rem;
}

.products-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.category-dropdown {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #1e2a4a;
  font-size: 1rem;
}

.category-dropdown::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.product-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
}

.product-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.product-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-name {
  font-weight: 500;
  color: #1e2a4a;
  margin-bottom: 0.25rem;
}

.product-price {
  color: #00c389;
  font-weight: 600;
}

.add-button {
  background: #00c389;
  color: white;
  border-radius: 9999px;
  padding: 0.5rem;
  transition: background-color 0.2s;
}

.add-button:hover {
  background: #00b37d;
}

.add-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-badge {
  background: #e8f7f1;
  color: #00c389;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.item-name {
  font-weight: 500;
  color: #1e2a4a;
}

.item-price {
  font-size: 0.875rem;
  color: #6b7280;
}

.remove-button {
  color: #9ca3af;
  transition: color 0.2s;
}

.remove-button:hover {
  color: #ef4444;
}

.remove-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.cart-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
