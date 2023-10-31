import { AdminLogin,
    AdminDashBoard,
    AdminCatMangment,
    AddCategory,
    ProductManagment,
    AddProduct } from './views';

const routes = [
    { path: '/*', exact: true, name: 'Admin Login', component: AdminLogin },
    { path: '/admin/dashboard', exact: true, name: 'Admin Dashboard', component: AdminDashBoard },
    { path: '/admin/category', exact: true, name: 'Category Management', component: AdminCatMangment },
    { path: '/admin/category/add-category', exact: true, name: 'Add Category', component: AddCategory },
    { path: '/admin/product', exact: true, name: 'Product Management', component: ProductManagment },
    { path: '/admin/product/add', exact: true, name: 'Add Product', component: AddProduct },
];

export default routes;
