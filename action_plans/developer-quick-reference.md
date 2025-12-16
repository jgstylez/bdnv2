# Developer Dashboard Quick Reference

**Last Updated:** 2024-12-19

---

## Quick Links

- **Developer Dashboard:** `/developer`
- **API Documentation:** `/developer/api-docs`
- **API Keys:** `/developer/api-keys`
- **Webhooks:** `/developer/webhooks`
- **SDKs:** `/developer/sdks`
- **Logs:** `/developer/logs`
- **Testing:** `/developer/testing`

---

## Getting Started

1. **Get Your API Key**
   - Navigate to `/developer/api-keys`
   - Click "Create Key"
   - Choose Sandbox (for testing) or Live (for production)
   - Copy your key securely

2. **Read the Documentation**
   - Visit `/developer/api-docs`
   - Review available endpoints
   - Check code examples for your language

3. **Download an SDK**
   - Go to `/developer/sdks`
   - Find your language
   - Copy installation command
   - Follow quick start examples

4. **Set Up Webhooks** (Optional)
   - Navigate to `/developer/webhooks`
   - Create webhook endpoint
   - Select events to subscribe to
   - Save webhook secret for verification

---

## API Base URL

- **Sandbox:** `https://api-sandbox.bdn.com/api/v1`
- **Live:** `https://api.bdn.com/api/v1`

---

## Authentication

Include your API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

---

## Rate Limits

- **Limit:** 10,000 requests per hour per API key
- **Headers:** Check `X-RateLimit-*` headers in responses
- **Reset:** Hourly reset window

---

## Common Endpoints

### Businesses
```
GET    /api/v1/businesses
GET    /api/v1/businesses/{id}
```

### Payments
```
POST   /api/v1/payments/c2b
```

### Transactions
```
GET    /api/v1/transactions
GET    /api/v1/transactions/{id}
```

### Users
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
```

---

## Webhook Events

- `payment.completed` - Payment successfully processed
- `payment.failed` - Payment failed
- `transaction.created` - New transaction created
- `transaction.updated` - Transaction updated
- `user.created` - New user registered
- `user.updated` - User profile updated
- `business.created` - New business added
- `business.updated` - Business information updated

---

## SDK Installation

### JavaScript/TypeScript
```bash
npm install @bdn/sdk
```

### Python
```bash
pip install bdn-sdk
```

### PHP
```bash
composer require bdn/sdk
```

### Ruby
```bash
gem install bdn-sdk
```

---

## Testing

Use the Testing Tools page (`/developer/testing`) to:
- Test API endpoints
- Generate cURL commands
- Validate request/response formats
- Debug integration issues

---

## Support

- **Documentation:** `/developer/api-docs`
- **Logs:** `/developer/logs` (for debugging)
- **Testing:** `/developer/testing` (for validation)

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** to store keys
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use sandbox keys** for development
5. **Revoke compromised keys** immediately
6. **Verify webhook signatures** using webhook secrets
7. **Use HTTPS** for all webhook endpoints

---

## Troubleshooting

### 401 Unauthorized
- Check API key is correct
- Verify key is active (not revoked)
- Ensure Authorization header format is correct

### 429 Too Many Requests
- Check rate limit headers
- Implement exponential backoff
- Consider upgrading API tier

### 400 Bad Request
- Validate request body format
- Check required parameters
- Review API documentation

### Webhook Not Receiving Events
- Verify webhook URL is accessible
- Check webhook is active
- Verify webhook secret is correct
- Check webhook logs for delivery status

---

## Code Examples

### JavaScript/TypeScript
```javascript
import { BDN } from '@bdn/sdk';

const bdn = new BDN({
  apiKey: process.env.BDN_API_KEY,
  environment: 'sandbox'
});

const businesses = await bdn.businesses.list();
```

### Python
```python
from bdn import BDN

bdn = BDN(
    api_key=os.getenv('BDN_API_KEY'),
    environment='sandbox'
)

businesses = bdn.businesses.list()
```

### cURL
```bash
curl -X GET https://api.bdn.com/api/v1/businesses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## Next Steps

1. Review full API documentation
2. Set up webhooks for real-time updates
3. Monitor logs for debugging
4. Test your integration thoroughly
5. Deploy to production with live API keys

