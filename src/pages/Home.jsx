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

            {/* Setup Instructions Section */}
            <Card>
              <BlockStack gap="500">
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Text variant="headingXl" as="h2">
                    🛠️ Setup Instructions
                  </Text>
                  <Text variant="bodyLg" color="subdued" alignment="center">
                    Complete guide to get your Never Miss app up and running
                  </Text>
                </div>

                <BlockStack gap="400">
                  {/* Installation Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        1
                      </div>
                      <Text variant="headingMd" as="h3">
                        Installation
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        Go to the <strong>Shopify App Store</strong>.
                      </Text>
                      <Text variant="bodyMd">
                        Click <strong>"Install"</strong> to add the app to your store.
                      </Text>
                      <Text variant="bodyMd">
                        Once installed, the app will appear in the <strong>left-hand sidebar</strong> of your Shopify admin.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* App Embed Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        2
                      </div>
                      <Text variant="headingMd" as="h3">
                        Enable App Embed
                      </Text>
                    </div>

                    {/* Side-by-side layout for instructions and image */}
                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      alignItems: 'flex-start'
                    }}>
                      {/* Instructions Column */}
                      <div style={{ flex: 1 }}>
                        <BlockStack gap="300">
                          <Text variant="bodyMd">
                            Go to the <strong>Online Store</strong> section in your Shopify admin.
                          </Text>
                          <Text variant="bodyMd">
                            Click on <strong>Themes</strong> section.
                          </Text>
                          <Text variant="bodyMd">
                            Click on <strong>Customize</strong> button.
                          </Text>
                          <Text variant="bodyMd">
                            Click on <strong>App Embeds</strong> section.
                          </Text>
                          <Text variant="bodyMd">
                            <strong>Enable</strong> the Never Miss widget.
                          </Text>
                        </BlockStack>
                      </div>

                      {/* Image Column */}
                      <div style={{
                        flex: '0 0 auto',
                        width: '280px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <img
                            src="/app_embed_section.png"
                            alt="Shopify App Embed Section - Enable Never Miss Widget"
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxWidth: '250px',
                              borderRadius: '4px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Text variant="bodySm" color="subdued" style={{ marginTop: '8px' }}>
                            Visual guide
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adding Products Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        3
                      </div>
                      <Text variant="headingMd" as="h3">
                        Adding Products
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        Open the Never Miss app and navigate to the <strong>"Coming Soon"</strong> section.
                      </Text>
                      <Text variant="bodyMd">
                        Click <strong>"Add Product"</strong> in the top-right corner.
                      </Text>
                      <Text variant="bodyMd">
                        Select the product(s) you want to mark as <strong>"Coming Soon"</strong>.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* Notify Me Button Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        4
                      </div>
                      <Text variant="headingMd" as="h3">
                        Enabling the "Notify Me" Button
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        In the product setup, check the box <strong>"Enable Notify Me"</strong>.
                      </Text>
                      <Text variant="bodyMd">
                        This will display a <strong>"Notify Me"</strong> button on the product page, allowing customers to sign up for restock alerts.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* Timer Setup Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        5
                      </div>
                      <Text variant="headingMd" as="h3">
                        Setting Up a 'Coming Soon' Timer
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        The timer section will be present at the <strong>bottom of the page</strong>.
                      </Text>
                      <Text variant="bodyMd">
                        Set the <strong>start and end time</strong> for the countdown.
                      </Text>
                      <Text variant="bodyMd">
                        The timer will <strong>automatically display</strong> on the product page during this period.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* Customization Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        6
                      </div>
                      <Text variant="headingMd" as="h3">
                        Customizing the Notify Me Form
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        Go to the <strong>"Notify Me"</strong> section in the app.
                      </Text>
                      <Text variant="bodyMd">
                        Customize the <strong>button text, form fields, and design</strong> to match your store's branding.
                      </Text>
                      <Text variant="bodyMd">
                        <strong>Save your changes</strong> — the updated version will reflect on the product page.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* Reports Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        7
                      </div>
                      <Text variant="headingMd" as="h3">
                        Viewing Reports
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        Access the <strong>Reports</strong> section to view analytics.
                      </Text>
                      <Text variant="bodyMd">
                        Here, you can see how many customers submitted their details through the Notify Me form.
                      </Text>
                    </BlockStack>
                  </div>

                  {/* Notifications Step */}
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px',
                    border: '1px solid #f59e0b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        8
                      </div>
                      <Text variant="headingMd" as="h3">
                        Restock Notifications & Emails
                      </Text>
                    </div>
                    <BlockStack gap="300">
                      <Text variant="bodyMd">
                        When products are restocked, sellers can <strong>manually contact</strong> customers who signed up for alerts.
                      </Text>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#fffbeb',
                        borderRadius: '8px',
                        border: '1px solid #fed7aa'
                      }}>
                        <Text variant="bodyMd" color="warning">
                          <strong>Note:</strong> The app does not send automated emails at this time — all notifications must be sent manually.
                        </Text>
                      </div>
                    </BlockStack>
                  </div>
                </BlockStack>

                {/* Quick Start Summary */}
                <div style={{
                  padding: '24px',
                  backgroundColor: '#ecfdf5',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0',
                  marginTop: '16px'
                }}>
                  <Text variant="headingMd" as="h3" style={{ color: '#059669', marginBottom: '12px' }}>
                    🎯 Quick Start Summary
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    Get started in 3 simple steps: 1) Install the app, 2) Enable app embed in your theme, 3) Add your first product to "Coming Soon".
                    The Notify Me functionality will automatically work once you enable it for your products.
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
                  � Getting Started
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
