# Demo Data Presentation — Icycon

Date: November 12, 2025

This document describes the demo user and dataset that was seeded into the Icycon project using the management command `users/management/commands/seed_demo_data.py`.

## Objective
Create a single, fully-populated demo user (and supporting entities) that exercises features across apps: tenants, marketplace, SEO, analytics, and social. The demo data helps QA, manual testing, and initial demos.

---

## What the seeding script does (high-level)
1. Create a demo tenant (`Demo Tenant`) and a demo user (`demo_user`). Attach the user to the tenant as `owner`.
2. Create a seller tenant (`Demo Seller`) and seller user (`demo_seller`).
3. Create a marketplace product `Demo Analytics Plugin` under the seller.
4. Save the product for `demo_user`.
5. Create an order (completed) for `demo_user` purchasing the product.
6. Create a 5-star review from `demo_user` for the product.
7. Create a conversation between buyer and seller and two messages (buyer and seller replies).
8. Create an SEO site and a content item (blog) for the tenant.
9. Create an Analytics site and a PageView entry.
10. Create a social `Post` and `SocialLog` entry showing an example post.

---

## How to run the command

From the project root (same folder as `manage.py`):

```bash
python manage.py seed_demo_data
```

Optional args:
- `--username` (default `demo_user`)
- `--email` (default `demo@example.com`)
- `--password` (default `demo1234`)

---

## What was created (summary counts)
(Counts shown are sample results from when the command was run during this session)

- Users: 8 (demo_user created or already existed)
- Tenants: 6
- Products: 1
- Orders: 2
- Reviews: 1
- SavedProducts: 1
- Conversations: 1
- Messages: 2
- SeoSites: 2
- SeoContent (ContentItem): 2
- AnalyticsSites: 2
- PageViews: 6
- Posts: 2
- SocialLogs: 1

---

## Representative sample records

- User: `demo_user` (email: demo@example.com)
- Tenant: `Demo Tenant` (owner: demo_user)
- Seller: `Demo Seller` (owner: demo_seller)
- Product: `Demo Analytics Plugin` — price: $49.99 — features: Dashboard, Real-time stats, Export CSV
- Order: Generated order number (ORD-XXXXXXXX) — status: completed — access_token provided
- Review: 5 stars — "Great demo plugin"
- Conversation: Subject: "Question about integration" with 2 messages
- SEO Site: https://demo.example.com — sitemap: /sitemap.xml
- Analytics PageView: visitor-1 on https://demo.example.com
- Social Post: "Launching our demo site today!"

---

## Implementation notes
- The seeding command is idempotent where possible: `get_or_create` is used to avoid duplicates.
- The command touches multiple apps and demonstrates relationships across tenants and users.
- Review unique constraints are respected (`product`, `reviewer`, `tenant`). If a demo user already has a review, the command won't create a duplicate.

---

## Next steps & suggestions
- Extend the seeder to create multiple products and orders covering other pricing models (subscription, custom).
- Add CLI flags to control the volume of generated data for performance/load testing.
- Add an option `--clear-first` to delete demo data before seeding (careful with production databases).
- Add more realistic analytics by generating many `PageView` rows across multiple timestamps and referrers.

---

## Where the code lives
- Seeder command: `users/management/commands/seed_demo_data.py`

---

If you'd like, I can:
- Extend the seeder to create 50 products and 200 orders for load testing
- Add a `--clear-first` flag with safeguards
- Create fixtures (JSON) you can load with `loaddata` for CI

Which would you prefer next?