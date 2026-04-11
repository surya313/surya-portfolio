---
layout: post.njk
title: "What I Learned Leading a Team of 7 Engineers at London Market"
description: "Honest lessons from moving from senior individual contributor to technical lead in a high-stakes financial services environment."
date: 2026-01-20
tags:
  - blog
  - leadership
  - career
---

I didn't plan to become a team lead. I was a senior Java engineer focused on building good microservices, and then one day I was responsible for the output of seven other engineers working on critical insurance infrastructure.

Here's what that transition actually taught me.

## The Code Is No Longer Your Primary Output

This one took me the longest to internalise. As an individual contributor, your quality metric is the quality of your code. As a lead, your quality metric is the quality of your team's output. That means your most important code-related contributions are code *review*, architectural *decisions*, and the standards you set, not the lines you write yourself.

When I kept trying to be the person who solved the hard technical problems personally, I became a bottleneck. The work slowed down. I had to learn to let go of problems and instead equip other engineers to solve them.

## Psychological Safety Is a Technical Concern

At London Market, we're working on systems where a bug can affect financial settlements worth millions. The natural instinct is to be extremely conservative, to hesitate before proposing changes and hesitate before reporting problems.

I noticed early on that engineers weren't raising concerns in standups until they were serious. By the time I heard about a potential issue, it was already urgent. Creating an environment where it was safe to say "I'm not sure about this" or "I think there might be a problem here" before it became a crisis was one of the most practically valuable things I did as a lead.

We introduced a simple norm: a brief "blockers and uncertainties" slot in standup, with explicit encouragement that a raised uncertainty is a positive contribution, not a weakness. Post-deploy defect rates dropped. Not because of better code, but because problems were surfaced earlier.

## Technical Debt Has a Political Dimension

Every engineer knows what technical debt is. What surprised me as a lead was how much of my job involved *communicating* technical debt to non-technical stakeholders in a way that secured time to address it.

The language that worked: **cost of carry**. Not "this code is messy" (which sounds like a preference) but "maintaining this without refactoring costs us approximately X hours per sprint, which scales as Y as we add features." Quantifying the drag made it a business conversation rather than an engineering one.

This is related to why I care about metrics. When I had the data showing that one particular service was responsible for 60% of our unplanned work, getting time to refactor it was a straightforward conversation. Without the data, it was an argument.

## The Best Thing I Did Was Create Space for Others to Lead

The engineers on my team are excellent. The best thing I could do was identify the areas each person was strongest in, create opportunities for them to take ownership of those areas, and then genuinely step back.

One engineer took complete ownership of our observability tooling with the ELK stack. Another effectively owned our CI/CD pipeline and SonarQube configuration. A third led our event-driven messaging patterns across services. I was there for support and unblocking, but they were the subject matter experts.

This isn't just good for them professionally. It's essential for the team's resilience. When I'm unavailable, the team doesn't stall.

## The Skill No One Talks About: Writing Clearly

The most underrated technical leadership skill is writing clearly. Architecture decision records, incident post-mortems, requirements documents, Confluence pages; if you write clearly, your team moves faster. If you write ambiguously, you create rework, misunderstanding, and meetings that could have been a paragraph.

I spent time improving my writing over the past two years. It has paid back more than any technical skill I developed in the same period.
