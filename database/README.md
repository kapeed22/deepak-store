# Database

Deepak Store uses PostgreSQL as the authoritative persistent data store.

## Schema Management

Database structure is managed through version-controlled SQL migrations.

```text
database/
└── migrations/
    └── 001_initial_schema.sql
```

Migrations must be applied in order.

Do not manually create application tables through the AWS RDS console.

## Source of Truth

PostgreSQL is authoritative for:

* Users
* Products
* Categories
* Inventory
* Carts
* Orders
* Payments
* Reservations
* Notifications

Redis is not a replacement for PostgreSQL.

Redis will be used for:

* caching
* idempotency
* rate limiting

## Monetary Values

Monetary values use PostgreSQL `NUMERIC(12,2)`.

The initial application currency is INR.

Floating-point types must not be used for monetary values.

## Inventory

Inventory uses:

```text
quantity
reserved_quantity
```

with the invariant:

```text
0 <= reserved_quantity <= quantity
```

Inventory reservation and release operations must be performed transactionally.

## Order History

Orders contain purchase-time snapshots of:

* product name
* unit price
* quantity
* shipping address

This prevents later product or address changes from altering historical orders.

## Migration Policy

Future schema changes must use additional migrations.

Example:

```text
001_initial_schema.sql
002_add_product_image.sql
003_add_order_delivery_metadata.sql
```

Existing migrations should not be rewritten after they have been applied to a shared environment.
