---
name: i-payout Full API Integration Guide
overview: Comprehensive guide for integrating i-payout API for ACH/bank transfers, beneficiary management, and payout processing in BDN 2.0
todos:
  - id: implement-api-authentication
    content: Implement API token authentication with i-payout
    status: pending
  - id: implement-beneficiary-management
    content: Create beneficiary management service (create, retrieve, update)
    status: pending
  - id: implement-transfer-methods
    content: Implement transfer method management (bank accounts, credit cards, wire profiles)
    status: pending
  - id: implement-transfers
    content: Implement transfer creation, approval, and status tracking
    status: pending
  - id: implement-webhooks
    content: Set up webhook handling for transfer status updates and events
    status: pending
  - id: implement-error-handling
    content: Implement comprehensive error handling and retry logic
    status: pending
---

# i-payout Full API Integration Guide

## Overview

This document provides comprehensive guidance for integrating i-payout's Full API Integration for ACH/bank transfers, beneficiary management, and payout processing in BDN 2.0.

**API Base URL:**
- **Production**: `https://merchantapi.ewallet.com/api/v1`
- **Test/Sandbox**: `https://merchantapi.testewallet.com/api/v1`

**Key Features:**
- Beneficiary management (create, retrieve, update)
- Transfer method management (bank accounts, credit cards, wire profiles)
- Transfer execution (ACH, Same-day ACH, Realtime ACH, International Bank, Swift Wire, Push to Card)
- Webhook notifications for real-time event updates
- Auto-approval and manual approval workflows

## Architecture Overview

```
BDN Application
    ↓
i-payout API Client (server/src/integrations/ipayouts.ts)
    ↓
i-payout API (merchantapi.ewallet.com)
    ↓
Payment Processing & Settlement
```

**Critical Security Principle:**
- All bank account and payment data is managed EXCLUSIVELY by i-payout
- BDN only stores tokenized references (`beneficiaryToken`, `transferMethodToken`, `transferToken`)
- Never store full account numbers, routing numbers, or sensitive payment data

## Step 1: API Authentication

### Obtaining an API Token

**Endpoint:** `POST /api/v1/auth/token`

**Request Headers:**
```
Authorization: Basic <base64(merchantId:merchantSecret)>
Content-Type: application/json
```

**Request Body:**
```json
{
  "merchantId": "<YOUR_MERCHANT_ID>",
  "merchantSecret": "<YOUR_MERCHANT_SECRET>"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "isSuccess": true,
  "statusCode": 200
}
```

### Using the API Token

All subsequent API requests require:
```
Authorization: Bearer <YOUR_API_TOKEN>
X-MerchantId: <YOUR_MERCHANT_ID>
```

**Token Management:**
- Tokens expire after the `expiresIn` period (typically 3600 seconds)
- Implement token refresh logic before expiration
- Store tokens securely (environment variables, secure storage)
- Never expose tokens in client-side code

## Step 2: Beneficiary Management

### Create Beneficiary

**Endpoint:** `POST /api/v1/beneficiaries`

**Purpose:** Create a new beneficiary (individual or business) who can receive payouts.

**Request:**
```typescript
POST /api/v1/beneficiaries
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
  Content-Type: application/json

Body:
{
  "username": "john_doe",           // Unique identifier for beneficiary
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",  // Optional
  "phone": "+1234567890",           // Optional
  "dateOfBirth": "1990-01-01",      // Optional, format: YYYY-MM-DD
  "country": "US",                  // ISO country code
  "address1": "123 Main St",        // Optional
  "city": "Los Angeles",            // Optional
  "state": "CA",                    // Optional
  "zipCode": "90001"                // Optional
}
```

**Response:**
```json
{
  "data": {
    "beneficiaryToken": "e0e4764b-9619-4deb-95c4-108ce9f0fe04"
  },
  "isSuccess": true,
  "message": "Customer created successfully",
  "statusCode": 0,
  "logIdentifier": "497b73624c0d47bfb0abf58df5dd99ca"
}
```

**Implementation Notes:**
- Store `beneficiaryToken` in BDN database (link to user account)
- `beneficiaryToken` is used for all subsequent operations with this beneficiary
- Username must be unique per merchant
- Minimum required fields: `username`, `firstName`, `lastName`

### Retrieve Beneficiary

**Endpoint:** `GET /api/v1/beneficiaries/{beneficiaryToken}`

**Purpose:** Retrieve beneficiary details and status.

**Request:**
```typescript
GET /api/v1/beneficiaries/{beneficiaryToken}
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
```

**Response:**
```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": {
    "beneficiaryToken": "e0e4764b-9619-4deb-95c4-108ce9f0fe04",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "active",
    "dateCreated": "2024-07-20T10:00:00.000Z",
    "dateUpdated": "2024-07-20T10:00:00.000Z"
  }
}
```

### Update Beneficiary

**Endpoint:** `PUT /api/v1/beneficiaries/{beneficiaryToken}`

**Purpose:** Update beneficiary information.

**Request:**
```typescript
PUT /api/v1/beneficiaries/{beneficiaryToken}
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
  Content-Type: application/json

Body:
{
  "email": "newemail@example.com",
  "phone": "+1987654321",
  "address1": "456 New St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102"
}
```

## Step 3: Transfer Method Management

### Add Bank Account Transfer Method

**Endpoint:** `POST /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/bank-accounts`

**Purpose:** Add a bank account as a transfer method for a beneficiary.

**Request:**
```typescript
POST /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/bank-accounts
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
  Content-Type: application/json

Body:
{
  "beneficiaryToken": "<beneficiaryToken>",
  "accountHolderName": "John Doe",
  "accountNickName": "John Personal Account",  // Display name for user
  "accountCurrency": "USD",
  "accountNumber": "123456789",
  "accountType1": "personal",                   // "personal" or "business"
  "accountType2": "checking",                   // "checking" or "savings"
  "bankName": "Bank of America",
  "bankCountry": "US",
  "routingNumber": "987654321",
  "branchAddress": "1234 Bank Street, Suite 567",
  "beneficiaryFirstName": "John",
  "beneficiaryLastName": "Doe",
  "beneficiaryCountry": "US",
  "beneficiaryAddress1": "1234 Elm St",
  "beneficiaryState": "CA",
  "beneficiaryCity": "Los Angeles",
  "beneficiaryZipCode": "90001"
}
```

**Response:**
```json
{
  "isSuccess": true,
  "message": "Bank account added successfully",
  "statusCode": 200,
  "logIdentifier": "def456ghi789",
  "token": "bankAcc123Token",
  "dateCreated": "2024-07-20T10:00:00.000Z",
  "dateUpdated": "2024-07-20T10:00:00.000Z"
}
```

**Security Notes:**
- ⚠️ **CRITICAL**: Bank account data (accountNumber, routingNumber) is sent directly to i-payout
- BDN should NEVER store full account numbers or routing numbers
- Store only the `token` returned in the response
- Store display information: `accountNickName`, `bankName`, `accountType2`, last 4 digits (if provided)

### Retrieve Bank Account

**Endpoint:** `GET /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/bank-accounts/{bankAccountToken}`

**Purpose:** Retrieve bank account details (masked for security).

**Request:**
```typescript
GET /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/bank-accounts/{bankAccountToken}
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
```

**Response:**
```json
{
  "isSuccess": true,
  "message": "Bank account retrieved successfully",
  "statusCode": 200,
  "logIdentifier": "ghi789jkl012",
  "data": {
    "accountHolderName": "John Doe",
    "accountNumber": "****6789",              // Masked
    "bankName": "Bank of the World",
    "routingNumber": "****4321",              // Masked
    "countryCode": "US",
    "currencyCode": "USD",
    "token": "bankAcc123Token",
    "accountType1": "personal",
    "accountType2": "checking",
    "status": "active"
  }
}
```

### List Bank Accounts

**Endpoint:** `GET /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/bank-accounts`

**Purpose:** List all bank accounts for a beneficiary.

**Response:**
```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": [
    {
      "token": "bankAcc123Token",
      "accountNickName": "John Personal Account",
      "bankName": "Bank of America",
      "accountType2": "checking",
      "accountNumber": "****6789",
      "status": "active"
    }
  ]
}
```

### Add Credit Card Transfer Method

**Endpoint:** `POST /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/credit-cards`

**Purpose:** Add a credit card as a transfer method (for Push to Card).

**Note:** Credit card data should be tokenized using i-payout's secure tokenization (if available) or PCI-compliant methods.

### Add Wire Profile Transfer Method

**Endpoint:** `POST /api/v1/transfermethods/beneficiaries/{beneficiaryToken}/wire-profiles`

**Purpose:** Add international wire transfer details.

## Step 4: Transfer Funds

### Create Transfer

**Endpoint:** `POST /api/v1/transfers`

**Purpose:** Create a transfer/payout to a beneficiary.

**Request:**
```typescript
POST /api/v1/transfers
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
  Content-Type: application/json

Body:
{
  "merchantTransactionId": "TX123456",              // Unique BDN transaction ID
  "beneficiaryToken": "<beneficiaryToken>",
  "autoApprove": true,                              // true = auto-approve, false = manual approval
  "comments": "Payment for services",               // Optional
  "dateExpire": "2024-12-31T23:59:59.999Z",        // Optional expiration
  "destinationAmount": 100.00,                      // Amount to send
  "destinationCurrency": "USD",
  "destinationType": "RegularACH",                 // Transfer type (see below)
  "bankAccount": {                                  // Bank account details (if not using existing token)
    "accountNickName": "John Personal Account",
    "accountCurrency": "USD",
    "accountNumber": "123456789",
    "accountType1": "personal",
    "accountType2": "checking",
    "bankName": "Bank of America",
    "bankCountry": "US",
    "routingNumber": "987654321",
    "branchAddress": "1234 Bank Street, Suite 567",
    "beneficiaryCountry": "US",
    "beneficiaryAddress1": "1234 Elm St",
    "beneficiaryState": "CA",
    "beneficiaryCity": "Los Angeles",
    "beneficiaryZipCode": "90001"
  }
  // OR use existing transfer method:
  // "destinationToken": "<bankAccountToken>"
}
```

**Transfer Types (`destinationType`):**
- `RegularACH` - Standard ACH (2-3 business days)
- `SameDayACH` - Same-day ACH (same business day)
- `RealtimeACH` - Real-time ACH (instant)
- `InternationalBank` - International bank transfer
- `SwiftWire` - SWIFT wire transfer
- `PushToCard` - Push to credit/debit card
- `eWallet` - Transfer to i-payout eWallet

**Response:**
```json
{
  "isSuccess": true,
  "message": "Transfer created successfully",
  "statusCode": 200,
  "logIdentifier": "abc123def456",
  "token": "trans789token",                        // Transfer token for tracking
  "dateCreated": "2024-07-09T16:17:00.548Z",
  "dateUpdated": "2024-07-09T16:17:00.548Z",
  "statusId": 1,                                   // Status: 1=Pending, 2=Approved, 3=Completed, etc.
  "fxRate": 1.05,                                  // Exchange rate (if applicable)
  "customerFee": 2.50,                             // Fee charged to customer
  "merchantFee": 1.00                              // Fee charged to merchant
}
```

**Implementation Notes:**
- Store `token` and `merchantTransactionId` in BDN database for tracking
- Link transfer to BDN transaction record
- If `autoApprove: false`, use Approve Transfer endpoint to approve
- Monitor status via webhooks or polling

### Approve Transfer

**Endpoint:** `POST /api/v1/transfers/{transferToken}/approve`

**Purpose:** Manually approve a transfer (when `autoApprove: false`).

**Request:**
```typescript
POST /api/v1/transfers/{transferToken}/approve
Headers:
  Authorization: Bearer <API_TOKEN>
  X-MerchantId: <MERCHANT_ID>
```

**Response:**
```json
{
  "isSuccess": true,
  "message": "Transfer approved successfully",
  "statusCode": 200,
  "token": "trans789token",
  "statusId": 2
}
```

### Get Transfer Status

**Endpoint:** `GET /api/v1/transfers/{transferToken}`

**Purpose:** Retrieve transfer status and details.

**Response:**
```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": {
    "token": "trans789token",
    "merchantTransactionId": "TX123456",
    "statusId": 3,                                 // 1=Pending, 2=Approved, 3=Completed, 4=Failed, etc.
    "status": "Completed",
    "destinationAmount": 100.00,
    "destinationCurrency": "USD",
    "customerFee": 2.50,
    "merchantFee": 1.00,
    "dateCreated": "2024-07-09T16:17:00.548Z",
    "dateCompleted": "2024-07-09T16:20:00.000Z"
  }
}
```

### Cancel Transfer

**Endpoint:** `POST /api/v1/transfers/{transferToken}/cancel`

**Purpose:** Cancel a pending transfer.

## Step 5: Webhooks

### Webhook Setup

**Purpose:** Receive real-time notifications about transfer status changes and other events.

**Webhook Events:**
- `transfer.created` - Transfer created
- `transfer.approved` - Transfer approved
- `transfer.completed` - Transfer completed
- `transfer.failed` - Transfer failed
- `transfer.cancelled` - Transfer cancelled
- `beneficiary.created` - Beneficiary created
- `beneficiary.updated` - Beneficiary updated
- `transfermethod.added` - Transfer method added
- `transfermethod.verified` - Transfer method verified

### Webhook Security

**Verification:**
- i-payout signs webhook payloads with HMAC-SHA256
- Verify signature using webhook secret
- Reject requests with invalid signatures

**Webhook Endpoint Implementation:**

```typescript
// server/src/api/webhooks/ipayouts.ts
import crypto from 'crypto';

export async function handleIPayoutWebhook(req: Request, res: Response) {
  const signature = req.headers['x-ipayout-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.IPAYOUTS_WEBHOOK_SECRET;
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  
  // Process event
  switch (event.type) {
    case 'transfer.completed':
      await handleTransferCompleted(event.data);
      break;
    case 'transfer.failed':
      await handleTransferFailed(event.data);
      break;
    // ... other event types
  }
  
  res.status(200).json({ received: true });
}
```

### Webhook Payload Example

```json
{
  "type": "transfer.completed",
  "data": {
    "token": "trans789token",
    "merchantTransactionId": "TX123456",
    "statusId": 3,
    "status": "Completed",
    "destinationAmount": 100.00,
    "destinationCurrency": "USD",
    "dateCompleted": "2024-07-09T16:20:00.000Z"
  },
  "timestamp": "2024-07-09T16:20:00.000Z"
}
```

## Implementation Guide

### File Structure

```
server/src/integrations/
  └── ipayouts.ts                    # Main i-payout API client

server/src/api/
  ├── beneficiaries/
  │   ├── beneficiaries.controller.ts
  │   ├── beneficiaries.routes.ts
  │   └── beneficiaries.service.ts
  ├── transfers/
  │   ├── transfers.controller.ts
  │   ├── transfers.routes.ts
  │   └── transfers.service.ts
  └── webhooks/
      └── ipayouts.ts                # Webhook handler
```

### i-payout Client Implementation

```typescript
// server/src/integrations/ipayouts.ts

interface IPayoutConfig {
  apiKey: string;
  merchantId: string;
  baseUrl: string; // https://merchantapi.testewallet.com/api/v1 or production
  webhookSecret: string;
}

class IPayoutClient {
  private config: IPayoutConfig;
  private token: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(config: IPayoutConfig) {
    this.config = config;
  }

  /**
   * Get or refresh API token
   */
  private async getToken(): Promise<string> {
    if (this.token && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.token;
    }

    const response = await fetch(`${this.config.baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.config.merchantId}:${this.config.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId: this.config.merchantId,
        merchantSecret: this.config.apiKey,
      }),
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(`Failed to get token: ${data.message}`);
    }

    this.token = data.data.token;
    const expiresIn = data.data.expiresIn || 3600;
    this.tokenExpiresAt = new Date(Date.now() + (expiresIn - 60) * 1000); // Refresh 60s early

    return this.token;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const token = await this.getToken();
    const url = `${this.config.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-MerchantId': this.config.merchantId,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!data.isSuccess) {
      throw new Error(`i-payout API error: ${data.message} (${data.statusCode})`);
    }

    return data;
  }

  /**
   * Create beneficiary
   */
  async createBeneficiary(params: {
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    country: string;
    address1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }): Promise<{ beneficiaryToken: string }> {
    const response = await this.request<{ data: { beneficiaryToken: string } }>(
      'POST',
      '/beneficiaries',
      params
    );
    return response.data;
  }

  /**
   * Get beneficiary
   */
  async getBeneficiary(beneficiaryToken: string): Promise<any> {
    return this.request('GET', `/beneficiaries/${beneficiaryToken}`);
  }

  /**
   * Add bank account transfer method
   */
  async addBankAccount(
    beneficiaryToken: string,
    bankAccount: {
      accountHolderName: string;
      accountNickName: string;
      accountCurrency: string;
      accountNumber: string;
      accountType1: 'personal' | 'business';
      accountType2: 'checking' | 'savings';
      bankName: string;
      bankCountry: string;
      routingNumber: string;
      branchAddress?: string;
      beneficiaryFirstName: string;
      beneficiaryLastName: string;
      beneficiaryCountry: string;
      beneficiaryAddress1: string;
      beneficiaryState?: string;
      beneficiaryCity?: string;
      beneficiaryZipCode?: string;
    }
  ): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>(
      'POST',
      `/transfermethods/beneficiaries/${beneficiaryToken}/bank-accounts`,
      {
        beneficiaryToken,
        ...bankAccount,
      }
    );
    return { token: response.token };
  }

  /**
   * Get bank account
   */
  async getBankAccount(
    beneficiaryToken: string,
    bankAccountToken: string
  ): Promise<any> {
    return this.request(
      'GET',
      `/transfermethods/beneficiaries/${beneficiaryToken}/bank-accounts/${bankAccountToken}`
    );
  }

  /**
   * List bank accounts for beneficiary
   */
  async listBankAccounts(beneficiaryToken: string): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(
      'GET',
      `/transfermethods/beneficiaries/${beneficiaryToken}/bank-accounts`
    );
    return response.data || [];
  }

  /**
   * Create transfer
   */
  async createTransfer(params: {
    merchantTransactionId: string;
    beneficiaryToken: string;
    autoApprove?: boolean;
    comments?: string;
    dateExpire?: string;
    destinationAmount: number;
    destinationCurrency: string;
    destinationType: string;
    destinationToken?: string; // Use existing transfer method
    bankAccount?: any; // Or provide bank account details
  }): Promise<{
    token: string;
    statusId: number;
    customerFee: number;
    merchantFee: number;
    fxRate?: number;
  }> {
    const response = await this.request<{
      token: string;
      statusId: number;
      customerFee: number;
      merchantFee: number;
      fxRate?: number;
    }>('POST', '/transfers', params);
    return response;
  }

  /**
   * Approve transfer
   */
  async approveTransfer(transferToken: string): Promise<void> {
    await this.request('POST', `/transfers/${transferToken}/approve`);
  }

  /**
   * Get transfer status
   */
  async getTransfer(transferToken: string): Promise<any> {
    return this.request('GET', `/transfers/${transferToken}`);
  }

  /**
   * Cancel transfer
   */
  async cancelTransfer(transferToken: string): Promise<void> {
    await this.request('POST', `/transfers/${transferToken}/cancel`);
  }
}

export default IPayoutClient;
```

## Error Handling

### Common Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

### Retry Logic

Implement exponential backoff for transient errors:

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.statusCode === 429 || error.statusCode >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Environment Variables

```bash
# i-payout Configuration
IPAYOUTS_API_KEY=<your_api_key>
IPAYOUTS_MERCHANT_ID=<your_merchant_id>
IPAYOUTS_BASE_URL=https://merchantapi.testewallet.com/api/v1  # Test
# IPAYOUTS_BASE_URL=https://merchantapi.ewallet.com/api/v1    # Production
IPAYOUTS_WEBHOOK_SECRET=<webhook_secret>
```

## Database Schema Updates

### Beneficiary Table

```prisma
model Beneficiary {
  id                String   @id @default(uuid())
  userId            String   @unique
  beneficiaryToken String   @unique // i-payout beneficiary token
  username          String   // i-payout username
  firstName         String
  lastName          String
  email             String?
  phone             String?
  country           String
  status            String   @default("active")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  transferMethods   TransferMethod[]
  transfers         Transfer[]

  @@index([userId])
  @@index([beneficiaryToken])
}
```

### Transfer Method Table

```prisma
model TransferMethod {
  id                String   @id @default(uuid())
  beneficiaryId     String
  beneficiary       Beneficiary @relation(fields: [beneficiaryId], references: [id])
  
  // PCI COMPLIANCE: Only store tokenized reference from i-payout
  transferMethodToken String  @unique // Token from i-payout
  type              String   // "bank_account", "credit_card", "wire_profile"
  
  // Display-only information (safe to store)
  displayName       String?  // accountNickName
  bankName          String?
  accountType       String?  // "checking", "savings"
  last4             String?  // Last 4 digits of account
  
  // NEVER STORE: Full account numbers, routing numbers, card numbers
  
  isDefault         Boolean  @default(false)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  transfers         Transfer[]

  @@index([beneficiaryId, isActive])
}
```

### Transfer Table

```prisma
model Transfer {
  id                    String   @id @default(uuid())
  merchantTransactionId String   @unique // BDN transaction ID
  transferToken         String   @unique // i-payout transfer token
  
  beneficiaryId         String
  beneficiary           Beneficiary @relation(fields: [beneficiaryId], references: [id])
  
  transferMethodId      String?
  transferMethod        TransferMethod? @relation(fields: [transferMethodId], references: [id])
  
  amount                Decimal
  currency              String   @default("USD")
  transferType          String   // "RegularACH", "SameDayACH", etc.
  
  statusId              Int      // i-payout status ID
  status                String   // "Pending", "Approved", "Completed", "Failed"
  
  customerFee           Decimal?
  merchantFee           Decimal?
  fxRate                Decimal?
  
  autoApproved          Boolean  @default(false)
  comments              String?
  
  dateCreated           DateTime @default(now())
  dateUpdated           DateTime @updatedAt
  dateCompleted         DateTime?
  dateExpire            DateTime?

  @@index([beneficiaryId])
  @@index([transferToken])
  @@index([merchantTransactionId])
  @@index([statusId])
}
```

## Integration Checklist

- [ ] Set up i-payout merchant account
- [ ] Obtain API credentials (API key, Merchant ID)
- [ ] Configure webhook endpoint and secret
- [ ] Implement API client (`server/src/integrations/ipayouts.ts`)
- [ ] Implement beneficiary management endpoints
- [ ] Implement transfer method management endpoints
- [ ] Implement transfer creation and management endpoints
- [ ] Implement webhook handler
- [ ] Add database models (Beneficiary, TransferMethod, Transfer)
- [ ] Add error handling and retry logic
- [ ] Add logging and monitoring
- [ ] Test in sandbox environment
- [ ] Set up production credentials
- [ ] Deploy and monitor

## Use Cases in BDN 2.0

### 1. User Cash-Out (BLKD → USD)

**Flow:**
1. User requests cash-out (BLKD → USD, 5% fee)
2. Create/retrieve beneficiary for user
3. Create/retrieve bank account transfer method
4. Create transfer via i-payout
5. Update BLKD wallet balance
6. Monitor transfer status via webhook

### 2. Business Payout (Hub Wallet → Business Bank)

**Flow:**
1. Business requests payout from Hub Wallet
2. Create/retrieve beneficiary for business
3. Create/retrieve bank account transfer method
4. Create transfer from Hub Wallet balance
5. Update Hub Wallet balance
6. Monitor transfer status via webhook

### 3. Ecom Payments Settlement (Ecom → Hub Wallet)

**Flow:**
1. Ecom Payments batch settlement ready
2. Create transfer from Ecom Payments account to Hub Wallet
3. Update Hub Wallet balance
4. Monitor transfer status via webhook

## Testing

### Sandbox Environment

- Use test API URL: `https://merchantapi.testewallet.com/api/v1`
- Test credentials provided by i-payout
- Test webhook endpoints locally using ngrok or similar

### Test Scenarios

1. **Create Beneficiary** - Verify beneficiary creation and token storage
2. **Add Bank Account** - Verify bank account addition and tokenization
3. **Create Transfer** - Verify transfer creation with auto-approval
4. **Manual Approval** - Verify manual approval workflow
5. **Webhook Processing** - Verify webhook signature validation and event handling
6. **Error Handling** - Test error scenarios (invalid account, insufficient funds, etc.)
7. **Retry Logic** - Test retry behavior for transient errors

## Security Best Practices

1. **Never store sensitive data** - Only store tokenized references
2. **Validate webhook signatures** - Always verify HMAC signatures
3. **Use HTTPS** - All API calls must use HTTPS
4. **Secure credential storage** - Store API keys in environment variables
5. **Token refresh** - Implement automatic token refresh before expiration
6. **Rate limiting** - Implement rate limiting to avoid exceeding API limits
7. **Logging** - Log all API calls but never log sensitive data
8. **Error messages** - Don't expose sensitive information in error messages

## References

- [i-payout API Documentation](https://developer.i-payout.com/docs/api-integration)
- [i-payout API Reference](https://developer.i-payout.com/reference)
- [Webhook Security Guide](https://developer.i-payout.com/docs/webhook-security)
