<!-- cspell:disable — survey doc full of site names and proper nouns -->

# Home-page design research: personal sites of ML researchers & engineers

**Date of access: August 21, 2026.** All sites below were fetched directly (HTML + rendered content) on this date. Quotes are verbatim from the pages as fetched. No claims are sourced from listicles.

## TL;DR

Across 16 sites — the four named inspirations plus twelve widely admired personal sites — **not one leads with a decorative hero graphic.** Every single one opens with words: name, a one-line identity, then a short prose bio dense with specific, verifiable, slightly odd biographical facts ("I started out designing a spacesuit for storms" — okfrank.co; "interested in interface design since the eMac in 2002" — andrewl.ee). The only home-page imagery anywhere in the set is _evidence_: Frank Costa's own drawing, Andrew Lee's actual work thumbnails, Benji Taylor's tiny monogram. Personality is carried by prose specificity, a distinctive utility page (/now, atoms, Questions), and the writing list itself. Nick's instinct is right: the decorative generative graphic is the one element on his home page that no admired site has. The strongest move is to replace it with either nothing (more specific prose) or with a real interactive figure lifted from one of his essays — a graphic that is evidence of the work, not an ornament in front of it.

---

## Part 1: The four named inspirations

### 1. thinkingmachines.ai (accessed 2026-08-21)

- **Above the fold:** Company name, then immediately a prose mission statement: "Thinking Machines Lab is an artificial intelligence research and product company. We're building a future where everyone has access to the knowledge and tools to make AI work for their unique needs and goals." The entire home page is a structured essay — mission, then belief sections under headers ("Science is better when shared", "Solid foundations matter", "Learning by doing"), ending with "Join us."
- **Hero graphic:** None. The static HTML served to a crawler contains no `<canvas>`, `<video>`, or `<img>` hero element. The page is text.
- **Typography/layout:** Webfonts (six .woff2 files); body set via `font-family: var(--font-sans)`. Single narrow reading column, generous whitespace, hairline rules between sections — the editorial system Nick's site already borrows.
- **Writing/work treatment:** The home page _is_ the writing — a manifesto. (Their research blog, Connectionism, lives separately.)
- **Signature element:** The credentials paragraph: "We are scientists, engineers, and builders who've created some of the most widely used AI products, including ChatGPT and Character.ai... PyTorch, OpenAI Gym, Fairseq, and Segment Anything." Credibility by naming artifacts, not adjectives.
- **Why it feels credible:** It states convictions in complete sentences and backs them with named shipped work; there is nothing to look at except what they believe.

### 2. andrewl.ee — Andrew Lee, founding designer at Thinking Machines (accessed 2026-08-21)

- **Above the fold, in order:** (1) name, lowercase: "andrew lee"; (2) one-line identity: "I'm a designer and toolmaker."; (3) three short bio paragraphs (founding designer at Thinking Machines → Design Director at Notion, "joined as the second designer" → Palantir mapping tools); (4) a grounding line: "I'm based in San Francisco and have been interested in interface design since the eMac in 2002."; (5) a hairline rule; (6) "featured work" list.
- **Hero graphic:** None. The page's five `<img>` elements (verified in HTML: Squarespace CDN assets) are all **thumbnails of the featured work entries** — Scout, Wayfinder, Palantir Foundry, Acorns mobile, Couture. Images exist only as evidence of shipped projects. One `@keyframes` rule in the page (a minor transition), nothing decorative.
- **Typography/layout:** Sans-serif, single column, lots of air. Built on Squarespace — unremarkable plumbing, and it doesn't matter.
- **Writing/work treatment:** "featured work" — project name, year, and an honest provenance label: "Scout — 2019 Personal project", "Palantir Foundry — 2016". No descriptions, no pitch.
- **Signature element:** The eMac line. One sentence of origin story does the work a hero animation is usually asked to do.
- **Why it feels credible:** Every sentence is a checkable fact, and the only images are the work itself.

### 3. okfrank.co — Frank Costa, product designer at Thinking Machines (accessed 2026-08-21)

- **Above the fold, in order:** (1) name + location + contact in one compact line: "Frank Costa · San Francisco · Email · X"; (2) one-line identity: "I'm the second product designer at Thinking Machines."; (3) bio paragraphs.
- **Hero graphic:** **One image on the entire page, and it's instructive:** an `<img src="/drawing.svg">` (1341×758, full-width, verified in HTML) — _his own drawing_, embedded mid-bio. It's earned because it's a personal artifact by someone with an art background ("I dropped out of a sculpture degree"), not generated decoration. It functions like a specimen, not a hero.
- **Typography/layout:** Tailwind-based; `--font-sans` for body with `--font-mono` accents (verified in CSS). Narrow single column.
- **Writing/work treatment:** No post list at all — the page is purely a bio. But the bio is unusually concrete: "I started AI Meeting Notes, which became one of its most successful products to date." / "I helped start Superlist, a productivity app spun out of Wunderlist (acquired by Microsoft)."
- **Signature element:** The escalating-weirdness autobiography: "In a past life, I built a publishing and data platform for Hollywood. I started out designing a spacesuit for storms." and "I dropped out of a sculpture degree, majored in clothing technology, and later realized I just wanted to build with computers. I'm self-taught." Plus the lived-cities line: "Prior to San Francisco, I lived in Berkeley, LA, Berlin, and Lisbon."
- **Why it feels credible:** The facts are so specific they could only belong to one person; the single image is something he made with his hands.

### 4. benji.org — Benji Taylor, SpaceX / ex-Aave / Dip (accessed 2026-08-21)

- **Above the fold, in order:** (1) name: "Benji Taylor"; (2) prose bio starting with place: "I was born in London, UK, and now live in Los Angeles, CA."; (3) career paragraphs (founded Los Feliz Engineering — "named after the first neighbourhood I moved to in the U.S." — Honk, Family, acquisition by Aave Labs; now "I lead design for X and SpaceXAI" at SpaceX; Dip co-founder); (4) a self-assessment: "I consider myself a designer at heart and enjoy building highly polished products."; (5) contact links _inside the prose_ ("You can find me on X, Instagram, or reach me via email"); (6) "Writing" list.
- **Hero graphic:** None. HTML contains exactly one `<svg>` — a 32×32 monogram/mark — and five `@keyframes` rules that appear to drive subtle entrance fades. From one of the most respected interface designers working, the home page is deliberately plain.
- **Typography/layout:** Restrained single column, quiet type, no ornament.
- **Writing/work treatment:** "Writing" — bare titles only ("Drawesome ~New~", "Liveline", "Agentation", "Annotating for agents", "Morphing icons with Claude", "Honkish", "Family Values"). No dates, no descriptions, one "New" tag. The titles are confident enough to stand alone.
- **Signature element:** Narrative bio that reads like a story (London → Los Feliz → acquisition → SpaceX), with the company named after his first neighborhood.
- **Why it feels credible:** A designer known for polish chose _no visual flourish at all_ — the restraint itself is the flex.

---

## Part 2: Wider survey (10 sites, all verified by direct fetch on 2026-08-21)

### 5. brandur.org — Brandur Leach (infrastructure engineer, Postgres/River)

- **Above the fold:** One orienting paragraph: "I'm Brandur. This site is where I publish words and photos. The section updated most often is atoms, short multimedia particles reminiscent of a Twitter feed. I update my now page monthly according to what I'm working on and thinking about." Then recent writing.
- **Hero graphic:** None on home. (He publishes photography elsewhere on the site — imagery lives where it's content.)
- **Typography/layout:** Inter (verified: six `inter` webfont references in HTML). Clean single column.
- **Writing treatment:** The best list format in the survey: title + full date + a one-to-two-sentence _abstract_ + a category tag: "Does anyone run Postgres without PgBouncer? August 12, 2026 — Almost every notable managed Postgres provider bundles a connection pooler, giving us a strong hint that connection management is a product problem rather than a user problem. _fragment_"
- **Signature element:** "Atoms" (a self-hosted short-form feed) and a monthly-updated /now page — the home page is a map of the site's living sections.
- **Why it feels credible:** The homepage promises a publishing cadence and the dated entries prove he keeps it.

### 6. patrickcollison.com — Patrick Collison (Stripe co-founder)

- **Above the fold:** His name and a bare alphabetical list of page links: About, Advice, Bookshelf, Culture, Dispatches, Fast, Growth, Labs, Links, Pollution, Progress, Questions, SV history, Travel. That's the whole home page.
- **Hero graphic:** None. Nothing at all.
- **Typography/layout:** Minimal to the point of anonymity.
- **Writing treatment:** The pages themselves (Questions, Advice, Fast) are famous essays/lists; the home page is only a table of contents.
- **Signature element:** The pages with one-word names — "Questions" and "Fast" are among the most-linked pages by any tech figure.
- **Why it feels credible:** One of the wealthiest founders alive has a home page with zero self-presentation; all status is delegated to the ideas behind the links.

### 7. sive.rs — Derek Sivers (CD Baby founder, writer)

- **Above the fold:** A disclaimer — "(Everything here is 100% me, no AI.)" — then "me in 10 seconds": "Xenophile, programmer, netizen, and conversationalist." followed by a dated life timeline "(1984-1997): Musician... (1998-2008): Entrepreneur. Started and sold CD Baby. Paid $83M to musicians. (2026+): ?"
- **Hero graphic:** None.
- **Typography/layout:** Georgia serif (verified in CSS: `font-family: Georgia, serif`). Plain HTML, fast.
- **Writing treatment:** "newest articles" with ISO dates ("2026-08-18 Building without predicting"); books each get a one-line pitch ("How to Live (2021) — My masterpiece. Best thing I've ever made. My soul in a book.").
- **Signature element:** He invented the /now page ("What am I doing now? See my /now page") and links a directory of others' now pages.
- **Why it feels credible:** "Paid $83M to musicians" is a life summarized in a checkable number, and the "(2026+): ?" is honest about the present.

### 8. thesephist.com — Linus Lee (AI interfaces researcher, Thrive Capital, ex-Notion)

- **Above the fold:** Giant heading "My name is Linus." then dense prose: "My research investigates the future of knowledge representation and creative work aided by machine understanding of language. I prototype software interfaces that help us become clearer thinkers and more prolific dreamers." — with nearly every noun phrase hyperlinked _into his own essays_.
- **Hero graphic:** None. The prose links are the interface.
- **Typography/layout:** Single column, prose-first, link-dense.
- **Writing treatment:** Writing isn't listed on the home page; it's woven in as citations for claims ("this blog is home to a half million words I've written"). Separate dated "Speaking" list (venue + italic talk title + date).
- **Signature element:** Self-citation as navigation, plus scale claims that are verifiable: "well over 100 side projects", music on Spotify, "grew up in Korea and Indiana."
- **Why it feels credible:** Every abstract claim about his research is a link to a concrete essay demonstrating it.

### 9. maggieappleton.com — Maggie Appleton (design engineer, illustrator)

- **Above the fold:** "The Garden — A digital garden is a collection of imperfect notes, essays, and ideas growing slowly over time." Then typed sections: Essays ("Opinionated, longform narrative writing with an agenda"), Notes ("Loose, unopinionated notes on things I don't entirely understand yet"), Patterns, Library.
- **Hero graphic:** No hero. Her signature illustrations exist, but as artwork attached to individual essays — imagery in service of specific ideas.
- **Writing treatment:** Grouped by _maturity and genre_ rather than one reverse-chron feed; entries carry descriptions and relative ages ("Essay, over 3 years ago").
- **Signature element:** The digital-garden taxonomy itself — the honesty gradient from Essays to Notes.
- **Why it feels credible:** She labels which ideas are half-grown, which reads as intellectual honesty no polished portfolio can fake.

### 10. rauno.me — Rauno Freiberg (interaction designer, Vercel)

- **Above the fold:** Name, then one sentence rendered large: "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details." Then Projects.
- **Hero graphic:** No hero image (verified: three inline SVGs total in the static HTML, all small). The craft is in the _micro-interactions_ of the page itself — the site is the portfolio piece, but through behavior, not a splash visual.
- **Signature element:** The closing mantra: "Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. Make it."
- **Why it feels credible:** An interaction designer whose home page demonstrates interaction quality instead of illustrating it.

### 11. paco.me — Paco Coursey (Linear, ex-Vercel)

- **Above the fold:** Name, then role prose: "Crafting interfaces. Building polished software and web experiences. Experimenting with magical details in user interfaces. Webmaster at Linear." ("Webmaster" — a deliberate, charming archaism.)
- **Hero graphic:** None.
- **Typography:** Söhne + Newsreader (serif) + Inter (verified: `sohne-subset-0.woff2`, `newsreader-subset-0.woff2`, `inter-subset.woff2` in HTML) — a quiet sans/serif editorial pairing close to Nick's own system.
- **Writing/work treatment:** Projects with one-line function statements ("Composable command menu React component."); Writing with title + one-line summary.
- **Signature element:** A "Now" section _inlined on the home page_, written intimately: "Developing skill through doing, guiltlessly exploring passion and interests, imbuing quality. Mindful that everything around me is someone's life work." Plus curated music playlists ("deep, dark, boring dance music").
- **Why it feels credible:** The Now section shares taste and state of mind, not accomplishments.

### 12. emilkowal.ski — Emil Kowalski (Linear, ex-Vercel; Sonner/Vaul author)

- **Above the fold:** A section headed "Today": "I work on the Web team at Linear. I like to build things for designers and developers, think deeply about the user interface, how it looks, feels, behaves." One line for the past ("Previously, I worked on the design team at Vercel."). Then Projects, then Writing.
- **Hero graphic:** None.
- **Writing/work treatment:** Projects as name + single clause ("Sonner — An opinionated toast component for React."); Writing as title + subtitle pairs, no dates ("Friction as a Feature — A natural filter for bad ideas.").
- **Signature element:** The "Today" framing — present tense first, past compressed to one line.
- **Why it feels credible:** The projects listed (Sonner, Vaul) are things thousands of developers already use; the page just names them.

### 13. jvns.ca — Julia Evans (systems programmer, Wizard Zines)

- **Above the fold:** "Hey! I'm Julia. Welcome to my blog. Here's every post I've ever written, organized by category. Enjoy!"
- **Hero graphic:** None.
- **Writing treatment:** The most radical in the survey: the home page is the **complete archive** — hundreds of dated posts grouped into ~40 categories ("Debugging stories", "How a computer thing works"), with ★ marks on favorites.
- **Signature element:** Total-archive-as-homepage, and the voice ("Enjoy!").
- **Why it feels credible:** A decade of dated posts on one page is an unforgeable record of sustained curiosity.

### 14. worrydream.com — Bret Victor

- **Above the fold:** Page title "Bret Victor, human being." Then a mission before any list: "I've dedicated my life to creating a humane dynamic medium. I am (now and forever) making Dynamicland." and "I am probably working intensely on it at this very moment."
- **Hero graphic:** None on the home page; project thumbnails accompany the work index.
- **Typography:** Avenir (verified in CSS).
- **Writing/work treatment:** A life's work indexed by year, 1999–2024, grouped by era ("Toward a dynamic medium", "Bits & blurts", "Poems & diversions").
- **Signature element:** Two bios side by side — "Promotional bio" (awards, Alan Kay quote) versus "Real bio" (his actual intellectual lineage, with suppliers credited: "authorable dynamic media (Alan Kay), powerful representations (Edward Tufte, Seymour Papert)..."). Also the sign-off: "Do not talk to me about AI."
- **Why it feels credible:** He literally separates the promotional self from the real self and lets you compare them.

### Also examined (brief)

- **berkeleygraphics.com / usgraphics.com** — Neil Panchal's studio. Text-only front page led by a design-philosophy table: "Emergent over prescribed aesthetics. Dense, not sparse. Ignore design trends. Timeless and unfashionable. Diametrically opposite of minimalism, as complex as it needs to be." A useful counter-pole: personality through density and stated principles, still zero decorative art.
- **henry.codes** — Henry Desroches. The maximalist outlier: an editorial-letter homepage with live weather/coordinates ("48ºF @ N 39º 43' 31.56"..."), poetry, and case studies (Stripe, YouTube, NYT). Proves the underlying rule from the opposite direction: the personality comes from _voice and lived detail_, not from a template hero — even at maximum volume.

---

## Part 3: Synthesis

### The near-universal home-page skeleton

Observed order on the admired personal sites (andrewl.ee, okfrank.co, benji.org, brandur.org, sive.rs, thesephist.com, paco.me, emilkowal.ski):

1. **Name** (plain text, often the `h1`)
2. **One-line identity** in first person ("I'm a designer and toolmaker.")
3. **Short prose bio** — 2–4 paragraphs of _specific, checkable facts_, usually with one odd personal detail
4. **List of writing and/or work** — quiet, typographic, sometimes dated
5. **Contact woven into prose or a compact line**, not a button row

What they leave out: taglines with adjectives, skill lists, testimonials, "hire me" CTAs, stat counters, card grids with icons, and — without exception — decorative hero art.

### How common are decorative hero graphics? Zero

Across all 16 sites fetched, **the count of decorative hero graphics/animations is zero.** The complete inventory of home-page imagery in the entire survey:

- okfrank.co: one SVG of **his own drawing** (personal artifact)
- andrewl.ee: five thumbnails of **actual shipped projects** (evidence)
- benji.org: one 32px **monogram** (identity mark)
- worrydream.com: thumbnails attached to the **work index** (evidence)

Every image earns its place by being either _made by_ the person or _made by them for a real project_. The TML-orbit sites specifically (andrewl.ee, okfrank.co) replace the hero-graphic slot with **hyper-specific autobiography** — the eMac sentence, the spacesuit sentence. The base inspiration (thinkingmachines.ai) is a text manifesto with no imagery at all in its served HTML.

### Personality carriers (what does the hero graphic's job instead)

- **One strange true detail:** "designing a spacesuit for storms" (okfrank.co); "named after the first neighbourhood I moved to" (benji.org); "since the eMac in 2002" (andrewl.ee)
- **A signature utility page:** /now (sive.rs, brandur.org, paco.me, henry.codes); atoms feed (brandur.org); Questions (patrickcollison.com)
- **A checkable number or artifact:** "Paid $83M to musicians" (sive.rs); "half million words" (thesephist.com); named products — Sonner, cmdk, AI Meeting Notes (emilkowal.ski, paco.me/benji.org via Dip, okfrank.co)
- **Voice:** "Enjoy!" (jvns.ca); "Do not talk to me about AI." (worrydream.com); "(Everything here is 100% me, no AI.)" (sive.rs)
- **The writing list itself, well-set:** dated titles with one-sentence abstracts (brandur.org)

### Anti-patterns (what reads as generic / AI-portfolio / LARPy, by absence from every admired site)

- **Abstract generative art as a hero** — appears on zero admired sites; it signals "I needed something to fill this space," the opposite of the evidence-only imagery rule above
- **Adjective-based self-description** ("passionate", "detail-oriented") — every surveyed bio uses nouns and shipped artifacts instead
- **Role taglines without objects** — compare "leading research & engineering @ Maple" to okfrank.co's pattern: role + _what specifically you made there_
- **Undated, unsummarized "Recent Work" card grids** — the admired lists are typographic lines, either dated with abstracts (brandur.org) or so confident they're bare titles (benji.org)
- **Decoration in a frame** — the bordered-frame-with-art pattern appears nowhere; hairlines in these systems separate _content_, they don't exhibit ornaments

---

## Part 4: Recommended directions for Nick's home page

All three are compatible with the existing system (EB Garamond / Geist Sans, hairlines, grayscale + blue, mono labels) — they change _what's in_ the frame, not the frame.

### Direction A — Delete the graphic; spend the space on a specific bio (the TML-orbit move)

Model: **okfrank.co, andrewl.ee, benji.org.** Remove the decorative generative graphic entirely. Expand the one-line role and short intro into 2–3 short paragraphs of concrete fact, following the observed formula: present role _with a named artifact_ ("At Maple I lead research & engineering on **_ — we shipped _**"), one prior chapter, one strange true detail (the eMac/spacesuit slot), and place ("I live in \_\_\_"). Contact links inline in the prose like benji.org, not a button row. This is the highest-confidence move: it's what both of his named TML-orbit inspirations do, and it costs nothing from his design system — EB Garamond prose _is_ the system.

### Direction B — If a graphic, make it evidence: promote a real figure from an essay (recommended)

Model: **okfrank.co's own drawing + andrewl.ee's work thumbnails**, applied to Nick's existing asset. He already builds quiet interactive SVG figures for his ML essays — those are exactly the "personal artifact / evidence" class of image that survives the survey's filter. Lift one genuinely good figure (e.g., a latency-decomposition diagram from the voice-agents work) onto the home page in place of the decorative graphic, with a small uppercase mono caption ("FIG. FROM 'ESSAY TITLE'") linking to the essay. The hairline frame stays; the content inside it stops being ornamental and becomes a specimen of the actual work. This keeps the visual rhythm of his current layout while resolving the LARP problem at its root: the image is no longer _pretending_ to mean something.

### Direction C — Make the writing list carry more weight; add a "now" line

Model: **brandur.org** (dated entries with one-to-two-sentence abstracts and a small category tag — his "fragment" tag maps directly onto Nick's mono-label vocabulary) and **paco.me / sive.rs** (a short present-tense "Now" passage on the home page). Upgrade "Recent Work" from titles to title + date + one-sentence abstract, and add a two-sentence "Now" block under the bio ("Currently: \_\_\_"), updated occasionally. Long-form ML essays are Nick's actual strength; the survey shows the admired pattern is to make the list itself the destination (jvns.ca and emilkowal.ski at the two extremes, brandur.org the best middle).

**Priority:** B is the recommended primary move (it uniquely uses an asset Nick already has and no other pattern requires), executed together with A's bio rewrite. C is a low-risk enhancement on top.
