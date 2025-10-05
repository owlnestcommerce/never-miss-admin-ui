import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, Text, Box, DataTable, Button, TextField, Modal, Checkbox, Spinner } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';

const PreOrder = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const shopify = useAppBridge();

  useEffect(() => {
    // Load sample products immediately for UI testing
    loadSampleProducts();

    // Then try to fetch real products
    fetchStorefrontProducts();
  }, [shopify]);

  const loadSampleProducts = () => {
    const sampleProducts = [
      {
        id: '1',
        title: 'Wireless Bluetooth Headphones',
        status: 'active',
        price: '89.99',
        inventory_quantity: 15,
        image_url: null
      },
      {
        id: '2',
        title: 'Premium Coffee Beans - Dark Roast',
        status: 'active',
        price: '24.99',
        inventory_quantity: 8,
        image_url: null
      },
      {
        id: '3',
        title: 'Ergonomic Office Chair',
        status: 'active',
        price: '299.99',
        inventory_quantity: 3,
        image_url: null
      },
      {
        id: '4',
        title: 'Smart Fitness Tracker',
        status: 'active',
        price: '149.99',
        inventory_quantity: 22,
        image_url: null
      },
      {
        id: '5',
        title: 'Organic Cotton T-Shirt',
        status: 'active',
        price: '29.99',
        inventory_quantity: 45,
        image_url: null
      }
    ];
    setAvailableProducts(sampleProducts);
  };

  const fetchStorefrontProducts = async () => {
    setIsLoading(true);
    try {
      const shopDomain = shopify.config.shop;
      console.log('🔍 Shopify App Bridge Config:', {
        shop: shopDomain,
        accessToken: shopify.config.accessToken ? 'Present' : 'Missing',
        apiKey: shopify.config.apiKey ? 'Present' : 'Missing'
      });

      // Since you added product read scope, let's try using the access token from App Bridge
      const accessToken = shopify.config.accessToken;

      if (!accessToken) {
        console.error('❌ No access token available in App Bridge config');
        throw new Error('No access token available');
      }

      console.log('🚀 Fetching products using access token...');
      console.log('API URL:', `https://${shopDomain}/admin/api/2023-10/products.json`);

      // Use the Admin API instead of Storefront API since we have admin access
      const response = await fetch(`https://${shopDomain}/admin/api/2023-10/products.json?limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        }
      });

      console.log('📡 Storefront API Response Status:', response.status);
      console.log('🔍 Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Storefront API Error Response:', errorText);
        throw new Error(`Storefront API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📦 Admin API Result:', result);
      console.log('📋 Products in response:', result.products?.length || 0);

      if (!result.products || !Array.isArray(result.products)) {
        console.warn('⚠️ No products array in response');
        throw new Error('No products data received from Admin API');
      }

      const products = result.products;
      console.log('✅ Admin API products fetched successfully:', products.length);

      const productNodes = products.map(product => ({
        id: product.id.toString(),
        title: product.title,
        status: product.status,
        price: product.variants?.[0]?.price || '0',
        inventory_quantity: product.variants?.[0]?.inventory_quantity || 0,
        image_url: product.image?.src || null,
        description: product.body_html || ''
      }));

      console.log('🔄 Processed admin products:', productNodes.length);
      console.log('📋 Sample product:', productNodes[0]);

      setAvailableProducts(productNodes);
    } catch (error) {
      console.error('💥 Failed to fetch storefront products:', error.message);
      console.error('🔧 Error details:', error);

      // Fallback to sample data if Storefront API fails
      const sampleProducts = [
        {
          id: 'gid://shopify/Product/1',
          title: 'Premium Wireless Headphones - Pro Series',
          status: 'active',
          price: '199.99',
          inventory_quantity: 25,
          image_url: 'https://cdn.shopify.com/s/files/1/0788/6762/8251/products/headphones.jpg',
          description: 'Professional-grade wireless headphones with active noise cancellation.'
        },
        {
          id: 'gid://shopify/Product/2',
          title: 'Organic Coffee Beans - Single Origin',
          status: 'active',
          price: '34.99',
          inventory_quantity: 12,
          image_url: 'https://cdn.shopify.com/s/files/1/0788/6762/8251/products/coffee-beans.jpg',
          description: 'Ethically sourced single-origin coffee beans with rich flavor notes.'
        },
        {
          id: 'gid://shopify/Product/3',
          title: 'Ergonomic Standing Desk Converter',
          status: 'active',
          price: '249.99',
          inventory_quantity: 7,
          image_url: 'https://cdn.shopify.com/s/files/1/0788/6762/8251/products/standing-desk.jpg',
          description: 'Height-adjustable standing desk converter for modern workspaces.'
        }
      ];

      console.log('🎭 Using sample products for demonstration');
      setAvailableProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithToken = async (shopDomain, storefrontAccessToken) => {
    console.log('🚀 Fetching with storefront token from:', `https://${shopDomain}/api/2023-07/graphql.json`);

    const response = await fetch(`https://${shopDomain}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query: `
          query GetProducts($first: Int!) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  description
                  featuredImage {
                    url
                    altText
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        quantityAvailable
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          first: 20
        }
      })
    });

    console.log('📡 Storefront API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Storefront API Error:', errorText);
      throw new Error(`Storefront API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('📦 Storefront API Result received');

    if (result.errors) {
      console.error('🚨 GraphQL Errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data?.products?.edges) {
      throw new Error('No products data in Storefront API response');
    }

    const products = result.data.products.edges;
    console.log('✅ Storefront products fetched successfully:', products.length);

    const productNodes = products.map(edge => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        status: node.availableForSale ? 'active' : 'inactive',
        price: node.priceRange?.minVariantPrice?.amount || '0',
        inventory_quantity: node.variants?.edges?.[0]?.node?.quantityAvailable || 0,
        image_url: node.featuredImage?.url || null,
        description: node.description || ''
      };
    });

    console.log('🔄 Processed storefront products:', productNodes.length);
    setAvailableProducts(productNodes);
  };

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setModalSearchTerm('');
  };

  const handleProductToggle = (productId) => {
    const isSelected = selectedProducts.some(p => p.id === productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    } else {
      const product = availableProducts.find(p => p.id === productId);
      if (product) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const filteredProducts = availableProducts.filter(product =>
    product.title.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const productHeaders = [
    'Product',
    'Status',
    'Price',
    'Inventory',
    'Image'
  ];

  const productRows = selectedProducts.map(product => [
    product.title,
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase',
      backgroundColor: product.status === 'active' ? '#dcfce7' : '#fef3c7',
      color: product.status === 'active' ? '#166534' : '#92400e'
    }}>
      {product.status}
    </span>,
    `$${parseFloat(product.price).toFixed(2)}`,
    product.inventory_quantity,
    product.image_url ? (
      <img
        src={product.image_url}
        alt={product.title}
        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
      />
    ) : 'No image'
  ]);

  return (
    <Page
      title="Pre-Order Configuration"
      primaryAction={{
        content: 'Select Products',
        onAction: openProductModal
      }}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Selected Products for Pre-Order</Text>
            <Box paddingBlockStart="2">
              <Text variant="bodyMd" color="subdued">
                Choose products that customers can pre-order when out of stock
              </Text>
            </Box>

            <Box paddingBlockStart="4">
              {selectedProducts.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'numeric', 'numeric', 'text']}
                  headings={productHeaders}
                  rows={productRows}
                />
              ) : (
                <Box paddingBlockStart="4">
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc'
                  }}>
                    <Text variant="headingMd" color="subdued">No products selected</Text>
                    <Box paddingBlockStart="2">
                      <Text variant="bodyMd" color="subdued">
                        Click "Select Products" to choose products for pre-order
                      </Text>
                    </Box>
                  </div>
                </Box>
              )}
            </Box>

            {selectedProducts.length > 0 && (
              <Box paddingBlockStart="4">
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <Text variant="bodyMd" fontWeight="medium">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected for pre-order
                  </Text>
                </div>
              </Box>
            )}
          </Card>
        </Layout.Section>
      </Layout>

      {/* Product Selection Modal */}
      <Modal
        open={isProductModalOpen}
        onClose={closeProductModal}
        title="Select Products for Pre-Order"
        primaryAction={{
          content: 'Done',
          onAction: closeProductModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: closeProductModal,
          },
        ]}
      >
        <Modal.Section>
          <TextField
            label="Search Products"
            value={modalSearchTerm}
            onChange={setModalSearchTerm}
            placeholder="Search by product name..."
            autoComplete="off"
          />

          <Box paddingBlockStart="4">
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spinner accessibilityLabel="Loading products" size="large" />
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Checkbox
                        checked={selectedProducts.some(p => p.id === product.id)}
                        onChange={() => handleProductToggle(product.id)}
                      />
                      <div>
                        <Text variant="bodyMd" fontWeight="medium">{product.title}</Text>
                        <Text variant="bodySm" color="subdued">
                          {product.status} • ${parseFloat(product.price).toFixed(2)} • {product.inventory_quantity} in stock
                        </Text>
                      </div>
                    </div>
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Box>

          {filteredProducts.length === 0 && !isLoading && (
            <Box paddingBlockStart="4">
              <Text variant="bodyMd" color="subdued">
                No products match your search.
              </Text>
            </Box>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default PreOrder;
