---
layout: post.njk
title: "Event-Driven Architecture Patterns I Use at London Market"
description: "A practical look at SNS/SQS-based event sourcing, dead letter queues, and saga patterns in a regulated insurance environment."
date: 2026-03-15
tags:
  - blog
  - aws
  - architecture
  - java
---

After 3+ years designing event-driven systems for London Market, I've built up a clear set of patterns that actually work under the pressure of a regulated, mission-critical insurance environment.

Here's what I reach for, and why.

## Why Event-Driven at London Market?

Insurance platforms at London Market handle complex multi-party workflows: a single policy can involve underwriters, brokers, claims handlers, and compliance teams, often simultaneously. The traditional synchronous request-response model falls apart quickly here. You end up with tight coupling, cascading failures, and no audit trail.

Moving to an event-driven model using AWS SNS and SQS changes that. Each domain event becomes a first-class citizen, independently deliverable, independently consumable, with full decoupling between producers and consumers.

## Pattern 1: Event Sourcing for Audit Trails

In insurance, audit is non-negotiable. Every state change on a policy or claim must be traceable. Rather than updating a record in place, we publish an immutable domain event to an SNS topic whenever state changes:

```
PolicyUnderwritten { policyId, underwriterId, premium, timestamp }
ClaimSubmitted     { claimId, policyId, amount, timestamp }
ClaimApproved      { claimId, approvedBy, timestamp }
```

Each event is persisted to DynamoDB via a Lambda subscriber, building an immutable event log. The current state of any entity is derived from its event history. This gives us a full audit trail and makes replaying past states straightforward, which is essential when regulators ask "what did this policy look like on 14th January?"

## Pattern 2: Dead Letter Queues (DLQs) for Resilience

In production, consumers fail. A downstream service might be temporarily unavailable, a message might be malformed, or a transient database issue might cause a processing exception.

Without a DLQ strategy, you have two bad options: skip the message (data loss) or block forever (system halt).

AWS SQS has native DLQ support. We configure each queue with a redrive policy. After 3 failed processing attempts, the message is automatically moved to a dedicated dead letter queue:

```java
// SQS queue configured with redrive policy (via AWS CDK / CloudFormation)
// maxReceiveCount: 3 — after 3 failures, message moves to DLQ

@SqsListener("${aws.sqs.policy-events-queue}")
public void handlePolicyEvent(PolicyEvent event) {
    try {
        policyService.process(event);
    } catch (TransientException e) {
        // Throwing causes SQS to redeliver up to maxReceiveCount
        throw e;
    }
}
```

A CloudWatch alarm monitors DLQ message count and pages the team when messages land there. A separate reprocessing job replays DLQ messages once the underlying issue is resolved, with full observability via CloudWatch Logs.

## Pattern 3: The Saga Pattern for Long-Running Workflows

A policy issuance at London Market isn't a single transaction. It spans multiple services: underwriting, compliance checks, document generation, broker notification. Each step can fail independently.

We use the choreography-based saga with SNS fan-out. Each service publishes an event to SNS when its step completes, and downstream services subscribe via their own SQS queues. Compensating events handle rollback when a step fails.

```
PolicySubmitted → SNS Topic → [Underwriting Queue] → PolicyUnderwritten
PolicyUnderwritten → SNS Topic → [Compliance Queue] → ComplianceCleared
ComplianceCleared → SNS Topic → [Document Queue] → PolicyDocumentGenerated
PolicyDocumentGenerated → SNS Topic → [Notification Queue] → BrokerNotified
```

If compliance rejects the policy, it publishes `ComplianceRejected` to SNS. Upstream services subscribed to that event trigger their own compensating actions. No distributed transaction required; each service owns its own rollback logic.

## What I've Learned

The hardest part of event-driven systems on AWS isn't the infrastructure. SNS and SQS are well-managed and reliable. The hard part is **message schema evolution**. When your event structure changes, old consumers may still be processing old message formats. We version our event schemas explicitly and use AWS Glue Schema Registry to enforce compatibility, ensuring producers and consumers can evolve independently without breaking each other.

The second hardest part is **testing**. Unit testing SQS consumers in isolation is straightforward with Mockito. End-to-end integration testing across sagas is harder. We use LocalStack with Testcontainers to spin up real SNS and SQS locally, giving us confidence that the full event chain works before anything reaches production.

If you're considering event-driven architecture for a regulated environment, start with the audit trail use case. Persisting every domain event to an immutable store delivers immediate, demonstrable value to compliance teams and forces you to think in events from day one.
