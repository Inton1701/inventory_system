<template>
  <Navbar />
  <div class="page-wrapper">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on the portal</h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="container py-4">
            <div class="card shadow">
              <div class="card-body">
                <div>
                  <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" v-for="tab in tabs" :key="tab.value">
                      <button
                        class="nav-link"
                        :class="{ active: activeTab === tab.value }"
                        @click="activeTab = tab.value"
                      >
                        {{ tab.label }}
                      </button>
                    </li>
                  </ul>
                </div>

                <div class="tab-content mt-4">
                  <!-- Google Drive Tab -->
                  <div v-if="activeTab === 'google-drive'">
                    <div class="card  border-secondary">
                      <div class="card-header text-white">
                        <h5>Google Drive Settings</h5>
                      </div>
                      <div class="card-body">
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="google-drive-toggle"
                            v-model="googleDriveEnabled"
                          />
                          <label class="form-check-label" for="google-drive-toggle">Enable Google Drive Integration</label>
                        </div>
                        <div class="mt-3">
                          <label for="folder-id" class="form-label">Folder ID</label>
                          <input
                            type="text"
                            id="folder-id"
                            class="form-control"
                            v-model="folderId"
                            :disabled="!googleDriveEnabled"
                            placeholder="Enter Google Drive Folder ID"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Invoice Tab -->
                  <div v-if="activeTab === 'invoice'">
                    <div class="card border-secondary">
                      <div class="card-header text-white">
                        <h5>Invoice Settings</h5>
                      </div>
                      <div class="card-body">
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="invoice-toggle"
                            v-model="invoiceEnabled"
                          />
                          <label class="form-check-label" for="invoice-toggle">Enable Invoice Generation</label>
                        </div>
                        <div class="mt-3">
                          <label for="store-name" class="form-label">Test Print</label>
                            <button class="btn btn-primary" @click="testPrint">Print</button>
                        </div>
                        <div class="mt-3">
                          <label for="store-name" class="form-label">Store Name</label>
                          <input
                            type="text"
                            id="store-name"
                            class="form-control"
                            v-model="storeName"
                            :disabled="!invoiceEnabled"
                            placeholder="Enter Store Name"
                          />
                        </div>
                        <div class="mt-3">
                          <label for="store-address" class="form-label">Store Address</label>
                          <input
                            type="text"
                            id="store-address"
                            class="form-control"
                            v-model="storeAddress"
                            :disabled="!invoiceEnabled"
                            placeholder="Enter Store Address"
                          />
                        </div>
                        <div class="mt-3">
                          <label for="store-second-address" class="form-label">Store Second Address</label>
                          <input
                            type="text"
                            id="store-second-address"
                            class="form-control"
                            v-model="storeSecondAddress"
                            :disabled="!invoiceEnabled"
                            placeholder="Enter Second Store Address"
                          />
                        </div>
                        <div class="mt-3">
                          <label for="contact" class="form-label">Contact</label>
                          <input
                            type="text"
                            id="contact"
                            class="form-control"
                            v-model="contact"
                            :disabled="!invoiceEnabled"
                            placeholder="Enter Contact"
                          />
                        </div>
                        <div class="mt-3">
                          <label for="message" class="form-label">Message</label>
                          <textarea
                            id="message"
                            class="form-control"
                            rows="3"
                            v-model="message"
                            :disabled="!invoiceEnabled"
                            placeholder="Enter Message"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 d-flex justify-content-end">
                  <button class="btn btn-info mx-3" @click="restoreDefaults">Restore Defaults</button>
                  <button class="btn btn-primary" @click="saveChanges">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from '/src/components/Admin/Navbar.vue';
import axios from 'axios';

export default {
  components: {
    Navbar,
  },
  setup() {
    const tabs = [
      { label: 'Google Drive', value: 'google-drive' },
      { label: 'Invoice', value: 'invoice' },
    ];
    const apiURL = process.env.VUE_APP_URL;
    const activeTab = ref('google-drive');
    const googleDriveEnabled = ref(false);
    const invoiceEnabled = ref(false);
    const folderId = ref('');
    const storeName = ref('');
    const storeAddress = ref('');
    const storeSecondAddress = ref('');
    const contact = ref('');
    const message = ref('');

    // Fetch current settings from backend
    onMounted(async () => {
      try {
        const response = await axios.get(`${apiURL}/settings`);
        const { receipt, config } = response.data;

        // Google Drive Settings (config)
        googleDriveEnabled.value = config.status;
        folderId.value = config.folderID;

        // Invoice Settings (receipt)
        invoiceEnabled.value = receipt.status
        storeName.value = receipt.storeName || '';
        storeAddress.value = receipt.storeAdress || '';
        storeSecondAddress.value = receipt.storeSecondAddress || '';
        contact.value = receipt.contact || '';
        message.value = receipt.message || '';
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    });

    // Save updated settings to the backend
    const saveChanges = async () => {
      try {
        await axios.post(`${apiURL}/updateReceiptSettings`, {
          status: invoiceEnabled.value,
          storeName: storeName.value,
          storeAdress: storeAddress.value,
          storeSecondAddress: storeSecondAddress.value,
          contact: contact.value,
          message: message.value,
        });

        await axios.post(`${apiURL}/updateConfigSettings`, {
          status: googleDriveEnabled.value,
          folderID: folderId.value,
        });

        alert('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
      }
    };

    // Restore default settings
    const restoreDefaults = async () => {
      try {
        await axios.post(`${apiURL}/restoreDefaultReceiptSettings`);
        await axios.post(`${apiURL}/restoreDefaultConfigSettings`);
        alert('Defaults restored successfully');
      } catch (error) {
        console.error('Error restoring defaults:', error);
        alert('Failed to restore defaults');
      }
    };
    const testPrint = async()=>{
      try {
        await axios.post(`${apiURL}/test_print`);
       
        alert('Printed successfully');
      } catch (error) {
        console.error('Error restoring defaults:', error);
        alert('Failed to print');
      }
    }

    return {
      activeTab,
      googleDriveEnabled,
      invoiceEnabled,
      folderId,
      storeName,
      storeAddress,
      storeSecondAddress,
      contact,
      message,
      tabs,
      saveChanges,
      restoreDefaults,
      testPrint
    };
  },
};
</script>

<style scoped>
/* Style for tabs */
nav button {
  transition: all 0.2s ease-in-out;
}

nav button.active {
  background-color: #f7f7f7;
}

nav button:hover {
  background-color: #e2e2e2;
}

/* Optional: Customize the tab content background */
.bg-white {
  background-color: #ffffff;
}

/* Optional: Add more custom styling here */
</style>
