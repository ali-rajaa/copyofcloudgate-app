# Legal Pages: Information Required

**To:** CEO / Company Officer
**Re:** Information needed to finalise the CloudGate Privacy Policy and Terms of Service
**Documents affected:** `privacy-policy.html`, `terms-of-service.html`

Both pages are drafted and complete apart from **21 factual fields** that only the company can confirm. Each appears highlighted in yellow on the page so nothing can be published by accident.

Please fill in the "Answer" column below and return this document. Nothing else is needed.

> **Note:** These documents are drafts and have not been reviewed by a lawyer. Once the fields below are completed, both should be reviewed by an Australian solicitor before going live.

---

## A. Company identity (6 fields)

| # | Field | Where it appears | What is needed | Answer |
|---|---|---|---|---|
| 1 | **Full legal entity name** | Privacy: Who we are, Contact<br>Terms: Agreement, General | The exact registered company name, e.g. "CloudGate Technologies Pty Ltd". Currently the pages say "CloudGate Technologies" with no entity type. | |
| 2 | **ABN / ACN** | Privacy: Who we are<br>Terms: Agreement | The registered ABN and/or ACN. Required to identify the contracting party. | |
| 3 | **Registered business address** | Privacy: Who we are, Contact<br>Terms: General | Full postal address. Required under the Privacy Act for privacy complaints. | |
| 4 | **Privacy contact person** | Privacy: Contact | Name or role title of whoever handles privacy requests, e.g. "Privacy Officer" or a named individual. | |
| 5 | **Governing state** | Terms: Governing law | Which Australian state's law governs the agreement, and whose courts hear disputes. Normally where the company is registered. Draft assumes Western Australia. | |
| 6 | **Effective date** | Both, page header | The date the documents take effect. Usually the day you publish. | |

---

## B. Data handling (5 fields) — *most important for legal exposure*

| # | Field | Where it appears | What is needed | Answer |
|---|---|---|---|---|
| 7 | **Hosting provider** | Privacy: Where your data is stored | Who hosts the infrastructure, e.g. AWS, Google Cloud, Azure. | |
| 8 | **Data centre region(s)** | Privacy: Where your data is stored | Physical location(s) where user files are stored, e.g. "Sydney, Australia" or "us-east-1, United States". **Users must be told if data leaves Australia.** | |
| 9 | **Encryption at rest** | Privacy: Where your data is stored | ⚠️ **Confirm whether files are encrypted at rest on the servers, and if so how.** The draft deliberately makes no claim, because stating this falsely is a misleading-conduct risk. If it is not implemented, we simply say nothing. | |
| 10 | **Overseas transfer mechanism** | Privacy: Where your data is stored | Only needed if data is stored outside Australia or you have EU users. Typically "Standard Contractual Clauses". If all data stays in Australia and you have no EU users, answer "N/A". | |
| 11 | **Payment processor** | Privacy: Information we collect | Who processes card payments, e.g. Stripe, Apple App Store, Google Play. | |

---

## C. Retention periods (4 fields)

These set how long data is kept. They should match what the system **actually does**, not what sounds good.

| # | Field | Where it appears | What is needed | Answer |
|---|---|---|---|---|
| 12 | **Deleted file retention** | Privacy: Retention and deletion | How long a deleted file stays recoverable before permanent deletion. Industry norm is 30 days. | |
| 13 | **Account closure deletion** | Privacy: Retention and deletion | How long after account closure until data is fully deleted. Common: 30–90 days. | |
| 14 | **Inactive account period** | Privacy: Retention and deletion | How long an account can sit unused before data may be deleted, after notice. Common: 12–24 months. If you never delete inactive accounts, answer "N/A". | |
| 15 | **Dispute resolution period** | Terms: Governing law | How long the parties try to resolve a dispute informally before court. Common: 30 days. | |

---

## D. Commercial terms (4 fields)

| # | Field | Where it appears | What is needed | Answer |
|---|---|---|---|---|
| 16 | **Currency** | Terms: Billing | Currency prices are charged in, e.g. AUD. | |
| 17 | **GST treatment** | Terms: Billing | Whether displayed prices include or exclude GST. | |
| 18 | **Downgrade grace period** | Terms: Billing | If a user downgrades and is over the free 100GB limit, how long they get to reduce usage before uploads are restricted. Common: 30 days. | |
| 19 | **Liability cap amount** | Terms: Limitation of liability | ⚠️ **A commercial decision.** The cap for free-plan users who have paid nothing. Draft suggests AUD $100. Lower is more protective but must stay reasonable to be enforceable. Worth a lawyer's input. | |

---

## E. Product policy (2 fields)

| # | Field | Where it appears | What is needed | Answer |
|---|---|---|---|---|
| 20 | **Minimum age** | Privacy: Children<br>Terms: Eligibility | Minimum age to hold an account. 13 is the US floor (COPPA); 16 is the safer default for GDPR. Should match what the app enforces at signup. | |
| 21 | **Analytics provider** | Privacy: Cookies and analytics | Any third-party analytics or crash reporting in use, e.g. Google Analytics, Firebase, Sentry. If none, answer "we do not use third party analytics". | |

---

## Three items worth the CEO's direct attention

1. **Encryption at rest (#9)** — the marketing pages currently say "encrypted in transit" only. If files are *also* encrypted at rest, that is a genuine selling point worth stating. If they are not, we must not imply it anywhere.

2. **Liability cap (#19)** — this is the single clause that most limits company exposure. Worth deciding deliberately rather than accepting a default.

3. **Data location (#8)** — if user files are stored outside Australia, this must be disclosed. Non-disclosure is a direct breach of Australian Privacy Principle 8.

---

## Also outstanding (not blocking these documents)

- **Plan pricing** — actual prices for Plus (250GB), Pro (500GB) and Family (1TB), monthly and yearly, needed to build the pricing page.
- **Feature verification** — confirmation that Vault Lock, one-tap restore, document scanning and file sharing all exist as described on the marketing pages.
- **Footer links** — Privacy Policy currently points to an old Google Sites page and Terms of Service is not linked at all. Both need repointing once these pages go live.
