/**
 * Makes an authenticated API call using Shopify App Bridge ID token
 * @param {object} appBridge - Shopify App Bridge instance
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - Fetch response
 */
export const authenticatedFetch = async (appBridge, url, options = {}) => {
  try {
    console.log('🔐 Auth Debug - Starting authenticated request to:', url);

    // Get Shopify App Bridge ID token
    let idToken = null;

    if (appBridge && appBridge.idToken) {
      try {
        console.log('🔐 Auth Debug - Requesting ID token from App Bridge');
        idToken = await appBridge.idToken();
        console.log('✅ Auth Debug - ID token retrieved successfully');
      } catch (tokenError) {
        console.warn('❌ Auth Debug - Failed to get ID token:', tokenError.message);

        // Try alternative: check if token is already available
        if (appBridge.token) {
          idToken = appBridge.token;
          console.log('✅ Auth Debug - Using existing token from App Bridge');
        }
      }
    } else {
      console.warn('❌ Auth Debug - App Bridge or idToken method not available');
    }

    // Prepare headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
      ...options.headers,
    };

    console.log('🚀 Auth Debug - Making request with auth:', !!idToken);
    console.log('🔐 Auth Debug - Headers include Authorization:', !!headers.Authorization);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('✅ Auth Debug - Request completed with status:', response.status);
    return response;

  } catch (error) {
    console.error('💥 Auth Debug - Request failed:', error);

    // Fallback: try without authentication
    try {
      console.warn('🔄 Auth Debug - Retrying without authentication');
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      console.log('✅ Auth Debug - Unauthenticated request succeeded');
      return response;
    } catch (fallbackError) {
      console.error('💥 Auth Debug - All requests failed:', fallbackError);
      throw new Error('Failed to make API request');
    }
  }
};

/**
 * Convenience function for GET requests
 */
export const authenticatedGet = async (shopify, url) => {
  return authenticatedFetch(shopify, url, { method: 'GET' });
};

/**
 * Convenience function for POST requests
 */
export const authenticatedPost = async (shopify, url, data) => {
  return authenticatedFetch(shopify, url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Convenience function for PUT requests
 */
export const authenticatedPut = async (shopify, url, data) => {
  return authenticatedFetch(shopify, url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Convenience function for DELETE requests
 */
export const authenticatedDelete = async (shopify, url) => {
  return authenticatedFetch(shopify, url, { method: 'DELETE' });
};
