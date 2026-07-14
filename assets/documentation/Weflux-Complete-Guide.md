# Weflux — The Complete Guide

**A plain-English handbook for every screen, button, and setting.**

Weflux (weflux.in) is a WhatsApp Business platform: a shared team inbox, broadcast
campaigns, a visual automation builder, a CRM, and integrations. This guide explains all
of it, start to finish, with **no prior experience assumed** — you do not need to know
anything about the WhatsApp Business API, a "BSP", or tools like Wati / Interakt / AiSensy.

> This Markdown file mirrors the designed PDF guide. It is written so you can also paste it
> (or any section) into an AI assistant and ask it to walk you through a step. The wording
> matches what you see on screen.

---

## Table of contents

1. WhatsApp for Business, explained (foundations)
2. Getting started with Weflux
3. The Team Inbox
4. Contacts & CRM
5. Message Templates
6. Campaigns & Broadcasts
7. Automation — the visual flow builder
8. Analytics, Tasks & Calls
9. Integrations — Google Sheets, e-commerce & migration
10. Settings & your account
- Appendix A: Glossary
- Appendix B: Quick reference & the golden rules

---

# 1. WhatsApp for Business, explained

Five ideas make everything else in Weflux obvious. Learn them once.

## 1.1 The app you know vs. the Business API
The green WhatsApp app on your phone is built for one person chatting with friends. It
can't safely send thousands of messages, be shared by a team, or connect to your website.

The **WhatsApp Business API** (also called the **Cloud API**) is Meta's professional version
of WhatsApp. There is no app to open — a tool like Weflux plugs into it and gives your whole
team one shared screen. An **API** is simply a doorway that lets two pieces of software talk;
the WhatsApp API is the doorway between Weflux and Meta's WhatsApp network. You never see it.

## 1.2 What a "BSP" is — and where Weflux fits
A **BSP** (Business Solution Provider), also called a **Tech Provider**, is a Meta-approved
company that hosts the API connection on your behalf. Meta doesn't hand the raw API to every
small business — you go through a BSP. **Weflux is your BSP.** It holds the approved connection,
keeps it healthy, and turns the technical machinery into simple screens.

**How a message travels:** You & your team (in Weflux) → Weflux (your BSP) → Meta WhatsApp
Cloud API → your customer's WhatsApp. It's two-way: when the customer replies, Meta pushes it
straight back through the same path into your inbox. That push is called a **webhook**.

Because you message through Meta's official channel, Meta sets the rules (the 24-hour window,
template approval, opt-outs, quality ratings). Weflux keeps you on the right side of them.

## 1.3 The 24-hour customer-service window (the one big rule)
Meta protects people from spam with a simple rule: **a business may send free, normal
messages only within 24 hours of the customer's last message.** Every time a customer messages
you, a fresh 24-hour timer starts. Inside that window you can type anything. Once it closes,
free-form messages are blocked and you must use a template.

In Weflux you never calculate this. A coloured banner sits atop every chat:
- Green: **"Session open — reply freely for another 16h 20m"**.
- Amber: **"24h window closed — use a template to re-engage"** (the reply box becomes a *Send Template* button).

**To message someone first** (a brand-new lead, or someone who's gone quiet) you must use a
template. Free typing is only for replying inside an open window.

## 1.4 Templates & their categories
A **template** is a pre-written message that Meta has reviewed and **approved** in advance.
Because Meta already checked it, you may send it any time — even outside the 24-hour window,
even to someone who's never messaged you. Templates can hold blanks called **variables**,
written `{{1}}`, `{{2}}`, filled with real details at send time.

The three categories:
- **MARKETING** — promotions, offers, re-engagement. Most expensive; needs opt-in; subject to marketing limits.
- **UTILITY** — order updates, receipts, reminders tied to a specific action. Cheap, approved fast, reaches anyone anytime.
- **AUTHENTICATION** — one-time passcodes / verification codes only.

Order updates should be UTILITY (cheaper and slip past the 24-hour window). Save MARKETING
for genuine promotions.

## 1.5 Opt-in, quality & what it costs
- **Opt-in / opt-out:** WhatsApp marketing is permission-based — only broadcast to people who
  opted in, and stop when someone opts out. Weflux handles opt-out with a per-contact toggle
  and with **opt-out keywords** (like "STOP"). Broadcasts exclude opted-out people by default.
- **Quality rating:** Meta grades each number GREEN / YELLOW / RED based on how people react.
  Too many blocks or "report spam" taps drops it; a RED rating can pause your sending.
- **Messaging limit:** how many *new* people you can message in 24 hours. New numbers start at
  **250/day** and climb automatically (1K → 10K → 100K → unlimited) as you verify your business
  and send good-quality messages.
- **Pricing:** **Weflux does not charge per message.** Meta bills your own WhatsApp payment
  method directly, and Weflux adds **₹0 markup**. Approximate India rates: Marketing ₹0.78,
  Utility ₹0.21, Authentication ₹0.16 per message; service replies inside the 24h window are free.
  You add a payment method in **Meta**, not in Weflux.

---

# 2. Getting started with Weflux

## 2.1 Create your account
Your Weflux account is a **workspace** (organisation). The person who registers becomes its
**Admin**. Sign up three ways:
- **Email & password:** fill the form (Organization Name auto-fills a URL slug), pick a password, click **Create Workspace**.
- **Google:** click **Continue with Google**.
- **Returning:** use **Sign in**.

Note: the sign-up screen is branded **"Bulk Message Sender" (powered by Weflux)** — this is
intentional (a sister brand), not a bug. Inside the app everything is Weflux. The "contact
number" on sign-up is just how Weflux reaches you — **not** your WhatsApp Business number.

## 2.2 A tour of the dashboard
Everything lives behind one dark sidebar on the left; clicking an item swaps the main area
(no page reloads). Top to bottom:
- **Logo & plan badge** (Free / Basic / Pro / Scale).
- **Account switcher** — if you connect multiple numbers, filter the dashboard to one, or "All Accounts".
- **Navigation:** Dashboard, Inbox (unread badge), Contacts, Campaigns, Templates, Automation,
  Integration (Beta), Analytics, CRM (New), Tasks (New), Calls (New), Migrate, Settings.
- A **padlock** = the feature isn't in your plan (click to request an upgrade). **New/Beta tags**
  flag newer modules. CRM/Tasks/Calls/Migrate are **add-ons** that appear only once enabled.
- **Bottom row:** your profile → Settings, notification bell, collapse toggle, light/dark theme, log out.
- A floating green **Weflux Assistant** (bottom-right) helps with setup and connects you to a real person.

## 2.3 Connect your WhatsApp number (go live)
Do this in **Settings → Connections**, or from the dashboard banner. Two paths:

**Path A — One-click (recommended).** Click **Connect WhatsApp**. Meta's Embedded Signup pop-up
opens: (1) log into Facebook, (2) give access to your Business, (3) pick your number & finish.
Weflux fetches your IDs, subscribes for replies, and registers the number — you type nothing
technical. Webhooks are configured automatically (Weflux is a verified Tech Provider).

**Path B — Manual (advanced).** Click **Manual** and paste: Display Name, Phone Number,
**Phone Number ID**, **WABA ID**, and **Permanent Access Token**. Save, then set the webhook in
Meta using the auto-generated Verify Token.

After connecting, each number shows an **Active** pill, its **quality rating**, and its daily
**messaging limit** (new numbers start at 250/day). A **Sync** button refreshes these from Meta.

## 2.4 Plans — and what each unlocks

| Capability | Free | Basic | Pro | Scale |
|---|---|---|---|---|
| WhatsApp numbers | 1 | 1 | 3 | 10 |
| Team seats | 1 | 20 | 30 | Unlimited |
| Message templates | 5 | Unlimited | Unlimited | Unlimited |
| Automation flows | — | 10 | 20 | Unlimited |
| Integrations | — | ✓ | ✓ | ✓ |
| Analytics | — | — | ✓ | ✓ |
| API access | — | — | — | ✓ |

- **Locked (padlock):** your plan doesn't include it (e.g. Automation on Free) — request an upgrade.
- **Hidden add-on:** CRM, Tasks, Calls, Migrate are switched on per-account by the Weflux team.
- Upgrades apply within ~30 seconds (no re-login needed).

**Roles inside your workspace:** Admin ("Full access"), Manager ("Team + reports"), Agent
("Inbox only"). The founder is the protected "main admin".

---

# 3. The Team Inbox

The Inbox is your shared team workspace where every WhatsApp conversation lands. Two panels: a
conversation list on the left, the open chat on the right. Everyone sees the same shared list.

## 3.1 The layout
- **Conversation list:** header with an "N open" pill, a funnel filter, a green **+** (new chat),
  a search box, and five tabs — **All · Unread · Mine · Open · Resolved**.
- **A row** shows an avatar, name (bold if unread), a coloured **lifecycle stage** pill, the last
  message, an assignee, labels, and a "how long they've waited" tag. A green dot = unread.
- **Chat window** (right): a header of actions, a session banner, the message thread, and the composer.

## 3.2 Working a conversation (header actions)
- **Call** — start a WhatsApp voice call (Chapter 8).
- **Template** — open the picker to send an approved template.
- **Assign** — hand the chat to a teammate (the first agent to reply is auto-assigned).
- **Resolve / Reopen** — mark done, or reopen.
- **Stage ▾** — move the contact along your funnel (New Lead → Customer).
- **⋮ More → Mark as Waiting** — park a chat you're waiting on.
- **Show / Hide Info** — toggle the Contact Info panel.

**Session banner:** green "Session open — reply freely…" while the 24-hour window is open; amber
"24h window closed — use a template…" once it expires (the reply box becomes *Send Template*).

**Status vs. Stage:** Status (Open / Resolved / Waiting) is the chat's workflow state; Stage
(New Lead → Customer) is the person's funnel position.

**Message ticks (your bubbles):** 🕐 queued → ✓ sent → ✓✓ delivered → blue ✓✓ read → ✗ failed.

Keyboard: `j`/`k` next/previous chat, `Esc` close, `Ctrl/⌘+N` new chat.

## 3.3 The composer & starting chats
- **Type & send:** Enter sends; Shift+Enter = new line. Your message appears instantly.
- **Canned responses:** type `/` for a saved-reply picker (managed in Settings).
- **Attach (📎):** Photo, Video, Audio, Document, Location, or a Menu/List (images ≤5 MB, video
  ≤16 MB, docs ≤100 MB).
- **Menu / List:** one button that opens up to 10 tappable options.
- The composer only works while the 24-hour window is open; otherwise you'll see *Send Template*.

**New chat:** click **+** → pick a contact or add a new number (10-digit numbers get the country
code added) → because it's a first message you must pick an approved **template** → fill any
`{{n}}` blanks (watch the live preview) → send or schedule.

## 3.4 The Contact Info panel
Click **Show Info** for three tabs:
- **Details:** phone, email, tags, labels, custom fields (edit inline), and a **WhatsApp Opt-out**
  toggle that stops all messages to this person.
- **Activity:** recent messages, past calls, and a **Lead Journey** timeline of every conversation.
- **Notes:** private, team-only notes the customer never sees.

**Tags vs. Labels:** tags stick to the *contact* and follow them everywhere; labels stick to a
single *conversation*.

---

# 4. Contacts & CRM

## 4.1 The Contacts list
Your master address book (sidebar → **Contacts**). Search by name/phone/email, filter by stage
or date. Buttons: **Add Contact**, **Import CSV** (only a `phone` column is required), **Export
CSV**. Columns include Name, Email, Stage, Source, Tags, Last Contact. Tick rows for bulk
actions (Send Template, Move Stage, Delete).

**Five ways a contact appears:** (1) someone messages your number, (2) you import a CSV, (3) you
create a CRM deal with a phone, (4) a lead flows in from an integration (Shopify, Sheets…), (5)
you add one manually. Deep editing (tags, custom fields, stage) happens in the Inbox Info panel.

## 4.2 Three ways to organise (don't mix these up)
- **Tag** — a free-form colour label (VIP, Urgent). A contact can hold many. Set up in Settings → Tags.
- **Stage** — where a contact sits in your funnel; exactly one at a time (New Lead → Contacted →
  Qualified → Opportunity → Customer → Churned). Rename/recolour in Settings → Contact Stages.
- **Custom field** — an extra profile detail you invent (Company, Account size) with a type
  (Text/Number/Date/Yes-No/URL). Defined in Settings → Custom Attributes; filled per contact.

Custom Attributes are on every plan; Tags and Contact Stages management appear on paid plans.

## 4.3 The CRM pipeline (add-on)
A visual sales pipeline. Each **deal** is a card you drag across stages: Lead → Contacted →
Proposal → Negotiation → Won → Lost. Top stats: Total Deals, Pipeline Value, Won Value, Win
Rate. Open a card for its detail (value, linked contact, notes, *Open in Inbox*, add follow-up
task). There's also a sortable table view, CSV import, and export.

**Two vocabularies, auto-synced:** move a deal on the board and the same person's stage updates
in Contacts (and vice-versa). Deals already Won/Lost are left untouched. You never keep two lists.

---

# 5. Message Templates

## 5.1 The Templates manager
Sidebar → **Templates**: every template as a card, colour-tinted by status. Status tabs: All ·
Approved · Pending · ⚠ Action Required. **Sync from Meta** pulls the latest status and rejection
reasons. **Create Template** opens the builder.

Statuses: **Approved** (ready to send) · **Pending** (Meta reviewing, usually minutes–hours) ·
**Rejected** (read the reason, fix, re-submit) · **Paused/Disabled** (Meta throttled it, usually
for low quality). Only Approved templates can be sent.

## 5.2 Building a template
Two panes: form on the left, a live WhatsApp preview on the right.
- **Name:** lowercase + underscores only (auto-fixed as you type), e.g. `order_confirmation`.
- **Category & language:** Marketing / Utility / Authentication (drives price & approval) + language.
- **Header (optional):** none, text, or an image / video / document.
- **Body:** your message with `{{1}}`, `{{2}}` variables; supports `*bold*`, `_italic_`. Add a
  footer and up to 10 interactive buttons (Quick-reply ×10, URL ×2, Call ×1, Copy-code ×1).
- **Submit to Meta:** it goes for review and shows as Pending until approved.

Get the category right — don't disguise a promotion as Utility.

## 5.3 The ready-made library & sending
**E-commerce template library** (Integration → D2C E-Commerce → Template library): ~18 proven
templates for every order stage. Pick a preset → type your brand (fills the `[BRAND]` token) →
**Publish to Meta** → map it to an order event (Chapter 9).

`[BRAND]` is swapped once at publish time (fixed text); `{{1}}`, `{{2}}` stay as blanks filled per
order at send time.

**Sending an approved template** (inbox / new chat / bulk): choose the template (Approved only) →
fill the `{{n}}` variables (`{{1}}` defaults to the contact's name; upload a header image if
needed) → send now or schedule (Tomorrow / Day After / custom).

Deleting a template also removes it from Meta and breaks any campaign using it — Weflux warns you.

---

# 6. Campaigns & Broadcasts

Send one approved template to many contacts at once. Available on every plan; needs a connected
number + an approved template.

## 6.1 The campaigns list
Each broadcast is a card with a live delivery funnel: **Total → Sent → Delivered → Read → Replied
→ Failed** (click any number to see those contacts). A connection-health strip shows your quality
and daily limit. Per-card buttons: Launch, Pause/Resume, Retry failed, Refresh, Duplicate, Export.
Cards show the estimated cost (Meta's price, ₹0 markup).

## 6.2 Creating a broadcast
One scrollable form + a final "are you sure?" with a cost estimate.
1. Name it, pick the number & template (Approved only; a body preview shows).
2. Map each `{{n}}` to a contact field (`{{name}}`, `{{phone}}`), a CSV column, or fixed text.
3. Choose the audience: **All Contacts · By Stage · By Tags · Upload CSV**. Leave *Exclude
   opted-out contacts* ticked.
4. Test to your own phone, then Send Immediately / Schedule for later / Save as Draft.

The confirmation dialog shows the exact recipient count and estimated cost before sending.

## 6.3 Reading the results (the report)
Delivery/read receipts arrive from WhatsApp *after* the send, so numbers keep rising — the page
auto-updates. You get funnel tiles, a delivery timeline chart, a **Why messages failed**
breakdown (Meta's error codes translated to a reason + fix), and a searchable per-contact table.

Manage a live send with Pause/Resume, Retry failed, and Refresh. **Reply Flows** auto-send a
follow-up template when someone replies to this campaign (optionally only if their reply contains
a keyword). Weflux paces sends (~20/sec) to protect your number and guards against double-sends.

---

# 7. Automation — the visual flow builder

Reply to customers 24/7 with no one at the keyboard. Available on Basic plan and up.

## 7.1 The idea
An automation is a flowchart: a **trigger** starts it, then steps run — send a message, ask a
question, branch, hand off. There is no separate bot builder: a **keyword auto-reply** is simply a
Trigger (with keywords like "hi, price") wired to a Send Message. Matching is case-insensitive
"contains". The list page shows each flow's trigger, step count, and run count; toggle each
Active/off, edit, or delete. Only an **Active** flow replies to real customers.

## 7.2 The canvas & blocks
Drag blocks from the left palette; draw a line from one block's handle to the next.
**Blocks that power live flows today:** Trigger · Send Message (text/buttons/media/list) ·
Template · Ask Question (saves the reply) · Condition (Yes/No branch) · Add Tag · Notify Agent ·
Wait (short delays ≤~20s) · Webhook. The palette also shows richer commerce blocks (Catalogue,
Products, WhatsApp Forms, Ask Location) that are being wired to live WhatsApp — build with the
working set for now.

## 7.3 Build, test & go live
1. Add a Trigger; set keywords (e.g. `hi, hello`), Apply.
2. Add a message block; write `Hi {{name}}, welcome!` and up to 3 buttons.
3. Connect them (drag from the trigger's handle).
4. Open the **Simulator** and role-play — it sends nothing to real customers.
5. Click **Activate**.

Save Draft keeps a non-firing draft; Activate makes it live; autosave saves every ~10s. Shortcut:
the **Import JSON → Copy AI prompt** button lets you build a flow by describing it to ChatGPT and
pasting the JSON back (six sample flows are also built in). Remember the 24-hour window — use a
Template block to reach people outside it; start with one automation per trigger.

---

# 8. Analytics, Tasks & Calls

## 8.1 Analytics (Pro plan and up)
A performance dashboard over any date range (7 / 14 / 30 / 90 days or custom; scope to one number
with the account switcher). Six KPIs (Messages sent, Delivered, Read, Replied, Failed, New
contacts) with rates and change vs. the previous period; an **estimated WhatsApp cost** broken
down by category (Meta bills directly, ₹0 markup, free service replies excluded); a message-volume
chart; a delivery funnel; an **Agent Performance** table (resolved counts + average reply time);
and **Top Templates** by read rate. Your Dashboard home also has a 7-day snapshot and a message log.

## 8.2 Tasks & Follow-ups (add-on)
A to-do list for follow-ups. Create a task with a title, **due date & time**, priority, and
assignee. When it's due, a browser notification pops up (`⏰ Task due`) and the sidebar shows an
amber badge. Tasks group into Overdue / Today / Upcoming / No due date. Tick the circle to
complete. A task is the to-do; the **due date** is what turns it into a timed reminder. A CRM
deal's *Add follow-up task* creates one already linked to that customer.

## 8.3 Calls (add-on)
Make and receive real WhatsApp voice calls in the browser. Start from *New call* or a chat's
**Call** button; allow the microphone; a softphone appears bottom-right (timer, mute, hang-up).
The Calls page logs every call (incoming/outgoing/missed) with duration.

**Permission handshake:** you can't cold-call — the customer must have *allowed calls* from your
business. If they haven't, Weflux sends them a one-tap "allow calls" prompt; call again once they
accept.

---

# 9. Integrations

## 9.1 Google Sheets 2-way sync
Connect one Google Sheet per project. A new lead row instantly gets a WhatsApp template, and the
customer's reply is written back into the same row.
1. **Connect a sheet** — sign in with Google once, pick one spreadsheet (one connection per project tab).
2. **Configure** — choose the tab, pick your approved first-touch template, map phone/name columns
   and any `{{n}}` variables.
3. **Install the live watcher** — paste a short script into the sheet (the dialog gives it to you)
   for instant sync, or use polling.
4. **Test & go live** — send a test lead to your own number, then point your ads/forms at the sheet.

"2-way" means: In = a new phone in the sheet becomes a WhatsApp send; Out = the reply and status
are written back. Weflux only ever touches the specific spreadsheet you pick (Google's limited
`drive.file` permission). Don't use Meta's `hello_world` sample — use a template approved on your
own number.

## 9.2 E-commerce order updates (no plugin)
Connect Shopify, WooCommerce, or a custom store; every order stage fires the WhatsApp template you
chose.
- **Shopify / WooCommerce:** paste your API keys — Weflux registers the order webhooks for you.
- **Custom / headless:** Weflux gives your developer a URL + secret to POST events to.

Stages you can message: cart abandoned, order placed / COD confirm, payment received, shipped,
out for delivery, delivered, cancelled, RTO, returned, refunded. Order-lifecycle messages are
UTILITY (cheap, send anytime); cart-recovery and review requests are MARKETING. Variables
(customer name, order number, total, tracking link, courier…) auto-fill from the order. A
**webhook** is your store phoning Weflux the instant something changes. Start with COD confirmation
(cuts fake orders/RTO) and abandoned-cart recovery.

## 9.3 Migrate from another tool (admin-only)
A four-step wizard imports contacts and chat history from WATI, Interakt, AiSensy, DoubleTick,
TeleCRM, a plain CSV, or a WhatsApp chat export (.txt):
1. Pick source (each shows how to export from it).
2. Upload the export file(s).
3. Preview — a dry run shows counts and a sample, with no writes yet.
4. Import — runs in the background (you can close the dialog).

Contacts (phone, name, tags, stage) and chat history come across; unknown columns become custom
fields. Re-running is safe (idempotent) — duplicates are skipped.

---

# 10. Settings & your account

Settings is one page with a left menu. Tags, Contact Stages, and Danger Zone appear on paid plans.

- **My Account** — your own name, email, login password, and photo (leave password blank to keep current).
- **Connections** — add/manage your WhatsApp number(s); status, quality, daily limit, Sync, Calls On/Off.
- **Canned Responses** — saved replies inserted by typing `/`; each has a shortcut (`/hello`), a
  title, and a message with `{{name}}` / `{{phone}}` placeholders. Import from CSV.
- **Tags** — colour-coded contact labels.
- **Custom Attributes** — extra profile fields (key, label, type).
- **Contact Stages** — rename/recolour/reorder your funnel stages (the seven built-ins).
- **Auto-Assignment** — route new chats by **keyword match** (contains a word → assign to an agent,
  by priority) or **round-robin** (spread evenly).
- **Opt-out Keywords** — words like STOP/UNSUBSCRIBE that auto-unsubscribe a contact (with an
  optional confirming auto-reply). Compliance backbone.
- **Team Members** — invite people (name, email, role, temporary password); roles are Admin (full
  access), Manager (team + reports), Agent (inbox only). Reset passwords, change roles, deactivate
  (history kept). The founding "main admin" is protected. Seats capped by plan.
- **Support Access** — a read-only log of every time Weflux support entered your dashboard (Entered/Left).
- **Request a Feature** — describe what you need; Weflux builds custom features on request.
- **Danger Zone** — permanently delete your account/workspace (type email + password to confirm).

**Billing lives in Meta, not Weflux:** there's no billing tab. Meta charges you directly for
messages; your dashboard shows whether a Meta payment method is connected and links out to manage
it. Weflux adds ₹0 markup.

---

# Appendix A — Glossary

- **24-hour window** — the period after a customer's last message when you can send free-form replies; after it, only approved templates.
- **Add-on** — a module (CRM, Tasks, Calls, Migrate) switched on for your account by the Weflux team.
- **API** — a doorway that lets two pieces of software talk.
- **Approved template** — a pre-written message Meta has reviewed and allowed.
- **Assignment** — the agent who owns a conversation (first to reply is auto-assigned).
- **Broadcast / Campaign** — one approved template sent to many contacts at once.
- **BSP / Tech Provider** — a Meta-approved company that hosts your WhatsApp API connection. Weflux is your BSP.
- **Canned response** — a saved reply snippet inserted by typing `/`.
- **Category** — a template's type: Marketing, Utility, or Authentication.
- **Cloud API** — Meta's hosted WhatsApp Business API that Weflux connects to.
- **Connection** — a WhatsApp Business number linked to Weflux.
- **Contact** — a person in your address book, identified by phone.
- **CRM / Deal** — your sales pipeline; a deal is one opportunity with a value and a stage.
- **Custom attribute (field)** — an extra profile field you define.
- **Embedded Signup** — Meta's one-click pop-up to connect your number; Weflux never sees your password.
- **Entitlements** — the live list of what your account can use; upgrades apply within ~30s.
- **Label** — a chip attached to a single conversation (a tag attaches to the contact).
- **Lead journey** — the timeline of every conversation a contact has had with you.
- **Lifecycle stage** — where a contact sits in your funnel (New Lead → Customer).
- **Messaging limit / tier** — how many new people you can message in 24 hours (starts at 250/day).
- **Opt-in / opt-out** — permission to message / a request to stop.
- **Phone Number ID · WABA ID** — Meta's identifiers for your number and account.
- **Quality rating** — Meta's health score for your number (Green/Yellow/Red).
- **Reply flow** — an auto follow-up template that fires when someone replies to a specific campaign.
- **Session** — another name for an open 24-hour window.
- **Tag** — a reusable colour-coded label on a contact.
- **Template** — see Approved template; holds `{{n}}` variables filled at send time.
- **Variable `{{n}}`** — a numbered blank in a template filled with real data at send time.
- **Webhook** — an instant "something happened" push (replies into your inbox; order events from your store).
- **Workspace / Organization** — your Weflux account; the person who registers is its Admin.

---

# Appendix B — Quick reference & the golden rules

**The five golden rules**
1. To message someone first, use an **approved template**.
2. You can type freely only within **24 hours** of the customer's last message.
3. Only **opt-in** contacts should get marketing; always honour **opt-outs**.
4. Keep messages useful — a bad **quality rating** throttles your number.
5. **Meta** bills you for messages directly; **Weflux adds ₹0**.

**Template categories & price:** Marketing ≈₹0.78 (offers) · Utility ≈₹0.21 (order updates) ·
Authentication ≈₹0.16 (OTPs) · Service reply free (in-window chat).

**Message ticks:** 🕐 queued → ✓ sent → ✓✓ delivered → blue ✓✓ read → ✗ failed.

**"How do I…?"**
- Reply to a customer? Inbox → click the chat → type → Enter.
- Message someone new? Inbox → **+** → pick contact → choose a template.
- Send to many? Campaigns → New Campaign → template + audience.
- Create a template? Templates → Create Template → Submit to Meta.
- Auto-reply to a keyword? Automation → New → Trigger + Send Message → Activate.
- Add my number? Settings → Connections → Connect WhatsApp.
- Import contacts? Contacts → Import CSV (download the template first).
- Add a teammate? Settings → Team Members → Invite Member.
- Stop messaging someone? Their Info panel → WhatsApp Opt-out toggle.
- See what's working? Analytics → pick a date range.

**Inbox shortcuts:** `j`/`k` next/previous · `Esc` close · `⌘/Ctrl+N` new chat · `/` canned reply.

**Need a hand?** WhatsApp/phone +91 63945 53354 · email hello@serves.in · or the green assistant
bubble on any screen.

---

*Weflux — fast, precise, trustworthy. weflux.in · The Complete Guide v1.0*
