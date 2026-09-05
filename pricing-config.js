/* =========================================================
   Weflux Pricing Configuration — Single Source of Truth
   All plan limits, prices, add-ons, and feature entitlements.
   Consumed by: pricing page, comparison table, structured data.
   ========================================================= */

const WEFLUX_PRICING = {

  /* ---- Core Plans ---- */
  plans: [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      positioning: 'Try Weflux with the essential WhatsApp inbox and contact management tools.',
      cta: { text: 'Start free', url: 'https://app.weflux.in/register' },
      featured: false,
      limits: {
        whatsappNumbers: 1,
        teamMembers: 1,
        contacts: 500,
        automations: 0,
        googleSheets: 0,
        templates: 3
      },
      features: {
        sharedInbox: true,
        broadcast: false,
        broadcastScheduling: false,
        segmentation: false,
        integrations: false,
        googleDrive: false,
        ecommerce: false,
        campaignAnalytics: false,
        whatsappCalling: false,
        whatsappAuthentication: false,
        webhooks: false,
        contactManagement: 'Basic',
        dashboard: 'Basic',
        support: 'Self-service'
      }
    },
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 999,
      annualPrice: 799,
      positioning: 'Everything a small business needs to manage, engage and automate WhatsApp conversations.',
      cta: { text: 'Start free trial', url: 'https://app.weflux.in/register?plan=basic' },
      featured: false,
      limits: {
        whatsappNumbers: 1,
        teamMembers: 3,
        contacts: 'Unlimited',
        automations: 5,
        googleSheets: 1
      },
      features: {
        sharedInbox: true,
        broadcast: true,
        broadcastScheduling: false,
        segmentation: 'Basic',
        integrations: 'Basic',
        googleDrive: true,
        ecommerce: true,
        campaignAnalytics: true,
        whatsappCalling: true,
        whatsappAuthentication: true,
        webhooks: false,
        support: 'Chat support'
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 2499,
      annualPrice: 1999,
      positioning: 'For growing businesses that need more automation, campaigns, integrations and team capacity.',
      cta: { text: 'Start free trial', url: 'https://app.weflux.in/register?plan=pro' },
      featured: true,
      badge: 'Most popular',
      limits: {
        whatsappNumbers: 2,
        teamMembers: 5,
        contacts: 'Unlimited',
        automations: 15,
        googleSheets: 3
      },
      features: {
        sharedInbox: true,
        broadcast: true,
        broadcastScheduling: true,
        segmentation: 'Advanced',
        integrations: 'Advanced',
        googleDrive: true,
        ecommerce: true,
        campaignAnalytics: 'Advanced',
        whatsappCalling: true,
        whatsappAuthentication: true,
        webhooks: true,
        support: 'Priority support'
      }
    },
    {
      id: 'scale',
      name: 'Scale',
      monthlyPrice: 4999,
      annualPrice: 3999,
      positioning: 'For businesses running larger WhatsApp operations with multiple numbers, team members and automations.',
      cta: { text: 'Start free trial', url: 'https://app.weflux.in/register?plan=scale' },
      featured: false,
      limits: {
        whatsappNumbers: 5,
        teamMembers: 10,
        contacts: 'Unlimited',
        automations: 25,
        googleSheets: 5
      },
      features: {
        sharedInbox: true,
        broadcast: true,
        broadcastScheduling: true,
        segmentation: 'Advanced',
        integrations: 'Advanced',
        googleDrive: true,
        ecommerce: true,
        campaignAnalytics: 'Advanced',
        whatsappCalling: true,
        whatsappAuthentication: true,
        webhooks: true,
        support: 'Priority support'
      }
    }
  ],

  /* ---- Enterprise ---- */
  enterprise: {
    positioning: 'For custom requirements.',
    cta: { text: 'Talk to Sales', url: 'contact.html?topic=enterprise' }
  },

  /* ---- Add-ons ---- */
  addons: {
    capacity: [
      {
        id: 'extra_whatsapp_number',
        name: 'Extra WhatsApp Number',
        price: 500,
        unit: '/month'
      },
      {
        id: 'extra_team_member',
        name: 'Extra Team Member',
        price: 250,
        unit: '/month'
      },
      {
        id: 'extra_automation',
        name: 'Extra Automation',
        price: 100,
        unit: '/month'
      },
      {
        id: 'extra_google_sheet',
        name: 'Extra Google Sheet',
        price: 150,
        unit: '/month'
      }
    ],
    modules: [
      {
        id: 'weflux_crm',
        name: 'Weflux CRM',
        price: 1500,
        unit: '/month'
      },
      {
        id: 'lead_alerts',
        name: 'Lead Alerts',
        price: 250,
        unit: '/month'
      },
      {
        id: 'invoicing',
        name: 'Invoicing',
        price: 500,
        unit: '/month + ₹2/invoice'
      }
    ],
    custom: [
      {
        id: 'custom_crm',
        name: 'Custom CRM Integration',
        price: 300,
        unit: '/month*',
        footnote: '*Additional development/setup charges may apply.'
      },
      {
        id: 'facebook_instagram',
        name: 'Facebook + Instagram',
        price: null,
        unit: 'Custom Request'
      }
    ]
  },

  /* ---- FAQ ---- */
  faq: [
    {
      q: 'What is Weflux?',
      a: 'Weflux is a WhatsApp Business Platform that provides a shared inbox, broadcasts, automation, campaigns, integrations and business communication tools.'
    },
    {
      q: 'Does Weflux charge a markup on WhatsApp messages?',
      a: 'No. Weflux does not add a markup to applicable Meta/WhatsApp messaging charges. Meta charges are passed through separately.'
    },
    {
      q: 'What is the difference between Basic, Pro and Scale?',
      a: 'Basic includes 1 WhatsApp number, 3 team members and 5 automations. Pro includes 2 WhatsApp numbers, 5 team members and 15 automations with advanced segmentation and analytics. Scale includes 5 WhatsApp numbers, 10 team members and 25 automations for larger operations.'
    },
    {
      q: 'Can I add more WhatsApp numbers?',
      a: 'Yes. Additional WhatsApp numbers cost ₹500/month each.'
    },
    {
      q: 'Can I add more team members?',
      a: 'Yes. Additional team members cost ₹250/month each.'
    },
    {
      q: 'Can I add more automations?',
      a: 'Yes. Additional automations cost ₹100/month each.'
    },
    {
      q: 'Is Weflux CRM included?',
      a: 'Weflux CRM is an optional ₹1,500/month module. It is not included in the core plans by default.'
    },
    {
      q: 'Does Weflux support Google Sheets?',
      a: 'Yes. Basic includes 1 Google Sheet integration, Pro includes 3, and Scale includes 5. Additional sheets cost ₹150/month each.'
    },
    {
      q: 'Does Weflux support Google Drive?',
      a: 'Yes. Google Drive attachments are included in Basic, Pro and Scale at no additional cost.'
    },
    {
      q: 'Does Weflux support e-commerce integrations?',
      a: 'Yes. E-commerce integration is included in Basic, Pro and Scale at no additional cost.'
    },
    {
      q: 'Is WhatsApp Authentication included?',
      a: 'Yes. WhatsApp Authentication is included in Basic, Pro and Scale. Applicable Meta/WhatsApp messaging charges for authentication messages are separate.'
    },
    {
      q: 'Does Weflux support Facebook and Instagram?',
      a: 'Facebook and Instagram integration is available through a custom request. Pricing depends on the requirements.'
    },
    {
      q: 'Does Weflux provide invoicing?',
      a: 'Yes. Invoicing is an optional module costing ₹500/month plus ₹2 per invoice created.'
    },
    {
      q: 'Can Weflux integrate with my own CRM?',
      a: 'Yes. Custom CRM integration is available from ₹300/month, with additional development or setup charges where applicable.'
    },
    {
      q: 'Can I switch plans later?',
      a: 'Yes. You can upgrade or downgrade in one click inside your workspace. We pro-rate the difference — no contracts.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'UPI, Net Banking, Visa / Mastercard / Amex, and NEFT/RTGS for enterprise. International cards work too — we bill in INR.'
    }
  ]
};
