---
title: "How to send a WhatsApp broadcast that gets read"
description: "Planning, writing and sending WhatsApp broadcast campaigns on the official Business API: segmentation, template wording, timing, and what to measure afterwards."
date: 2026-06-01
author: "Weflux Team"
category: "Broadcasts"
cover: green
draft: false
faqs:
  - q: "Can recipients see each other in a WhatsApp broadcast?"
    a: "No. Each person receives an individual one-to-one message and cannot see anyone else on the list. Replies come back to you privately, into the same thread they would use for any other conversation."
  - q: "What is the best time to send a WhatsApp broadcast?"
    a: "Business hours in the recipient's own timezone, and not during a meal. The specifics matter less than the principle: write down what the recipient is doing when the message arrives, and if the answer is sleeping or working, change the timing before you change the copy."
  - q: "How do I stop people opting out of my broadcasts?"
    a: "Send less often to better-chosen segments. Opt-outs are mostly a relevance problem rather than a copy problem. A campaign with a high read rate and a high opt-out rate is not a success, it is a warning about the next one."
  - q: "Should I include a link in a WhatsApp broadcast?"
    a: "Usually as a button rather than raw text. Call-to-action buttons are cleaner to tap and quick-reply buttons are better still, because a reply opens a 24-hour window in which you can talk normally without paying for another template."
---

WhatsApp broadcasts get read. That is the appeal, and it is also the trap: a channel people actually open is a channel you can burn through quickly.

Here is how to plan, write and send one properly, and what to look at afterwards.

## Before you write anything

**Pick the segment first, not the message.** The most common mistake is writing something good and then looking for people to send it to. Start from a group with a reason to hear from you this week: bought in the last ninety days, abandoned a cart, renewal due next month, attended the webinar. A smaller, better-chosen audience converts better and costs less.

**Check your messaging limit.** Meta caps how many unique people you can start conversations with per rolling 24 hours, typically starting at 250 and rising to 1,000, 10,000 and 100,000. Sending to a list larger than your limit produces failures, not a queue.

**Get the template approved before you need it.** Approval is usually quick, but it is Meta's review queue. Plan a day for anything time-sensitive.

## Choosing the category

Every template is Marketing, Utility or Authentication, and the category decides what you may say and what Meta charges.

- **Marketing** for anything promotional or intended to bring someone back.
- **Utility** for messages about a transaction the customer already made.
- **Authentication** for one-time passcodes, and nothing else.

Submitting a promotion as Utility to save money does not work. Reviewers check whether a real transaction exists, the template is rejected, and repeated attempts affect your account standing.

## Writing one people do not block

**Lead with who you are.** Most recipients read the notification preview and decide from it. If they cannot tell who this is, some proportion reports it, and reports are what Meta counts.

**One message, one purpose.** A broadcast doing three jobs gets ignored for all three.

**Put the point in the first sentence.** Not the greeting, not the context, the thing you want them to know.

**Keep it short enough not to need expanding.** If the recipient has to tap "read more", you have already lost most of them.

**Use buttons.** A call-to-action button is cleaner than a pasted URL, and a quick-reply button is better still: a reply opens a 24-hour window in which you can talk normally without paying for another template.

**Give an exit.** A footer opt-out line costs you a few recipients and protects your quality rating, which is worth considerably more.

## Timing

Timing moves results more than copy does.

Business hours in the recipient's timezone. Not during a meal. Not at 11pm, whatever the open rate looks like the next morning, because the blocks arrive with it.

For triggered sends, work backwards from the customer's situation rather than your calendar. Cart recovery in fifteen to sixty minutes. Review requests after they have actually used the thing. Replenishment timed to when the product genuinely runs out, which your order data already tells you.

A useful discipline: for every campaign, write down what the recipient is doing when it arrives. If the honest answer is "sleeping" or "at work and irritated", fix the timing first.

## Sending

Pace the send rather than firing everything at once. A good platform paces to your current messaging limit automatically; if yours does not, send in batches.

Schedule rather than pressing send when you happen to be ready. Anything going to a large list deserves to land at a chosen hour.

And send yourself a test first. The preview catches broken merge fields, and a template that renders "Hi {{1}}," to four thousand people is a bad afternoon.

## What to measure

Four numbers, in order of how much they tell you.

**Delivered** is a data-quality check, not a result. Near-total on a clean list; if it is not, your numbers need work.

**Read** is high on WhatsApp for almost everything, including messages people resent. Useful as a baseline, misleading as a success metric.

**Replies** are the real signal. A broadcast that starts conversations is doing the job, and every reply opens a free 24-hour window.

**Opt-outs** are the one to watch hardest. A campaign with a high read rate and a high opt-out rate is not a success. It borrowed from a list you cannot easily rebuild.

For revenue campaigns, hold back a random slice of the audience and compare. The uplift is usually real and usually smaller than raw attribution suggests, and knowing the true number is what lets you spend confidently.

## A workable first campaign

Pick one segment with an obvious reason to hear from you. Write one template with one purpose and a quick-reply button. Get it approved. Schedule it for a sensible local hour. Send to a few hundred rather than everyone. Read the reply and opt-out rates before you scale it.

That sequence is unglamorous and it is how the campaigns that work get built. More on the mechanics in the [broadcasts guide](/broadcasts), and the [templates guide](/whatsapp-message-templates) covers wording that gets approved.
