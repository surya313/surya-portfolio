---
layout: post.njk
title: "How Amazon Q Developer Reduced Our Post-Deploy Defects by 30%"
description: "A practical account of integrating AI-assisted code review into a Java microservices team at London Market. What worked, what didn't, and the actual numbers."
date: 2026-02-10
tags:
  - blog
  - ai-tools
  - java
  - devops
---

When Amazon Q Developer (formerly CodeWhisperer) matured enough to use for serious code review, I was sceptical. We'd tried AI pair programming tools before and found them useful for boilerplate but unreliable for anything nuanced.

After 8 months of daily use at London Market, here's my honest assessment.

## The Context

Our team of 7 engineers maintains a suite of Spring Boot microservices handling insurance policy processing, claims, and financial settlement. The codebase is Java 21, deployed on AWS EKS, with strict SonarQube gates and a 85%+ test coverage requirement.

Before Q Developer, our most common post-deploy defects were:
- NullPointerExceptions from unhandled optional fields in API responses
- Missing validation on edge cases in financial calculations
- Thread safety issues in cached singleton services

## What Amazon Q Developer Actually Does Well

**1. Null safety suggestions.** Q Developer is remarkably good at spotting places where we're not handling `Optional` properly or where a field could be null at runtime but isn't checked. It flagged dozens of these in our codebase that SonarQube had missed.

**2. Security vulnerability scanning.** It caught a hardcoded secret that had slipped through a PR review. Not a production secret, thankfully (it was in a test config), but it would have ended up in our Git history.

**3. AWS API usage patterns.** For our DynamoDB and S3 interactions, Q's suggestions often reflected best practices we hadn't considered, like using batch writes more aggressively or handling `ProvisionedThroughputExceededException` with exponential backoff.

## What It Doesn't Do Well

It doesn't understand our business domain. A suggestion that's syntactically correct and superficially sensible can still be logically wrong in the context of insurance calculations. For example, it suggested simplifying a premium rounding calculation that looked redundant but was actually required by London Market's regulatory compliance rules.

The lesson: AI-assisted review is a first pass, not a final one. Human domain knowledge is still irreplaceable.

## The Numbers After 8 Months

Before Amazon Q integration into our PR review process, we averaged roughly 4-5 production defects per sprint that traced back to code review gaps.

After making Q Developer a consistent part of how engineers work (alongside tightening our test coverage requirements), that dropped to 2-3, a reduction of around **30%**. Not all of that is attributable to Q alone, but the correlation is clear.

## How We Use It in Practice

Q Developer runs inside IntelliJ as part of our development workflow. The four areas where it earns its place:

**1. Code optimisation during development.** As engineers write, Q surfaces suggestions for more idiomatic or efficient implementations, such as better use of Java Streams, cleaner Optional handling, and more appropriate collection types. It's not always right, but it prompts the right questions.

**2. PR review assistance.** Before raising a PR, engineers run Q over their diff. It catches things that are easy to miss when you're close to the code, like unhandled edge cases, missing null checks, and potential performance regressions. It's a first-pass review that raises the quality floor before a human reviewer even looks.

**3. Writing test cases.** Q is particularly useful for generating test scaffolding. Given a method signature and some context, it produces a reasonable set of JUnit test cases covering the happy path and common edge cases. Engineers extend and adapt these rather than starting from blank files.

**4. Identifying edge cases from Jira acceptance criteria.** This one surprised us. Pasting a Jira ticket's acceptance criteria into Q and asking it to identify scenarios we might have missed has become a standard step before writing tests. It looks at the AC from a different angle than the engineer who wrote the code, which is exactly when it's most useful.

## Going Further: Kiro IDE and MCP Servers

Alongside IntelliJ and Q Developer, we've recently adopted **Kiro IDE** with **MCP (Model Context Protocol) server integrations**, and this has been a separate but equally significant productivity shift.

Kiro connects directly to Jira and Confluence via MCP servers, which means a large category of manual overhead that used to fall on engineers is now automated:

- **RCA documentation.** After a production incident, Kiro drafts the root cause analysis from logs, PR history, and service context. Engineers review and approve rather than write from scratch.
- **Jira updates.** Ticket status, comments, and acceptance criteria updates are handled without leaving the IDE.
- **Confluence documentation.** New feature documentation and architecture decision records are generated and published to the right Confluence space automatically.
- **Manifest and config generation.** Kubernetes manifests and AWS infrastructure configs are drafted based on existing patterns in the codebase.

The cumulative time saving is significant. Tasks that previously consumed 30-60 minutes of an engineer's day, scattered across context switches between IDE, browser, Jira, and Confluence, now take minutes. It keeps engineers in flow and reduces the cognitive cost of the process work that surrounds actual development.

Combined with Amazon Q Developer for code quality, the overall toolchain is genuinely changing how the team operates. Not by replacing engineering judgement, but by eliminating the low-value manual work around it.

## Recommendation

If you're leading a Java backend team, the ROI on Amazon Q Developer is positive, but only if it becomes a consistent part of how engineers actually work. Make it part of the PR checklist: run Q before you raise the PR, not after review comes back. The value comes from the habit, not from any single catch it makes.

Layer in MCP server integrations for your project management and documentation tools and the gains compound further. Less time on process, more time on engineering.

And through all of it: pair AI tooling with good domain knowledge. The AI handles the syntax and the admin; you handle the semantics and the decisions.
