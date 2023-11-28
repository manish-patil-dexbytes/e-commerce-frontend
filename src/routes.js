// Importing view components for different routes
import {
  AdminLogin,
  AdminDashBoard,
  AdminCatMangment,
  AddCategory,
  ProductManagment,
  AddProduct,
  ProductVarient,
  AddProductVarient,
} from "./views";

// Defining the routes for the application
const routes = [
  {
    // Route for the Admin Login page
    path: "/*",
    exact: true,
    name: "Admin Login",
    component: AdminLogin,
  },
  {
    // Route for the Admin Dashboard page
    path: "/admin/dashboard",
    exact: true,
    name: "Admin Dashboard",
    component: AdminDashBoard,
  },
  {
    // Route for Category Management
    path: "/admin/category",
    exact: true,
    name: "Category Management",
    component: AdminCatMangment,
  },
  {
    // Route for adding a new category
    path: "/admin/category/add-category",
    exact: true,
    name: "Add Category",
    component: AddCategory,
  },
  {
    // Route for Product Management
    path: "/admin/product",
    exact: true,
    name: "Product Management",
    component: ProductManagment,
  },
  {
    // Route for adding a new product
    path: "/admin/product/add",
    exact: true,
    name: "Add Product",
    component: AddProduct,
  },
  {
    // Route for Product Variant Management
    path: "/admin/varients",
    exact: true,
    name: "Product Variant",
    component: ProductVarient,
  },
  {
    // Route for adding a new product variant
    path: "/admin/varients/add",
    exact: true,
    name: "Add Variant",
    component: AddProductVarient,
  },
];

export default routes;
