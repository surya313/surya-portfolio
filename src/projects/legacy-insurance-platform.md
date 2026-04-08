---
title: "Legacy Insurance Platform Modernisation"
tag: "Insurance · Lloyd's of London"
period: "2022 — Present"
stack: ["Java 21", "Spring Boot", "AWS SNS", "AWS SQS", "AWS EKS", "PostgreSQL", "ELK Stack"]
impact: "30% fewer defects · 20% faster APIs"
order: 1
---

## The Problem

Lloyd's operated critical insurance systems built on legacy monolithic architecture. They were brittle, expensive to maintain, and unable to scale with growing underwriting volumes. The ongoing mission is to progressively modernise these systems into a cloud-native, event-driven microservices architecture on AWS.

## Architecture

```
[Policy Service] → AWS SNS → [SQS Queue] → [Claims Service]
[Underwriting]  → AWS SNS → [SQS Queue] → [Notification Service]
       ↓
[PostgreSQL + DynamoDB]  [Elasticsearch + Kibana]
       ↓
  [AWS EKS — Docker]
       ↓
[Jenkins CI/CD + SonarQube]
```

## What I Did

Leading a team of 7 engineers in the ongoing modernisation of legacy insurance systems into event-driven Spring Boot microservices on AWS EKS. Using AWS SNS and SQS for reliable async messaging between services, decoupling policy, claims, underwriting, and notification workflows.

Optimised PostgreSQL and DynamoDB queries and integrated Amazon Q Developer for code quality and defect reduction. Championed TDD across the team, pushing test coverage from under 40% to 85%+ on core services. Built full observability using the ELK stack (Elasticsearch, Logstash, Kibana), enabling real-time incident detection.

## Outcomes

- **30%** reduction in post-deploy defects
- **20%** faster API response times
- **85%+** test coverage on core services
- Full ELK observability across all microservices
- Ongoing modernisation actively in progress
