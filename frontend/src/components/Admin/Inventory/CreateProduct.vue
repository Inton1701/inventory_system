<template>
  <Navbar />
  <div class="page-wrapper">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h6>Create product +</h6>
          </div>
        </div>
      </div>
      <form @submit.prevent="addProduct">
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
                        <font-awesome-icon
                          :icon="['fas', 'wheat-awn']"
                          style="padding-right: 2vw; color: green"
                        />
                        <span>Product Information</span>
                      </h5>
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
                            required
                          />
                          <p class="mt-1">Maximum of 35 Characters</p>
                        </div>
                      </div>
                      <div class="col-lg-5 col-sm-6 col-12">
                        <div class="mb-3 add-product">
                          <label class="form-label">Category</label>
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
                          <i data-feather="life-buoy" class="add-info"></i>
                          <span>Product Pricing</span>
                        </h5>
                        <a href="javascript:void(0);">
                          <i
                            data-feather="chevron-down"
                            class="chevron-down-add"
                          ></i>
                        </a>
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

            <!-- Image Section -->
            <div class="accordion-card-one accordion" id="accordionExample3">
              <div class="accordion-item">
                <div class="accordion-header" id="headingThree">
                  <div
                    class="accordion-button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-controls="collapseThree"
                  >
                    <div class="text-editor add-list">
                      <div class="addproduct-icon list icon">
                        <h5>
                          <i data-feather="image" class="add-info"></i>
                          <span>Product Image</span>
                        </h5>
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
                    <div class="image-upload">
                      <input type="file" @change="onFileChange" />
                      <div
                        v-if="!inputedProduct.image.url"
                        class="image-uploads"
                      >
                        <i data-feather="plus-circle"></i>
                        <h4>Add Images</h4>
                      </div>
                    </div>
                    <div v-if="inputedProduct.image.url" class="phone-img">
                      <img
                        :src="inputedProduct.image.url"
                        alt="Uploaded image"
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
          <div class="col-lg-12">
            <div class="btn-addproduct mb-4">
              <button type="button" class="btn btn-cancel me-2">Cancel</button>
              <button type="submit" class="btn btn-submit">Save Product</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import Navbar from "/src/components/Admin/Navbar.vue";
import Swal from "sweetalert2";

export default {
  components: {
    Navbar,
  },
  setup() {
    const apiURL = process.env.VUE_APP_URL;
    const inputedProduct = ref({
      name: "",
      description: "",
      price: "",
      cost: "",
      category: "",
      image: { url: "", file: null },
    });
    const categories = ref([]);

    const getSelection = async () => {
      try {
        const response = await axios.get(`${apiURL}/get_category_list`);
        if (response.data.success) {
          categories.value = response.data.categories;
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch categories", "error");
      }
    };

    onMounted(async () => {
      try {
        await getSelection();
      } catch (error) {
        console.error(error);
      }
    });

    const addProduct = async () => {
      if (
        !inputedProduct.value.name ||
        !inputedProduct.value.price ||
        !inputedProduct.value.cost ||
        !inputedProduct.value.category
      ) {
        Swal.fire("Error", "Please fill out all required fields.", "error");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", inputedProduct.value.name);
        formData.append("description", inputedProduct.value.description);
        formData.append("price", inputedProduct.value.price);
        formData.append("cost", inputedProduct.value.cost);
        formData.append("category", inputedProduct.value.category);

        if (inputedProduct.value.image.file) {
          formData.append("image", inputedProduct.value.image.file);
        }

        const response = await axios.post(`${apiURL}/add_products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          Swal.fire("Success", "Product added successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to add product", "error");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        Swal.fire(
          "Error",
          "An error occurred while adding the product",
          "error"
        );
      }
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        inputedProduct.value.image = { file, url: URL.createObjectURL(file) };
      }
    };

    const removeImage = () => {
      inputedProduct.value.image = { url: "", file: null };
    };

    return {
      inputedProduct,
      addProduct,
      onFileChange,
      removeImage,
      categories,
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
