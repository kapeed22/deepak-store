-- Deepak Store
-- Migration: 001_initial_schema
-- PostgreSQL

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(320),
    password_hash TEXT,

    full_name VARCHAR(150) NOT NULL,

    phone VARCHAR(30),
    google_subject VARCHAR(255),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_phone_unique UNIQUE (phone),
    CONSTRAINT users_google_subject_unique UNIQUE (google_subject)
);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT categories_slug_unique UNIQUE (slug)
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    description TEXT,

    price NUMERIC(12, 2) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT products_category_fk
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT products_slug_unique UNIQUE (slug),

    CONSTRAINT products_price_non_negative
        CHECK (price >= 0)
);

CREATE INDEX products_category_id_idx
    ON products(category_id);

CREATE INDEX products_active_idx
    ON products(is_active);

-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT inventory_product_unique
        UNIQUE (product_id),

    CONSTRAINT inventory_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT inventory_quantity_non_negative
        CHECK (quantity >= 0),

    CONSTRAINT inventory_reserved_non_negative
        CHECK (reserved_quantity >= 0),

    CONSTRAINT inventory_reserved_not_exceed_quantity
        CHECK (reserved_quantity <= quantity)
);

-- ============================================================
-- ADDRESSES
-- ============================================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    label VARCHAR(50),
    recipient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,

    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),

    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT addresses_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX addresses_user_id_idx
    ON addresses(user_id);

-- ============================================================
-- CARTS
-- ============================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT carts_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX carts_one_cart_per_user_idx
    ON carts(user_id);

-- ============================================================
-- CART ITEMS
-- ============================================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cart_items_cart_fk
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT cart_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT cart_items_quantity_positive
        CHECK (quantity > 0),

    CONSTRAINT cart_items_cart_product_unique
        UNIQUE (cart_id, product_id)
);

CREATE INDEX cart_items_cart_id_idx
    ON cart_items(cart_id);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    status VARCHAR(40) NOT NULL,

    subtotal NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    shipping_address_snapshot JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orders_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT orders_subtotal_non_negative
        CHECK (subtotal >= 0),

    CONSTRAINT orders_total_non_negative
        CHECK (total >= 0),

    CONSTRAINT orders_status_valid
        CHECK (
            status IN (
                'CREATED',
                'PAYMENT_PENDING',
                'PAID',
                'PAYMENT_FAILED',
                'CONFIRMED',
                'PROCESSING',
                'READY_FOR_PICKUP',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED'
            )
        )
);

CREATE INDEX orders_user_id_idx
    ON orders(user_id);

CREATE INDEX orders_status_idx
    ON orders(status);

CREATE INDEX orders_created_at_idx
    ON orders(created_at);

-- ============================================================
-- ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,
    product_id UUID NOT NULL,

    product_name VARCHAR(200) NOT NULL,

    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    line_total NUMERIC(12, 2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT order_items_order_fk
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT order_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT order_items_unit_price_non_negative
        CHECK (unit_price >= 0),

    CONSTRAINT order_items_quantity_positive
        CHECK (quantity > 0),

    CONSTRAINT order_items_line_total_non_negative
        CHECK (line_total >= 0)
);

CREATE INDEX order_items_order_id_idx
    ON order_items(order_id);

-- ============================================================
-- INVENTORY RESERVATIONS
-- ============================================================

CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,
    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT inventory_reservations_order_fk
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT inventory_reservations_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT inventory_reservations_quantity_positive
        CHECK (quantity > 0),

    CONSTRAINT inventory_reservations_status_valid
        CHECK (
            status IN (
                'ACTIVE',
                'CONFIRMED',
                'RELEASED',
                'EXPIRED'
            )
        )
);

CREATE INDEX inventory_reservations_order_id_idx
    ON inventory_reservations(order_id);

CREATE INDEX inventory_reservations_product_id_idx
    ON inventory_reservations(product_id);

CREATE INDEX inventory_reservations_status_expiry_idx
    ON inventory_reservations(status, expires_at);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    provider VARCHAR(50) NOT NULL,

    amount NUMERIC(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',

    provider_payment_id VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT payments_order_fk
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT payments_order_unique
        UNIQUE (order_id),

    CONSTRAINT payments_amount_non_negative
        CHECK (amount >= 0),

    CONSTRAINT payments_status_valid
        CHECK (
            status IN (
                'PENDING',
                'SUCCEEDED',
                'FAILED',
                'TIMED_OUT'
            )
        )
);

CREATE INDEX payments_status_idx
    ON payments(status);

CREATE UNIQUE INDEX payments_provider_payment_id_unique_idx
    ON payments(provider_payment_id)
    WHERE provider_payment_id IS NOT NULL;

-- ============================================================
-- PAYMENT ATTEMPTS
-- ============================================================

CREATE TABLE payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id UUID NOT NULL,

    attempt_number INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    provider_reference VARCHAR(255),

    error_code VARCHAR(100),
    error_message TEXT,

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT payment_attempts_payment_fk
        FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE CASCADE,

    CONSTRAINT payment_attempts_number_positive
        CHECK (attempt_number > 0),

    CONSTRAINT payment_attempts_status_valid
        CHECK (
            status IN (
                'PENDING',
                'SUCCEEDED',
                'FAILED',
                'TIMED_OUT'
            )
        ),

    CONSTRAINT payment_attempts_unique_number
        UNIQUE (payment_id, attempt_number)
);

CREATE INDEX payment_attempts_payment_id_idx
    ON payment_attempts(payment_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    order_id UUID,

    type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    recipient VARCHAR(320) NOT NULL,

    attempt_count INTEGER NOT NULL DEFAULT 0,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    sent_at TIMESTAMPTZ,

    CONSTRAINT notifications_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT notifications_order_fk
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,

    CONSTRAINT notifications_channel_valid
        CHECK (
            channel IN (
                'EMAIL',
                'SMS'
            )
        ),

    CONSTRAINT notifications_status_valid
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'SENT',
                'FAILED'
            )
        ),

    CONSTRAINT notifications_attempt_count_non_negative
        CHECK (attempt_count >= 0)
);

CREATE INDEX notifications_status_idx
    ON notifications(status);

CREATE INDEX notifications_order_id_idx
    ON notifications(order_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER inventory_set_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER addresses_set_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER carts_set_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cart_items_set_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER inventory_reservations_set_updated_at
BEFORE UPDATE ON inventory_reservations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER notifications_set_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
