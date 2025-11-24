## Icycon — User flow (UI templates -> actions)

Below is a flowchart (Mermaid) that shows the typical user journey starting from the `home.html` template and travelling through the main app screens implemented by the repo templates (analytics, aso, backlinks, blog, email engine, social/social_media, marketplace, multilingual, seo, tenants/profile).

Copy the Mermaid block below into a Mermaid viewer (VS Code Mermaid preview extension, GitHub if supported, or https://mermaid.live/) to visualize it.

```mermaid
flowchart TD
  A[Home (home.html)] -->|not logged in| B(Login / Signup)
  B -->|after login| C[Dashboard / Home (logged-in)]

  subgraph Core
    C --> D[Analytics (analytics.html)]
    C --> E[ASO (aso.html)]
    C --> F[Backlinks (backlinks.html)]
    C --> G[Blog (blog.html)]
    C --> H[Marketplace (marketplace.html)]
    C --> I[Multilingual (multilingual.html)]
    C --> J[SEO (seo.html) - sites / keywords / faqs / content]
    C --> K[Email Engine (email_engine.html)]
    C --> L[Social (social.html) - scheduling & connectors]
    C --> M[Social Media (social_media.html) - CMS + distribution]
    C --> N[Tenants / Profile (accounts_profile.html / profile.html)]
  end

  %% Social Media flow (create -> preview -> publish)
  M --> MA[Create Post (social_media/create_post.html)]
  MA --> MB[Edit / Add Media / Set Platforms]
  MB --> MC[Validate (guardrails / policy checks)]
  MC -->|pass| MD[Publish Now / Schedule]
  MC -->|fail| ME[Show Policy Error / Edit]
  MD --> MF[Post Saved -> Published (list view: social_media/posts.html)]
  MF --> MG[View Engagements & Comments]

  %% Social (legacy/lightweight posting) flow
  L --> LA[Connect Social Accounts (social/accounts.html)]
  LA --> LB[Create Post (social/posts.html)]
  LB --> LC[Schedule or Publish (task enqueued)]
  LC --> LD[Social Logs (social/logs.html)]

  %% Shared steps
  MA -.-> LB  %% content authored in social_media can seed social.Post entries
  LB -.-> MA  %% or lightweight posts can be promoted into CMS posts

  %% Auxiliary flows
  K --> KA[Email Contacts / Lists / Templates / Sends]
  J --> JA[SEO Content Items / Keywords / Sites / FAQs]
  D --> DA[Analytics Dashboards]
  N --> NA[Invite Users / Tenant Settings]

  %% Errors and admin
  MC -->|rate-limit| X[Retry Later]
  MC -->|auth error| Y[Re-authenticate Account]

  style A fill:#f9f,stroke:#333,stroke-width:1px
  style C fill:#efe,stroke:#333
  style M fill:#fffae6,stroke:#333
  style L fill:#e6f7ff,stroke:#333

  classDef admin fill:#eee,stroke:#666,stroke-dasharray: 5 5;
  N:::admin

  click MA "#create-post" "Open create post page"
  click LA "#connect-accounts" "Open connect accounts"

``` 

### How to use this
- Open `docs/USER_FLOW_CHART.md` in VS Code and install a Mermaid preview extension (or open the mermaid block at https://mermaid.live/).
- The nodes map to templates in `icycon/templates/` so you can jump from the diagram to the template files:
  - `home.html` -> start
  - `social_accounts.html`, `social_posts.html`, `social_logs.html` -> social
  - `social_media/create_post.html` -> social_media create flow
  - `analytics.html`, `aso.html`, `backlinks.html`, `blog.html`, `marketplace.html`, `seo*.html`, `email_*.html` -> other modules

### Next steps / customizations
- I can export this to an SVG/PNG and add it to the repo (e.g., `docs/flowchart.svg`).
- I can also produce separate per-app flowcharts (e.g., Social Media detailed flow with states: draft -> scheduled -> published -> engagement tracking).

If you'd like an SVG/PDF exported and committed to the repo, tell me and I'll generate it and add it under `docs/`.
