---
title: "Legacy Insurance Platform Modernisation"
tag: "Insurance · Lloyd's of London"
period: "2022 — Present"
stack: ["Java 17", "Spring Boot", "Kafka", "AWS EKS", "PostgreSQL", "ELK Stack"]
impact: "30% fewer defects · 20% faster APIs"
order: 1
---

## The Problem

Lloyd's operated critical insurance systems built on legacy monolithic architecture — brittle, expensive to maintain, and unable to scale with growing underwriting volumes.

## Architecture

```
[Policy Service] → Kafka → [Claims Service]
[Underwriting]  → Kafka → [Notification Service]
       ↓
[PostgreSQL + DynamoDB]  [Elasticsearch + Kibana]
       ↓
  [AWS EKS — Docker]
       ↓
[Jenkins CI/CD + SonarQube]
```

## What I Did

Led a team of 7 engineers decomposing the monolith into event-driven Spring Boot microservices on AWS EKS. Implemented Apache Kafka for async messaging between services, optimised PostgreSQL and DynamoDB queries, and integrated Amazon Q Developer for code quality and defect reduction.

Championed TDD across the team, pushing test coverage from under 40% to 85%+ on core services. Built full observability using the ELK stack — Elasticsearch, Logstash, Kibana — enabling real-time incident detection.

## Outcomes

- **30%** reduction in post-deploy defects
- **20%** faster API response times
- **85%+** test coverage on core services
- Full ELK observability across all microservices
