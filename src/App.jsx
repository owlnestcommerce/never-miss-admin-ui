import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useAppBridge, NavMenu } from '@shopify/app-bridge-react';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import ComingSoonSettings from './pages/ComingSoonSettings';
import NotifyMe from './pages/NotifyMe';
import PreOrder from './pages/PreOrder';
import RaiseQuery from './pages/RaiseQuery';
import Reports from './pages/Reports';
import { authenticatedPost } from './utils/api';

function Root() {
  const shopify = useAppBridge()
  console.log('App.jsx - Shopify instance:', shopify);

  useEffect(() => {
    // Only run if shopify is properly initialized
    if (!shopify || !shopify.config || !shopify.config.shop) {
      console.log('App.jsx - Shopify not ready, skipping init call');
      return;
    }

    const makeInitCall = async () => {
      try {
        console.log('App.jsx - Making init call for shop:', shopify.config.shop);
        const shopDomain = shopify.config.shop

        // Prepare the payload
        const payload = {
          shop_domain: shopDomain,
          session_token: "",
        };

        // Make the authenticated API call
        const response = await authenticatedPost(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/init`, payload);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('App.jsx - Init call successful:', result);
      } catch (error) {
        console.error('App.jsx - Init call failed:', error);
      }
    };

    // Call when component mounts - only once per shop
    makeInitCall();
  }, []); // Remove shopify dependency to prevent multiple calls

  return (
    <>
      <NavMenu>
        <a slot="nav-link" href="/">Home</a>
        <a slot="nav-link" href="/coming-soon">Coming Soon</a>
        <a slot="nav-link" href="/notify-me">Notify Me</a>
        {/* <a slot="nav-link" href="/pre-order">Pre Order</a> */}
        <a slot="nav-link" href="/reports">Reports</a>
        {/* <a slot="nav-link" href="/raise-query">Raise a Query</a> */}
      </NavMenu>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/coming-soon/:productId" element={<ComingSoonSettings />} />
        <Route path="/notify-me" element={<NotifyMe />} />
        <Route path="/pre-order" element={<PreOrder />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/raise-query" element={<RaiseQuery />} />
      </Routes>
    </>
  );
}

export default Root;
