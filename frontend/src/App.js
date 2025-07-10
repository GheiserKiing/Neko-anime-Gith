// File: frontend/src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA       from "react-ga4";

import { CartProvider }         from "./contexts/CartContext";
import { WishlistProvider }     from "./contexts/WishlistContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

import Home            from "./pages/home/home";
import CategoryPage    from "./pages/category/CategoryPage";
import ProductoPage    from "./pages/producto/producto";
import Carrito         from "./pages/carrito/carrito";
import Wishlist        from "./pages/wishlist/wishlist";
import CheckoutWizard  from "./pages/checkout/CheckoutWizard";
import Exito           from "./pages/exito/exito";
import NotFound        from "./pages/notfound/NotFound";

import LoginPage       from "./pages/LoginPage";
import AdminLayout     from "./pages/admin/AdminLayout";

import ProductsAndCategoriesTab from "./pages/admin/tabs/ProductsAndCategoriesTab";
import OrdersTab               from "./pages/admin/tabs/OrdersTab";
import MetricsTab              from "./pages/admin/tabs/MetricsTab";
import BulkTab                 from "./pages/admin/tabs/BulkTab";
import DropshipCenterTab       from "./pages/admin/tabs/DropshipCenterTab";      // <-- import dropship
import SettingsTab             from "./pages/admin/tabs/SettingsTab";
import SuppliersTab            from "./pages/admin/tabs/SuppliersTab";
import AlertsTab               from "./pages/admin/tabs/AlertsTab";
import MessagesTab             from "./pages/admin/tabs/MessagesTab";
import EmailLogsTab            from "./pages/admin/tabs/EmailLogsTab";
import EmailTemplatesTab       from "./pages/admin/tabs/EmailTemplatesTab";
import NewsletterTab           from "./pages/admin/tabs/NewsletterTab";
import NewsletterCampaignTab   from "./pages/admin/tabs/NewsletterCampaignTab";

import PrivacyPolicy      from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiesPolicy      from "./pages/CookiesPolicy";

import { getToken } from "./services/authService";
import "./App.css";

// Inicializa Google Analytics
ReactGA.initialize("G-XXXXXXX");

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

function AppWrapper() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");
  const [categories, setCategories] = useState([]);

  // Track pageviews
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  // Carga categorías
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Acepto"
        cookieName="gdprCookie"
        style={{ background: "#2E2E2E", textAlign: "center" }}
        buttonStyle={{ color: "#FFF", backgroundColor: "#4CAF50" }}
      >
        Usamos cookies para mejorar tu experiencia —{" "}
        <a href="/politica-privacidad" style={{ color: "#FFD700" }}>
          Política de Privacidad
        </a>
      </CookieConsent>

      {!isAdmin && <Header categories={categories} />}

      <div style={{ marginTop: isAdmin ? 0 : 64 }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="products-categories" replace />} />
            <Route path="products-categories" element={<ProductsAndCategoriesTab />} />
            <Route path="orders"                element={<OrdersTab />} />
            <Route path="metrics"               element={<MetricsTab />} />
            <Route path="bulk"                  element={<BulkTab />} />
            <Route path="dropship"              element={<DropshipCenterTab />} />  {/* <-- dropship */}
            <Route path="settings"              element={<SettingsTab />} />
            <Route path="suppliers"             element={<SuppliersTab />} />
            <Route path="alerts"                element={<AlertsTab />} />
            <Route path="messages"              element={<MessagesTab />} />
            <Route path="email-logs"            element={<EmailLogsTab />} />
            <Route path="email-templates"       element={<EmailTemplatesTab />} />
            <Route path="newsletter"            element={<NewsletterTab />} />
            <Route path="newsletter-campaign"   element={<NewsletterCampaignTab />} />
          </Route>

          {/* Store */}
          <Route path="/"                         element={<Home />} />
          <Route path="/categoria"                element={<CategoryPage />} />
          <Route path="/categoria/:name"          element={<CategoryPage />} />
          <Route path="/categoria/:name/:subname" element={<CategoryPage />} />
          <Route path="/producto/:id"             element={<ProductoPage />} />
          <Route path="/carrito"                  element={<Carrito />} />
          <Route path="/wishlist"                 element={<Wishlist />} />
          <Route path="/checkout"                 element={<CheckoutWizard />} />
          <Route path="/exito"                    element={<Exito />} />
          <Route path="/politica-privacidad"      element={<PrivacyPolicy />} />
          <Route path="/terminos-condiciones"     element={<TermsAndConditions />} />
          <Route path="/cookies"                  element={<CookiesPolicy />} />
          <Route path="*"                         element={<NotFound />} />
        </Routes>
      </div>

      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <AppWrapper />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
