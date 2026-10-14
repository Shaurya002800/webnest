# WebNest business-flow configuration

The website code and database schema are ready before the final business details are known. Configure these hosted runtime values later:

- `LEGAL_BUSINESS_NAME`: name shown on payment and email screens.
- `BUSINESS_EMAIL`: receives enquiry and payment notifications.
- `BUSINESS_WHATSAPP_NUMBER`: digits only, including country code, for example `919876543210`.
- `BUSINESS_UPI_ID`: public business UPI address used on approved payment links.
- `EMAIL_FROM`: verified Resend sender, for example `WebNest <hello@webnest.in>`.
- `RESEND_API_KEY`: secret used only by the Worker.
- `ADMIN_ACCESS_TOKEN`: a long random secret used to open `/admin`; it is kept in session storage, not URLs.

The public workflow is enquiry → reference → scoped discussion → quotation → `/payment?reference=...&amount=...&purpose=...` → pending payment confirmation → manual bank verification → receipt.

The payment screen never declares a payment successful. It records the UTR as pending until the administrator verifies the matching bank credit and changes its status in `/admin`.
