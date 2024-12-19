<template>
  <div class="main-wrapper">
    <div class="header" style="background-color: #0BBF64;">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Logo / Title -->
        <div class="logo mx-auto">
          <img src="img/logo.png" alt="Gulay" class="img-fluid" style="width: 200px; height: 60px;" />
        </div>

        <!-- Logout Button -->
        <button class="btn btn-danger" @click="logout()">X</button>
      </div>
    </div>

    <div class="page-wrapper pos-pg-wrapper ms-0">
      <div class="content pos-design p-0">
        <div class="row align-items-start pos-wrapper">
          <div class="col-md-3 col-lg-2">
            <div class="category-list">
              <h2 class="text-center py-2">CATEGORIES</h2>
              <ul class="list-group text-center overflow-auto"
                style="max-height:100vh; overflow-y: auto; scrollbar-width: thin;">
                <li v-for="category in categories" :key="category.name" class="list-group-item text-uppercase py-3 "
                  :class="{ 'active': selectedCategory === category.name }" @click="selectCategory(category.name)">
                  <a class="fs-5" href="javascript:void(0);">{{ category.name }}</a>
                </li>
              </ul>
            </div>
          </div>
          <!-- Product Display -->
          <div class="col-md-12 col-lg-6">
            <div class="row bg-white px-3 pb-4 mx-1 mt-2">
              <h4>Search Products:</h4>
              <input v-model="searchQuery" class="form-control  border border-primary border-4 fs-3 mb-2 mt-3"
                type="text" placeholder="Search Here" ref="barcodeInput" />
            </div>
            <div class="row pos-wrapper">
              <div class="row">
                <div class="col-md-12 col-lg-12">
                  <div class="pos-products">
                    <div class="tabs_container mx-auto">
                      <div v-if="filteredProducts.length" class="tab_content active">
                        <div class="row">
                          <div v-for="product in filteredProducts" :key="product.id"
                            class="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-3 product-item">
                            <div class="product-info text-light border border-3 rounded-1"
                              style=" border-color: #0BBF64; color: #fff;" @click="addProduct(product)">
                              <a href="javascript:void(0);" class="img-bg">
                                <img v-if="product.image" :src="`${imgURL}${product.image}`" alt="Product" />
                                <img v-else src="/img/icons/no-image-icon.png" />
                              </a>
                              <h6 class="product-name ms-2">
                                <a href="">{{ product.name }}</a>
                              </h6>
                              <div class="d-flex ms-2 align-items-center justify-content-between price">
                                <span class="text-primary"><span class="text-dark">Available:</span>{{ product.quantity
                                  }}</span>
                                <p class="me-2 text-secondary">{{ product.price }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                        <p class="text-center fs-1">No products available .</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Order List and Summary -->
          <div class="col-md-12 col-lg-4 ps-0">
            <aside class="order-sidebar">
              <div class="d-flex justify-content-between align-items-center text-uppercase fw-bold py-3">
                ITEM LIST

                <span>
                  <button class="btn btn-info px-4 py-1 mx-1" @click="openEditCartModal">EDIT</button>
                  <button class="btn btn-danger px-4 py-1 mx-1" @click="cancelTransaction" id="del-btn">CANCEL</button>
                </span>

              </div>
              <div class="product-added">
                <div class="product-wrap">
                  <table class="table table-responsive">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>PRICE</th>
                        <th>QTY.</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cart" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.quantity * item.price }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="order-summary">
                <h6>Order Summary</h6>

                <table class="table">
                  <tr>
                    <td>SUB-TOTAL</td>
                    <td class="text-end">{{ subtotal }}</td>
                  </tr>
                  <tr>
                    <td>VAT</td>
                    <td class="text-end">{{ VAT }}%</td>
                  </tr>
                  <tr>
                    <td class="fs-5 fw-bolder">TOTAL</td>
                    <td class="text-end fs-5 fw-bolder">{{ total.toFixed(2) }}</td>
                  </tr>
                  <tr v-if="change">
                    <td class="fs-5 fw-bolder text-danger">CHANGE</td>
                    <td class="text-end fs-5 fw-bolder text-danger">{{ change }}</td>
                  </tr>
                </table>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="btn-row d-sm-flex align-items-center justify-content-between fixed-bottom bg-light py-3 px-3">
    <a href="javascript:void(0);" class="btn btn-secondary btn-icon flex-fill position-relative p-3 py-4 fs-5"
      @click="openPaymentModal">
      <span class="me-1 d-flex align-items-center">
        <i data-feather="credit-card" class="feather-16 text-light"></i>
      </span>PAYMENT
    </a>
    <a href="javascript:void(0);" class="btn btn-icon flex-fill position-relative p-3 py-4  fs-5" @click="openVoidModal"
      style="background: #F36F24;">
      <span class="me-1 d-flex align-items-center">
        <i data-feather="trash-2" class="feather-16"></i>
      </span>VOID SALES
    </a>

    <a href="javascript:void(0);" class="btn btn-success btn-icon flex-fill position-relative p-3 py-4  fs-5"
      @click="openReturnModal">

      <span class="me-1 d-flex align-items-center">
        <i data-feather="corner-up-right" class="feather-16"></i>
      </span>RETURN ITEMS
    </a>
  </div>


  <!-- Modal for Payment -->
  <div class="modal fade" id="payment-modal" tabindex="-1" aria-labelledby="payment-modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="payment-modalLabel">Payment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="payment" class="text-center">TOTAL AMOUNT: {{ total }}</label>
            <input type="number" id="payment" class="form-control" v-model="clientPayment" min="1"
              @keydown.enter="processPayment" placeholder="Enter payment amount" />
          </div>
          <p v-if="paymentError.message" class="text-danger">{{ paymentError.message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">CANCEL</button>
          <button type="button" class="btn btn-secondary" @click="processPayment">PAY</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="return-modal" tabindex="-1" aria-labelledby="return-modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="return-modalLabel">REFERENCE:</h5>
          <button type="button" class="btn-close" id="return-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input v-model="transactionId" class="form-control" type="text" placeholder="Transaction ID"
            @keydown.enter="fetchTransactionItems" />
          <p v-if="transactionError" class="text-danger">{{ transactionError }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
          <button type="button" class="btn btn-primary" @click="fetchTransactionItems">GET ITEMS</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Return Item Selection -->
<div class="modal fade" id="select-return-items-modal" tabindex="-1" aria-labelledby="select-return-items-modalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="select-return-items-modalLabel">Select Items for Return</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="table-responsive">
          <table class="table" tabindex="0" @keydown="handleKeyNavigation">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Return Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in returnItems" :key="item._id">
                <td class="text-center">
                  <input type="checkbox" v-model="item.selected" />
                </td>
                <td style="width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="{{ item.name }}">
                  {{ item.name }}
                </td>
                <td class="text-center">{{ item.quantity }}</td>
                <td>
                  <input 
                    type="number" 
                    v-model="item.returnQuantity" 
                    :max="item.quantity" 
                    min="1" 
                    :autofocus="index === focusedIndex" 
                    class="form-control" 
                    @input="validateReturnQuantity(item)" 
                  />
                </td>
                <td class="text-end">{{ item.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
        <button type="button" class="btn btn-primary" @click="processReturn">RETURN ITEMS</button>
      </div>
    </div>
  </div>
</div>

  <!-- Void Transaction Modal -->
  <div class="modal fade" id="void-transaction-modal" tabindex="-1" aria-labelledby="voidTransactionModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="voidTransactionModalLabel">Void Transaction</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="processVoid">
            <div class="mb-3">
              <label for="transaction-id" class="form-label">REFERENCE</label>
              <input type="text" id="transaction-id" class="form-control" v-model="transactionId"
                placeholder="Enter Transaction ID" required>
            </div>
            <p v-if="transactionError" class="text-danger">{{ transactionError }}</p>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
          <button type="button" class="btn btn-danger" @click="processVoid">VOID</button>
        </div>
      </div>
    </div>
  </div>


  <div class="modal fade" id="edit-cart-modal" tabindex="-1" aria-labelledby="edit-cart-modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="edit-cart-modalLabel">Edit Cart Items</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table" tabindex="0" @keydown="handleCartKeyNavigation">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart" :key="item._id">
                <td>{{ item.name }}</td>
                <td>
                  <input type="number" v-model="item.quantity" min="1" @input="validateCartQuantity(item)" />
                </td>
                <td>{{ item.price }}</td>
                <td>{{ item.price * item.quantity }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="removeCartItem(index)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { modalController } from '@/utils/modalController';
import axios from 'axios';
import 'sweetalert2'

export default {
  setup() {
    const router = useRouter();
    const apiURL = process.env.VUE_APP_URL;
    const imgURL = process.env.VUE_APP_IMAGE_URL;
    const selectedCategory = ref('all');
    const barcode = ref('');
    const barcodeInput = ref(null);
    const cart = ref([]);
    const categories = ref([]);
    const subtotal = ref(0);
    const VAT = ref(12); // Example tax rate
    const discount = ref(0);
    const barcodeError = ref({ message: null });
    const paymentError = ref({ message: null });
    const lastAddedProduct = ref(null);
    const stockQuantity = ref(null); // Store the stock quantity of the last fetched product
    const newQuantity = ref(1); // New quantity input for the modal
    const quantityError = ref(null);
    const change = ref(null);
    const clientPayment = ref(null);
    const products = ref([]);
    const transactionId = ref('');
    const transactionError = ref(null);
    const returnItems = ref([]);
    const focusedIndex = ref(0);
    const focusedCartIndex = ref(0);
    const isNewTransaction = ref(true);
    const isTransactionOpen = ref(false);
    const searchQuery = ref('');
 
    const filteredProducts = computed(() => {
      if (searchQuery.value.trim() === '') {
        return products.value;
      }
      return products.value.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });


    const total = computed(() =>
      subtotal.value + (subtotal.value * VAT.value) / 100 - discount.value
    );



    // Methods
    const getCategories = async () => {
      try {
        if (await checkState()) return;
        const response = await axios.get(`${apiURL}/get_category_list`);
        categories.value = [{ name: 'All' }, ...response.data.categories]; // Add "All" category
      } catch (error) {
        console.error(error);
      }
    };

    const getProductsByCategory = async (categoryName) => {
      try {
        if (await checkState()) return;
        const response = await axios.get(`${apiURL}/get_products_by_category/${categoryName}`);
        products.value = response.data.products;
      } catch (error) {
        console.error(error);
      }
    };

    const selectCategory = async (categoryName) => {
      selectedCategory.value = categoryName; // Update selected category

      if (categoryName === 'All') {
        await getAllProducts(); // Fetch all products if "All" is selected
      } else {
        await getProductsByCategory(categoryName); // Fetch products by category
      }
    };

    const getAllProducts = async () => {
      try {
        if (await checkState()) return;
        const response = await axios.get(`${apiURL}/products_list`);
        products.value = response.data.products;
      } catch (error) {
        console.error(error);
      }
    };
    const filteredCategories = computed(() => {
      // Filter products based on the selected category
      if (selectedCategory.value === 'all') {
        return categories.value;
      }
      return categories.value.filter(category => category.name === selectedCategory.value);
    });


    const addProduct = async (product = null) => {
      try {
        if (await checkState()) return;

        if (isNewTransaction.value) {
          cart.value = []; // Clear the cart
          subtotal.value = 0;
          discount.value = 0;
          change.value = null;
          isNewTransaction.value = false; // Set to false after starting a new transaction
        }
        if (!product) {
          if (!barcode.value.trim()) {
            return;
          }

          if (barcode.value.trim().startsWith("@")) {
            const sku = barcode.value.trim().substring(1);
            const lookup = await axios.get(`${apiURL}/get_product_info/${sku}`);
            if (lookup.data.success) {
              product = lookup.data.product
              Swal.fire({
                title: product.name,
                html: `
            <div style="display: flex; justify-content: space-between;">
              <p style="flex: 1; text-align: left;"><strong>SKU:</strong></p>
              <p style="flex: 1; text-align: right;">${product.sku}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="flex: 1; text-align: left;"><strong>Price:</strong></p>
              <p style="flex: 1; text-align: right;">$${product.price}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="flex: 1; text-align: left;"><strong>Available Stock:</strong></p>
              <p style="flex: 1; text-align: right;">${product.quantity}</p>
            </div>
            `,
                icon: 'info',
              });

              barcodeError.value.message = null;
              return;
            } else {
              barcodeError.value.message = lookup.data.message || "Product not found.";
              return;
            }

          }

          const response = await axios.get(`${apiURL}/get_product_info/${barcode.value.trim()}`);
          if (response.data.success) {
            product = response.data.product; // Assign the fetched product

            barcodeError.value.message = null;
          } else {
            barcodeError.value.message = response.data.message || "Product not found.";
            return;
          }
        }

        // Store the last added product and its stock quantity
        lastAddedProduct.value = product;
        stockQuantity.value = product.quantity;

        // Check if the product is already in the cart
        const existingItem = cart.value.find((item) => item._id === product._id);

        if (existingItem) {
          // Increment quantity if product is already in the cart
          const newTotalQuantity = existingItem.quantity + 1;
          if (newTotalQuantity <= stockQuantity.value) {
            existingItem.quantity = newTotalQuantity;
          } else {
            barcodeError.value.message = `Maximum stock reached for ${product.name}.`;
          }
        } else {
          // Add product to cart if not already present
          if (stockQuantity.value > 0) {
            cart.value.push({ ...product, quantity: 1 });
          } else {
            barcodeError.value.message = `No stock available for ${product.name}.`;
          }
        }

        updateSubtotal(); // Update the subtotal after adding the product
      } catch (error) {
        console.error("Error adding product:", error);
        barcodeError.value.message = "An error occurred while fetching the product.";
      } finally {
        barcode.value = ""; // Clear the barcode input
      }
    };


    const updateSubtotal = () => {
      subtotal.value = cart.value.reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const handleKeydown = (event) => {
      switch (event.key) {
        case 'F1':
          event.preventDefault();
          openPaymentModal();
          break;
        case 'F2':
          event.preventDefault();
          openVoidModal(); // open return modal
          break;
        case 'F3':
          event.preventDefault();
          openReturnModal(); // open return modal
          break;
        case 'q':
          event.preventDefault();
          openUpdateQuantityModal(); // Open quantity modal
          break;
        case 'Escape':
          // Refocus on the barcode input
          if (barcodeInput.value) {
            barcodeInput.value.focus();
            transactionId.value = ''; // Clear transaction ID
            returnItems.value = []; // Clear previously selected items
            transactionError.value = null; // Clear any previous errors
          }
          break;
        case 'l': // Check for Ctrl + L
          if (event.ctrlKey) {
            event.preventDefault();
            router.push('/lockscreen'); // Redirect to lock screen
          }
          break;
        default:
          break;
      }
    };
    const resetTransactions = () => {
      transactionId.value = '';
      returnItems.value = [];
      transactionError.value = null;
    }

    const openPaymentModal = async () => {
      if (await checkState()) return;
      if (total.value > 0) {
        resetTransactions();
        modalController.show('payment-modal');
        modalController.focus('payment-modal');
      }

    };

    const openReturnModal = async () => {
      if (await checkState()) return;
      resetTransactions();
      modalController.show('return-modal');
      modalController.focus('return-modal');
      addNavigationListener();
    };
    const addNavigationListener = () => {
      window.addEventListener("keydown", handleKeyNavigation);
    };

    const removeNavigationListener = () => {
      window.removeEventListener("keydown", handleKeyNavigation);
    };

    const openVoidModal = async () => {
      if (await checkState()) return;
      resetTransactions();
      modalController.show('void-transaction-modal');
      modalController.focus('void-transaction-modal');
    };



    const handleModalKeydown = async (event) => {
      if (await checkState()) return;
      // Check for Enter key
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        updateProductQuantity(); // Trigger the update function
      }

      // Check for Escape key
      if (event.key === 'Escape') {
        event.preventDefault(); // Prevent default behavior
        modalController.hide('update-quantity-modal')
      }

    };

    const openUpdateQuantityModal = () => {
      if (lastAddedProduct.value) {
        // Open modal to update quantity
        modalController.show('update-quantity-modal');
        modalController.focus('update-quantity-modal');
      } else {
        barcodeError.value.message = "No product in cart yet.";
      }
    };
    const processPayment = async () => {
      // Validate payment
      if (clientPayment.value === null || clientPayment.value < total.value) {
        paymentError.value.message = `Payment must be at least ${total.value}.`;
        return;
      }

      try {
        // Prepare transaction data
        const transactionData = {
          cart: cart.value.map((item) => ({
            _id: item._id, // Product ID
            name: item.name,
            price: item.price,
            total: item.total,
            quantity: item.quantity,
          })),
          paymentMethod: "Cash", // You can dynamically set this
          discounts: discount.value,
          netAmount: subtotal.value,
          VAT: (subtotal.value * VAT.value) / 100,
          totalAmount: total.value,
          cash: clientPayment.value,
          change: change.value,
          status: "Completed", // Transaction status
          employee: localStorage.getItem("user"), // Example employee, replace with actual
        };

        // Send transaction data to the backend
        const response = await axios.post(`${apiURL}/commit_transaction`, transactionData);

        if (response.data.success) {
          // Backend transaction was successful
          console.log("Transaction saved:", response.data.transaction);

          // Calculate change
          change.value = (clientPayment.value - total.value).toFixed(2);


          clientPayment.value = null;
          paymentError.value.message = null;

          // Notify the user of successful payment (optional)
          Swal.fire({
            title: 'Success!',
            text: 'Transaction successful.',
            icon: 'success',
            timer: 1500, // 
            showConfirmButton: false // Optional: Hide the confirm button
          });

          // Close the payment modal
          modalController.hide('payment-modal')
          isNewTransaction.value = true;

        } else {
          // Backend returned an error
          paymentError.value.message = response.data.message || "Failed to process transaction.";
          console.error("Transaction failed:", response.data.message);
        }
      } catch (error) {
        // Handle network or server errors
        console.error("Error processing payment:", error);
        paymentError.value.message = "An error occurred while processing the payment. Please try again.";
      }
    };


    const processVoid = async () => {
      try {
        if (await checkState()) return;
        const response = await axios.post(`${apiURL}/void_transaction`, {
          transactionId: transactionId.value,
          employee: 'JohnDoe' // Replace with actual employee information
        });

        if (response.data.success) {
          // Display success message
          Swal.fire({
            title: 'Voided!',
            text: 'Transaction has been successfully voided.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

          // Clear transaction ID and close the modal
          resetTransactions();
          modalController.hide('void-transaction-modal');
        } else {
          // Handle server error messages
          Swal.fire({
            title: 'Error',
            text: response.data.message || 'Failed to void the transaction.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false

          });
        }
      } catch (error) {
        // Handle unexpected errors
        Swal.fire({
          title: 'Error',
          text: `An error occurred: ${error.message}`,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false

        });
      }
    };


    const updateProductQuantity = async () => {
      if (await checkState()) return;
      if (lastAddedProduct.value) {
        if (newQuantity.value > stockQuantity.value) {
          quantityError.value = `Stock quantity is only ${stockQuantity.value}. Please enter a valid quantity.`;
          return;
        }

        // Update quantity in cart
        const cartItem = cart.value.find((item) => item._id === lastAddedProduct.value._id);
        if (cartItem) {
          cartItem.quantity = newQuantity.value;
        }

        updateSubtotal();

        modalController.hide('update-quantity-modal');
        newQuantity.value = 1;
        quantityError.value = null;

        // Focus back on the barcode input
        if (barcodeInput.value) {
          barcodeInput.value.focus();
        }
      }
    };
    const fetchTransactionItems = async () => {
      try {
        modalController.hide('return-modal');
        removeNavigationListener();

        // Fetch transaction items from the API
        const response = await axios.get(`${apiURL}/get_transaction_items/${transactionId.value}`);
        const { success, cart, totalAmount } = response.data;

        if (success && cart && Array.isArray(cart)) {
          // Process the cart items
          console.log('Transaction cart items:', cart);

          // Populate the returnItems array with the fetched items
          returnItems.value = cart.map(item => ({
            _id: item._id,
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selected: false, // Add a 'selected' property to track if the item is selected for return
            returnQuantity: 0, // Initialize return quantity to 0
          }));

          modalController.show('select-return-items-modal')
        } else {
          console.error('Cart is empty or response structure is incorrect');
        }
      } catch (error) {
        console.error('Error fetching transaction items:', error);
      }
    };

    const processReturn = async () => {
      try {
        if (await checkState()) return;
        const itemsToReturn = returnItems.value.filter(item => item.selected && item.returnQuantity > 0);

        if (itemsToReturn.length === 0) {
          transactionError.value = 'Please select at least one item to return.';
          return;
        }

        // Await the axios call to get the response properly
        const response = await axios.post(`${apiURL}/return_transaction/${transactionId.value}`, {
          returnedItems: itemsToReturn,
          employee: localStorage.getItem("user")
        });

        console.log(response.data); // This will now log the actual response data

        if (response.data.success) {
          // Update stock and cart
          itemsToReturn.forEach(item => {
            const cartItem = cart.value.find(cartItem => cartItem._id === item._id);
            if (cartItem) {
              cartItem.quantity -= item.returnQuantity;
              if (cartItem.quantity <= 0) {
                const index = cart.value.indexOf(cartItem);
                cart.value.splice(index, 1); // Remove the item if quantity becomes 0
              }
            }
          });

          // Notify the user of successful payment (optional)
          Swal.fire({
            title: 'Returned!',
            text: 'Transaction successful.',
            icon: 'success',
            timer: 1500, // 
            showConfirmButton: false // Optional: Hide the confirm button
          });

          modalController.hide('select-return-items-modal')
          // Clear transaction ID input

        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message || 'Failed to process the return.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false

          });
        }
      } catch (error) {
        console.error('Error processing return:', error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while processing the return. Please try again.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false

        });
      }
    };

    const validateReturnQuantity = (item) => {
      if (item.returnQuantity > item.quantity) {
        item.returnQuantity = item.quantity; // Reset to maximum allowed
      }
    }




    const handleKeyNavigation = (event) => {
      const items = returnItems.value; // Access the return items
      if (!items || items.length === 0) return; // Exit if no items are present

      if (event.key === "ArrowDown" && focusedIndex.value < items.length - 1) {
        event.preventDefault(); // Prevent scrolling
        focusedIndex.value = (focusedIndex.value + 1) % items.length; // Move focus down
      } else if (event.key === 'ArrowUp' && focusedIndex.value > 0) {
        event.preventDefault(); // Prevent scrolling
        focusedIndex.value = (focusedIndex.value - 1 + items.length) % items.length; // Move focus up
      } else if (event.key === " ") {
        event.preventDefault(); // Prevent scrolling
        const currentItem = items[focusedIndex.value];
        if (currentItem && currentItem.returnQuantity > 0) {
          // Only allow selection if returnQuantity > 0
          currentItem.selected = !currentItem.selected;
        }
      } else if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior
        // Process return only if at least one item is selected
        if (items.some((item) => item.selected)) {
          processReturn();
        } else {
          transactionError.value = "Please select at least one item to return.";
        }
      }

      // Trigger autofocus on the input when moving focus
      const focusedInput = document.querySelector(`#select-return-items-modal .focused input[type="number"]`);
      if (focusedInput) {
        focusedInput.focus();
      }
    };
    const validateCartQuantity = (item) => {
      if (item.quantity < 0) {
        item.quantity = 0; // Allow 0 but prevent negative quantities
      }
    };



    // Handle key navigation and actions in the cart modal
    const handleCartKeyNavigation = (event) => {
      const items = cart.value; // Access the cart items
      if (!items || items.length === 0) return; // Exit if no items are present

      switch (event.key) {
        case "ArrowDown":
          if (focusedCartIndex.value < items.length - 1) {
            event.preventDefault(); // Prevent scrolling
            focusedCartIndex.value++;
          }
          break;

        case "ArrowUp":
          if (focusedCartIndex.value > 0) {
            event.preventDefault(); // Prevent scrolling
            focusedCartIndex.value--;
          }
          break;

        case "Delete":
          event.preventDefault(); // Prevent default behavior
          removeCartItem(focusedCartIndex.value); // Delete the focused item
          break;

        case "Enter":
          event.preventDefault(); // Prevent default behavior
          // Optionally trigger saving the changes if Enter is pressed
          saveCartChanges();
          break;

        default:
          break;
      }

      // Trigger autofocus on the input of the focused item
      const focusedInput = document.querySelector(
        `#edit-cart-modal .focused input[type="number"]`
      );
      if (focusedInput) {
        focusedInput.focus();
      }
    };

    // Remove an item from the cart
    const removeCartItem = (index) => {
      cart.value.splice(index, 1); // Remove the item at the specified index
      if (focusedCartIndex.value >= cart.value.length) {
        focusedCartIndex.value = cart.value.length - 1; // Adjust focus index
      }
      updateSubtotal(); // Update the subtotal after removing an item
    };

    // Save changes to the cart
    const saveCartChanges = () => {
      cart.value = cart.value.filter((item) => item.quantity > 0);

      updateSubtotal(); // Update subtotal
      modalController.hide("edit-cart-modal"); // Close modal
    };

    // Open the edit cart modal
    const openEditCartModal = async () => {
      if (await checkState()) return;
      if (cart.value.length > 0) {
        focusedCartIndex.value = 0; // Reset focus to the first item
        modalController.show("edit-cart-modal");
        modalController.focus("edit-cart-modal");
      } else {
        Swal.fire({
          title: "Cart is empty",
          text: "Add items to the cart first.",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });
        barcodeInput.value.focus();
      }

    };

    // Function to handle canceling the transaction and clearing the cart
    const cancelTransaction = () => {
      // Show SweetAlert for confirmation
      Swal.fire({
        title: "Cancel Transaction",
        text: "Are you sure you want to cancel the transaction and empty the cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the cart if confirmed
          if (cart.value.length > 0) {
            cart.value = [];
            updateSubtotal(); // Update subtotal after emptying cart
            Swal.fire({
              title: "Transaction Canceled",
              text: "Your cart has been emptied.",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              title: "Your Cart is empty",
              text: "Make new transaction",
              icon: "info",
              timer: 1500,
              showConfirmButton: false,
            });
          }
          barcodeInput.value.focus();

        }
      });
    };

    const checkState = async () => {
      try {
        const response = await axios.get(`${apiURL}/transaction_state`);
        if (response.data.success) {
          isTransactionOpen.value = response.data.isOpen;

          if (isTransactionOpen.value === false) {
            Swal.fire({
              title: 'Error',
              text: 'Transaction is already closed, no further actions can be processed.',
              icon: 'error',
              timer: 5000,
              showConfirmButton: false
            });
            return true; // Return true if transaction is closed
          }

          return false; // Return false if the transaction is open
        } else {
          console.error("Failed to fetch transaction state.");
          return false; // Ensure a return value in case of failure
        }
      } catch (error) {
        console.error("Error fetching transaction state:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to get transaction state",
          icon: "error",
          confirmButtonText: "OK",
        });
        return false; // Ensure a return value in case of error
      }
    };

    const logout = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userId = localStorage.getItem('id');
            const response = await axios.patch(`${apiURL}/logout/${userId}`)
            if (response.data.success) {
              // Clear local storage
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              localStorage.removeItem('user');
              localStorage.removeItem('emails');
              localStorage.removeItem("image");

              // Redirect to home
              router.push('/');

              Swal.fire(
                'Logged Out',
                'You have been successfully logged out.',
                'success'
              );
            } else {
              Swal.fire(
                'Logged Out',
                'An error occurred during logout',
                'error'
              );
              router.push('/');
            }

          } catch (error) {
            Swal.fire('Error', 'An error occurred during logout', 'error');
            console.log(error);
          }

        }
      });
    };

    // Assuming `processReturn` and `transactionError` are defined somewhere in your code.

    // Lifecycle Hooks
    onMounted(() => {
      getCategories();
      getAllProducts();
      selectedCategory.value = 'All';
      if (barcodeInput.value) {
        barcodeInput.value.focus();
      }

      window.addEventListener('keydown', handleKeydown); // Listen to keydown events
      window.addEventListener("keydown", handleCartKeyNavigation);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener("keydown", handleCartKeyNavigation);
    });

    // Return Variables and Methods
    return {
      categories,
      selectedCategory,
      barcode,
      barcodeInput,
      cart,
      subtotal,
      VAT,
      discount,
      total,
      barcodeError,
      lastAddedProduct,
      stockQuantity,
      newQuantity,
      quantityError,
      addProduct,
      updateProductQuantity,
      handleModalKeydown,
      focusedIndex,
      handleKeyNavigation,
      validateReturnQuantity,
      focusedCartIndex,
      handleCartKeyNavigation,
      openEditCartModal,
      validateCartQuantity,
      removeCartItem,
      cancelTransaction,
      change,
      clientPayment,
      paymentError,
      selectCategory,
      products,
      imgURL,
      transactionId,
      transactionError,
      returnItems,
      fetchTransactionItems,
      processReturn,
      processVoid,
      openPaymentModal,
      openVoidModal,
      openReturnModal,
      processPayment,
      logout,
      getAllProducts,
      filteredProducts,
      searchQuery
    };
  },
};
</script>



<style scoped>
.focused {
  background-color: #f0f8ff;
  /* Light blue */
  outline: 2px solid #007bff;
  /* Optional for extra visibility */
}

.tabs_container {
  min-height: 80vh;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.tab_content {
  display: flex;
  flex-wrap: wrap;
  /* Allow products to wrap to new rows */
  gap: 1rem;
  /* Space between items */
  justify-content: flex-start;
  height: 100%;
  /* Fill the container */
}

.product-item {
  width: 200px;
  height: 200px;
  /* Fixed height for each product */
  margin-bottom: 1rem;
  /* Space between rows */
  box-sizing: border-box;
}

.product-info {
  position: relative;
  padding: 15px;
  padding-inline: 0;
  background: #f9f9f9;
  border-radius: 3px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.product-info img {
  width: 100%;
  /* Ensures the image covers the full width */
  height: 150px;
  /* Fixed height for images */
  object-fit: fit;
  /* Ensure the image covers the area on the X-axis */
  margin-bottom: 30px;
  margin-inline: 0;
}

.product-info:hover {
  transform: scale(1.05);
  /* Slight zoom effect on hover */
}

/* Category List Styling */
.category-list {
  padding: 15px;
  background-color: #f9f9f9;
}

.category-list ul {
  list-style-type: none;
  padding-left: 0;
}

.category-list li {
  margin-bottom: 10px;
}

.category-list a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.category-list a:active {
  color: #fff;
}

.category-list a:hover {
  color: #fff;
}

.list-group-item.active {
  background-color: #fff;
  /* Green background for active list item */
  border-color: #22A95E;
  /* Optional: Match border with the active color */
}

.list-group-item a {
  color: #fff;
  /* Make the text white inside the active list item */
}

.list-group-item.active a {
  color: #000;
  /* Make the text white inside the active list item */
}

.list-group-item {
  background-color: #22A95E;
  border-radius: 10px;
  padding: 25px 0;
  font-weight: 900;
}

/* Keyboard Key Styling for the UI */
.keyboard-key {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.1);
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.btn-info,
#del-btn {
  position: relative;
  /* Make the button a reference for the absolute key */
  padding-top: 20px;
  /* Add some padding to avoid content overlap */
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
}

.btn-row {
  position: fixed;
  bottom: 0;
  /* Ensure it's at the bottom of the viewport */
  left: 50%;
  transform: translateX(-50%);
  /* Center the menu horizontally */
  z-index: 9999;
  /* Make sure it is on top of all other content */
  width: 100%;
  padding: 0;
  /* Adjust as needed */
}

.order-summary h6 {
  margin-top: 0;
  /* Remove extra top margin */
  margin-bottom: 8px;
  /* Add a small space below the heading */
}

.order-summary .table {
  margin-top: 0;
  /* Remove extra top margin */
  margin-bottom: 0;
  /* Remove extra bottom margin */
}

.order-summary .table tr {
  margin-top: 0;
  /* Remove any top margin for rows */
  margin-bottom: 0;
  /* Remove any bottom margin for rows */
}

.order-summary .table td {
  padding-top: 15px;
  /* Adjust top padding for cells */
}

/* Product order list container adjustments */
.product-order-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* Allow the product order list to take remaining space */
  overflow: hidden;
}

/* Ensure the product added section expands */
.product-order-list .product-added {
  flex-grow: 1;
  /* Expand to fill available space */
  overflow-y: auto;
  /* Allow vertical scrolling */
  margin-bottom: 20px;
  padding-right: 15px;
  /* Optional: Add some space from the right edge */
}

/* Product wrap table adjustments */
.product-wrap table {
  width: 100%;
  table-layout: auto;
  overflow-x: auto;
  /* Enable horizontal scroll if necessary */
}

/* Table and row adjustments */
.product-order-list .product-wrap th,
.product-order-list .product-wrap td {
  padding: 8px;
  /* Spacing inside cells */
  text-align: left;
  /* Align text to the left */
  font-size: 1rem;
  /* Default font size */
}

/* Smaller font size for longer content */
.product-order-list .product-wrap tbody td {
  font-size: calc(1rem - 0.2vw);
  /* Shrink font size based on screen size */
  word-wrap: break-word;
  overflow-wrap: anywhere;
  /* Ensure text breaks correctly */
}

/* Responsive design adjustments */
@media (max-height: 768px) {
  .product-order-list .product-wrap tbody td {
    font-size: 0.85rem;
    /* Shrink font size further for smaller screens */
  }

  /* Adjust button sizes on small screens */
  .btn-row .btn {
    font-size: 0.9rem;
    /* Smaller font size for buttons */
    padding: 10px 18px;
    /* Adjust button padding */
  }
}

/* Sidebar container adjusted to fit full screen height */
.order-sidebar {
  height: 100vh;
  /* Take up full screen height */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* Enable scrolling if content exceeds the height */
  justify-content: space-between;
  /* Push content to top and bottom */
}



.order-sidebar {
  background-color: #f8f9fa;
  /* Light background for the sidebar */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-sidebar .py-3 {
  font-size: 1.2rem;
}

.order-sidebar .product-added {
  margin-top: 20px;
  margin-bottom: 20px;
}

.order-sidebar .table {
  border-collapse: separate;
  border-spacing: 0 8px;
  /* Adds space between rows */
}

.order-sidebar .table-striped tbody tr:nth-of-type(odd) {
  background-color: #CDEBDB;
  /* Light gray for odd rows */
}

.order-sidebar .table-hover tbody tr:hover {
  background-color: #e9ecef;
  /* Slight hover effect */
}

.order-sidebar .table th,
.order-sidebar .table td {
  padding: 12px 15px;
  /* Better spacing for table cells */
}

.order-sidebar .order-summary h6 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.order-sidebar .order-summary table {
  margin-top: 10px;
}

.order-sidebar .order-summary td {
  padding: 10px 15px;
  border-top: 1px solid #dee2e6;
  /* Add separation between rows */
}

.order-sidebar .order-summary .fs-5 {
  font-size: 1.2rem;
}

.order-sidebar .order-summary .fw-bolder {
  font-weight: bolder;
}

.order-sidebar .order-summary .text-end {
  text-align: right;
}

.order-sidebar .btn-info,
.order-sidebar .btn-danger {
  font-size: 1rem;
  padding: 10px 15px;
}

/* Adjust button padding and font size */
.order-sidebar .btn {
  border-radius: 25px;
  /* Rounded buttons */
}
.truncate {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
