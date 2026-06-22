# Design QA

- Source visual truth: `../design-references/magazine-cover-monochrome-reference.png`, `../design-references/magazine-cover-color-reference.png`
- Implementation screenshot: `hero-implementation.png`
- Full implementation screenshot: `full-page-implementation.png`
- Full-view comparison evidence: `qa-comparison.png`
- Focused comparison evidence: `qa-comparison-focus.png`
- Viewport: 390 × 844 CSS pixels
- State: magazine cover at the beginning of the invitation body; intro, gallery modal, and account accordion separately exercised

**Findings**

- No actionable P0, P1, or P2 mismatch remains.
- Typography: Cormorant Garamond reproduces the high-contrast editorial serif character of the references. The oversized two-line title, flanking date/time, small edition line, names, and bottom caption preserve the reference hierarchy and wrapping.
- Spacing and layout rhythm: the title, names, centered couple, opposing date/time columns, and small footer metadata follow the source composition. Safe margins remain intact at 390 px.
- Colors and visual tokens: the implementation intentionally follows the selected color direction rather than the monochrome sample. White display type, saturated blue sky, green landscape, and white editorial body match the confirmed brief.
- Image quality and asset fidelity: `DSC_5280.JPG` is rendered from a 1466 × 2200 optimized source with a sharp full-bleed crop. Original scene illustrations and wedding photographs are used throughout; no visible image placeholders or substitute drawings remain.
- Copy and content: names, date, time, venue, family relationship labels, map destinations, temporary contacts, temporary accounts, invitation copy, and closing copy match the approved content specification. RSVP and dress code are absent as requested.
- Interactions: scroll-driven six-scene crossfade, gallery lightbox with keyboard navigation, account accordions, copy controls, phone/SMS links, map links, calendar link, and device share fallback are implemented.

**Patches made during QA**

- Changed the scene opacity curve so scene 1 is visible immediately at scroll position zero and adjacent scenes crossfade without a blank opening frame.
- Loaded and visually checked the gallery imagery across the page before the final full-page capture.
- Verified gallery modal open/close and account accordion expansion in the browser.
- Increased and unified the hero date/time line height to `0.96` with a `0.06em` row gap; both columns render at the same computed spacing.
- Increased hero names to `22–29px`, the English caption to `16–19px`, and the Korean footer metadata to `11–13px`, with stronger text shadows for mobile legibility.
- Extended the intro from `700svh` to `850svh`; each scene now has a full-opacity hold plateau and a shorter `0.04`-progress fade band.

**Follow-up Polish**

- [P3] Replace temporary parent names, phone numbers, account numbers, and transport copy before publication.
- [P3] Revisit the hero crop after the user completes the planned photo edit.
- [P3] Tune scene timing on a physical iPhone and Android device after content approval.

**Implementation Checklist**

- [x] Mobile layout and responsive max-width
- [x] Intro scene crossfade
- [x] Magazine cover hero
- [x] Invitation, calendar, gallery, venue, contacts, accounts, closing
- [x] Interactive states and keyboard-accessible lightbox
- [x] Production build

final result: passed
