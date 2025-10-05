import React from 'react';
import { Page, Card, Layout, Text, BlockStack, InlineGrid, Button, Box, Badge, Columns, Column } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Coming Soon',
      description: 'Set up countdown timers for products that are not yet available. Perfect for building hype and anticipation.',
      icon: '⏰',
      path: '/coming-soon',
      color: 'success',
      available: true,
      benefits: ['Build anticipation', 'Collect sign-ups', 'Control launch timing']
    },
    {
      title: 'Notify Me',
      description: 'Allow customers to subscribe for notifications when products become available or restocked.',
      icon: '🔔',
      path: '/notify-me',
      color: 'info',
      available: true,
      benefits: ['Customer engagement', 'Email collection', 'Automated notifications']
    },
    {
      title: 'Pre Order',
      description: 'Enable customers to place orders for products before they are officially released.',
      icon: '📦',
      path: '/pre-order',
      color: 'warning',
      available: false,
      benefits: ['Early revenue', 'Demand validation', 'Customer commitment']
    },
    {
      title: 'Reports',
      description: 'View analytics and insights about your coming soon campaigns and customer engagement.',
      icon: '📊',
      path: '/reports',
      color: 'attention',
      available: true,
      benefits: ['Performance tracking', 'Customer insights', 'Campaign optimization']
    },
    {
      title: 'Raise Query',
      description: 'Allow customers to submit questions or requests about upcoming products.',
      icon: '💬',
      path: '/raise-query',
      color: 'critical',
      available: false,
      benefits: ['Customer feedback', 'Product validation', 'Support management']
    }
  ];

  return (
    <Page
      title="Never Miss"
      subtitle="Boost engagement and sales with smart product launch tools"
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="600">
            {/* Welcome Section */}
            <Card>
              <BlockStack gap="400">
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: 'white',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                    🚀
                  </div>
                  <Text variant="headingXl" as="h1" alignment="center">
                    Welcome to Never Miss
                  </Text>
                  <Text variant="bodyLg" color="subdued" alignment="center">
                    Transform your product launches with powerful engagement tools designed to build anticipation,
                    capture demand, and drive sales for your upcoming releases.
                  </Text>
                </div>
              </BlockStack>
            </Card>

            {/* Features Grid */}
            <BlockStack gap="400">
              <InlineGrid columns={{ xs: 1, sm: 2, lg: 3 }} gap="400">
                {features.map((feature) => (
                  <Card key={feature.title}>
                    <BlockStack gap="400">
                      {/* Header with Icon and Status */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginBottom: '16px'
                        }}>
                          <Text variant="headingXl" as="span">
                            {feature.icon}
                          </Text>
                          {!feature.available && (
                            <Badge tone="info">Coming Soon</Badge>
                          )}
                        </div>

                        <Text variant="headingMd" as="h3">
                          {feature.title}
                        </Text>
                      </div>

                      {/* Description */}
                      <Text variant="bodyMd" color="subdued">
                        {feature.description}
                      </Text>

                      {/* Benefits */}
                      <Box background="surface-selected" padding="300" borderRadius="200">
                        <Text variant="headingSm" as="h4" color="subdued">
                          Key Benefits:
                        </Text>
                        <BlockStack gap="200">
                          {feature.benefits.map((benefit, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: feature.available ? '#22c55e' : '#6b7280'
                            }} />
                            <Text variant="bodySm" color="subdued">
                              {benefit}
                            </Text>
                          </div>
                          ))}
                        </BlockStack>
                      </Box>

                      {/* Action Button */}
                      {feature.available ? (
                        <Button
                          primary
                          onClick={() => navigate(feature.path)}
                        >
                          Open {feature.title}
                        </Button>
                      ) : (
                        <Button
                          disabled
                        >
                          Coming Soon
                        </Button>
                      )}
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            </BlockStack>

            {/* Getting Started Section */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">
                  🚀 Getting Started
                </Text>
                <Text variant="bodyMd" color="subdued">
                  Choose any feature above to start boosting your product launches. Each tool is designed to work
                  independently or together to create comprehensive launch campaigns.
                </Text>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginTop: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9'
                  }}>
                    <Text variant="headingSm" as="h4" style={{ color: '#0ea5e9' }}>
                      💡 Pro Tip
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Start with "Coming Soon" to build anticipation, then enable "Notify Me" to collect customer emails for your product launch.
                    </Text>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <Text variant="headingSm" as="h4" style={{ color: '#f59e0b' }}>
                      📈 Best Practice
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Use "Reports" to track performance and optimize your campaigns based on real customer engagement data.
                    </Text>
                  </div>
                </div>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
