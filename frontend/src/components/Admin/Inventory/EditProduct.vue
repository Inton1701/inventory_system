<template>
  <Navbar />
  <div class="page-wrapper">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>New Product</h4>
            <h6>Create new product</h6>
          </div>
        </div>
      </div>
      <form @submit.prevent="editProduct">
        <div class="card">
          <div class="card-body add-product pb-0">
            <div class="accordion-card-one accordion" id="accordionExample">
              <div class="accordion-item">
                <div class="accordion-header" id="headingOne">
                  <div
                    class="accordion-button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-controls="collapseOne"
                  >
                    <div class="addproduct-icon">
                      <h5>
                        <i data-feather="info" class="add-info"></i
                        ><span>Product Information</span>
                      </h5>
                      <a href="javascript:void(0);"
                        ><i
                          data-feather="chevron-down"
                          class="chevron-down-add"
                        ></i
                      ></a>
                    </div>
                  </div>
                </div>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div class="row">
                      <div class="col-lg-5 col-sm-6 col-12">
                        <div class="mb-3 add-product">
                          <label class="form-label">Product Name</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Product name here."
                            :maxlength="35"
                            v-model="inputedProduct.name"
                            @input="
                              productName = filterTextInput($event.target.value)
                            "
                            required
                          />
                          <p class="mt-1">Maximum of 35 Characters</p>
                        </div>
                      </div>
                    </div>
                    <div class="addservice-info">
                      <div class="row">
                        <div class="col-lg-4 col-sm-6 col-12">
                          <div class="mb-3 add-product">
                            <div class="add-newplus">
                              <label class="form-label">Category</label>
                            </div>
                            <select
                              class="form-control"
                              v-model="inputedProduct.category"
                            >
                              <option value="None">None</option>
                              <option
                                v-for="category in categories"
                                :key="category._id"
                                :value="category.name"
                              >
                                {{ category.name }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div
                        class="input-blocks summer-description-box transfer mb-3"
                      >
                        <label>Description</label>
                        <textarea
                          class="form-control h-100"
                          rows="5"
                          placeholder="Please type here the description"
                          :maxlength="150"
                          v-model="inputedProduct.description"
                          @input="
                            productDescription = filterTextInput(
                              $event.target.value
                            )
                          "
                        ></textarea>
                        <p class="mt-1">Maximum of 150 Characters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Pricing Section -->
            <div class="accordion-card-one accordion" id="accordionExample2">
              <div class="accordion-item">
                <div class="accordion-header" id="headingTwo">
                  <div
                    class="accordion-button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-controls="collapseTwo"
                  >
                    <div class="text-editor add-list">
                      <div class="addproduct-icon list icon">
                        <h5>
                          <i data-feather="life-buoy" class="add-info"></i
                          ><span>Product Pricing</span>
                        </h5>
                        <a href="javascript:void(0);"
                          ><i
                            data-feather="chevron-down"
                            class="chevron-down-add"
                          ></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="collapseTwo"
                  class="accordion-collapse collapse show"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample2"
                >
                  <div class="accordion-body">
                    <div class="row">
                      <div class="col-lg-4 col-sm-6 col-12">
                        <div class="mb-3 add-product">
                          <label class="form-label">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            class="form-control"
                            v-model="inputedProduct.price"
                            required
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div class="col-lg-4 col-sm-6 col-12">
                        <div class="mb-3 add-product">
                          <label class="form-label">Cost</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            class="form-control"
                            v-model="inputedProduct.cost"
                            required
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="collapseThree"
            class="accordion-collapse collapse show"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample3"
          >
            <div class="accordion-body">
              <div class="text-editor add-list add">
                <div class="col-lg-12">
                  <div class="add-choosen">
                    <div class="input-blocks">
                      <div class="image-upload">
                        <input type="file" @change="onFileChange" />
                        <div
                          class="image-uploads"
                          v-if="
                            !inputedProduct.image.url && !inputedProduct.url
                          "
                        >
                          <i data-feather="plus-circle"></i>
                          <h4>Edit Images</h4>
                        </div>
                      </div>
                    </div>
                    <div
                      class="phone-img"
                      v-if="inputedProduct.image.url || inputedProduct.url"
                    >
                      <img
                        :src="
                          inputedProduct.image.url
                            ? inputedProduct.image.url
                            : inputedProduct.url
                        "
                        alt="Product Image"
                      />
                      <a href="javascript:void(0);" @click="removeImage">
                        <i
                          data-feather="x"
                          class="x-square-add remove-product"
                        ></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Save Buttons -->
        </div>
        <div class="col-lg-12">
          <div class="btn-addproduct mb-4">
            <button type="button" class="btn btn-cancel me-2">Cancel</button>
            <button type="submit" class="btn btn-submit">Save Product</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import feather from "feather-icons";
import Swal from "sweetalert2";
import Navbar from "/src/components/Admin/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  setup() {
    const apiURL = process.env.VUE_APP_URL;
    const imageURL = process.env.VUE_APP_IMAGE_URL;
    const inputedProduct = ref({
      name: "",
      description: "",
      price: 0,
      cost: 0,
      category: "",
      image: { file: null, url: null }, // Image info
      url: "",
    });
    const route = useRoute();
    const categories = ref(null);
    const product = ref({});

    // Fetch category list
    const getSelection = async () => {
      try {
        const categoryResponse = await axios.get(`${apiURL}/get_category_list`);
        if (categoryResponse.data.success) {
          categories.value = categoryResponse.data.categories;
        } else {
          Swal.fire("Error", categoryResponse.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch category data", "error");
      }
    };

    // Fetch product details and assign image URLs
    const getProductDetails = async () => {
      const productId = route.params.id;
      try {
        const response = await axios.get(`${apiURL}/get_product/${productId}`);
        product.value = response.data.product;
        inputedProduct.value = {
          ...response.data.product,
          // Check if product has image, else set a default placeholder
          image: {
            file: null,
            url: response.data.product.image
              ? `${imageURL}${response.data.product.image}`
              : "/path/to/default-image.jpg", // Default placeholder image
          },
          url: response.data.product.image
            ? `${imageURL}${response.data.product.image}`
            : "/path/to/default-image.jpg", // Default placeholder image
        };
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const editProduct = async () => {
      try {
        const formData = new FormData();

        // Add non-image fields to FormData
        Object.entries(inputedProduct.value).forEach(([key, value]) => {
          if (key !== "image" && key !== "url") {
            formData.append(key, value || "");
          }
        });

        // Handle image: only send it if a new file is selected
        if (inputedProduct.value.image.file) {
          formData.append("image", inputedProduct.value.image.file);
        }

        const productId = route.params.id;
        const response = await axios.patch(
          `${apiURL}/edit_products/${productId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.success) {
          Swal.fire("Success", "Product updated successfully!", "success");
          await getProductDetails(); // Refresh product details
        } else {
          Swal.fire("Error", response.data.message || "Update failed", "error");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire("Error", "Failed to update product", "error");
      }
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        inputedProduct.value.image.file = file; // Attach the file
        inputedProduct.value.image.url = URL.createObjectURL(file); // Preview the file
        inputedProduct.value.url = null; // Clear the current URL
      }
    };

    const removeImage = () => {
      if (inputedProduct.value.image.url) {
        URL.revokeObjectURL(inputedProduct.value.image.url);
      }
      inputedProduct.value.image = { file: null, url: null };
      inputedProduct.value.url = null; // Remove URL reference
    };

    onMounted(async () => {
      try {
        await getSelection();
        await getProductDetails();
        feather.replace();
      } catch (error) {
        console.error("Error during onMounted:", error);
      }
    });

    onBeforeUnmount(() => {
      if (inputedProduct.value.image.url) {
        URL.revokeObjectURL(inputedProduct.value.image.url); // Clean up
      }
    });

    return {
      inputedProduct,
      categories,
      editProduct,
      onFileChange,
      removeImage,
    };
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: red;
}

.text-danger {
  color: red;
}
</style>
