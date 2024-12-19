<template>
  <Navbar />
  <div class="page-wrapper">
    <div class="content">
      <div class="row mb-3">
        <div class="col-6 d-flex justify-content-start">
          <button class="rounded-3 px-2" @click="toggleTransaction" :class="['btn', isTransactionOpen ? 'btn-danger' : 'btn-success']">
            {{ isTransactionOpen ? 'END TRANSACTION' : 'START TRANSACTION' }}
          </button>
        </div>
        <div class="col-6 d-flex justify-content-end">
          <button class="bg-success rounded-3 px-2 " @click="downloadSalesReport" ><font-awesome-icon icon="file-lines"/> PRINT SALES REPORT</button>
        </div>
      </div>
      <div class="row">
      <!-- Total Items Sold -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex ">
        <div class="dash-widget w-100 border-2 ">
          <div class="mx-3">
            <span class=" text-success "><font-awesome-icon icon="wheat-awn" :size="'2x'" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h5>
              <span class="counters ">{{ totalItemsSold }}</span>
            </h5>
            <h6 class=" text-success text-uppercase fw-bolder">Product Sold</h6>
          </div>
        </div>
      </div>
      <!-- Total Sales -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100 border-2">
          <div class="mx-3">
            <span  class="text-success"><font-awesome-icon icon="money-bill-1" :size="'2x'" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h5 >
              <font-awesome-icon icon="fa-peso-sign" />
              <span class="counters">{{ totalSales.toFixed(2) }}</span>
            </h5>
            <h6 class="text-success text-uppercase fw-bolder">PURCHASES</h6>
          </div>
        </div>
      </div>
      <!-- Total Profit -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="mx-3">
            <span class="text-success">
              <font-awesome-icon icon="fa-arrow-trend-up" :size="'2x'"/>
            </span>
          </div>
          <div class="dash-widgetcontent">
            <h5>
              <font-awesome-icon icon="fa-peso-sign" />
              <span class="counters">{{ totalProfit.toFixed(2) }}</span>
            </h5>
            <h6 class="text-success text-uppercase fw-bolder">INCOME</h6>
          </div>
        </div>
      </div>
      <!-- Total Lost -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash3 w-100">
          <div class="mx-3">
            <span class="text-success">
              <font-awesome-icon icon="fa-arrow-trend-down" :size="'2x'" />
            </span>
          </div>
          <div class="dash-widgetcontent">
            <h5 >
              <font-awesome-icon icon="fa-peso-sign" />
              <span class="counters">{{ totalLost.toFixed(2) }}</span>
            </h5>
            <h6 class="text-success text-uppercase fw-bolder">LOST</h6>
          </div>
        </div>
      </div>
      <!-- Total Transactions -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-count bg-secondary">
          <div class="dash-counts">
            <h4>{{ totalTransactions }}</h4>
            <h5>TRANSACTIONS</h5>
          </div>
          <div class="dash-imgs">
            <font-awesome-icon icon="fa-handshake" />
          </div>
        </div>
      </div>
      <!-- Total Returns -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-count badge-bg">
          <div class="dash-counts">
            <h4>{{ totalReturnedTransactions }}</h4>
            <h5>RETURNED ITEMS</h5>
          </div>
          <div class="dash-imgs">
            <font-awesome-icon icon="fa-reply" />
          </div>
        </div>
      </div>
      <!-- Total Purchase Invoice -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-count das2 " style="background: #F36F24;">
          <div class="dash-counts">
            <h4>{{ totalVoidedTransactions }}</h4>
            <h5>VOID SALES</h5>
          </div>
          <div class="dash-imgs">
            <font-awesome-icon icon="fa-ban" />
          </div>
        </div>
      </div>
      <!-- Completed Transactions -->
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-count das3"  style="background:#FCEE21;" >
          <div class="dash-counts" >
            <h4 class="text-dark">{{ totalCompletedTransactions }}</h4>
            <h5 class="text-dark">SUCCESSFUL TRANSACTIONS</h5>
          </div>
          <div class="dash-imgs text-dark" >
            <font-awesome-icon icon="fa-clipboard-check" />
          </div>
        </div>
      </div>
    </div>
  </div>
      <div class="row">
        <div class="col-xl-7 col-sm-12 col-12 d-flex">
          <div class="card flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div class="graph-sets">
              </div>
            </div>
            <div class="card-body">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
        <div class="col-xl-5 col-sm-12 col-12 d-flex">
          <div class="card flex-fill default-cover mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Recent Transactions</h4>
              <div class="view-all-link">
                <a href="javascript:void(0);" class="view-all d-flex align-items-center">
                  View All<span class="ps-2 d-flex align-items-center"><i data-feather="arrow-right"
                      class="feather-16"></i></span>
                </a>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive dataview">
                <ClipLoader v-if="loading" />
                <table v-else class="table datanew">
            <thead>
              <tr>
                <th>Referece ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody class="sales-list">
    <tr v-if="transactions.length <= 0">
      <td colspan="3">No transactions available</td>
    </tr>
    <tr v-else v-for="trans in transactions.slice(0, 5)" :key="trans.id">
      <td>{{ trans.transactionId }}</td>

      <td class="text-center">
        <span :class="{
          'badge': true,
          'badge-bgsuccess': trans.status === 'Completed',
          'badge-bgdanger': trans.status === 'Voided',
          'badge-bgprimary': trans.status === 'Returned'
        }">
          {{ trans.status }}
        </span>
      </td>

      <td>{{ $formatDate(trans.createdAt) }}</td>
    </tr>
  </tbody>
</table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { ref, onMounted, onBeforeUnmount,nextTick } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";
import Navbar from "/src/components/Admin/Navbar.vue";
import Swal from "sweetalert2";
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import { exportToCSV } from "@/utils/exportCSV";
export default {
  components: {
    Navbar,
    ClipLoader
  },
  setup() {
    const chartCanvas = ref(null);
    let chartInstance = null;
    const apiURL = process.env.VUE_APP_URL;
    // Initialize statistics as ref variables
    const totalItemsSold = ref(0);
    const totalSales = ref(0);
    const totalProfit = ref(0);
    const totalLost = ref(0);
    const totalTransactions = ref(0);
    const totalCompletedTransactions = ref(0);
    const totalVoidedTransactions = ref(0);
    const totalReturnedTransactions = ref(0);
    const isTransactionOpen = ref(false);
    const dateRange = ref({ startDate: null, endDate: null });
    const loading = ref(false);
    const isLoading = ref(false);
    const transactions = ref([]);
    const products = ref([]);
    const getTransactions = async () => {
      loading.value = true;
      try {
        const reponse = await axios.get(`${apiURL}/get_all_transactions`);
        if (reponse.data.success) {
          transactions.value = reponse.data.transactions
        } else {
          Swal.fire('Eror', 'Failed to get all transaction', 'error');
        }

      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Something went wrong', 'error');
      } finally {
        loading.value = false;
      }
    }
     const  getFastMovingProducts=  async () => {
      try {
        const response = await axios.get(`${apiURL}/get_fast_moving`); // Adjust API endpoint as necessary
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching fast-moving products:', error);
      }
    }
    const renderChart = (salesData) => {
  try {
    // Check if data and canvas element are valid
    if (!salesData || salesData.length === 0 || !chartCanvas.value) {
      console.error("Invalid sales data or chart canvas is not available.");
      return;
    }

    const labels = salesData.map((data) => data._id); // Assuming '_id' represents labels
    const totalSalesData = salesData.map((data) => data.totalSales);
    const totalProfitData = salesData.map((data) => data.totalProfit);

    const ctx = chartCanvas.value.getContext("2d");

    // Destroy existing chart instance before creating a new one
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new Chart instance
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Sales",
            data: totalSalesData,
            backgroundColor: "rgba(40, 199, 111, 0.2)", // Translucent background
            borderColor: "rgb(40, 199, 111)",
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Smooth curves
          },
          {
            label: "Total Profit",
            data: totalProfitData,
            backgroundColor: "rgba(255, 77, 77, 0.2)",
            borderColor: "rgb(255, 77, 77)",
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Smooth curves
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ₱${tooltipItem.raw.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Dates",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: "Values",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(200, 200, 200, 0.2)", // Subtle gridlines
            },
            ticks: {
              callback: function (value) {
                return `₱${value.toLocaleString()}`;
              },
            },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error rendering chart:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to render the chart",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

    // Fetch transaction state (open or closed)
    const updateTransactionState = async () => {
  try {
    const response = await axios.get(`${apiURL}/transaction_state`);
    if (response.data.success) {
      isTransactionOpen.value = response.data.isOpen;
      const responses = await axios.get("http://localhost:4000/api/sales_data");
      const salesData = responses.data.data;
      exportToCSV(salesData, `product_report`);
    } else {
      console.error("Failed to fetch transaction state.");
    }
  } catch (error) {
    console.error("Error fetching transaction state:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to update transaction state",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
const toggleTransaction = async () => {
  const action = isTransactionOpen.value ? "close" : "open";
  try {
    const result = await Swal.fire({
      title: "Confirm Action",
      text: `Are you sure you want to ${action} the transaction?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const endpoint = `${action}_transaction`;
      const response = await axios.post(`${apiURL}/${endpoint}`);
   
      if (response.data.success) {
        isTransactionOpen.value = !isTransactionOpen.value;
        await Swal.fire({
          title: "Success!",
          text: `Transaction ${action}ed successfully`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset data if the transaction was opened
        if (isTransactionOpen.value) {
          // Reset statistics and chart data
          totalItemsSold.value = 0;
          totalSales.value = 0;
          totalProfit.value = 0;
          totalLost.value = 0;
          totalTransactions.value = 0;
          totalCompletedTransactions.value = 0;
          totalVoidedTransactions.value = 0;
          totalReturnedTransactions.value = 0;
          dateRange.value = { startDate: null, endDate: null };

          // Reload statistics and chart data
          await fetchStatistics();
        } else {
          // Optionally, fetch statistics again when transaction is closed
          await fetchStatistics();
        }
      } else {
        throw new Error(response.data.message || `Failed to ${action} transaction`);
      }
    }
  } catch (error) {
    console.error(`Error ${action}ing transaction:`, error);
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
const fetchStatistics = async () => {
  try {
    isLoading.value = true;

    const response = await axios.get(`${apiURL}/get_statistics`);
    if (response.data.success) {
      const statistics = response.data.statistics;

      // Set the statistics values
      totalTransactions.value = statistics.totalTransactions;
      totalCompletedTransactions.value = statistics.totalCompletedTransactions;
      totalVoidedTransactions.value = statistics.totalVoidedTransactions;
      totalReturnedTransactions.value = statistics.totalReturnedTransactions;
      totalSales.value = statistics.totalSalesAmount;
      totalProfit.value = statistics.totalProfitAmount;
      totalLost.value = statistics.totalLossAmount;
      totalItemsSold.value = statistics.totalItemsSold;
      dateRange.value = statistics.dateRange || { startDate: null, endDate: null };
    } else {
      console.error("Failed to fetch dashboard statistics");
    }
    // Fetch the sales data for the chart
    const chartResponse = await axios.get(`${apiURL}/get_sales`);
    if (chartResponse.data.success) {
      const salesData = chartResponse.data.salesDatas;
      renderChart(salesData); // Render the chart once the data is fetched
    } else {
      console.error("Failed to fetch sales data for chart");
    }
  } catch (error) {
    console.error("Error fetching statistics:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to fetch dashboard data",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    isLoading.value = false;
  }
}; // On component mount, fetch initial data

const downloadSalesReport = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/sales_data");
    if (response.data.success) {
      const salesData = response.data.data;
      exportToCSV(salesData, `product_report`);
    } else {
      console.error("Failed to fetch sales data:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }
};
    onMounted(async () => {
      await updateTransactionState();
      await fetchStatistics();
      await getTransactions();
      await getFastMovingProducts();
    });

    // Clean up the chart instance when the component is unmounted
    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    return {
      chartCanvas,
      totalItemsSold,
      totalSales,
      totalProfit,
      totalLost,
      totalTransactions,
      totalCompletedTransactions,
      totalVoidedTransactions,
      totalReturnedTransactions,
      dateRange,
      isTransactionOpen,
      toggleTransaction,
      getTransactions,
      transactions,
      products,
      downloadSalesReport
    };
  },
};
</script>
