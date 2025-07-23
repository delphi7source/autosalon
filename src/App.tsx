
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CarDetail from "./pages/CarDetail";
import Financing from "./pages/Financing";
import TestDrive from "./pages/TestDrive";
import Service from "./pages/Service";
import Insurance from "./pages/Insurance";
import TradeIn from "./pages/TradeIn";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Warranty from "./pages/Warranty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import CarsManagement from "./pages/admin/CarsManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import AppointmentsManagement from "./pages/admin/AppointmentsManagement";
import TradeInManagement from "./pages/admin/TradeInManagement";
import InsuranceManagement from "./pages/admin/InsuranceManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Public site routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
              <Route path="/car/:id" element={<Layout><CarDetail /></Layout>} />
              <Route path="/financing" element={<Layout><Financing /></Layout>} />
              <Route path="/test-drive" element={<Layout><TestDrive /></Layout>} />
              <Route path="/service" element={<Layout><Service /></Layout>} />
              <Route path="/insurance" element={<Layout><Insurance /></Layout>} />
              <Route path="/trade-in" element={<Layout><TradeIn /></Layout>} />
              <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/warranty" element={<Layout><Warranty /></Layout>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredPermission="admin.access">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={
                  <ProtectedRoute requiredPermission="users.read">
                    <UsersManagement />
                  </ProtectedRoute>
                } />
                <Route path="cars" element={
                  <ProtectedRoute requiredPermission="cars.read">
                    <CarsManagement />
                  </ProtectedRoute>
                } />
                <Route path="services" element={
                  <ProtectedRoute requiredPermission="services.read">
                    <ServicesManagement />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute requiredPermission="orders.read">
                    <OrdersManagement />
                  </ProtectedRoute>
                } />
                <Route path="appointments" element={
                  <ProtectedRoute requiredPermission="appointments.read">
                    <AppointmentsManagement />
                  </ProtectedRoute>
                } />
                <Route path="tradein" element={
                  <ProtectedRoute requiredPermission="tradein.read">
                    <TradeInManagement />
                  </ProtectedRoute>
                } />
                <Route path="insurance" element={
                  <ProtectedRoute requiredPermission="insurance.read">
                    <InsuranceManagement />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
