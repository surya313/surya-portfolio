---
title: "Real-Time Banking Notification System"
tag: "Banking · AcolyteSoft"
period: "2021 — 2022"
stack: ["Java", "AWS SNS", "SQS", "Lambda", "React", "Redux"]
impact: "Real-time notifications at scale"
order: 2
---

## The Problem

The banking app lacked real-time feedback for customers during account creation, leading to poor experience and high support call volume.

## Architecture

```
[Account Creation API]
       ↓
[AWS SNS Topic] → [SQS Queue]
       ↓
[Lambda] → Email / SMS / Push
       ↓
[React + Redux — Live status]
```

## What I Did

Designed and implemented an event-driven notification pipeline using AWS SNS and SQS, triggered on account creation events. Lambda functions handled fan-out delivery across email, SMS, and push channels. Built the frontend live-status view with React and Redux so customers could see their account creation progress in real time.

## Outcomes

- Near-zero notification lag for account events
- Significant reduction in support call volume
- Scalable fan-out pattern handles traffic spikes without degradation
