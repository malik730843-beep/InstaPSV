---
description: how to process and approve subscription payments
---

1. Fetch all pending subscription requests from the database.
// turbo
2. Run the command to list pending requests:
   `node scripts/list-pending-payments.js`
3. Analyze the requests and ask the user if any specific transaction IDs should be verified manually or if I should proceed with bulk approval (if mock payment is enabled).
4. For each approved request, run the approval command:
   `node scripts/approve-payment.js <request_id>`
5. For each rejected request, run the rejection command:
   `node scripts/reject-payment.js <request_id> "<reason>"`
6. Notify the user once all requests have been processed.
