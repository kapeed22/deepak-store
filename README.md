# Deepak Store

Deepak Store is a private, portfolio-grade grocery/provision-store application.

The business domain is intentionally simple. The engineering architecture demonstrates production-oriented patterns including:

* Node.js / TypeScript backend
* React-based frontend
* PostgreSQL
* Redis / ElastiCache
* Asynchronous processing with AWS SQS
* Payment and notification workers
* Inventory reservation and concurrency control
* Idempotency
* Token-bucket rate limiting
* Authentication and authorization
* OpenFGA-based authorization
* Docker
* Amazon ECR
* Amazon EKS
* AWS infrastructure managed with Terraform
* GitHub Actions CI/CD
* GitHub OIDC → AWS authentication
* Observability and failure handling

## Architecture Principle

The application uses a modular monolith for synchronous business operations and independently deployable workers for asynchronous workloads.

The project deliberately avoids unnecessary microservices and infrastructure complexity.

## Repository Structure

```text
apps/
  frontend/
  api/

workers/
  payment/
  notification/

packages/
  contracts/
  shared/

database/

infrastructure/
  terraform/

k8s/

docker/

docs/
  architecture/

.github/
  workflows/
```

## Core Business Capabilities

### Customer

* Register
* Login with email/password
* Google OAuth
* OTP authentication architecture
* Browse products
* Search products
* View product details
* Manage cart
* Checkout
* Make UPI-oriented payment
* View orders
* Receive order/payment notifications

### Admin

* Manage products
* Manage inventory
* View orders
* Update order status
* View payment status

## Engineering Goals

The project is designed to demonstrate:

1. Clear domain modeling
2. Transactional database operations
3. Inventory consistency
4. Idempotent APIs
5. Asynchronous event processing
6. Retry and failure handling
7. Authentication vs authorization separation
8. Infrastructure as code
9. Containerized deployment
10. CI/CD
11. Cloud-native architecture

This repository is the single source of truth for application code, infrastructure definitions, contracts, and documentation.
