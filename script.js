"use strict";

// ======================================
// 1. DATA AND LOCAL STORAGE
// ======================================

const STORAGE_KEY = "smartInventoryProducts";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Laptop", price: 800 },
  { id: 2, name: "Mouse", price: 25 }
];

function isValidProduct(product) {
  return (
    product &&
    Number.isInteger(product.id) &&
    typeof product.name === "string" &&
    product.name.trim() !== "" &&
    Number.isFinite(product.price) &&
    product.price > 0
  );
}

function loadProducts() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      return DEFAULT_PRODUCTS.map(product => ({ ...product }));
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return DEFAULT_PRODUCTS.map(product => ({ ...product }));
    }

    return parsedData.filter(isValidProduct);
  } catch (error) {
    console.error("Could not load products:", error);
    return DEFAULT_PRODUCTS.map(product => ({ ...product }));
  }
}

let products = loadProducts();

let nextId =
  products.reduce(
    (maximum, product) => Math.max(maximum, product.id),
    0
  ) + 1;

let editingProductId = null;

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error("Could not save products:", error);

    showAnalyticsMessage(
      "Unable to save data. Check browser storage settings.",
      "error"
    );

    return false;
  }
}

// ======================================
// 2. HTML ELEMENTS
// ======================================

const totalProductsEl = document.getElementById("totalProducts");
const inventoryValueEl = document.getElementById("inventoryValue");
const budgetProductsEl = document.getElementById("budgetProducts");
const premiumProductsEl = document.getElementById("premiumProducts");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productTableBody = document.getElementById("productTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const resultCount = document.getElementById("resultCount");

const productFormSection = document.getElementById("productFormSection");
const productForm = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const formMessage = document.getElementById("formMessage");

const averagePriceEl = document.getElementById("averagePrice");
const affordableCountEl = document.getElementById("affordableCount");
const standardCountEl = document.getElementById("standardCount");
const discountValueEl = document.getElementById("discountValue");

const affordableReport = document.getElementById("affordableReport");
const inventoryReport = document.getElementById("inventoryReport");
const analyticsMessage = document.getElementById("analyticsMessage");

// ======================================
// 3. HELPER FUNCTIONS
// ======================================

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);

// Parameters and local variables
function calculateTax(price, taxRate = 0.10) {
  const taxAmount = price * taxRate;
  return price + taxAmount;
}

function calculateDiscount(total, discountRate = 0.10) {
  const discountAmount = total * discountRate;
  return discountAmount;
}

// if/else
function getCategory(price) {
  if (price < 100) {
    return "budget";
  } else if (price < 500) {
    return "standard";
  } else {
    return "premium";
  }
}

// switch
function getCategoryLabel(category) {
  switch (category) {
    case "budget":
      return "Budget";

    case "standard":
      return "Standard";

    case "premium":
      return "Premium";

    default:
      return "Unknown";
  }
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
}

function showAnalyticsMessage(message, type) {
  analyticsMessage.textContent = message;
  analyticsMessage.className = `message ${type}`;
}

// ======================================
// 4. LOOPS: break AND continue
// ======================================

function getInventoryTotal() {
  let total = 0;

  for (const product of products) {
    // continue skips invalid entries
    if (!isValidProduct(product)) {
      continue;
    }

    total += product.price;
  }

  return total;
}

function getCategoryCount(category) {
  let count = 0;

  for (const product of products) {
    if (!isValidProduct(product)) {
      continue;
    }

    if (getCategory(product.price) === category) {
      count++;
    }
  }

  return count;
}

// Find the first premium product.
// break stops the loop as soon as a match is found.
function getFirstPremiumProduct() {
  let firstPremium = null;

  for (const product of products) {
    if (!isValidProduct(product)) {
      continue;
    }

    if (getCategory(product.price) === "premium") {
      firstPremium = product;
      break;
    }
  }

  return firstPremium;
}

// ======================================
// 5. RENDER PRODUCT TABLE
// ======================================

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      getCategory(product.price) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productTableBody.replaceChildren();

  filteredProducts.forEach(product => {
    const row = document.createElement("tr");
    const category = getCategory(product.price);

    const nameCell = document.createElement("td");

    const nameElement = document.createElement("div");
    nameElement.className = "product-name";
    nameElement.textContent = product.name;

    const subtitle = document.createElement("div");
    subtitle.className = "product-subtitle";
    subtitle.textContent = `Product ID: ${product.id}`;

    nameCell.append(nameElement, subtitle);

    const priceCell = document.createElement("td");
    priceCell.textContent = formatMoney(product.price);

    const categoryCell = document.createElement("td");

    const badge = document.createElement("span");
    badge.className = `category-badge ${category}`;
    badge.textContent = getCategoryLabel(category);

    categoryCell.appendChild(badge);

    const taxCell = document.createElement("td");
    taxCell.textContent = formatMoney(calculateTax(product.price));

    const actionsCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "action-cell";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-btn edit-btn";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${product.name}`);

    editButton.addEventListener("click", () => {
      editProduct(product.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-btn delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${product.name}`);

    deleteButton.addEventListener("click", () => {
      deleteProduct(product.id);
    });

    actionGroup.append(editButton, deleteButton);
    actionsCell.appendChild(actionGroup);

    row.append(
      nameCell,
      priceCell,
      categoryCell,
      taxCell,
      actionsCell
    );

    productTableBody.appendChild(row);
  });

  emptyMessage.hidden = filteredProducts.length > 0;

  resultCount.textContent =
    `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;
}

// ======================================
// 6. STATISTICS AND ANALYTICS
// ======================================

function updateStatistics() {
  const total = getInventoryTotal();

  totalProductsEl.textContent = products.length;
  inventoryValueEl.textContent = formatMoney(total);
  budgetProductsEl.textContent = getCategoryCount("budget");
  premiumProductsEl.textContent = getCategoryCount("premium");
}

function renderReportList(listElement, items, emptyText) {
  listElement.replaceChildren();

  if (items.length === 0) {
    const item = document.createElement("li");
    item.className = "report-empty";
    item.textContent = emptyText;

    listElement.appendChild(item);
    return;
  }

  items.forEach(text => {
    const item = document.createElement("li");
    item.textContent = text;
    listElement.appendChild(item);
  });
}

function updateAnalytics() {
  const total = getInventoryTotal();

  const average = products.length > 0
    ? total / products.length
    : 0;

  // filter()
  const affordableProducts = products.filter(
    product => product.price < 200
  );

  const standardProducts = products.filter(
    product => getCategory(product.price) === "standard"
  );

  // map()
  const affordableNames = affordableProducts.map(
    product =>
      `${product.name.toUpperCase()} — ${formatMoney(product.price)}`
  );

  const inventoryItems = products.map(product => {
    return (
      `${product.name}: ` +
      `${getCategoryLabel(getCategory(product.price))} ` +
      `(${formatMoney(product.price)})`
    );
  });

  // Demonstrates break through the helper function above
  const firstPremium = getFirstPremiumProduct();

  if (firstPremium) {
    inventoryItems.push(
      `First premium product: ${firstPremium.name}`
    );
  }

  averagePriceEl.textContent = formatMoney(average);
  affordableCountEl.textContent = affordableProducts.length;
  standardCountEl.textContent = standardProducts.length;
  discountValueEl.textContent = formatMoney(
    calculateDiscount(total)
  );

  renderReportList(
    affordableReport,
    affordableNames,
    "No products under $200."
  );

  renderReportList(
    inventoryReport,
    inventoryItems,
    "Your inventory is currently empty."
  );
}

function renderDashboard() {
  renderProducts();
  updateStatistics();
  updateAnalytics();
}

// ======================================
// 7. ADD AND EDIT PRODUCTS
// ======================================

function openAddForm() {
  editingProductId = null;

  productForm.reset();
  formTitle.textContent = "Add Product";
  formMessage.textContent = "";
  formMessage.className = "message";

  productFormSection.hidden = false;

  productFormSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  productNameInput.focus();
}

function editProduct(id) {
  const product = products.find(item => item.id === id);

  if (!product) {
    showAnalyticsMessage("Product not found.", "error");
    return;
  }

  editingProductId = id;

  formTitle.textContent = "Edit Product";
  productNameInput.value = product.name;
  productPriceInput.value = product.price;

  formMessage.textContent = "";
  formMessage.className = "message";

  productFormSection.hidden = false;
  productFormSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function saveProduct(event) {
  event.preventDefault();

  const name = productNameInput.value.trim();

  // Explicit conversion from string to number
  const price = Number(productPriceInput.value);

  if (!name) {
    showFormMessage("Please enter a product name.", "error");
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    showFormMessage(
      "Enter a valid price greater than zero.",
      "error"
    );
    return;
  }

  let successMessage;

  if (editingProductId !== null) {
    const product = products.find(
      item => item.id === editingProductId
    );

    if (!product) {
      showFormMessage("Product not found.", "error");
      return;
    }

    product.name = name;
    product.price = price;

    successMessage = `${name} updated successfully.`;
  } else {
    products.push({
      id: nextId++,
      name: name,
      price: price
    });

    successMessage = `${name} added successfully.`;
  }

  if (!saveProducts()) {
    showFormMessage(
      "Changes could not be saved in browser storage.",
      "error"
    );
    return;
  }

  productForm.reset();
  productFormSection.hidden = true;
  editingProductId = null;

  renderDashboard();
  showAnalyticsMessage(successMessage, "success");
}

// ======================================
// 8. DELETE PRODUCTS
// ======================================

function deleteProduct(id) {
  const product = products.find(item => item.id === id);

  if (!product) {
    return;
  }

  const shouldDelete = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  );

  if (!shouldDelete) {
    return;
  }

  const previousProducts = products;

  products = products.filter(item => item.id !== id);

  if (!saveProducts()) {
    // Restore previous in-memory data if saving fails
    products = previousProducts;
    renderDashboard();
    return;
  }

  if (editingProductId === id) {
    editingProductId = null;
    productFormSection.hidden = true;
  }

  renderDashboard();

  showAnalyticsMessage(
    `${product.name} deleted successfully.`,
    "success"
  );
}

// ======================================
// 9. PROMPT-BASED QUICK ADD
// ======================================

function addProductUsingPrompt() {
  const nameInput = window.prompt("Enter product name:");

  if (nameInput === null) {
    return;
  }

  const name = nameInput.trim();

  if (!name) {
    window.alert("Product name cannot be empty.");
    return;
  }

  const priceInput = window.prompt(
    "Enter product price in USD:"
  );

  if (priceInput === null) {
    return;
  }

  const price = Number(priceInput);

  if (!Number.isFinite(price) || price <= 0) {
    window.alert("Enter a valid price greater than zero.");
    return;
  }

  const newProduct = {
    id: nextId++,
    name: name,
    price: price
  };

  products.push(newProduct);

  if (!saveProducts()) {
    products = products.filter(
      product => product.id !== newProduct.id
    );

    renderDashboard();
    return;
  }

  renderDashboard();

  showAnalyticsMessage(
    `${name} added successfully.`,
    "success"
  );
}

// ======================================
// 10. CSV EXPORT
// ======================================

function exportCSV() {
  if (products.length === 0) {
    showAnalyticsMessage(
      "There are no products to export.",
      "error"
    );
    return;
  }

  const headings = [
    "ID",
    "Product Name",
    "Price",
    "Category",
    "Price Including 10% Tax"
  ];

  const rows = products.map(product => [
    product.id,
    product.name,
    product.price.toFixed(2),
    getCategoryLabel(getCategory(product.price)),
    calculateTax(product.price).toFixed(2)
  ]);

  const escapeCSV = value =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csvContent = [headings, ...rows]
    .map(row => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "inventory-report.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showAnalyticsMessage(
    "CSV report exported successfully.",
    "success"
  );
}

// ======================================
// 11. EVENT LISTENERS
// ======================================

document
  .getElementById("addProductBtn")
  .addEventListener("click", openAddForm);

document
  .getElementById("quickAddBtn")
  .addEventListener("click", addProductUsingPrompt);

document
  .getElementById("cancelBtn")
  .addEventListener("click", () => {
    productForm.reset();
    productFormSection.hidden = true;
    editingProductId = null;
    formMessage.textContent = "";
  });

productForm.addEventListener("submit", saveProduct);

searchInput.addEventListener("input", renderProducts);

categoryFilter.addEventListener("change", renderProducts);

document
  .getElementById("exportBtn")
  .addEventListener("click", exportCSV);

// ======================================
// 12. INITIALIZE DASHBOARD
// ======================================

renderDashboard();
