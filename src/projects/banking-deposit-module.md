---
title: "Banking Deposit Module"
tag: "Banking · C-Edge Technologies"
period: "2018 — 2020"
stack: ["Java", "Spring Boot", "AOP", "DTOs", "Oracle DB"]
impact: "30% reduction in data over-fetching"
order: 3
---

## The Problem

The core deposit system had no clear separation between domain logic and data transfer, causing significant over-fetching and an unauditable codebase with no centralised logging.

## Architecture

```
[REST Controller]
       ↓
[Service — AOP Logging Aspect]
       ↓
[DTO Layer — prevents over-fetching]
       ↓
[Spring Data JPA → Oracle DB]
```

## What I Did

Designed and delivered the core deposit module covering deposit processing and interest calculations. Introduced AOP-based cross-cutting logging so every service call was captured without polluting business logic. Built a DTO layer that decoupled the API contract from the persistence model, eliminating unnecessary data transfer.

## Outcomes

- **30%** reduction in data over-fetching
- Full audit trail via AOP logging — zero changes to business logic
- Clean separation of concerns enabling independent evolution of API and DB schema
