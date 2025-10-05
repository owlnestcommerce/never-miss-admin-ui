import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, Checkbox, Text, Box, Spinner, TextField, Select, FormLayout } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { authenticatedFetch, authenticatedPut } from '../utils/api';

const NotifyMe = () => {
  const [enableNotifyMe, setEnableNotifyMe] = useState(false);
  const [isCustomButton, setIsCustomButton] = useState(false);
  const [buttonColor, setButtonColor] = useState('#0080FF');
  const [buttonText, setButtonText] = useState('Notify Me');
  const [formButtonText, setFormButtonText] = useState('Notify Me');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [buttonType, setButtonType] = useState('rounded');
  const [formHeading, setFormHeading] = useState('🔔 Notify Me When Available');
  const [formDescription, setFormDescription] = useState('Get notified when this product is back in stock.');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shopify = useAppBridge();

  const handleCheckboxChange = (checked) => {
    setEnableNotifyMe(checked);
    setHasUnsavedChanges(true);
  };

  const handleCustomButtonChange = (checked) => {
    setIsCustomButton(checked);
    setHasUnsavedChanges(true);
  };

  const handleButtonColorChange = (value) => {
    setButtonColor(value);
    setHasUnsavedChanges(true);
  };

  const handleButtonTextChange = (value) => {
    setButtonText(value);
    setHasUnsavedChanges(true);
  };

  const handleFormButtonTextChange = (value) => {
    setFormButtonText(value);
    setHasUnsavedChanges(true);
  };

  const handleTextColorChange = (value) => {
    setTextColor(value);
    setHasUnsavedChanges(true);
  };

  const handleButtonTypeChange = (value) => {
    setButtonType(value);
    setHasUnsavedChanges(true);
  };

  const handleFormHeadingChange = (value) => {
    setFormHeading(value);
    setHasUnsavedChanges(true);
  };

  const handleFormDescriptionChange = (value) => {
    setFormDescription(value);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const shopDomain = shopify.config.shop;

        const response = await authenticatedFetch(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/config/sold_out`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Configuration fetched:', result);

        setEnableNotifyMe(result.enable_notify_me || false);
        setIsCustomButton(result.button_config?.is_custom_button || false);
        setButtonColor(result.button_config?.button_color || '#0080FF');
        setButtonText(result.button_config?.button_text || 'Notify Me');
        setFormButtonText(result.form_config?.button_text || 'Notify Me'); 
        setTextColor(result.button_config?.text_color || '#FFFFFF');
        setButtonType(result.button_config?.button_type || 'rounded');
        setFormHeading(result.form_config?.heading || 'Get Notified When Available');
        setFormDescription(result.form_config?.description || 'Enter your email address and we\'ll send you a notification when this item becomes available again.');
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
        // Keep default value of false
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [shopify.config.shop, shopify]);

  const handleSave = async () => {
    try {
      // Get shop domain from app bridge
      const shopDomain = shopify.config.shop;

      const payload = {
        enable_notify_me: enableNotifyMe,
        button_config: {
          is_custom_button: isCustomButton,
          button_text: buttonText,
          button_color: buttonColor,
          button_type: buttonType,
          text_color: textColor
        },
        form_config: {
          heading: formHeading,
          description: formDescription,
          button_text: formButtonText
        }
      };

      const response = await authenticatedPut(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/config/sold_out`, payload);

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
      title="Notify Me Configuration"
      primaryAction={{
        content: 'Save',
        onAction: handleSave,
        disabled: !hasUnsavedChanges
      }}
      style={{marginBottom: '10px'}}
    >
      <Layout>
        <Layout.Section style={{ paddingBottom: '32px' }}>
          {isLoading ? (
            <Card>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <Spinner accessibilityLabel="Loading configuration" size="large" />
                <Layout.Section>
                  <Text variant="bodyMd" as="p">Loading configuration...</Text>
                </Layout.Section>
              </div>
            </Card>
          ) : (
            <>
              <Layout.Section>
                <Card sectioned style={{ marginBottom: '24px' }}>
                  <Text variant="headingMd" as="h2">Notify Me Feature</Text>
                  <Layout.Section>
                    <Checkbox
                      label="Enable the notify me feature for sold out items"
                      checked={enableNotifyMe}
                      onChange={handleCheckboxChange}
                    />
                  </Layout.Section>
                  <Layout.Section>
                    <Text variant="bodySm" color="subdued">
                      When enabled, customers will see a button allowing them to be notified when sold out items become available again.
                    </Text>
                    </Layout.Section>
                  </Card>
              </Layout.Section>

              <Layout.Section>
                <Card sectioned title="Button Configuration" subdued={!enableNotifyMe} style={{ marginBottom: '24px' }}>
                <Layout.Section>
                  <Checkbox
                    label="Show Custom Button"
                    checked={isCustomButton}
                    onChange={handleCustomButtonChange}
                    disabled={!enableNotifyMe}
                  />
                </Layout.Section>
                <Layout.Section>
                  <Text variant="bodySm" color="subdued">
                    Enable custom button styling for the notify me feature. When disabled, a default button will be used.
                  </Text>
                </Layout.Section>

                <Layout.Section>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '32px',
                    alignItems: 'start'
                  }}>
                      <div>
                        <FormLayout>
                          <Text variant="headingMd" as="h3">Button Appearance</Text>
                          <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <Text variant="bodyMd" as="p">Button Background Color:</Text>
                              <input
                                type="color"
                                value={buttonColor}
                                onChange={(e) => handleButtonColorChange(e.target.value)}
                                disabled={!enableNotifyMe || !isCustomButton}
                                style={{
                                  width: '40px',
                                  height: '28px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  cursor: (!enableNotifyMe || !isCustomButton) ? 'not-allowed' : 'pointer',
                                  opacity: (!enableNotifyMe || !isCustomButton) ? 0.5 : 1,
                                }}
                              />
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <Text variant="bodyMd" as="p">Button Text Color:</Text>
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => handleTextColorChange(e.target.value)}
                                disabled={!enableNotifyMe || !isCustomButton}
                                style={{
                                  width: '40px',
                                  height: '28px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  cursor: (!enableNotifyMe || !isCustomButton) ? 'not-allowed' : 'pointer',
                                  opacity: (!enableNotifyMe || !isCustomButton) ? 0.5 : 1,
                                }}
                              />
                            </div>
                          </div>

                          <TextField
                            label="Button Text"
                            value={buttonText}
                            onChange={handleButtonTextChange}
                            placeholder="Enter button text (e.g., Notify Me)"
                            autoComplete="off"
                            helpText="Text for the button that appears on sold out items"
                            disabled={!enableNotifyMe || !isCustomButton}
                          />

                          <Select
                            label="Button Style"
                            options={[
                              { label: 'Rounded Corners', value: 'rounded' },
                              { label: 'Sharp Corners', value: 'sharp' }
                            ]}
                            value={buttonType}
                            onChange={handleButtonTypeChange}
                            helpText="Choose the corner style for your button"
                            disabled={!enableNotifyMe || !isCustomButton}
                          />
                        </FormLayout>
                      </div>

                      <div>
                        <Text variant="headingMd" as="h3">Preview</Text>
                        <Layout.Section>
                          <Text variant="bodySm" as="p" color="subdued">
                            Live preview of your button:
                          </Text>
                        </Layout.Section>
                        <Layout.Section>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            backgroundColor: enableNotifyMe ? (isCustomButton ? '#fafbfc' : '#f8f9fa') : '#f6f6f7',
                            border: '1px dashed #cbd6e2',
                            borderRadius: '8px',
                            minHeight: '120px',
                            opacity: (enableNotifyMe && isCustomButton) ? 1 : 0.5
                          }}>
                            <button
                              style={{
                                backgroundColor: buttonColor,
                                color: textColor,
                                border: 'none',
                                borderRadius: buttonType === 'rounded' ? '8px' : '0',
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: (enableNotifyMe && isCustomButton) ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                minWidth: '140px',
                                opacity: isCustomButton ? 1 : 0.7
                              }}
                              disabled={!enableNotifyMe || !isCustomButton}
                              onMouseEnter={(e) => {
                                if (enableNotifyMe && isCustomButton) {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (enableNotifyMe && isCustomButton) {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }
                              }}
                            >
                              {buttonText || 'Default Button'}
                            </button>
                          </div>
                          {!isCustomButton && (
                            <Layout.Section textAlign="center">
                              <Text variant="bodySm" color="subdued">
                                Using default button styling
                              </Text>
                            </Layout.Section>
                          )}
                        </Layout.Section>
                      </div>
                    </div>
                  </Layout.Section>
                </Card>
              </Layout.Section>

              <Layout.Section style={{ marginBottom: '32px' }}>
                <Card sectioned title="Notify Me Form Configuration" subdued={!enableNotifyMe}>
                <FormLayout>
                  <Text variant="headingMd" as="h3">Form Settings</Text>
                  <Layout.Section>
                    <TextField
                      label="Form Heading"
                      value={formHeading}
                      onChange={handleFormHeadingChange}
                      placeholder="Enter form heading (e.g., Get Notified)"
                      helpText="The heading displayed at the top of the notification form"
                      disabled={!enableNotifyMe}
                    />
                    <TextField
                      label="Form Description"
                      value={formDescription}
                      onChange={handleFormDescriptionChange}
                      placeholder="Enter form description"
                      multiline={3}
                      helpText="The description text below the heading explaining the form"
                      disabled={!enableNotifyMe}
                    />
                    <TextField
                      label="Submit Button Text"
                      value={formButtonText}
                      onChange={handleFormButtonTextChange}
                      placeholder="Enter button text (e.g., Notify Me, Subscribe)"
                      helpText="Text for the form submit button"
                      disabled={!enableNotifyMe}
                    />
                  </Layout.Section>
                </FormLayout>
                </Card>
              </Layout.Section>
            </>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default NotifyMe;
