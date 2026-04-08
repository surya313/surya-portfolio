---
layout: post.njk
title: "Event-Driven Architecture Patterns I Use at Lloyd's of London"
description: "A practical look at Kafka-based event sourcing, dead letter queues, and saga patterns in a regulated insurance environment."
date: 2026-03-15
tags:
  - blog
  - kafka
  - architecture
  - java
---

After 3+ years designing event-driven systems for Lloyd's of London, I've built up a clear set of patterns that actually work under the pressure of a regulated, mission-critical insurance environment.

Here's what I reach for — and why.

## Why Event-Driven at Lloyd's?

Insurance platforms at Lloyd's handle complex multi-party workflows: a single policy can involve underwriters, brokers, claims handlers, and compliance teams — often simultaneously. The traditional synchronous request-response model falls apart quickly here. You end up with tight coupling, cascading failures, and no audit trail.

Kafka changes that. Each domain event becomes a first-class citizen, independently replayable, independently consumable.

## Pattern 1: Event Sourcing for Audit Trails

In insurance, audit is non-negotiable. Every state change on a policy or claim must be traceable. We store every domain event as an immutable log entry in Kafka. Instead of updating a record in PostgreSQL, we append an event:

```
PolicyUnderwritten { policyId, underwriterId, premium, timestamp }
ClaimSubmitted     { claimId, policyId, amount, timestamp }
ClaimApproved      { claimId, approvedBy, timestamp }
```

The current state of any entity is a projection of its event history. This gives us a full audit trail for free and makes replaying past states trivial — extremely useful when regulators ask "what did this policy look like on 14th January?"

## Pattern 2: Dead Letter Queues (DLQs) for Resilience

In production, consumers fail. A downstream service might be temporarily unavailable, a message might be malformed, or a transient database lock might cause a processing exception.

Without a DLQ strategy, you have two bad options: skip the message (data loss) or block forever (system halt).

Our pattern: after N retry attempts (we use 3), failed messages are routed to a dedicated dead letter topic. An alerting job monitors DLQ lag and pages the team. A separate reprocessing service lets us replay DLQ messages once the underlying issue is fixed — with full observability.

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, PolicyEvent> kafkaListenerFactory() {
    var factory = new ConcurrentKafkaListenerContainerFactory<String, PolicyEvent>();
    factory.setCommonErrorHandler(new DefaultErrorHandler(
        new DeadLetterPublishingRecoverer(kafkaTemplate),
        new FixedBackOff(1000L, 3L)
    ));
    return factory;
}
```

## Pattern 3: The Saga Pattern for Long-Running Workflows

A policy issuance at Lloyd's isn't a single transaction — it spans multiple services: underwriting, compliance checks, document generation, broker notification. Each step can fail independently.

We use the choreography-based saga: each service emits events that trigger the next step, and compensating events handle rollback.

```
PolicySubmitted → [Underwriting Service] → PolicyUnderwritten
PolicyUnderwritten → [Compliance Service] → ComplianceCleared
ComplianceCleared → [Document Service] → PolicyDocumentGenerated
PolicyDocumentGenerated → [Notification Service] → BrokerNotified
```

If Compliance rejects the policy, it emits `ComplianceRejected`, which triggers compensating actions upstream. No distributed transaction required.

## What I've Learned

The hardest part of event-driven systems isn't the technology — Kafka is well-documented and battle-tested. The hard part is **schema evolution**. When your event schemas change, you need to handle old consumers still reading old event formats. We use Avro with the Confluent Schema Registry for exactly this reason.

The second hardest part is **testing**. Unit testing Kafka consumers in isolation is straightforward, but end-to-end integration testing across sagas requires careful test container setup. We use Testcontainers with an embedded Kafka for our integration test suite.

If you're considering Kafka for a regulated environment, start with the audit trail use case — it delivers immediate, demonstrable value and forces you to think in events from day one.
