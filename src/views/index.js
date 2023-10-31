import React from 'react';

 export const AdminLogin = React.lazy(() => import('../admin/admin-login/AdminLogin'));
 export const AdminDashBoard = React.lazy(() => import('../admin/admin-dashboard/AdminDashboard'));
 export const AdminCatMangment = React.lazy(() => import('../admin/admin-category/AdminCategoryManagment'));
 export const AddCategory = React.lazy(() => import('../admin/admin-category/AdminAddCategory'));
 export const ProductManagment = React.lazy(() => import('../admin/admin-product/AdminProductMangment'));
 export const AddProduct = React.lazy(() => import('../admin/admin-product/AdminAddProduct'));

