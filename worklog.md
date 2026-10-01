# Worklog

---
Task ID: 1
Agent: Super Z (main agent)
Task: Build premium personal developer website for Chinmai Sagar from two resumes + passport photo (Type 3 — Interactive Web Development, Next.js 16)

Work Log:
- Extracted both resumes (PDF text + DOCX via python-docx + embedded hyperlinks from DOCX rels/PDF URI annotations). Source of truth: name Chinmai Sagar A.V, Zoho Developer Intern @ Elite Tech Corp (Feb 2025–Mar 2026), ML Intern @ Shiash (May–Jul 2024), 2 live projects on Zoho Catalyst, BCA @ DRBCCC/University of Madras, GitHub @chinmaisagar28, LinkedIn chinmai-sagar.
- Initialized fullstack env (init script), pushed Prisma schema (ContactMessage model) to SQLite.
- Asset pipeline (scripts/prep-assets.mjs): photo → WebP (640×800, 320×400) + JPG, resume DOCX → PDF via soffice (public/resume/Chinmai-Sagar-Resume.pdf, 107KB), 20 simple-icons brand SVGs → public/logos/ with currentColor, 5 hand-drawn marks (deluge, zoho-crm, zoho-creator, zoho-books, cursor), favicon.svg monogram.
- Captured REAL screenshots of both live projects via agent-browser (project-ai-dress-advisor.webp, project-netbook.webp + small variants).
- Data layer: src/data/{profile,experience,projects,technologies,zoho}.ts — strictly resume-derived, no invented facts.
- Design system in globals.css: warm paper/ink/signal-red editorial tokens, Fraunces + Space Grotesk + JetBrains Mono via next/font, grain overlay, scroll-reveal classes, photo→character transition keyframes, reduced-motion kill-switch.
- Sections: Navbar (scroll-spy, mobile overlay), Hero (photo 2.5s → scan-line wipe → SVG character on pedestal, skippable, tech marquee), About (sticky heading, facts, stats, education), Experience (dark timeline, 7+3 truthful bullets), ZohoEcosystem (hub-spoke diagram, auto-cycle until interaction, evidence panel), TechStack (SVG constellation with lit edges + grouped icon lists), Projects (data-driven asymmetric cards → full-screen case-study overlay, Escape close, scroll lock), ResumeBand, Contact (honest form states + IST clock), Footer.
- Character system (src/character/): CharacterSVG.tsx (~40 SVG elements, nested joint groups with absolute pivots), poses.ts (12 data-driven poses + walk/dash overlays), controller.ts (singleton rAF engine: exponential smoothing, 0.45s dash-arc fast jumps, walk cycle, blink scheduler, breathing, mouse-follow look, section staging via scroll spy, form-field gestures, project hover tracking, mobile/narrow fallback = hero-only, silent failure guards), CharacterStage.tsx.
- Effects (src/effects/): InteractiveNetwork canvas (device-adaptive node count, cursor physics with bounded radius, pauses on hidden tab, static under reduced-motion/low-end), CustomCursor (red dot + trailing ring, fine-pointer only), ScrollProgress, Reveal (IntersectionObserver).
- Secure contact API (src/app/api/contact/route.ts): zod validation, in-memory rate limit 5/10min per hashed IP, honeypot (silent fake success), attachment whitelist (ext+MIME+5MB) with randomized sanitized filenames persisted to db/uploads, Prisma persistence, no secrets client-side.
- SEO: metadata + OG/Twitter (generated 1200×630 og-card.png via scripts/make-og.mjs), canonical placeholder, JSON-LD Person, sitemap.ts, semantic HTML, single h1.
- Debugged: (1) Turbopack served stale globals.css — restarted dev server + cleared .next; (2) headless browser reports no pointer media features → rewrote device detection (finePointer fallback via maxTouchPoints, low-end threshold cores<=2 per spec's i5-8th-gen requirement); (3) character overlapped content at ≤1439px widths → journeyActive gate (≥1440px gets full margin journey, narrower gets hero-only guide); (4) character scale 150px in hero frame vs 116px in margins.
- Verified via agent-browser: photo→character transition (clip-path applies), all 8 sections desktop + mobile, nav-click character dash, form focus gestures, happy pose on success, zero console errors, no horizontal overflow (390px), Escape-closes overlay, resume PDF 200.
- Verified API security by curl: 400 invalid input, honeypot fake-success, attachment stored with sanitized name, 429 rate limiting. Test data cleaned from DB + uploads.

Stage Summary:
- Deliverable: complete Next.js 16 personal identity website at / (single-page, App Router).
- Key decisions: source-of-truth data files; character as final enhancement with graceful degradation (reduced-motion, low-end, narrow screens, failure → invisible); contact persistence via Prisma (honest success only after backend confirm); all logos behind a central registry (src/lib/logos.ts) for painless swapping.
- Known placeholders: canonical URL https://chinmaisagar.dev (update when domain live); email forwarding hook documented in API route comments (set SMTP/RESEND env vars).

---
Task ID: 2
Agent: Super Z (main agent)
Task: Surgical 2D skeletal rig repair of the SVG character — hierarchical joints, correct pivots, connected geometry, clamped pupils, restored scroll guidance (user spec §1–§23). No redesign; artwork preserved.

Work Log:
- Restored context: re-read CharacterSVG.tsx / controller.ts / poses.ts / bus.ts, original upload VectorImage.Svg, and live DOM state via agent-browser at 1600×900.
- Diagnosed via in-browser pivot experiment (zero vs rotate(+10°) bbox deltas): EFFECTIVE ROTATION CENTER WAS 2× THE PIVOT. Root cause — joint groups carried CSS `style.transformOrigin` while the controller wrote `rotate(a cx cy)` attribute transforms; in SVG2 the transform attribute is a CSS presentation property, so transform-origin composed on top (e.g. left-arm rotated around (268,704) instead of the shoulder (134,352)). This single bug made every limb swing from wrong centers = the reported "independent SVG objects" behavior.
- Fix 1 (CharacterSVG.tsx): stripped all 15 redundant `transformOrigin` styles from joint groups; controller attribute pivots are now the single source of truth. Verified empirically: rotate(+10°) now matches true-shoulder-pivot prediction within 1px.
- Fix 2 (CharacterSVG.tsx): pupils moved from the detached world-space `group-1` overlay INTO the head hierarchy — head > left-eye > left-pupil (id replaces group-26), head > right-eye > right-pupil (group-27); coordinates converted from overlay translate(176.19,-99.61) space to head-local (pixel-identical). Pupils now inherit head/torso/root transforms and can never drift off the face. Removed degenerate group-1/10/22/24/28 overlay.
- Fix 3 (controller.ts): binds left-pupil/right-pupil (was cj-eyes); ONE clamped look offset for both eyes, clamped to the eye-boundary ellipse (free travel = eye rx6.5/ry10 − pupil r3.5 → (3, 6.5) local units) per spec §8; blink squash pivots at each pupil's own rest center.
- Fix 4 (CharacterSVG.tsx): arm geometry rebuilt as bone capsules — upper arm = shoulder ellipse (rx18 ry12) centered ON the shoulder pivot tapering to a r15 hem arc centered ON the elbow; forearm = r18.5 elbow cap + straight body + rounded wrist, cuff preserved; forearm group renders above upper arm so the elbow cap seals the joint at ANY shoulder×elbow angle (verified at think pose elbow −122°). Elbow circles removed (fully covered by capsules). Colors/outline style unchanged (#946132/#A56C38/#7A4F28/#8A5A2E).
- Fix 5 (CharacterSVG.tsx): added STATIC deltoid shoulder caps (deltoid-left/right, sleeve-coloured, in torso layer UNDER the arms) that own the shoulder region when a pose lifts the arm away — no background wedge/hollow armpit at any raise angle (wave −148°, point ±96°, happy ±152°).
- Fix 6 (CharacterSVG.tsx): svg `overflow: visible` — raised poses extended past the viewBox right edge (local x max ≈ 318; wave hand reaches ≈ 385) and the SVG viewport was silently clipping forearms/hands ("hand floating away" look). No controller math or on-screen body size changed; stage has no paint-clipping ancestors; fixed-position elements don't create scrollable overflow.
- Fix 7 (poses.ts): inspect pose (zoho section) now looks LEFT (headRot −4, eyeX −2.5, torsoRot 1) — the guide stages in the right gutter with the diagram to its left.
- Verified legs (§7): already a correct hip→knee→ankle nested chain (knee discs + shirt-hem cover math checked for ±20° hip swing) — untouched per "don't fix what's correct".
- Section staging verified live: hero(pedestal) → about(think, right) → experience(pointRight, left) → zoho(inspect, right) → stack(pointLeft, right) → projects(pointRight, left) → resume(wave, left) → contact(guide, left); nav click = 0.45s dash + pose transition; pointer-events:none confirmed; mobile 390px: no overflow-x, hero-only guide, nothing blocked; console clean; tsc errors only in unrelated examples/skills dirs.

Stage Summary:
- The character is now a single coherent 2D articulated rig: attribute-driven joint rotations around true anatomical pivots, hierarchical local coordinates (root→torso→head/arms; pelvis→thigh→shin→foot), capsule-sealed arm joints, static deltoid caps, head-bound pupils, and section-aware scroll/nav staging restored — artwork and pose system otherwise unchanged.
- Key files: src/character/CharacterSVG.tsx (hierarchy + geometry), src/character/controller.ts (pupil binding/clamp/blink), src/character/poses.ts (inspect direction).
- Zoho "hover a node" spacing task from the prior session was already implemented (mt-[clamp(24px,3vw,48px)] in ZohoEcosystem.tsx) — re-verified, no change needed.
