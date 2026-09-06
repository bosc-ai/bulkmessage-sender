---
title: "How to connect your WhatsApp number"
description: "Step-by-step guide to connecting a WhatsApp Business number to Weflux through Meta Embedded Signup, including migrating an existing number and fixing common errors."
date: 2026-06-02
author: "Weflux Team"
category: "Getting started"
cover: green
draft: false
faqs:
  - q: "Can I use a number that is already on the WhatsApp Business app?"
    a: "Yes, but it has to be migrated, and once it moves to the API it leaves the phone app. The API becomes how that number sends and receives, and you work it through the web inbox instead. Many businesses keep a separate personal number on the app."
  - q: "Can I use a landline for the WhatsApp Business API?"
    a: "Yes, provided it can receive a verification call. Choose voice verification rather than SMS when prompted. The number must not already be registered on WhatsApp."
  - q: "Why does verification say my number is already registered?"
    a: "The number is active on the WhatsApp consumer app or the WhatsApp Business app. Delete the WhatsApp account for that number from within the app first, wait a few minutes, then retry. Deleting the app without deleting the account does not release the number."
  - q: "How long does connecting a number take?"
    a: "The Embedded Signup flow itself takes a few minutes. Business Verification, which Meta requires to raise your messaging limits, takes longer and depends on your documents. Start verification early rather than when you hit the cap."
---

Connecting a number takes a few minutes through Meta's Embedded Signup. Here is the sequence, and what to do when it does not go smoothly.

## Before you start

- **A Facebook Business Manager account.** Free to create at business.facebook.com. It should belong to your company, not your agency or provider.
- **A phone number** that can receive an SMS or a call, and that is **not currently active on WhatsApp**, either the consumer app or the Business app.
- **Admin access** to the Business Manager. A colleague with partial access cannot complete the flow.

## The steps

1. **Open Settings and start the connection.** In Weflux, go to Settings and choose to connect a WhatsApp number. This opens Meta's own Embedded Signup window.
2. **Log in to Facebook.** Use the account with admin rights on your Business Manager. This is Meta's window, not ours, and your password is never visible to Weflux.
3. **Select or create your Business Manager.** If your business already has one, pick it. Creating a second one for the same business causes verification problems later.
4. **Create or select the WhatsApp Business Account.** This holds your number and your templates. It stays yours.
5. **Enter your phone number and verify it.** Meta sends a code by SMS, or calls you if you choose voice verification. Enter the code in Meta's window.
6. **Set your display name.** This is what customers see. It must reflect your actual business name and comply with Meta's display name policy. A name that reads like a keyword string will be rejected.
7. **Finish and return.** The window closes and the number appears in Weflux, usually within a minute.

## Migrating a number already on the WhatsApp Business app

You can bring an existing number across, and most businesses should, because customers already have it saved.

Before you begin, **back up anything you need from the app.** Chat history lives on the device and does not migrate. Export it from within WhatsApp if it matters to you.

Then delete the WhatsApp account for that number from inside the Business app: Settings, Account, Delete my account. Deleting the app itself does not release the number. Wait a few minutes, then run the Embedded Signup flow above.

Once migrated, the number no longer works in the phone app. That is not a Weflux limitation, it is how the API works.

## Complete Business Verification early

Meta verifies that your business exists using registration documents and a matching public presence. It is separate from connecting the number, and it gates your messaging limits.

Do it in the first week. The common mistake is leaving it until a campaign is blocked by a limit, at which point you are waiting on Meta's queue with a deadline.

## Common problems

**"This number is already registered."** It is still active on WhatsApp somewhere. Delete the account from within the app, wait, retry.

**"You do not have permission."** Your Facebook user is not an admin on the Business Manager. Ask an existing admin to grant full control, then start again.

**The verification code never arrives.** Try voice verification instead of SMS. Some Indian carriers filter automated SMS. If the number is a landline, voice is the only option.

**The display name is rejected.** It must match how customers know your business. Not a description, not keywords, not a slogan. If your legal name and trading name differ, use the one customers recognise and be ready to show it in use.

**The window closes with no result.** Usually a popup blocker or a browser extension. Try again in a normal window without extensions.

## After connecting

Submit two or three templates for the messages you actually send, so they are approved before you need them. Add your team, set roles, and import contacts. Then send a real campaign to a small segment before you send a large one.

The [templates guide](/whatsapp-message-templates) covers what gets approved, and [Embedded Signup](/embedded-signup) explains the onboarding flow in more detail.
