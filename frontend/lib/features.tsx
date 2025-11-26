import React, { ReactElement } from 'react';
import {
  Bot,
  MessageSquare,
  Mail,
  Globe,
  Link as LinkIcon,
  MapPin,
  Zap,
  Smartphone,
  ShoppingBag,
  PenTool,
  LayoutGrid,
} from 'lucide-react';

type Cta = { label: string; href: string };

export type FeatureConfig = {
  slug: string;
  title: string;
  subtitle: string;
  cardDescription: string;
  description: string;
  bullets: string[];
  primaryCta: Cta;
  secondaryCta: Cta;
  icon: ReactElement;
};

export const featureList: FeatureConfig[] = [
  {
    slug: 'seo',
    title: 'SEO Platform',
    subtitle: 'Technical / Content / Local',
    cardDescription:
      'Comprehensive technical SEO, content strategy, local/GBP optimization, and Search Console orchestration to build your digital foundation.',
    description:
      'Track your sites, content, FAQs, backlinks, and directory citations in one place. Align technical SEO with content and local search.',
    bullets: [
      'Sites, content items, FAQ entries, keyword clusters',
      'Backlink view with anchor/status (API driven)',
      'Directory submissions with status tracking',
      'Tenant-aware data so teams stay scoped',
    ],
    primaryCta: { label: 'View SEO Data', href: '/features/seo/data' },
    secondaryCta: { label: 'API Features', href: '/#/auth' },
    icon: <LayoutGrid className="w-6 h-6" />,
  },
  {
    slug: 'aeo',
    title: 'Answer Engine Optimization',
    subtitle: 'LLM Visibility',
    cardDescription:
      "The next evolution of SEO. We optimize your brand for Large Language Models (LLMs) like ChatGPT, Claude, and Perplexity.",
    description:
      'Prepare your brand for LLMs and answer engines with clean structured data, FAQs, and multilingual-ready content.',
    bullets: [
      'FAQs and content items exposed via API',
      'Translation/LLM endpoint for quick language variants',
      'Tenant-aware data to keep orgs separated',
      'Backlink and directory support to build authority',
    ],
    primaryCta: { label: 'Try Translation', href: '/features/aeo/data' },
    secondaryCta: { label: 'See FAQs', href: '/features/aeo/data' },
    icon: <Bot className="w-6 h-6" />,
  },
  {
    slug: 'social',
    title: 'Social & Community Marketing',
    subtitle: 'Engage & Respond',
    cardDescription:
      "Powered by 'Riona', our policy-compliant agent, we drive engagement across social platforms and manage your community effectively.",
    description:
      'Accounts, posts, conversations, comments, and engagement metrics are available via API to power your frontends and agents.',
    bullets: [
      'Social accounts, posts, comments, conversations, messages endpoints',
      'Engagement metrics (likes, shares, clicks) per post',
      'Ready to plug into your React UI or agent workflows',
      'Secure per-tenant access',
    ],
    primaryCta: { label: 'Connect Social Data', href: '/features/social/data' },
    secondaryCta: { label: 'View Posts', href: '/features/social/data' },
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    slug: 'email',
    title: 'Email & SMS Revenue Engine',
    subtitle: 'Lifecycle & Outreach',
    cardDescription:
      'High-converting opt-in flows paired with lawful B2B cold outreach. Turn leads into lifelong customers.',
    description:
      'Lists, contacts, templates, flows, and send history are exposed via the API to drive your revenue campaigns.',
    bullets: [
      'Email lists, contacts, templates, flows endpoints',
      'Send history for analytics and reporting',
      'Marketing summary endpoint for quick dashboards',
      'Pairs with welcome emails on signup out of the box',
    ],
    primaryCta: { label: 'View Email Data', href: '/features/email/data' },
    secondaryCta: { label: 'Marketing Overview', href: '/features/email/data' },
    icon: <Mail className="w-6 h-6" />,
  },
  {
    slug: 'multilingual',
    title: 'Multilingual SEO',
    subtitle: 'Expand Globally',
    cardDescription:
      'Expand globally with automated translation, proper hreflang implementation, and dedicated language URLs.',
    description:
      'Use the multilingual summary and translation endpoints to ship localized content with proper hreflang structure.',
    bullets: [
      'Multilingual summary endpoint for locales and counts',
      'Translation endpoint with optional OpenAI support',
      'SEO content items and FAQ endpoints for localized pages',
      'Tenant scoping to keep locales per brand',
    ],
    primaryCta: { label: 'Translate Content', href: '/features/multilingual/data' },
    secondaryCta: { label: 'View Multilingual Data', href: '/features/multilingual/data' },
    icon: <Globe className="w-6 h-6" />,
  },
  {
    slug: 'backlinks',
    title: 'Backlink Acquisition',
    subtitle: 'Authority Building',
    cardDescription:
      'Ethical digital PR and high-quality resource links to boost your domain authority and search rankings.',
    description:
      'Surface backlink data for your SEO sites, including anchor text and status, to guide ethical PR and outreach.',
    bullets: [
      'Backlinks endpoint grouped by SEO sites',
      'Anchor, status, and domain rating fields',
      'Pairs with directory submissions for local/authority signals',
      'API-first so you can build the UI you need',
    ],
    primaryCta: { label: 'View Backlinks', href: '/features/backlinks/data' },
    secondaryCta: { label: 'See Directories', href: '/features/directories/data' },
    icon: <LinkIcon className="w-6 h-6" />,
  },
  {
    slug: 'directories',
    title: 'Directory & Citation Submissions',
    subtitle: 'Local & Global Signals',
    cardDescription:
      'Curated, quality-first submissions to authoritative directories to solidify your local and global presence.',
    description:
      'Track directory submissions with status per tenant to strengthen local and global presence.',
    bullets: [
      'Create and list directories via `/api/seo/directories/`',
      'Status tracking (pending, submitted, approved, rejected)',
      'Tenant-aware to keep orgs separate',
      'Complements backlinks for authority',
    ],
    primaryCta: { label: 'Manage Directories', href: '/features/directories/data' },
    secondaryCta: { label: 'Back to Services', href: '/services' },
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    slug: 'free-zone',
    title: 'Free Zone: Converge Market Reach',
    subtitle: 'Always-On Experiments',
    cardDescription:
      'Always-on creative ideas and micro-tools designed to capture top-of-funnel traffic and engage users.',
    description:
      'Launch lightweight tools, promos, and experiments that earn attention while feeding your core funnels.',
    bullets: [
      'Micro-landing templates to ship offers fast',
      'Gamified lead capture blocks and widgets',
      'Simple APIs for giveaways, waitlists, and surveys',
      'Pairs with email, social, and SEO programs for follow-up',
    ],
    primaryCta: { label: 'Spin Up a Microtool', href: '/features/free-zone/data' },
    secondaryCta: { label: 'Back to Services', href: '/services' },
    icon: <Zap className="w-6 h-6" />,
  },
  {
    slug: 'aso',
    title: 'App Store Optimization',
    subtitle: 'iOS & Android',
    cardDescription:
      'Dominate the iOS App Store and Google Play Store with keyword optimization, visual assets, and review management.',
    description:
      'List apps, keywords, and store listings via the ASO endpoints to power your app growth UI.',
    bullets: [
      'Apps, keywords, and listings endpoints (tenant-scoped)',
      'Keywords with position and search volume fields',
      'Listing data to show localized titles and descriptions',
      'Pairs with reviews and conversations in marketplace',
    ],
    primaryCta: { label: 'View ASO Data', href: '/features/aso/data' },
    secondaryCta: { label: 'See Marketplace', href: '/features/marketplace/data' },
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    slug: 'marketplace',
    title: 'Marketplace & Directory Listings',
    subtitle: 'Products, Orders, Reviews',
    cardDescription:
      'Strategic placement on platforms like G2, Capterra, Shopify App Store, and Chrome Web Store tailored to your niche.',
    description:
      'Expose products, orders, reviews, and saved items via the marketplace endpoints to build your storefront and review UI.',
    bullets: [
      'Products, orders, reviews, saved products endpoints',
      'Conversations and messages for buyer/seller communication',
      'Tenant-aware data for multi-org support',
      'Great for B2B directories or app stores',
    ],
    primaryCta: { label: 'View Marketplace Data', href: '/features/marketplace/data' },
    secondaryCta: { label: 'Back to Services', href: '/services' },
    icon: <ShoppingBag className="w-6 h-6" />,
  },
  {
    slug: 'content',
    title: 'Trending Blog Engine',
    subtitle: 'Research / Brief / Draft',
    cardDescription:
      'End-to-end content production: Topic research, briefs, drafts, and scheduling. Ride the wave of trending topics.',
    description:
      'Use SEO content items, multilingual support, and translation to power your blog workflows.',
    bullets: [
      'Content items endpoint for blog/Q&A/product pages',
      'Multilingual summary to plan locales',
      'Translation endpoint (OpenAI-enabled) for quick drafts',
      'FAQ endpoint for rich answers',
    ],
    primaryCta: { label: 'Plan Content', href: '/features/content/data' },
    secondaryCta: { label: 'Translate Copy', href: '/features/multilingual/data' },
    icon: <PenTool className="w-6 h-6" />,
  },
];

export const featureBySlug: Record<string, FeatureConfig> = Object.fromEntries(
  featureList.map((feature) => [feature.slug, feature])
);
