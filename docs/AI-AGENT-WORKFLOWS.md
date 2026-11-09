# Lotus Tubes AI Agent Operating Model

**Status:** implementation specification. The profile cards describe the planned AI roles; the customer-facing automation is not live merely because the profiles are displayed.

## Agent directory

| Agent ID | Display name | Position | Email |
|---|---|---|---|
| `ananya-quotation` | Ananya Mehta | AI Quotation & Sales Coordination Agent | ananyamehta@lotustubes.com |
| `riya-invoice` | Riya Shah | AI Billing & Invoice Coordination Agent | riyashah@lotustubes.com |
| `neha-enquiry` | Neha Desai | AI Customer Enquiry & Resolution Agent | nehadesai@lotustubes.com |
| `arjun-support` | Arjun Yadav | AI Customer Support & Operations Manager | arjunyadav@lotustubes.com |

The four profiles must be presented as AI agents, not human employees. Email addresses are profile/contact identifiers only until the mailboxes are provisioned, verified and connected to the sending service.

## Responsibility and boundaries

### Ananya — quotations
1. Watch for quotation requests from authenticated customer accounts and RFQs assigned by staff.
2. Match the request to the actual CRM enquiry, customer, product record and requested specifications.
3. Create a quotation-preparation task for the sales team when price, taxes, freight, lead time, validity, payment or product details are missing.
4. Prepare a customer-facing draft only from a formal quotation record that staff has completed.
5. Send the final quotation by email and WhatsApp only after the Super Admin has approved that exact document version and recipient.

Ananya must never invent or estimate prices, product dimensions, standards, stock, tax, delivery commitments or commercial terms. A customer-submitted RFQ is not itself an approved quotation.

### Riya — billing and invoices
1. Monitor invoice/billing records created and finalised by the accounts team.
2. Confirm customer identity, order reference, invoice number, amount, currency, document version and recipient.
3. Queue the approved invoice document for delivery by email and WhatsApp.
4. Record provider message IDs, timestamps and delivery/failure states against the invoice.

Riya must not create or edit accounting values, mark an invoice as paid, or send a draft invoice as final. The accounts team remains the system of record for billing.

### Neha — Contact Us enquiries
1. Receive Contact Us submissions and attach a unique query/ticket reference.
2. Link the ticket to the matching customer account when identity is verified.
3. Route the ticket to the responsible staff member or team and track its owner and state.
4. Capture the staff member's proposed response as a draft.
5. Send that response only after the Super Admin approves the exact text and destination. The Super Admin may edit the response before approval.

Neha may acknowledge receipt and provide the ticket reference automatically. She must not present an unapproved staff draft as an official company answer.

### Arjun — customer support and operations manager
1. Provide the customer chat entry point on the website.
2. Authenticate the customer and verify ownership of the referenced quotation, invoice or enquiry before retrieving details.
3. Query the relevant CRM and agent records; request missing context from the relevant agent or staff queue.
4. Prepare a proposed status update with its source records and send it to the Super Admin for review.
5. Allow the Super Admin to approve, edit or reject the proposed reply inside the review interface.
6. Send only the approved version, then log the interaction and delivery result.

While the answer is being checked, display a holding response such as:

> Thank you for your patience. I’m checking the latest status of your request with our team. I’ll get back to you shortly.

Arjun must not disclose other customers' information, infer payment or dispatch status, promise timelines, or claim a document/message was delivered without a confirmed provider result.

## Required approval and delivery lifecycle

Use a server-enforced state machine for each customer-facing action:

`received → assigned → draft_prepared → pending_admin_approval → approved → dispatching → sent → delivered`

Alternative terminal or review states: `changes_requested`, `rejected`, `delivery_failed`, `cancelled`.

- Only an authorised Super Admin can approve or edit-and-approve a customer-facing quotation, invoice dispatch, staff response or Arjun chat reply.
- Approval must be bound to the immutable draft version, customer/recipient, channel and referenced business record. Any edit after approval invalidates the approval and returns the item to `pending_admin_approval`.
- The server must re-check permission and approval state immediately before dispatch; hiding buttons in the frontend is not sufficient.
- Use idempotency keys and provider message IDs to prevent duplicate sends when requests retry.
- Store the approving user, timestamp, approved content hash, target, channel, delivery provider response and audit event.
- A failed email or WhatsApp send must remain visible in the Super Admin queue for retry or staff follow-up. Never show a failure as delivered.

## Super Admin workspace

Add an **AI Operations** area to the CRM with:

- Agent directory and role/status visibility.
- Unified task inbox filtered by agent, customer, reference, date and approval/delivery state.
- Draft review panel showing customer, source record, channel, exact message/document preview and source data.
- Approve, edit-and-approve, request changes and reject actions.
- Activity history, delivery provider response and retry controls.
- Agent health/configuration status, including missing email or WhatsApp credentials.

Staff may own and resolve enquiries or prepare commercial documents according to their permissions. Staff cannot bypass the Super Admin approval gate for the customer-facing actions specified above.

## Data and integration work required before activation

Repository review identified existing customer, contact, enquiry, quotation and generic agent-task records, plus Resend email and Meta WhatsApp service integrations. The following gaps must be addressed before enabling the full workflow:

1. Replace the legacy seven-agent sales/marketing registry with these four named agents, while retaining safe compatibility for historical task records.
2. Refactor the current automatic quotation draft logic. It contains fallback catalogue selection, estimated unit prices and default technical/commercial values. Those are not safe sources for a customer quotation.
3. Add a first-class Invoice model and accounts-team workflow; do not treat a quotation as an invoice.
4. Add customer conversation/message storage and a chat API, with account ownership checks and moderation/rate limits.
5. Add task types and approval endpoints for invoice delivery, contact-query responses and chat status replies.
6. Add server-side dispatch workers for approved documents/messages using the existing email and WhatsApp providers.
7. Add the AI Operations review interface to the CRM, plus audit records and tests for approval bypass, cross-customer access, duplicate dispatch and failed delivery.
8. Provision and verify all four mailboxes, set the production Resend sender/domain configuration, and configure Meta WhatsApp Business Cloud API credentials and approved message templates.

## Suggested implementation phases

1. **Governance foundation:** four-agent registry, access rules, task states, audit trail and Super Admin review UI.
2. **Quotation delivery:** connect Ananya to existing RFQ/quotation records and add approved email/WhatsApp dispatch.
3. **Invoice delivery:** add invoice/accounting records and connect Riya to approved invoice documents.
4. **Enquiry resolution:** route Contact Us tickets to staff and enable Neha's approved response workflow.
5. **Customer chat:** build the authenticated chat/ticket experience and Arjun's cross-agent status lookup with mandatory approval.

Do not enable unattended customer messaging until the approval state machine, identity checks, provider credentials, delivery logging and automated tests are in place.
