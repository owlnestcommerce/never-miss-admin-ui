import {Page, Card, Text, BlockStack, Box, Button, Banner, List, Checkbox} from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { authenticatedPut } from '../utils/api';

const ComingSoonSettings = () => {
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();

  // Get shop domain from Shopify context
  const shopDomain = shopify.config.shop || '';

  // Get product data from navigation state
  const productTitle = location.state?.productTitle || location.state?.existingConfig?.product_title || 'Unknown Product';
  const productImage = location.state?.productImage || location.state?.existingConfig?.product_image_url || '';
  const existingConfig = location.state?.existingConfig;

  // Debug logging for image display
  console.log('Settings Page - Product Image:', productImage || 'None');
  console.log('Settings Page - Existing Config:', existingConfig);

  // State for form - prefill with existing config if available
  const [startDate, setStartDate] = useState(existingConfig?.start_date ? new Date(existingConfig.start_date) : null);
  const [startTime, setStartTime] = useState(existingConfig?.start_time || '');
  const [endDate, setEndDate] = useState(existingConfig?.end_date ? new Date(existingConfig.end_date) : null);
  const [endTime, setEndTime] = useState(existingConfig?.end_time || '');
  const [enableNotifyMe, setEnableNotifyMe] = useState(existingConfig?.enable_notify_me || false);
  const [isSaving, setIsSaving] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerContent, setBannerContent] = useState({ title: '', description: '', status: 'success' });

  const handleStartDateChange = useCallback((date) => {
    setStartDate(date);
  }, []);

  const handleStartTimeChange = useCallback((value) => {
    setStartTime(value);
  }, []);

  const handleEndDateChange = useCallback((date) => {
    setEndDate(date);
  }, []);

  const handleEndTimeChange = useCallback((value) => {
    setEndTime(value);
  }, []);

  const validateForm = () => {
    if (!startDate || !startTime) {
      setBannerContent({
        title: 'Start Date & Time Required',
        description: 'Please set both start date and time for the coming soon timer.',
        status: 'critical'
      });
      setShowBanner(true);
      return false;
    }

    if (!endDate || !endTime) {
      setBannerContent({
        title: 'End Date & Time Required',
        description: 'Please set both end date and time for the coming soon timer.',
        status: 'critical'
      });
      setShowBanner(true);
      return false;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setBannerContent({
        title: 'Invalid Time Range',
        description: 'End date and time must be after start date and time.',
        status: 'critical'
      });
      setShowBanner(true);
      return false;
    }

    return true;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Compute timestamps from date and time
      const startTimestamp = new Date(`${startDate.toISOString().split('T')[0]}T${startTime}`).toISOString();
      const endTimestamp = new Date(`${endDate.toISOString().split('T')[0]}T${endTime}`).toISOString();

      const requestBody = {
        start_date: startDate.toISOString().split('T')[0],
        start_time: startTime,
        end_date: endDate.toISOString().split('T')[0],
        end_time: endTime,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        product_title: productTitle,
        product_image_url: productImage,
        enable_notify_me: enableNotifyMe
      };

      console.log('API Call:', {
        url: `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/config/coming_soon/${productId}`,
        method: 'PUT',
        shopDomain,
        productId,
        requestBody
      });

      // Make authenticated API call to save coming soon settings
      const response = await authenticatedPut(shopify, `https://api.owlnestlabs.com/api/v1/never-miss/shopify/${shopDomain}/config/coming_soon/${productId}`, {
        start_date: startDate.toISOString().split('T')[0],
        start_time: startTime,
        end_date: endDate.toISOString().split('T')[0],
        end_time: endTime,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        product_title: productTitle,
        product_image_url: productImage,
        enable_notify_me: enableNotifyMe
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setBannerContent({
        title: 'Settings Saved Successfully',
        description: `Coming soon settings have been configured for "${productTitle}".`,
        status: 'success'
      });
      setShowBanner(true);

      // Reset form after successful save
      setTimeout(() => {
        setStartDate(null);
        setStartTime('');
        setEndDate(null);
        setEndTime('');
        setShowBanner(false);
      }, 3000);

    } catch (error) {
      setBannerContent({
        title: 'Save Failed',
        description: 'There was an error saving the coming soon settings. Please try again.',
        status: 'critical'
      });
      setShowBanner(true);
    } finally {
      setIsSaving(false);
    }
  }, [productTitle, startDate, startTime, endDate, endTime, enableNotifyMe, shopDomain, productId, shopify]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  return (
      <Page
        title="Coming Soon Settings"
        subtitle={`Configure settings for "${productTitle}"`}
        backAction={{ content: 'Coming Soon', url: '/coming-soon' }}
        primaryAction={{
          content: isSaving ? 'Saving...' : 'Save',
          onAction: handleSave,
          loading: isSaving,
          disabled: !(startDate && startTime && endDate && endTime)
        }}
      >
        <BlockStack gap="500">
        {showBanner && (
          <Banner
            title={bannerContent.title}
            status={bannerContent.status}
            onDismiss={dismissBanner}
          >
            <p>{bannerContent.description}</p>
          </Banner>
        )}

        {/* Product Information Card */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Product Information
            </Text>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}>
              <img
                src={productImage || 'https://via.placeholder.com/80x80?text=No+Image'}
                alt={productTitle}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9'
                }}
              />
              <div>
                <Text variant="headingLg" as="h3">
                  {productTitle}
                </Text>
                <Text variant="bodyMd" color="subdued">
                  Product ID: {productId}
                </Text>
              </div>
            </div>
          </BlockStack>
        </Card>

        {/* Notify Me Feature Card */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Notify Me Feature
            </Text>
            <Checkbox
              label="Enable Notify Me"
              helpText="Allow customers to sign up for notifications when the product becomes available"
              checked={enableNotifyMe}
              onChange={setEnableNotifyMe}
            />
          </BlockStack>
        </Card>

        {/* Timer Settings and Preview Card */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Coming Soon Timer Settings
            </Text>

            {/* Main Configuration Section */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-around' }}>
              {/* Left Side - Configuration */}
              <div>
                <BlockStack gap="300">
                  <Box>
                    <Text as="h3" variant="headingSm" color="subdued">
                      Start Date & Time
                    </Text>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="date"
                        value={startDate ? startDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleStartDateChange(new Date(e.target.value))}
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '140px'
                        }}
                      />
                      <select
                        value={startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '140px'
                        }}
                      >
                        <option value="">Select start time...</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="01:00">1:00 AM</option>
                        <option value="02:00">2:00 AM</option>
                        <option value="03:00">3:00 AM</option>
                        <option value="04:00">4:00 AM</option>
                        <option value="05:00">5:00 AM</option>
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="23:00">11:00 PM</option>
                      </select>
                    </div>
                  </Box>

                  <Box>
                    <Text as="h3" variant="headingSm" color="subdued">
                      End Date & Time
                    </Text>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="date"
                        value={endDate ? endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleEndDateChange(new Date(e.target.value))}
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '140px'
                        }}
                      />
                      <select
                        value={endTime}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                          width: '140px'
                        }}
                      >
                        <option value="">Select end time...</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="01:00">1:00 AM</option>
                        <option value="02:00">2:00 AM</option>
                        <option value="03:00">3:00 AM</option>
                        <option value="04:00">4:00 AM</option>
                        <option value="05:00">5:00 AM</option>
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="23:00">11:00 PM</option>
                      </select>
                    </div>
                  </Box>
                </BlockStack>
              </div>

              {/* Right Side - Preview (Always Visible) */}
              <div style={{ flex: 1, marginLeft: '20px'}}>
                <Text as="h3" variant="headingSm" color="subdued">
                  Preview
                </Text>
                <Card background="surface-neutral">
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      <strong>Product:</strong> {productTitle}
                    </Text>
                    <Text as="p" variant="bodyMd">
                      <strong>Notify Me:</strong> {enableNotifyMe ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Text as="p" variant="bodyMd">
                      <strong>Coming Soon Period:</strong>
                    </Text>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {startDate && startTime && endDate && endTime ? (
                        <div>
                          <div>Start: {startDate.toLocaleDateString()} at {startTime}</div>
                          <div>End: {endDate.toLocaleDateString()} at {endTime}</div>
                        </div>
                      ) : (
                        <div style={{ fontStyle: 'italic', color: '#9ca3af' }}>
                          Configure dates and times to see preview
                        </div>
                      )}
                    </div>
                  </BlockStack>
                </Card>
              </div>
            </div>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
};

export default ComingSoonSettings;
