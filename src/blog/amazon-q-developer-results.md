---
layout: post.njk
title: "How Amazon Q Developer Reduced Our Post-Deploy Defects by 30%"
description: "A practical account of integrating AI-assisted code review into a Java microservices team at Lloyd's of London — what worked, what didn't, and the actual numbers."
date: 2026-02-10
tags:
  - blog
  - ai-tools
  - java
  - devops
---

When Amazon Q Developer (formerly CodeWhisperer) matured enough to use for serious code review, I was sceptical. We'd tried AI pair programming tools before and found them useful for boilerplate but unreliable for anything nuanced.

After 8 months of daily use at Lloyd's of London, here's my honest assessment.

## The Context

Our team of 7 engineers maintains a suite of Spring Boot microservices handling insurance policy processing, claims, and financial settlement. The codebase is Java 17, deployed on AWS EKS, with strict SonarQube gates and a 85%+ test coverage requirement.

Before Q Developer, our most common post-deploy defects were:
- NullPointerExceptions from unhandled optional fields in API responses
- Missing validation on edge cases in financial calculations
- Thread safety issues in cached singleton services

## What Amazon Q Developer Actually Does Well

**1. Null safety suggestions.** Q Developer is remarkably good at spotting places where we're not handling `Optional` properly or where a field could be null at runtime but isn't checked. It flagged dozens of these in our codebase that SonarQube had missed.

**2. Security vulnerability scanning.** It caught a hardcoded secret that had slipped through a PR review. Not a production secret, thankfully — it was in a test config — but it would have ended up in our Git history.

**3. AWS API usage patterns.** For our DynamoDB and S3 interactions, Q's suggestions often reflected best practices we hadn't considered — like using batch writes more aggressively or handling `ProvisionedThroughputExceededException` with exponential backoff.

## What It Doesn't Do Well

It doesn't understand our business domain. A suggestion that's syntactically correct and superficially sensible can still be logically wrong in the context of insurance calculations. For example, it suggested simplifying a premium rounding calculation that looked redundant but was actually required by Lloyd's regulatory compliance rules.

The lesson: AI-assisted review is a first pass, not a final one. Human domain knowledge is still irreplaceable.

## The Numbers After 8 Months

Before Amazon Q integration into our PR review process, we averaged roughly 4-5 production defects per sprint that traced back to code review gaps.

After establishing Q Developer as a required step in our CI pipeline (it runs on every PR alongside SonarQube), that dropped to 2-3 — a reduction of around **30%**. Not all of that is attributable to Q alone (we also tightened our test coverage requirements in the same period), but the correlation is clear.

## Our Integration Pattern

We run Q Developer in two places:
1. **IDE-level** (VS Code and IntelliJ plugins) — developers get inline suggestions as they write
2. **CI pipeline** — a Q security scan runs on every PR and must pass before merge

The CI integration was the bigger win. It catches things developers miss when they're focused on writing new code, and it creates a consistent quality gate regardless of individual experience levels.

## Recommendation

If you're leading a Java backend team, the ROI on Amazon Q Developer is positive, but only if you integrate it into your pipeline rather than leaving it as an optional developer tool. The value comes from consistency, not from any single catch it makes.

And pair it with good domain knowledge. The AI handles the syntax; you handle the semantics.
