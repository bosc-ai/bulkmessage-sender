---
title: "The WhatsApp Business API, explained for non-developers"
description: "What the WhatsApp Business API is, how it differs from the WhatsApp Business app, what it costs, and what you need before you can send your first message."
date: 2026-05-28
author: "Weflux Team"
category: "WhatsApp Business API"
cover: green
draft: false
faqs:
  - q: "Do I need a developer to use the WhatsApp Business API?"
    a: "No. The API has no interface of its own, but providers supply one. You log into a dashboard, connect your number through a Facebook authorisation flow, and work from there. The API and webhooks exist if you want to build on them, and are not required to use the product."
  - q: "Can I use my normal WhatsApp number for the API?"
    a: "Only if it is not currently active on the WhatsApp consumer app or the WhatsApp Business app. A number on the Business app can be migrated, but it leaves the app when it does, because the API becomes how that number sends and receives. Most businesses keep a separate personal number."
  - q: "How much does the WhatsApp Business API cost?"
    a: "Two charges. Meta bills per message by template category and destination country. Your provider bills a platform fee for the software. Ask any provider whether their per-message rate is Meta's published rate or their own, because that difference dominates the bill as volume grows."
  - q: "Why can I not just type a message and send it to everyone?"
    a: "Because a first message to someone who has not written to you in the last 24 hours must use a template Meta approved in advance. Inside an open 24-hour window you can write freely. This constraint is what keeps official API numbers from being banned."
---

"WhatsApp Business API" sounds like something you need an engineer for. You don't. Here is the plain-English version, and the parts that actually decide whether it is right for you.

## What it actually is

The WhatsApp Business API, officially the WhatsApp Business Platform, is Meta's way of letting software send and receive WhatsApp messages. That is the whole idea.

It has no app of its own. There is no icon to tap. It is a connection point, and the interface comes from whichever platform you sign up with. This confuses people the first time they hear it: you are not buying "the API", you are buying software that talks to it.

The reason it exists is that WhatsApp's other products do not scale. The consumer app is one person on one phone. The WhatsApp Business app adds a catalogue and away messages but is still tied to a single device, which is why two people cannot work it without logging each other out. The API separates the phone number from the device, and everything useful follows from that.

## The three products, honestly compared

| | WhatsApp | WhatsApp Business app | WhatsApp Business API |
|---|---|---|---|
| Cost | Free | Free | Platform fee plus per-message charges |
| People per number | One device | One device | As many as your software allows |
| Bulk messaging | No | Capped broadcast lists, saved contacts only | Yes, on approved templates |
| Automation | No | Away messages and greetings | Full, event-driven |
| Integrations | No | No | REST API and webhooks |
| Verified badge | No | No | Possible, at Meta's discretion |

The practical test is simple. **If more than one person needs to answer the number, or you need to message people who have not saved your contact, you need the API.** Below that, the Business app is genuinely fine and costs nothing, and anyone telling you otherwise is selling something.

## The one rule that shapes everything

You cannot send free-form text to someone who has not messaged you in the last 24 hours.

Any first contact, any broadcast, any nudge to a customer who has gone quiet, has to use a **message template** that Meta approved in advance. You register the wording, Meta reviews it, and once approved you can send it with the variable parts filled in per person.

When a customer messages you, a **24-hour window** opens. Inside it you can reply with ordinary text, images or documents, no template needed. When it closes, you are back to templates.

This is the constraint people find most annoying and it is also the reason the whole thing works. It is why official API numbers are not banned in waves the way unofficial bulk senders are, and it is why the messages people receive on WhatsApp are still, mostly, worth reading.

## What you need before you start

- **A Facebook Business Manager.** Free to create. Your WhatsApp Business Account lives inside it, and it should be under your company rather than your provider's.
- **A phone number** that can receive an SMS or call, and is not currently active on the WhatsApp consumer or Business app.
- **Business Verification.** Meta checks your business exists using registration documents. Do this early: it gates how many people you can message per day.
- **A few approved templates.** Write the messages you actually intend to send and submit them before you need them.

## What it costs

Two separate charges, and conflating them is the most common confusion.

**Meta charges per message**, by template category and destination. Marketing costs more than Utility. Authentication has its own rate. Replies inside the 24-hour window are treated differently again. Meta publishes these rates and revises them periodically.

**Your provider charges a platform fee** for the software.

The question worth asking any provider, in writing: *is the per-message rate you quote Meta's published rate, or your own?* At low volume the platform fee dominates and the answer barely matters. Past a few thousand messages a month, it is most of your bill.

## How many messages you can send

Meta sets a **messaging limit** per number: how many unique people you can start a conversation with in a rolling 24 hours. New numbers typically start at 250 and step up through 1,000, 10,000 and 100,000 as you send consistently to people who want to hear from you.

Alongside it sits a **quality rating**, driven mainly by blocks and reports. Send to a bought list and it falls, taking your limit with it, usually during the campaign where you needed it most.

Replies to people who messaged you first do not count against the limit. Only conversations you start.

## Is it right for you?

**Probably yes if** more than one person answers your WhatsApp, you want to send order updates or reminders automatically, you need to reach customers who have not saved your number, or you want WhatsApp connected to your store or CRM.

**Probably not yet if** you are a solo operator handling a manageable number of chats. The Business app is free and does that well. Move when it stops fitting, not before.

If you are weighing providers, the [comparison guide](/comparison) covers what actually differs between them, and the [platform guide](/platform) goes deeper on how the API behaves.
