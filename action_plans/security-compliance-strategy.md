---
name: Security & Compliance Strategy - Database Security, PCI DSS, and Legal Compliance
overview: Comprehensive security and compliance strategy ensuring database security, PCI DSS compliance for payment processing, and legal/financial compliance requirements. Includes encryption, access controls, audit logging, monitoring, and compliance reporting.
todos:
  - id: setup-database-encryption
    content: Configure database encryption at rest (PostgreSQL Cloud SQL, Firestore)
    status: pending
  - id: create-encryption-service
    content: Create encryption service for application-level encryption of sensitive fields
    status: pending
  - id: implement-pci-validation
    content: Create PCI validation middleware to prevent card/bank data in requests/logs (reject requests with payment data, ensure data goes to processors)
    status: pending
  - id: implement-processor-integration
    content: Ensure iPayOuts/EcomPayments integrations handle all card/bank data - BDN only receives tokens
    status: pending
  - id: setup-database-rls
    content: Implement Row-Level Security (RLS) policies in PostgreSQL
    status: pending
  - id: update-firestore-rules
    content: Enhance Firestore security rules with stricter access controls
    status: pending
  - id: create-audit-logging
    content: Implement comprehensive audit logging service for all sensitive data access
    status: pending
  - id: add-audit-models
    content: Add AuditLog and SensitiveDataAccess models to Prisma schema
    status: pending
  - id: implement-gdpr-export
    content: Create GDPR data export API endpoint for user data requests
    status: pending
  - id: implement-gdpr-deletion
    content: Create GDPR data deletion API endpoint with anonymization
    status: pending
  - id: create-consent-management
    content: Implement consent management system for GDPR/CCPA compliance
    status: pending
  - id: implement-aml-monitoring
    content: Create AML transaction monitoring service for financial compliance
    status: pending
  - id: create-kyc-system
    content: Implement KYC verification system for financial regulations
    status: pending
  - id: setup-security-monitoring
    content: Create security monitoring service for intrusion detection and anomaly detection
    status: pending
  - id: create-incident-response
    content: Document incident response procedures and create incident logging system
    status: pending
  - id: create-compliance-dashboard
    content: Build admin compliance dashboard showing PCI, GDPR, and security status
    status: pending
    dependencies:
      - create-audit-logging
      - setup-security-monitoring
  - id: setup-security-scanning
    content: Configure automated security scanning in CI/CD (OWASP ZAP, Snyk, SonarQube)
    status: pending
  - id: write-security-tests
    content: Write security test suite for PCI compliance, access control, and encryption
    status: pending
    dependencies:
      - implement-pci-validation
      - create-encryption-service
---

# Security & Compliance Strategy

## Overview

This plan establishes comprehensive security measures and compliance frameworks for BDN 2.0, focusing on database security, PCI DSS compliance for payment processing, and legal/financial compliance requirements.

**Key Architecture Principle:**

- **BLKD (Black Dollars)** and **BDN Wallet System** are proprietary internal systems (not subject to PCI compliance)
- **USD transactions, card information, and bank information** are managed, edited, and updated exclusively via **iPayOuts/EcomPayments** (PCI-compliant processors)
- BDN system **NEVER** receives, stores, or processes raw card/bank data
- BDN only stores tokenized references and display information from processors

## 1. PCI DSS Compliance (Payment Card Industry Data Security Standard)

### PCI DSS Scope & Payment System Architecture

**CRITICAL DISTINCTION:**

**BLKD (Black Dollars) - Proprietary Internal Currency:**

- BLKD is BDN's proprietary digital currency (internal to the platform)
- BLKD wallet system is proprietary to BDN (similar to store credit/gift card balance)
- **NOT subject to PCI DSS compliance** - BLKD is not a real payment card or bank account
- BLKD transactions are internal transfers within the BDN system
- BLKD balances stored in BDN database (no PCI compliance required)

**USD Transactions - PCI-Compliant Payment Processors:**

- **All USD transactions** (credit cards, bank transfers) are processed via PCI-compliant processors:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **Ecom Payments**: Credit card processing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - **iPayOuts**: ACH/bank transfers (incoming and outgoing)
- **Card and bank information** is managed, stored, and updated **exclusively** by iPayOuts/EcomPayments
- BDN system **NEVER** receives, stores, or processes raw card/bank data
- BDN only stores:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Tokenized payment method references from processors
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Last 4 digits (for display only)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Processor transaction IDs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - Display information (card brand, expiry month/year)

**Payment Flow Architecture:**

```
USD Payment Flow (PCI-Compliant):
User → BDN App → Ecom Payments/iPayOuts → Processor Stores Card/Bank Data
                                      ↓
                              Token Returned to BDN
                                      ↓
                              BDN Stores Token Only
                                      ↓
                              Card/Bank Data Managed by Processor

BLKD Payment Flow (Internal - No PCI Required):
User → BDN App → BDN Wallet System → Internal BLKD Transfer
                                      ↓
                              BLKD Balance Updated in BDN Database
                                      ↓
                              No External Processor
                                      ↓
                              Proprietary Internal Currency
```

**BLKD Wallet System Architecture:**

```
BLKD Wallet (Proprietary Internal System):
├── BLKD Balance Storage
│   └── Stored in BDN PostgreSQL database
│       └── Standard encryption (not PCI-specific)
│
├── BLKD Transactions
│   └── Internal transfers between BDN wallets
│       └── No external payment processor
│       └── No card/bank data involved
│
├── BLKD Purchase (USD → BLKD Conversion)
│   └── USD payment via Ecom Payments/iPayOuts (PCI-compliant)
│   └── BLKD credited to user's BLKD wallet (internal)
│   └── BLKD balance stored in BDN database
│
└── BLKD Usage (BLKD → Payment)
    └── BLKD deducted from user's BLKD wallet
    └── Payment processed (may involve USD via processors)
    └── No PCI compliance required for BLKD portion
```

**Key Points:**

- BLKD is BDN's proprietary digital currency (like store credit)
- BLKD wallet balances are internal to BDN system
- BLKD transactions are internal transfers (not payment card transactions)
- BLKD purchases require USD payment (PCI-compliant via processors)
- BLKD balances and transactions are NOT subject to PCI DSS requirements

### PCI DSS Requirements

**BDN 2.0 PCI Compliance Level:** Level 1 (if processing >6M transactions/year) or Level 2-4 (based on volume)

**PCI Compliance Scope:**

- ✅ **Applies to**: USD transactions via Ecom Payments and iPayOuts
- ✅ **Applies to**: Card and bank account data managed by processors
- ❌ **Does NOT apply to**: BLKD wallet balances and transactions (internal proprietary currency)
- ❌ **Does NOT apply to**: BLKD-to-BLKD transfers (internal system)

### Critical PCI Requirements

**Requirement 1-2: Network Security**

- Firewall configuration
- Network segmentation
- Default password policies
- Network monitoring

**Requirement 3: Protect Stored Cardholder Data**

**For USD Transactions (via Ecom Payments/iPayOuts):**

- ✅ **NEVER store**: Full PAN, CVV, full account numbers, PINs, routing numbers
- ✅ **NEVER receive**: Raw card/bank data from users (all data goes directly to processors)
- ✅ **ONLY store**: Tokenized payment method references from iPayOuts/EcomPayments
- ✅ **ONLY store**: Last 4 digits (for display), card brand, expiry month/year
- ✅ **ONLY store**: Processor transaction IDs (not payment data)
- ✅ **Encryption**: All stored payment tokens encrypted at rest (AES-256)
- ✅ **Tokenization**: All payment methods tokenized by iPayOuts/EcomPayments before BDN receives them

**For BLKD Transactions (Internal - Not PCI Scope):**

- ✅ **BLKD balances**: Stored in BDN database (proprietary internal currency)
- ✅ **BLKD transactions**: Internal transfers, no external payment data
- ❌ **Not subject to PCI**: BLKD is not a payment card or bank account

**Requirement 4: Encrypt Transmission**

- ✅ **HTTPS/TLS**: All API communications use TLS 1.2+
- ✅ **Certificate Management**: Valid SSL certificates, auto-renewal
- ✅ **No card data in logs**: Payment data never logged

**Requirement 5-6: Vulnerability Management**

- Regular security scans
- Patch management
- Secure coding practices
- Code reviews for payment code

**Requirement 7-8: Access Control**

- Role-based access control (RBAC)
- Unique user IDs
- Strong authentication (2FA for admin)
- Access logging and monitoring

**Requirement 9: Physical Security**

- Google Cloud data centers (PCI-compliant)
- No physical access to production systems

**Requirement 10: Network Monitoring**

- Logging all access to cardholder data (USD transactions via processors)
- Log retention (1 year minimum)
- Log review procedures
- Intrusion detection
- **Note**: BLKD transactions are internal and not subject to PCI logging requirements

**Requirement 11: Security Testing**

- Quarterly vulnerability scans
- Annual penetration testing
- Code security reviews

**Requirement 12: Security Policy**

- Security policies and procedures
- Incident response plan
- Regular security training

### Payment Processor Integration Requirements

**iPayOuts Integration** (`server/src/integrations/ipayouts.ts`):

```typescript
/**
 * iPayOuts Integration
 * 
 * CRITICAL: Card and bank information is managed EXCLUSIVELY by iPayOuts
 * BDN system NEVER receives, stores, or processes raw card/bank data
 * 
 * Responsibilities:
 * - ACH/bank transfers (incoming and outgoing)
 * - Bank account management (add, update, delete)
 * - Bank account verification
 * - All bank data storage and encryption handled by iPayOuts
 */
class IPayOutsClient {
  /**
   * Add bank account - Data sent directly to iPayOuts
   * BDN receives only tokenized reference back
   */
  async addBankAccount(params: {
    userId: string;
    accountNumber: string; // Sent to iPayOuts, never stored in BDN
    routingNumber: string; // Sent to iPayOuts, never stored in BDN
    accountType: 'checking' | 'savings';
    accountHolderName: string;
  }): Promise<{ token: string; last4: string; bankName: string }> {
    // Call iPayOuts API with bank data
    // iPayOuts stores and manages all bank account data
    // Return only tokenized reference and display info to BDN
  }
  
  /**
   * Update bank account - Managed via iPayOuts API
   */
  async updateBankAccount(token: string, updates: Partial<BankAccountData>): Promise<void> {
    // All updates go through iPayOuts API
    // BDN never receives full account data
  }
  
  /**
   * Process ACH transfer - Bank data managed by iPayOuts
   */
  async processACHTransfer(params: {
    fromToken: string; // Tokenized bank account reference
    toToken: string; // Tokenized bank account reference
    amount: number;
    currency: 'USD';
  }): Promise<{ transactionId: string }> {
    // Process via iPayOuts API
    // Bank account data never touches BDN system
  }
}
```

**Ecom Payments Integration** (`server/src/integrations/ecom-payments.ts`):

```typescript
/**
 * Ecom Payments Integration
 * 
 * CRITICAL: Credit card information is managed EXCLUSIVELY by Ecom Payments
 * BDN system NEVER receives, stores, or processes raw card data
 * 
 * Responsibilities:
 * - Credit card processing
 * - Card management (add, update, delete)
 * - Card verification
 * - All card data storage and encryption handled by Ecom Payments
 */
class EcomPaymentsClient {
  /**
   * Add credit card - Data sent directly to Ecom Payments
   * BDN receives only tokenized reference back
   */
  async addCreditCard(params: {
    userId: string;
    cardNumber: string; // Sent to Ecom Payments, never stored in BDN
    cvv: string; // Sent to Ecom Payments, never stored in BDN
    expiryMonth: number;
    expiryYear: number;
    cardholderName: string;
  }): Promise<{ token: string; last4: string; brand: string }> {
    // Call Ecom Payments API with card data
    // Ecom Payments stores and manages all card data
    // Return only tokenized reference and display info to BDN
  }
  
  /**
   * Update credit card - Managed via Ecom Payments API
   */
  async updateCreditCard(token: string, updates: Partial<CardData>): Promise<void> {
    // All updates go through Ecom Payments API
    // BDN never receives full card data
  }
  
  /**
   * Process card payment - Card data managed by Ecom Payments
   */
  async processCardPayment(params: {
    cardToken: string; // Tokenized card reference
    amount: number;
    currency: 'USD';
  }): Promise<{ transactionId: string }> {
    // Process via Ecom Payments API
    // Card data never touches BDN system
  }
}
```

**Frontend Payment Method Management:**

```typescript
// lib/payment-methods.ts
/**
 * Payment Method Management
 * 
 * All card/bank data operations must go through processor APIs
 * Frontend should use processor SDKs/iframes for secure data entry
 */
export async function addPaymentMethod(type: 'card' | 'bank', data: PaymentData) {
  if (type === 'card') {
    // Use Ecom Payments SDK/iframe for card entry
    // Card data never touches BDN frontend
    const token = await ecomPaymentsSDK.tokenizeCard(data);
    // Send only token to BDN backend
    return await api.post('/api/payment-methods', { token, processor: 'ecom_payments' });
  } else {
    // Use iPayOuts SDK/iframe for bank entry
    // Bank data never touches BDN frontend
    const token = await ipayoutsSDK.tokenizeBankAccount(data);
    // Send only token to BDN backend
    return await api.post('/api/payment-methods', { token, processor: 'ipayouts' });
  }
}
```

### PCI Compliance Implementation

**Database Schema Compliance** (`server/prisma/schema.prisma`):

```prisma
model PaymentMethod {
  id                String   @id @default(uuid())
  userId            String
  currency           String   @default("USD") // Only USD payment methods (BLKD is separate)
  
  // PCI COMPLIANCE: Card/Bank data managed by iPayOuts/EcomPayments
  // BDN only stores tokenized references from processors
  paymentMethodToken String  @unique // Token from iPayOuts/EcomPayments
  processor          String  // "ecom_payments" (cards), "ipayouts" (bank accounts)
  
  // Display-only (safe to store, provided by processor)
  displayInfo       Json     // { cardLast4, cardBrand, expiryMonth, expiryYear, accountLast4, bankName }
  
  // NEVER STORE: Full PAN, CVV, full account numbers, routing numbers
  // Card/bank data is managed/edited/updated via iPayOuts/EcomPayments APIs only
  
  isDefault         Boolean  @default(false)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId, isActive])
  @@map("payment_methods")
}

model BLKDWallet {
  id            String   @id @default(uuid())
  userId        String   @unique
  balance       Float    @default(0)
  currency      String   @default("BLKD") // Proprietary internal currency
  
  // NOT SUBJECT TO PCI: BLKD is internal proprietary currency
  // Similar to store credit or gift card balance
  // No external payment processor involved
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("blkd_wallets")
}

model Transaction {
  id                    String   @id @default(uuid())
  userId                String
  amount                Float
  currency              String   // "USD" or "BLKD"
  
  // PCI COMPLIANCE: Only for USD transactions via processors
  processorTransactionId String? // External processor transaction ID (iPayOuts/EcomPayments)
  processor              String? // "ecom_payments", "ipayouts" (null for BLKD transactions)
  
  // Payment method reference (tokenized, only for USD transactions)
  paymentMethodId       String? // Reference to PaymentMethod (tokenized, USD only)
  
  // BLKD transactions don't use payment methods (internal transfers)
  // BLKD transactions: processor = null, paymentMethodId = null
  
  // NEVER STORE: Full card numbers, CVV, account numbers
  // Card/bank data managed by iPayOuts/EcomPayments
  
  status                PaymentStatus @default(PENDING)
  createdAt             DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([currency, createdAt])
  @@index([processorTransactionId])
  @@map("transactions")
}
```

**Payment Processing Compliance** (`server/src/services/payment-engine.ts`):

```typescript
class PaymentEngine {
  /**
   * Process USD payment - PCI compliant
   * Card/bank data managed by iPayOuts/EcomPayments
   * BDN NEVER receives or stores full card/bank data
   * Only works with tokenized payment method references
   */
  async processUSDPayment(params: {
    paymentMethodToken: string; // Tokenized reference from iPayOuts/EcomPayments
    amount: number;
    currency: 'USD'; // Only USD payments go through processors
    processor: 'ecom_payments' | 'ipayouts';
    // NEVER: cardNumber, cvv, accountNumber, routingNumber
  }): Promise<PaymentResult> {
    // Validate token exists (provided by processor)
    // Process via iPayOuts/EcomPayments API
    // Store only processor transaction ID
    // NEVER log payment data
    // Card/bank data updates managed by processor APIs
  }
  
  /**
   * Process BLKD transaction - Internal, not PCI scope
   * BLKD is proprietary internal currency
   * No external payment processor involved
   */
  async processBLKDTransaction(params: {
    fromUserId: string;
    toUserId: string;
    amount: number; // BLKD amount
    currency: 'BLKD';
  }): Promise<TransactionResult> {
    // Internal BLKD wallet transfer
    // No PCI compliance required (internal proprietary currency)
    // Update BLKD wallet balances directly
  }
  
  /**
   * Add/Update Payment Method - Managed via Processor APIs
   * Card/bank information managed by iPayOuts/EcomPayments
   * BDN only receives tokenized reference
   */
  async addPaymentMethod(params: {
    userId: string;
    processor: 'ecom_payments' | 'ipayouts';
    // Card/bank data sent directly to processor
    // BDN receives only tokenized reference back
  }): Promise<PaymentMethod> {
    // Call iPayOuts/EcomPayments API to add payment method
    // Processor handles card/bank data storage
    // BDN receives and stores only tokenized reference
  }
}
```

**Data Validation** (`server/src/middleware/pci-validation.ts`):

```typescript
/**
 * PCI Validation Middleware
 * Ensures no card/bank data is sent to BDN APIs
 * Card/bank data must go directly to iPayOuts/EcomPayments
 */
export function validateNoCardData(req: Request, res: Response, next: NextFunction) {
  const body = JSON.stringify(req.body);
  
  // Check for potential card data patterns (should never be in BDN requests)
  const cardPattern = /\b\d{13,19}\b/; // 13-19 digit numbers (PAN)
  const cvvPattern = /\b\d{3,4}\b/; // CVV patterns
  const accountPattern = /\b\d{8,17}\b/; // Bank account numbers
  const routingPattern = /\b\d{9}\b/; // Routing numbers
  
  if (cardPattern.test(body) || cvvPattern.test(body) || 
      accountPattern.test(body) || routingPattern.test(body)) {
    logger.error('Potential payment data detected in BDN request - should go to processor', {
      endpoint: req.path,
      ip: req.ip,
      error: 'Card/bank data must be sent directly to iPayOuts/EcomPayments, not BDN',
    });
    return res.status(400).json({ 
      error: 'Invalid request. Payment data must be processed via iPayOuts/EcomPayments.',
      message: 'Card and bank information is managed by our payment processors. Please use their secure forms.',
    });
  }
  
  next();
}

/**
 * Validate payment method operations
 * Ensures payment methods are managed via processor APIs
 */
export function validatePaymentMethodOperation(req: Request, res: Response, next: NextFunction) {
  // Payment method add/update operations should only accept:
  // - paymentMethodToken (from processor)
  // - displayInfo (last 4 digits, brand, etc.)
  // NEVER: full card numbers, CVV, account numbers
  
  if (req.body.cardNumber || req.body.cvv || req.body.accountNumber || req.body.routingNumber) {
    return res.status(400).json({
      error: 'Payment data must be managed via iPayOuts/EcomPayments APIs',
      message: 'Card and bank information cannot be sent directly to BDN. Use processor APIs.',
    });
  }
  
  next();
}
```

## 2. Database Security

### Encryption

**Encryption at Rest:**

**PostgreSQL (Google Cloud SQL):**

- ✅ **Automatic encryption**: Cloud SQL encrypts data at rest by default
- ✅ **Encryption keys**: Managed by Google Cloud KMS
- ✅ **Backup encryption**: All backups encrypted
- ✅ **Transparent Data Encryption (TDE)**: Enabled

**Firestore:**

- ✅ **Automatic encryption**: Firestore encrypts data at rest by default
- ✅ **Encryption keys**: Managed by Google Cloud

**Application-Level Encryption:**

For sensitive fields (PII, addresses, etc.):

```typescript
// server/src/services/encryption-service.ts
import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  
  constructor() {
    // Get encryption key from Google Cloud Secret Manager
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }
  
  encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }
  
  decrypt(encrypted: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

**Encryption in Transit:**

- ✅ **TLS 1.2+**: All database connections use TLS
- ✅ **Certificate validation**: Strict certificate validation
- ✅ **Connection strings**: Encrypted connection strings in secrets

**Database Connection Security** (`server/src/config/database.ts`):

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Must include SSL parameters
    },
  },
  log: ['error', 'warn'], // Never log queries with sensitive data
});

// Ensure SSL connection
if (!process.env.DATABASE_URL?.includes('sslmode=require')) {
  throw new Error('Database URL must require SSL');
}
```

### Access Control

**Database User Roles** (PostgreSQL):

```sql
-- Application user (limited permissions)
CREATE ROLE bdn_app_user WITH LOGIN PASSWORD '...';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO bdn_app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO bdn_app_user;

-- Read-only user (for reporting)
CREATE ROLE bdn_readonly_user WITH LOGIN PASSWORD '...';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bdn_readonly_user;

-- Admin user (for migrations)
CREATE ROLE bdn_admin_user WITH LOGIN PASSWORD '...';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bdn_admin_user;
```

**Row-Level Security (RLS)** - PostgreSQL:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own transactions
CREATE POLICY user_transactions ON transactions
  FOR SELECT
  USING (auth.uid() = "userId");

-- Policy: Businesses can only see their own transactions
CREATE POLICY business_transactions ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = transactions."orderId"
      AND o."businessId" = auth.business_id()
    )
  );
```

**Firestore Security Rules** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users can only see their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write transactions
    }
    
    // Payment methods - users can only access their own
    match /payment_methods/{paymentMethodId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write payment methods
    }
  }
}
```

### Audit Logging

**Database Audit Log** (`server/prisma/schema.prisma`):

```prisma
model AuditLog {
  id            String   @id @default(uuid())
  action        String   // "CREATE", "UPDATE", "DELETE", "READ"
  tableName     String   // Table name
  recordId      String?  // Record ID
  userId        String?  // User who performed action
  ipAddress     String?
  userAgent     String?
  changes       Json?    // Before/after values (sanitized)
  metadata      Json?    // Additional context
  createdAt     DateTime @default(now())
  
  @@index([tableName, recordId])
  @@index([userId, createdAt])
  @@index([action, createdAt])
  @@map("audit_logs")
}

model SensitiveDataAccess {
  id            String   @id @default(uuid())
  userId        String
  dataType      String   // "payment_method", "transaction", "wallet"
  recordId      String
  accessType    String   // "READ", "EXPORT", "DELETE"
  ipAddress     String?
  userAgent     String?
  accessedAt    DateTime @default(now())
  
  @@index([userId, accessedAt])
  @@index([dataType, accessedAt])
  @@map("sensitive_data_access")
}
```

**Audit Logging Service** (`server/src/services/audit-service.ts`):

```typescript
class AuditService {
  /**
   * Log access to sensitive data
   * Required for PCI DSS Requirement 10 (USD transactions only)
   * BLKD transactions logged for internal audit but not PCI requirement
   */
  async logAccess(params: {
    userId: string;
    dataType: string; // "payment_method", "transaction", "wallet"
    recordId: string;
    accessType: string;
    currency?: 'USD' | 'BLKD'; // Track currency for PCI scope
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    // Log all access to sensitive data
    // Required for PCI DSS Requirement 10 (USD transactions)
    // BLKD access logged for internal audit (not PCI requirement)
  }
  
  /**
   * Log data changes
   * Sanitize payment data before logging
   */
  async logDataChange(params: {
    userId: string;
    action: string;
    tableName: string;
    recordId: string;
    changes: Record<string, any>;
    currency?: 'USD' | 'BLKD';
  }): Promise<void> {
    // Log all changes to sensitive data
    // Sanitize sensitive fields before logging (remove any payment data)
    // PCI requirement for USD transactions only
  }
  
  /**
   * Log payment method operations
   * Card/bank data managed by iPayOuts/EcomPayments
   * BDN only logs token operations
   */
  async logPaymentMethodOperation(params: {
    userId: string;
    operation: 'add' | 'update' | 'delete';
    paymentMethodToken: string; // Only token, never full data
    processor: 'ecom_payments' | 'ipayouts';
  }): Promise<void> {
    // Log payment method operations
    // Only log tokenized references, never full card/bank data
  }
}
```

## 3. Legal & Financial Compliance

### GDPR Compliance (General Data Protection Regulation)

**Requirements:**

1. **Right to Access**: Users can request their data
2. **Right to Erasure**: Users can request data deletion
3. **Right to Portability**: Users can export their data
4. **Consent Management**: Track user consent
5. **Data Minimization**: Only collect necessary data
6. **Privacy by Design**: Privacy built into system

**Implementation:**

**User Data Export** (`server/src/api/users/export.ts`):

```typescript
export async function exportUserData(userId: string): Promise<UserDataExport> {
  // Export all user data in machine-readable format (JSON)
  // Include: profile, transactions, orders, preferences
  // Exclude: payment tokens (security)
}
```

**User Data Deletion** (`server/src/api/users/delete.ts`):

```typescript
export async function deleteUserData(userId: string): Promise<void> {
  // Anonymize user data (GDPR "right to be forgotten")
  // Keep transaction records for legal/financial compliance
  // Remove PII, keep anonymized transaction data
}
```

**Consent Management** (`server/prisma/schema.prisma`):

```prisma
model UserConsent {
  id            String   @id @default(uuid())
  userId        String
  consentType   String   // "marketing", "analytics", "demographics"
  consented     Boolean
  consentDate   DateTime
  withdrawnDate DateTime?
  ipAddress     String?
  userAgent     String?
  
  @@index([userId, consentType])
  @@map("user_consents")
}
```

### CCPA Compliance (California Consumer Privacy Act)

**Requirements:**

1. **Right to Know**: Users can request data disclosure
2. **Right to Delete**: Users can request deletion
3. **Right to Opt-Out**: Users can opt out of data sale
4. **Non-Discrimination**: Cannot discriminate for exercising rights

**Implementation:**

Similar to GDPR, with additional opt-out mechanisms.

### Financial Regulations

**Bank Secrecy Act (BSA) / Anti-Money Laundering (AML):**

- Transaction monitoring for suspicious activity
- Reporting thresholds ($10,000+ transactions)
- Customer identification program (KYC)

**Transaction Monitoring** (`server/src/services/aml-service.ts`):

```typescript
class AMLService {
  /**
   * Monitor transactions for AML compliance
   * Applies to USD transactions (via processors)
   * BLKD transactions monitored for internal fraud prevention
   */
  async monitorTransaction(transaction: Transaction): Promise<void> {
    // Check for suspicious patterns:
    // - Large transactions
    // - Rapid transactions
    // - Unusual patterns
    
    // USD transactions: AML compliance (BSA requirements)
    if (transaction.currency === 'USD' && transaction.amount > 10000) {
      await this.flagForReview(transaction);
      await this.generateSAR(transaction); // Suspicious Activity Report
    }
    
    // BLKD transactions: Internal fraud monitoring (not AML requirement)
    if (transaction.currency === 'BLKD' && transaction.amount > 50000) {
      await this.flagForReview(transaction); // Internal review only
    }
  }
  
  /**
   * Generate Suspicious Activity Report
   * Required for BSA compliance (USD transactions only)
   */
  async generateSAR(transaction: Transaction): Promise<void> {
    // Generate Suspicious Activity Report
    // Required for BSA compliance
    // Only for USD transactions via processors
    // BLKD transactions not subject to SAR requirements
  }
}
```

**KYC (Know Your Customer)** (`server/prisma/schema.prisma`):

```prisma
model KYCVerification {
  id            String   @id @default(uuid())
  userId        String   @unique
  status        KYCStatus @default(PENDING)
  level         Int      // 1 = Basic, 2 = Enhanced, 3 = Full
  documents     Json?    // Document references (encrypted)
  verifiedAt    DateTime?
  expiresAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("kyc_verifications")
}

enum KYCStatus {
  PENDING
  VERIFIED
  REJECTED
  EXPIRED
}
```

## 4. Security Monitoring & Incident Response

### Security Monitoring

**Log Aggregation** (`server/src/services/security-monitor.ts`):

```typescript
class SecurityMonitor {
  async monitorAccess(params: {
    userId: string;
    resource: string;
    action: string;
    ipAddress: string;
  }): Promise<void> {
    // Monitor for:
    // - Unusual access patterns
    // - Failed login attempts
    // - Access from new locations
    // - Privilege escalation attempts
  }
  
  async detectAnomalies(): Promise<SecurityAlert[]> {
    // Detect:
    // - Brute force attacks
    // - SQL injection attempts
    // - Unusual transaction patterns
    // - Data exfiltration attempts
  }
}
```

**Intrusion Detection** (`server/src/middleware/security.ts`):

```typescript
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Rate limiting
  // IP whitelisting/blacklisting
  // Request validation
  // SQL injection prevention
  // XSS prevention
}
```

### Incident Response Plan

**Incident Response Procedures** (`docs/incident-response.md`):

1. **Detection**: Automated alerts + manual detection
2. **Containment**: Isolate affected systems
3. **Investigation**: Determine scope and impact
4. **Remediation**: Fix vulnerabilities, restore systems
5. **Notification**: Notify affected users, regulators (if required)
6. **Post-Incident**: Review and improve

**Incident Logging** (`server/prisma/schema.prisma`):

```prisma
model SecurityIncident {
  id            String   @id @default(uuid())
  type          String   // "breach", "attack", "vulnerability"
  severity      String   // "low", "medium", "high", "critical"
  description   String
  affectedUsers Int?
  detectedAt    DateTime @default(now())
  containedAt   DateTime?
  resolvedAt    DateTime?
  status        IncidentStatus @default(OPEN)
  actions       Json?    // Actions taken
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([status, detectedAt])
  @@map("security_incidents")
}

enum IncidentStatus {
  OPEN
  INVESTIGATING
  CONTAINED
  RESOLVED
  CLOSED
}
```

## 5. Compliance Reporting

### PCI Compliance Reports

**Quarterly Reports:**

- Vulnerability scan results
- Access log reviews
- Security policy updates
- Incident reports

**Annual Reports:**

- Penetration test results
- Compliance self-assessment
- Security training completion

### Compliance Dashboard

**Admin Compliance View** (`app/admin/compliance.tsx`):

- PCI compliance status
- Security scan results
- Audit log summaries
- Incident reports
- Compliance metrics

## 6. Security Testing

### Automated Security Tests

**Security Test Suite** (`__tests__/security/`):

```typescript
// __tests__/security/pci-compliance.test.ts
describe('PCI Compliance', () => {
  describe('USD Transactions (PCI Scope)', () => {
    it('should not store full card numbers', () => {
      // Test that no full card numbers are stored in BDN database
      // Card data managed by iPayOuts/EcomPayments
    });
    
    it('should not accept card data in API requests', () => {
      // Test that API rejects requests with card data
      // Card data must go directly to processor APIs
    });
    
    it('should only store tokenized payment method references', () => {
      // Test that only tokens from processors are stored
    });
    
    it('should not log payment data', () => {
      // Test that payment data is not logged
    });
    
    it('should encrypt payment tokens at rest', () => {
      // Test encryption of payment method tokens
    });
  });
  
  describe('BLKD Transactions (Not PCI Scope)', () => {
    it('should allow BLKD wallet operations without PCI restrictions', () => {
      // BLKD is internal proprietary currency
      // Not subject to PCI compliance
    });
    
    it('should store BLKD balances without encryption requirements', () => {
      // BLKD balances are internal, not payment card data
      // Standard encryption applies but not PCI-specific requirements
    });
  });
});

// __tests__/security/access-control.test.ts
describe('Access Control', () => {
  it('should prevent unauthorized access to transactions', () => {
    // Test RLS policies
  });
  
  it('should require authentication for sensitive endpoints', () => {
    // Test API authentication
  });
});
```

### Security Scanning

**Tools:**

- **OWASP ZAP**: Web application security scanner
- **Snyk**: Dependency vulnerability scanning
- **SonarQube**: Code security analysis
- **Google Cloud Security Scanner**: Cloud infrastructure scanning

## 7. Implementation Files

### New Files

**Security Services:**

- `server/src/services/encryption-service.ts` - Data encryption/decryption
- `server/src/services/audit-service.ts` - Audit logging (PCI for USD, internal for BLKD)
- `server/src/services/security-monitor.ts` - Security monitoring
- `server/src/services/aml-service.ts` - AML transaction monitoring (USD transactions)
- `server/src/services/compliance-service.ts` - Compliance reporting
- `server/src/services/blkd-wallet-service.ts` - BLKD wallet management (internal, not PCI)

**Security Middleware:**

- `server/src/middleware/pci-validation.ts` - PCI data validation (rejects card/bank data in requests, ensures data goes to processors)
- `server/src/middleware/payment-method-validation.ts` - Validates payment method operations use processor APIs only
- `server/src/middleware/security.ts` - Security headers, rate limiting
- `server/src/middleware/audit-logging.ts` - Automatic audit logging

**Payment Processor Integrations:**

- `server/src/integrations/ecom-payments.ts` - Ecom Payments client (card processing, card data management)
- `server/src/integrations/ipayouts.ts` - iPayOuts client (ACH/bank transfers, bank data management)
- `lib/payment-methods.ts` - Frontend payment method utilities (uses processor SDKs)

**Compliance APIs:**

- `server/src/api/compliance/export-data.ts` - GDPR data export
- `server/src/api/compliance/delete-data.ts` - GDPR data deletion
- `server/src/api/compliance/consent.ts` - Consent management

**Admin Compliance:**

- `app/admin/compliance.tsx` - Compliance dashboard
- `app/admin/security-incidents.tsx` - Security incidents view
- `app/admin/audit-logs.tsx` - Audit log viewer

### Modified Files

- `server/prisma/schema.prisma` - Add security/compliance models, BLKD wallet model
- `server/src/services/transaction-engine.ts` - Add PCI validation for USD transactions, separate BLKD processing
- `server/src/services/payment-engine.ts` - Separate USD (PCI via processors) and BLKD (internal) processing
- `server/src/integrations/ecom-payments.ts` - Ensure card data managed exclusively by Ecom Payments, BDN only receives tokens
- `server/src/integrations/ipayouts.ts` - Ensure bank data managed exclusively by iPayOuts, BDN only receives tokens
- `lib/payment-methods.ts` - Update to use processor SDKs for secure payment method entry
- `firestore.rules` - Enhanced security rules (separate rules for USD vs BLKD)
- `.github/workflows/security-scan.yml` - Security scanning workflow

## 8. Compliance Checklist

### PCI DSS Checklist

**USD Transactions (via iPayOuts/EcomPayments):**

- [ ] No full card numbers stored in BDN database
- [ ] No CVV codes stored in BDN database
- [ ] No full bank account numbers stored in BDN database
- [ ] No routing numbers stored in BDN database
- [ ] Card/bank data managed exclusively by iPayOuts/EcomPayments
- [ ] All payment method references tokenized (from processors)
- [ ] Payment method add/update operations use processor APIs only
- [ ] TLS 1.2+ for all connections to processors
- [ ] Encryption at rest enabled for payment tokens
- [ ] Access controls implemented for payment data
- [ ] Audit logging enabled for USD transaction access
- [ ] Security policies documented
- [ ] Incident response plan in place
- [ ] Quarterly vulnerability scans scheduled
- [ ] Annual penetration testing scheduled

**BLKD Wallet System (Not PCI Scope):**

- [ ] BLKD wallet balances stored securely (standard encryption)
- [ ] BLKD transactions logged for internal audit
- [ ] BLKD fraud monitoring implemented
- [ ] BLKD balance reconciliation procedures
- [ ] Note: BLKD is proprietary internal currency, not subject to PCI DSS

### GDPR Checklist

- [ ] Data export functionality implemented
- [ ] Data deletion functionality implemented
- [ ] Consent management system in place
- [ ] Privacy policy accessible
- [ ] Data processing agreements with vendors
- [ ] Data breach notification procedures

### Financial Compliance Checklist

- [ ] Transaction monitoring implemented
- [ ] KYC verification system in place
- [ ] Suspicious activity reporting capability
- [ ] Transaction limits enforced
- [ ] Regulatory reporting procedures

## 9. Success Metrics

**Security:**

- Zero data breaches
- 100% of sensitive data encrypted
- 100% PCI compliance score (USD transactions via processors)
- Zero card/bank data stored in BDN database
- 100% payment method operations via processor APIs
- < 1 hour incident response time
- 100% audit log coverage (USD transactions for PCI, BLKD for internal audit)

**Compliance:**

- 100% GDPR compliance
- 100% CCPA compliance
- All regulatory reports submitted on time
- Zero compliance violations