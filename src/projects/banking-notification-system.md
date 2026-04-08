---
title: "Real-Time Banking Notification System"
tag: "Banking · AcolyteSoft"
period: "2021 — 2022"
stack: ["Java", "Spring Boot", "AWS SNS", "AWS SQS", "AWS Lambda", "AWS SES", "DynamoDB", "React", "Redux"]
impact: "Real-time notifications at scale"
order: 2
---

## The Problem

The banking app had no real-time feedback mechanism during account creation. Customers submitted their details and received no status updates until the process completed, or failed silently. This led to repeated support calls, duplicate submissions, and poor customer experience.

## Architecture

```
[Account Creation API — Spring Boot]
           ↓
    [AWS SNS Topic] — fan-out to per-channel queues
    ↙          ↓          ↘
[Email Queue] [SMS Queue] [Push Queue]
    ↓              ↓            ↓
[Lambda→SES] [Lambda→SNS SMS] [Lambda→FCM]

[Account Creation API] also writes status → [DynamoDB]
           ↑
[React + Redux] polls status endpoint every 2–3s
→ displays live account creation progress to customer
```

## What I Did

Designed and implemented the event-driven notification pipeline triggered on account creation events. The Spring Boot API publishes to an AWS SNS topic which fans out to three separate SQS queues, one per delivery channel. Each queue triggers a dedicated Lambda function: email via AWS SES, SMS via SNS SMS, and push notifications via FCM.

In parallel, the API writes account creation status to DynamoDB at each stage. The React and Redux frontend polls a lightweight status endpoint every 2-3 seconds, updating the UI to reflect progress in real time, giving customers clear visibility without requiring WebSockets or persistent connections.

## Outcomes

- Customers receive email, SMS, and push notifications within seconds of account events
- Live status view in the React frontend eliminates uncertainty during account creation
- Fan-out pattern across independent queues means one channel failing does not affect others
- Significant reduction in support call volume from customers chasing account status
