# Deepak Store — Domain Specification

## 1. Purpose

Deepak Store is a small grocery/provision-store application.

The business functionality is intentionally simple so that the project can focus on demonstrating sound software and cloud architecture.

---

## 2. Actors

### Customer

A customer can:

* create an account
* authenticate
* browse products
* search products
* add products to a cart
* modify the cart
* checkout
* make a payment
* view order history
* receive notifications

### Administrator

An administrator has all customer capabilities plus:

* create/update products
* manage inventory
* view orders
* update order status
* view payment status

A user may have both customer and administrator capabilities.

Authorization is enforced by the backend. Hiding an administrative UI element is not considered a security control.

---

## 3. Authentication

Supported authentication mechanisms:

* Email/password
* Google OAuth
* Mobile OTP

The authentication mechanism establishes the identity of the user.

After successful authentication, the application issues its own application access token.

JWT is the token format; it is not the authorization system.

OTP delivery will initially use a mock provider so that development does not depend on paid SMS infrastructure.

---

## 4. Authorization

Authorization is separate from authentication.

OpenFGA is responsible for evaluating application authorization relationships.

The application backend remains responsible for enforcing the authorization decision on protected operations.

Initial authorization requirements include:

* customer access
* administrator access
* ownership of customer resources
* administrative product management
* administrative inventory management
* administrative order management

---

## 5. Product Domain

A product represents an item sold by Deepak Store.

A product has at least:

* identifier
* name
* description
* category
* price
* active/inactive status
* timestamps

Products may belong to categories such as:

* Dairy
* Vegetables
* Snacks
* Beverages
* Groceries
* Household

Inventory is modeled separately from product information.

---

## 6. Inventory

Inventory represents the quantity of a product available for sale.

Inventory must support concurrent checkout attempts safely.

Example:

```text
Available stock = 2

Customer A attempts to purchase 2
Customer B attempts to purchase 2
```

The system must not allow both transactions to successfully consume the same two units.

Inventory reservation therefore exists as a separate domain concept.

The database is the source of truth for inventory.

Redis must not be treated as the authoritative inventory store.

---

## 7. Cart

A customer has a cart containing products and quantities.

The cart is mutable until checkout.

A cart item references:

* product
* quantity
* price information required by the application

The final order price must not depend on a mutable product price after the order has been created.

---

## 8. Order

An order represents a customer's purchase.

An order contains:

* customer
* order items
* amounts
* payment information
* order status
* timestamps

Order items represent the products and quantities purchased.

The order retains the relevant purchase-time pricing.

---

## 9. Order State Machine

The initial order lifecycle is:

```text
CREATED
   ↓
PAYMENT_PENDING
   ├──→ PAYMENT_FAILED
   │
   └──→ PAID
          ↓
       CONFIRMED
          ↓
       PROCESSING
          ↓
   READY_FOR_PICKUP / SHIPPED
          ↓
       DELIVERED
```

Cancellation and reservation-expiration transitions will be defined explicitly during implementation.

Invalid state transitions must be rejected.

For example:

```text
PAYMENT_FAILED → DELIVERED
```

is invalid.

---

## 10. Payment

The application uses a payment-provider abstraction.

The application must not directly couple the order domain to one specific payment implementation.

Initial implementation:

```text
MockUPIPaymentProvider
```

The mock provider allows development and testing of:

* success
* failure
* timeout
* retry
* duplicate processing

A real UPI payment provider can later implement the same abstraction.

A static UPI QR code or UPI ID is not considered sufficient evidence for automatic payment confirmation.

---

## 11. Payment Processing

Payment processing is asynchronous.

The API creates the payment operation and publishes a payment command/job.

Example:

```text
ProcessPayment
```

The payment worker consumes the command and communicates with the configured payment provider.

The result is represented as an event.

Examples:

```text
PaymentSucceeded
PaymentFailed
PaymentTimedOut
```

Commands request an operation.

Events describe something that has already happened.

---

## 12. Inventory Reservation

Checkout creates an inventory reservation before payment processing.

A reservation represents inventory temporarily held for an order.

A reservation may eventually be:

```text
ACTIVE
CONFIRMED
RELEASED
EXPIRED
```

Successful payment causes the reservation to become confirmed.

Failed/expired payment causes the reservation to be released.

Reservation behavior must be implemented transactionally.

---

## 13. Idempotency

Operations that can be retried must be idempotent.

Examples include:

* checkout
* payment processing
* payment callbacks/events
* notification jobs

The system must not create duplicate orders or process the same payment operation multiple times because of retries or duplicate messages.

Redis will initially be used for API idempotency handling where appropriate.

The exact idempotency contract will be defined before implementation.

---

## 14. Rate Limiting

Rate limiting uses a token-bucket algorithm.

Redis provides the distributed state required by the rate limiter.

Different endpoints may use different limits.

Examples:

```text
Authentication endpoints
Customer APIs
Administrative APIs
Payment-related APIs
```

Unauthenticated endpoints may use client/IP-based identities.

Authenticated endpoints may additionally use the authenticated user identity.

Rate limiting must be implemented atomically.

---

## 15. Caching

Redis is used as a cache for suitable read-heavy data.

Cached data is never considered the authoritative source of truth.

PostgreSQL remains authoritative for persistent business data.

---

## 16. Notifications

Notifications are asynchronous.

Events such as:

```text
OrderPlaced
PaymentSucceeded
PaymentFailed
OrderConfirmed
OrderShipped
OrderDelivered
```

may generate notification jobs.

The notification worker communicates with email/SMS providers.

Notification failure must not cause an otherwise successful order or payment to fail.

Failed notification jobs should support retry and eventual dead-letter handling.

---

## 17. Messaging

AWS SQS is the initial messaging infrastructure.

Queues are used for asynchronous work rather than synchronous request/response operations.

Initial workload categories include:

* payment processing
* notifications

Dead-letter queues will be used for messages that repeatedly fail processing.

Message consumers must be idempotent.

---

## 18. Database

PostgreSQL is the authoritative application database.

The initial domain entities are:

```text
User
Category
Product
Inventory
Cart
CartItem
Address
Order
OrderItem
Payment
PaymentAttempt
InventoryReservation
Notification
```

The final relational schema, constraints, indexes, foreign keys, and transaction boundaries will be derived from this specification.

Database schema changes will be version-controlled through migrations.

---

## 19. Redis Responsibilities

Redis is used for:

* token-bucket rate limiting
* API idempotency
* caching

Redis is not the system of record for:

* users
* products
* inventory
* orders
* payments

---

## 20. Application Architecture

The synchronous API is a modular monolith.

Initial modules:

```text
Auth
Users
Products
Categories
Cart
Inventory
Orders
Checkout
Payments
Admin
Notifications
```

The API communicates with PostgreSQL, Redis, OpenFGA and SQS.

Asynchronous processing is handled by independently deployable workers.

Initial workers:

```text
Payment Worker
Notification Worker
```

Additional workers will only be introduced when there is a genuine architectural reason.

---

## 21. High-Level Architecture

```text
                    ┌─────────────────┐
                    │    Customer     │
                    │    Browser      │
                    └────────┬────────┘
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Node.js API   │
                    │   TypeScript    │
                    └───┬────┬────┬───┘
                        │    │    │
             ┌──────────┘    │    └──────────┐
             ▼               ▼               ▼
        ┌─────────┐    ┌──────────┐    ┌─────────┐
        │Postgres │    │  Redis   │    │ OpenFGA │
        └────┬────┘    └──────────┘    └─────────┘
             │
             │ async work
             ▼
        ┌──────────┐
        │   SQS    │
        └────┬─────┘
             │
       ┌─────┴───────────┐
       ▼                 ▼
┌──────────────┐  ┌────────────────┐
│Payment Worker│  │Notification    │
│              │  │Worker          │
└──────┬───────┘  └───────┬────────┘
       │                  │
       ▼                  ├── Email
Payment Provider          └── SMS
```

---

## 22. Infrastructure Direction

The eventual AWS deployment will use:

```text
Amazon EKS       → API + workers
Amazon RDS       → PostgreSQL
ElastiCache      → Redis/Valkey
Amazon SQS       → asynchronous messaging
Amazon ECR       → container images
Amazon S3        → object storage where required
AWS Secrets Manager → secrets
ALB              → HTTP ingress/load balancing
VPC              → network isolation
IAM              → AWS permissions
CloudWatch/OpenTelemetry → observability
```

Infrastructure will be managed with Terraform.

GitHub Actions will build, test and publish immutable container images to ECR.

GitHub OIDC will be used for GitHub-to-AWS authentication rather than long-lived AWS credentials.

---

## 23. Design Principle

The project should demonstrate that a simple business domain can be implemented using disciplined engineering without artificially creating complexity.

We prefer:

```text
Simple domain
      +
Strong contracts
      +
Correct data modeling
      +
Controlled asynchronous processing
      +
Explicit failure handling
      +
Infrastructure automation
```

over unnecessary microservices or infrastructure added only for appearance.
