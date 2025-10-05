import {Page, Card, Text, BlockStack, Box, Button, Badge, IndexTable, Thumbnail, ButtonGroup} from '@shopify/polaris';
import React, { useState, useCallback, useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';

const ComingSoon = () => {
  const shopify = useAppBridge();
  const navigate = useNavigate();

  // State for products that have been selected and configured
  const [comingSoonProducts, setComingSoonProducts] = useState([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get shop domain from Shopify context
  const shopDomain = shopify.config.shop || '';

  // Fetch existing coming soon configurations
  const fetchExistingConfigs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      console.log('Fetching existing coming soon configs for:', shopDomain);
      const response = await authenticatedFetch(shopify, `https://api.owlnestlabs.in/api/v1/never-miss/shopify/${shopDomain}/config/coming_soon`);

      if (!response.ok) {
        // If no configs exist (404), it's not an error - just no data
        if (response.status === 404) {
          console.log('No existing configs found');
          return;
        }
        throw new Error(`Failed to fetch configs: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched configs:', data);

      // Transform API response to match our table structure
      // API returns: { "product_123": {config}, "product_456": {config} }
      // We need: [ {id: "gid://shopify/Product/123", title: "...", ...} ]
      const transformedProducts = Object.entries(data).map(([productKey, config]) => {
        // Extract numeric ID from "product_123" format
        const productId = productKey.replace('product_', '');
        const shopifyGid = `gid://shopify/Product/${productId}`;

        return {
          id: shopifyGid,
          title: config.product_title,
          featuredImage: {
            originalSrc: config.product_image_url
          },
          startDate: config.start_date,
          startTime: config.start_time,
          endDate: config.end_date,
          endTime: config.end_time,
          enableNotifyMe: config.enable_notify_me || false,
          // Store full config for passing to settings page
          config: config,
          // Add dynamic status calculation
          status: (() => {
            const now = new Date();
            const startTime = new Date(config.start_timestamp);
            const endTime = new Date(config.end_timestamp);

            if (now >= startTime && now <= endTime) {
              return 'active';
            } else if (now < startTime) {
              return 'upcoming';
            } else {
              return 'expired';
            }
          })()
        };
      });

      console.log('Transformed products for table:', transformedProducts);
      setComingSoonProducts(transformedProducts);

    } catch (error) {
      console.error('Error fetching existing configs:', error);
      // Keep empty state if fetch fails
    } finally {
      setIsRefreshing(false);
      setIsLoadingConfigs(false);
    }
  }, [shopDomain, shopify]);

  // Handle opening the resource picker for adding new products
  const handleAddProduct = useCallback(() => {
    shopify.resourcePicker({
      type: 'product',
      action: 'select',
      multiple: false,
    }).then((payload) => {
      console.log('Full payload:', payload);
      console.log('Payload keys:', Object.keys(payload));

      // Handle different payload structures
      let newProduct = null;

      if (payload.products && payload.products.length > 0) {
        newProduct = payload.products[0];
      } else if (payload.selection && payload.selection.length > 0) {
        newProduct = payload.selection[0];
      } else if (payload.length > 0) {
        newProduct = payload[0];
      }

      console.log('New product:', newProduct);

      if (newProduct) {
        // Add to selected products array
        setComingSoonProducts(prev => {
          // Check if product already exists
          const exists = prev.find(p => p.id === newProduct.id);
          if (exists) {
            console.log('Product already exists in table');
            return prev; // Don't add duplicate
          }
          return [...prev, newProduct];
        });

        console.log('Product added to table successfully');

        // Extract clean numeric ID from Shopify GID
        const cleanProductId = newProduct.id.toString().split('/').pop() || newProduct.id;

        // Extract image URL from different possible properties
        // Prioritize images array first, then featureImage, then single image
        const productImage = newProduct.images?.[0]?.src ||
                           newProduct.images?.[0]?.url ||
                           newProduct.images?.[0]?.originalSrc ||
                           newProduct.featuredImage?.originalSrc ||
                           newProduct.featuredImage?.url ||
                           newProduct.image?.src ||
                           '';

        // Navigate to settings page for the newly added product
        console.log('Navigating to settings page with product image:', productImage || 'None found');
        navigate(`/coming-soon/${cleanProductId}`, {
          state: {
            productId: newProduct.id,
            productTitle: newProduct.title,
            productImage: productImage,
          }
        });
      }
    }).catch((error) => {
      console.log('Resource picker cancelled or error:', error);
    });
  }, [shopify]);

  // Handle clicking on a product row to edit settings
  const handleProductClick = useCallback((productId) => {
    // Find the product data
    const product = comingSoonProducts.find(p => p.id === productId);
    if (product) {
      // Extract image URL from different possible properties
      // Prioritize images array first, then featureImage, then single image
      const productImage = product.images?.[0]?.src ||
                         product.images?.[0]?.url ||
                         product.images?.[0]?.originalSrc ||
                         product.featuredImage?.originalSrc ||
                         product.featuredImage?.url ||
                         product.image?.src ||
                         '';

      console.log('Navigating to settings for product (click):', {
        searchedId: productId,
        foundProduct: product,
        featuredImage: product.featuredImage,
        productImage: productImage,
        fullProduct: product
      });

      // Extract just the numeric ID from Shopify GID (e.g., "gid://shopify/Product/123" -> "123")
      const cleanProductId = productId.toString().split('/').pop() || productId;

      // Navigate to settings page with clean ID, product data, and existing config
      navigate(`/coming-soon/${cleanProductId}`, {
        state: {
          productId: product.id,
          productTitle: product.title,
          productImage: productImage,
          existingConfig: product.config, // Pass existing configuration for prefilling
        }
      });
    }
  }, [comingSoonProducts, navigate]);

  // Fetch existing configs when component mounts
  useEffect(() => {
    fetchExistingConfigs();
  }, [fetchExistingConfigs]);

  return (
    <Page
      title="Coming Soon"
      subtitle="Manage products with coming soon settings"
      primaryAction={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={fetchExistingConfigs}
            disabled={isRefreshing}
            variant="secondary"
          >
            Refresh Status
          </Button>
          <Button
            primary
            onClick={handleAddProduct}
            variant="primary"
          >
            Add Product
          </Button>
        </div>
      }
    >
      {comingSoonProducts.length > 0 ? (
        <Card>
          <IndexTable
            resourceName={{ singular: 'product', plural: 'products' }}
            itemCount={comingSoonProducts.length}
            headings={[
              { title: 'Product' },
              { title: 'Status' },
              { title: 'Notify Me' },
              { title: 'Start Date' },
              { title: 'End Date' },
            ]}
            selectable={false}
          >
            {comingSoonProducts.map((product, index) => (
              <IndexTable.Row
                key={product.id}
                id={product.id}
                position={index}
                onClick={() => handleProductClick(product.id)}
              >
                <IndexTable.Cell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {(() => {
                      // Extract image URL from different possible properties for table display
                      // Prioritize images array first, then featureImage, then single image
                      const tableImage = product.images?.[0]?.src ||
                                       product.images?.[0]?.url ||
                                       product.images?.[0]?.originalSrc ||
                                       product.featuredImage?.originalSrc ||
                                       product.featuredImage?.url ||
                                       product.image?.src;
                      return tableImage ? (
                        <Thumbnail
                          source={tableImage}
                          alt={product.title}
                          size="small"
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9ca3af',
                          fontSize: '10px'
                        }}>
                          No Image
                        </div>
                      );
                    })()}
                    <div>
                      <Text variant="bodyMd" fontWeight="semibold" as="span">
                        {product.title}
                      </Text>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  {(() => {
                    switch (product.status) {
                      case 'active':
                        return <Badge tone="success">Active</Badge>;
                      case 'upcoming':
                        return <Badge tone="info">Upcoming</Badge>;
                      case 'expired':
                        return <Badge tone="critical">Expired</Badge>;
                      default:
                        return <Badge tone="neutral">Configured</Badge>;
                    }
                  })()}
                </IndexTable.Cell>
                <IndexTable.Cell>
                  {product.enableNotifyMe ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e'
                      }} />
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb'
                      }} />
                    </div>
                  )}
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd">
                    {product.startDate ? new Date(product.startDate).toLocaleDateString() : 'Not set'}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd">
                    {product.endDate ? new Date(product.endDate).toLocaleDateString() : 'Not set'}
                  </Text>
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Card>
      ) : (
        <Card background="surface-neutral">
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>
              No products configured
            </div>
            <Text as="p" variant="bodyMd" color="subdued">
              Get started by adding your first product to configure coming soon settings.
            </Text>
          </div>
        </Card>
      )}
    </Page>
  );
};

export default ComingSoon;
