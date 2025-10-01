import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, Checkbox, Text, Box, Spinner } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';

const SoldOut = () => {
  const [enableNotifyMe, setEnableNotifyMe] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shopify = useAppBridge();

  const handleCheckboxChange = (checked) => {
    setEnableNotifyMe(checked);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const shopDomain = shopify.config.shop;

        const response = await fetch(`https://backend.owlnestcommerce.com/api/v1/never-miss/shopify/${shopDomain}/config/sold_out`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Configuration fetched:', result);

        setEnableNotifyMe(result.enable_nofity_me || false);
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
        // Keep default value of false
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [shopify.config.shop]);

  const handleSave = async () => {
    try {
      // Get shop domain from host query param
      const shopDomain = shopify.config.shop

      const payload = {
        enable_nofity_me: enableNotifyMe
      };

      const response = await fetch(`https://backend.owlnestcommerce.com/api/v1/never-miss/shopify/${shopDomain}/config/sold_out`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Configuration saved successfully:', result);
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  return (
    <Page
      title="Sold Out Configuration"
      primaryAction={{
        content: 'Save',
        onAction: handleSave,
        disabled: !hasUnsavedChanges
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '20px' }}>
              <Text variant="headingMd" as="h2">Sold Out Settings</Text>
              <Box paddingBlockStart="4">
                <Text variant="bodyMd" as="p">
                  Configure display options for sold out items on your storefront.
                </Text>
              </Box>
              {isLoading ? (
                <Box paddingBlockStart="4">
                  <Spinner accessibilityLabel="Loading configuration" size="small" />
                  <Text variant="bodySm" as="span" color="subdued"> Loading configuration...</Text>
                </Box>
              ) : (
                <Box paddingBlockStart="4">
                  <Checkbox
                    label="Display 'Notify Me' option for sold out items"
                    checked={enableNotifyMe}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              )}
              <Box paddingBlockStart="4">
                <Text variant="bodySm" color="subdued">
                  When enabled, customers will see a checkbox and button to request email notifications when sold out items become available again.
                </Text>
              </Box>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SoldOut;
