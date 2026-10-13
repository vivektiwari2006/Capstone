# Capstone — Smart Inventory Dashboard

An interactive and responsive inventory management dashboard built using **HTML, CSS, and JavaScript**. This project helps users manage products, monitor inventory value, analyze product categories, and export product data.

## 📌 Project Overview

The Smart Inventory Dashboard provides a simple interface for managing product inventory. Users can add new products, update existing product details, delete products, search for products, filter products by category, and view automatically updated inventory statistics.

The application uses browser Local Storage to save product data, allowing the data to remain available after refreshing the page in the same browser and origin.

## ✨ Features

### 1. Dashboard Statistics
- Displays the total number of products.
- Calculates the total inventory value.
- Counts budget products.
- Counts premium products.
- Updates statistics when product data changes.

### 2. Product Management
- Add new products.
- View products in a table.
- Edit existing product details.
- Delete products.
- Validate product information before saving.

### 3. Quick Add
- Add a product using browser prompt dialogs.
- Enter product information without opening the regular product form.

### 4. Search and Category Filter
- Search for products.
- Filter products by category.
- View matching products in the inventory table.

### 5. Inventory Analytics
- Calculate the average product price.
- Count affordable products.
- Count standard-category products.
- Calculate the configured discount value.
- Display inventory reports.

### 6. Data Persistence
- Saves product data using browser Local Storage.
- Loads previously saved products when the dashboard opens.
- Preserves saved data after a page refresh, provided the browser's stored data remains available.

### 7. CSV Export
- Export product inventory data to a CSV file.
- Open the exported file in spreadsheet applications that support CSV.

### 8. Responsive User Interface
- Clean dashboard layout.
- Responsive styling for smaller screens.
- Interactive buttons, forms, and table elements.
- Visual feedback when interacting with dashboard components.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structures the dashboard |
| CSS3 | Styles the interface and responsive layout |
| JavaScript | Implements dashboard logic and interactivity |
| Local Storage | Persists data in the browser |
| CSV | Exports inventory data |

## 📂 Project Structure

```text
smart-inventory-dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

**File descriptions:**

- `index.html` — Contains the dashboard structure, product form, statistics, analytics, and table.
- `style.css` — Contains styling, layout, hover effects, focus states, and responsive design.
- `script.js` — Contains product management, calculations, search, filtering, local storage, and CSV export logic.
- `README.md` — Contains project information, features, setup instructions, and documentation.

## 🚀 How to Run the Project

This is a standalone frontend project. No backend server or package installation is required.

1. Download or copy the project folder to your computer.
2. Make sure all three application files are in the same folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Open `index.html` in a modern web browser.
4. Use the dashboard to manage products and view inventory analytics.

**Alternative:** Open the project folder in Visual Studio Code and use the Live Server extension to run `index.html` locally.

## 📊 Inventory Calculation Logic

The dashboard uses JavaScript to calculate inventory statistics.

### Total Products

Counts the products currently present in the inventory.

### Inventory Value

Adds the prices of all products.

**Formula:**

`Inventory Value = Sum of all product prices`

### Average Price

Calculates the average price of all products.

**Formula:**

`Average Price = Total of product prices / Number of products`

### Product Categories

The current application categorizes products using their prices:

- **Budget:** Price below $100.
- **Standard:** Price from $100 up to, but not including, $500.
- **Premium:** Price of $500 or above.

### Discount Calculation

Calculates a discount based on the discount rate configured in the JavaScript code.

## 💾 Data Storage

The application uses the browser's `localStorage` API to save inventory data.

When the application starts, it attempts to load previously saved product data. After product changes, the updated data is saved in Local Storage.

**Important limitations:**

- Data is stored in the browser, not in a remote database.
- Data is not automatically synchronized between different browsers or devices.
- Clearing the browser's site data may remove saved inventory data.
- Local Storage should not be treated as a secure database for sensitive information.

## 🧪 Testing Checklist

The following tests should be completed before submission:

- [ ] The dashboard opens without errors.
- [ ] New products can be added.
- [ ] Existing products can be edited.
- [ ] Products can be deleted.
- [ ] Search functionality works.
- [ ] Category filtering works.
- [ ] Dashboard statistics update correctly.
- [ ] Analytics update when product data changes.
- [ ] Product data remains available after refreshing the page.
- [ ] CSV export works correctly.
- [ ] Invalid input is handled appropriately.
- [ ] The interface displays correctly on desktop and mobile screens.
- [ ] Browser developer tools show no unexpected JavaScript errors.

## ⚠️ Current Limitations

- The application uses Local Storage instead of a database.
- User authentication is not implemented.
- Multiple users cannot share a synchronized inventory.
- Data is not automatically backed up to a server.
- Product management is limited to the features implemented in the current frontend.

## 🔮 Future Improvements

The project could be extended with the following features:

- Backend integration using Node.js and Express.js.
- MongoDB database integration.
- User login and authentication.
- Stock quantity tracking.
- Low-stock notifications.
- Interactive charts and graphical analytics.
- CSV import functionality.
- Inventory reports and data backup.
- Role-based access for administrators and staff.

## 🎯 Learning Outcomes

This project demonstrates practical use of:

- HTML page structure.
- CSS styling and responsive layouts.
- JavaScript functions and conditional statements.
- Arrays and array methods such as `filter()` and `map()`.
- DOM manipulation and event listeners.
- CRUD operations.
- Form validation and user input handling.
- Local Storage for browser-based persistence.
- Data calculations and inventory analytics.
- CSV file generation and export.

## 📝 Conclusion

The Smart Inventory Dashboard is a lightweight inventory management application built with HTML, CSS, and JavaScript. It combines product CRUD operations, search and filtering, inventory statistics, analytics, browser-based data persistence, and CSV export in a responsive user interface.

The project provides a practical demonstration of frontend development and JavaScript-based data management.

Capstone — Smart Inventory Dashboard

An interactive and responsive inventory management dashboard built using HTML, CSS, and JavaScript.
Project Name: Capstone
Project Title: Smart Inventory Dashboard
Technologies: HTML5, CSS3, JavaScript
Application Type: Frontend Web Application
Data Storage: Browser Local Storage
