import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useAppBridge, NavMenu } from '@shopify/app-bridge-react';
import ComingSoon from './pages/ComingSoon';
import SoldOut from './pages/SoldOut';
import PreOrder from './pages/PreOrder';
import RaiseQuery from './pages/RaiseQuery';
import { getSessionToken } from "@shopify/app-bridge-utils";

function Root() {
  const shopify = useAppBridge()
  console.log(shopify);

  useEffect(() => {
    const makeInitCall = async () => {
      try {
        // Get access token from app bridge session
        // const sessionToken = await getSessionToken(shopify);
        const shopDomain = shopify.config.shop

        // Prepare the payload
        const payload = {
          shop_domain: shopDomain,
          session_token: "",
        };

        // Make the API call
        const response = await fetch(`https://backend.owlnestcommerce.com/api/v1/never-miss/shopify/${shopDomain}/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Init call successful:', result);
      } catch (error) {
        console.error('Init call failed:', error);
      }
    };

    // Call when component mounts
    makeInitCall();
  }, [shopify]);

  return (
    <>
      <NavMenu>
        <a slot="nav-link" href="/coming-soon">Coming Soon</a>
        <a slot="nav-link" href="/sold-out">Sold Out</a>
        <a slot="nav-link" href="/pre-order">Pre Order</a>
        <a slot="nav-link" href="/raise-query">Raise a Query</a>
      </NavMenu>
      <Routes>
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/sold-out" element={<SoldOut />} />
        <Route path="/pre-order" element={<PreOrder />} />
        <Route path="/raise-query" element={<RaiseQuery />} />
      </Routes>
    </>
  );
}

export default Root;
