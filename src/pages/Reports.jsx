import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, Text, Box, DataTable, Select, Spinner, Button, Pagination, Tabs, InlineStack, TextField } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { NotificationIcon, CalendarIcon, PackageIcon, ExportIcon } from '@shopify/polaris-icons';
import { authenticatedFetch, authenticatedPost } from '../utils/api';

const Reports = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ limit: 10, page: 1 });
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const shopify = useAppBridge();

  const fetchSubscriptions = async (page = 1) => {
    setIsLoading(true);
    try {
      const shopDomain = shopify.config.shop;
      const response = await authenticatedFetch(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/subscriptions?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubscriptions(result.subscriptions || []);
      setPagination(result.pagination || { limit: 10, page: 1 });
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      setSubscriptions([]);
      setPagination({ limit: 10, page: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      const shopDomain = shopify.config.shop;

      console.log('Downloading report with dates:', { startDate, endDate });

      const response = await authenticatedPost(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/report/notify-me/download`, {
        start_date: startDate,
        end_date: endDate
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Handle the file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `notify-me-subscriptions-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('Report download completed successfully');
    } catch (error) {
      console.error('Failed to download report:', error);
      // You might want to show an error toast/notification here
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [shopify.config.shop]);

  const subscriptionHeaders = [
    'Email',
    'Product Name',
    'Created At',
    'Product Image'
  ];

  const handleProductClick = (productId) => {
    window.open(`https://${shopify.config.shop}/admin/products/${productId}`, '_blank');
  };

  const subscriptionRows = subscriptions.map(subscription => [
    subscription.email,
    <button
      onClick={() => handleProductClick(subscription.product_id)}
      style={{
        background: 'none',
        border: 'none',
        color: '#006fbb',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        padding: 0,
        textAlign: 'left'
      }}
    >
      {subscription.product_title}
    </button>,
    new Date(subscription.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    subscription.product_image_url ? (
      <img
        src={subscription.product_image_url}
        alt={subscription.product_title}
        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
      />
    ) : 'No image'
  ]);

  const tabs = [
    {
      id: 'notify-me',
      content: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <NotificationIcon width={16} height={16} />
          Notify Me
        </span>
      ),
      accessibilityLabel: 'Notify Me subscriptions',
    },
    // {
    //   id: 'coming-soon',
    //   content: (
    //     <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    //       <CalendarIcon width={16} height={16} />
    //       Coming Soon
    //     </span>
    //   ),
    //   accessibilityLabel: 'Coming Soon subscriptions',
    // },
    {
      id: 'pre-order',
      content: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PackageIcon width={16} height={16} />
          Pre-Order
        </span>
      ),
      accessibilityLabel: 'Pre-Order subscriptions',
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Notify Me
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <Text variant="headingMd" as="h2">Notify Me Subscription List</Text>
                <Box paddingBlockStart="2">
                  <Text variant="bodyMd" color="subdued">Total subscriptions: {!isLoading ? subscriptions.length : 'Loading...'}</Text>
                </Box>
              </div>
              <InlineStack gap="200" blockAlign="center">
                <Text variant="bodySm" color="subdued">From:</Text>
                <div style={{ width: '140px' }}>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={setStartDate}
                    label=""
                    labelHidden
                  />
                </div>
                <Text variant="bodySm" color="subdued">To:</Text>
                <div style={{ width: '140px' }}>
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={setEndDate}
                    label=""
                    labelHidden
                  />
                </div>
                <Button
                  primary
                  size="large"
                  icon={ExportIcon}
                  disabled={isDownloading}
                  onClick={downloadReport}
                  variant='primary'
                >
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
              </InlineStack>
            </div>
            <Box paddingBlockStart="4">
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <Spinner accessibilityLabel="Loading subscriptions" size="large" />
                </div>
              ) : (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={subscriptionHeaders}
                  rows={subscriptionRows}
                />
              )}
            </Box>

            {!isLoading && subscriptions.length === 0 && (
              <Box paddingBlockStart="4">
                <Text variant="bodyMd" color="subdued">No subscriptions found.</Text>
              </Box>
            )}

            {!isLoading && subscriptions.length > 0 && (
              <Box paddingBlockStart="4" paddingBlockEnd="4">
                <Pagination
                  hasPrevious={pagination.page > 1}
                  onPrevious={() => fetchSubscriptions(pagination.page - 1)}
                  hasNext={subscriptions.length === pagination.limit}
                  onNext={() => fetchSubscriptions(pagination.page + 1)}
                />
              </Box>
            )}
          </>
        );
      case 1: // Coming Soon
        return (
          <>
            <Text variant="headingMd" as="h2">Coming Soon Subscription List</Text>
            <Box paddingBlockStart="4">
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={subscriptionHeaders}
                rows={[]}
              />
            </Box>
            <Box paddingBlockStart="4">
              <Text variant="bodyMd" color="subdued">No coming soon subscriptions found.</Text>
            </Box>
          </>
        );
      case 2: // Pre-Order
        return (
          <>
            <Text variant="headingMd" as="h2">Pre-Order Subscription List</Text>
            <Box paddingBlockStart="4">
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={subscriptionHeaders}
                rows={[]}
              />
            </Box>
            <Box paddingBlockStart="4">
              <Text variant="bodyMd" color="subdued">No pre-order subscriptions found.</Text>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Page
      title="Customer Subscriptions"
    >
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="4">
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
          </Box>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            {renderTabContent()}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Reports;
