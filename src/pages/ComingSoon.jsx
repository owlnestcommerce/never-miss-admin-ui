import {Page, PageActions, Card, Text, BlockStack} from '@shopify/polaris';
import React from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';
import { TitleBar } from '@shopify/app-bridge-react';

const ComingSoon = () => {
  return (
    <Page
      narrowWidth
      backAction={{content: 'Orders', url: '#'}}
      title="Add payment method"
      primaryAction={{content: 'Save', disabled: true}}
    >
      <Card>
        <BlockStack gap="200">
          <Text as="h2" variant="headingSm">
            Credit card
          </Text>
          <Text as="p" variant="bodyMd">
            Credit card information
          </Text>
        </BlockStack>
      </Card>
      <PageActions
        primaryAction={{content: 'Save', disabled: true}}
        secondaryActions={[{content: 'Delete', icon: DeleteIcon}]}
      />
    </Page>
  );
};

export default ComingSoon;
