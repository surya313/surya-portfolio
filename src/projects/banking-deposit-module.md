---
title: "Banking Deposit Module"
tag: "Banking · C-Edge Technologies"
period: "2018 — 2020"
stack: ["Java", "Spring Boot", "AOP", "Spring Data JPA", "Oracle DB"]
impact: "30% reduction in data over-fetching"
order: 3
---

## The Problem

The core deposit system had no clear separation between the API contract and the persistence model. Every API response returned raw entity data, causing significant over-fetching. Service calls had no consistent logging, making defect triage and audit trails nearly impossible without touching business logic.

## Architecture

```
[Client]
   ↓
[REST Controller] ←→ [Request / Response DTOs]
   ↓
[Service Layer]
   ↑ intercepted transparently by [AOP Logging Aspect]
   ↓
[Spring Data JPA → Oracle DB]
```

## What I Did

Designed and delivered the core deposit module covering deposit processing and interest calculations. Introduced AOP-based logging as a cross-cutting concern. Aspects intercept service method calls transparently, capturing inputs, outputs, and exceptions without any changes to business logic.

Built a DTO layer at the API boundary to decouple the response contract from the JPA entity model, ensuring only the required fields are serialised and returned to the caller. This eliminated unnecessary data transfer.

## Outcomes

- **30%** reduction in data over-fetching at the API boundary
- Full audit trail via AOP with zero modifications to business logic
- Clean separation between API contract and persistence model, enabling both to evolve independently
