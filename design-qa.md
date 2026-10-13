# Homepage redesign QA

## Evidence

- Source visual truth:
  - `C:/Users/User/AppData/Local/Temp/codex-clipboard-6e822b66-d224-4ff6-98ee-4cd05b427958.png` — selected hero composition.
  - `C:/Users/User/AppData/Local/Temp/codex-clipboard-56096fae-b890-499a-a3ec-fd9db42c8fb8.png` — selected About section composition.
  - `C:/Users/User/AppData/Local/Temp/codex-clipboard-12dd1d84-4b4a-415e-8725-2321386756bc.png` — selected four-step process composition.
  - `C:/Users/User/AppData/Local/Temp/codex-clipboard-afaa0400-bfaf-41ac-a1e1-a4aacb8b5564.png` — selected full-page structure.
- Implementation screenshot: Codex in-app Browser tab 3 full-page capture of `http://127.0.0.1:4321/` (inline session artifact).
- Desktop viewport: 1600 × 900 CSS pixels at device scale 1.
- Mobile viewport: 390 × 844 CSS pixels at device scale 1.
- State: homepage at the top; FAQ interaction checked separately.
- Density normalisation: the supplied references and browser implementation were compared by composition and relative proportions because their source widths differ. No device frame or browser chrome was treated as page content.

## Full-view comparison

- The implementation follows the reference order: contained hero, compact call strip, service cards, homepage About section, local coverage, four-step process, reviews, FAQs and final call-to-action.
- Content is constrained to a 1200px maximum width with consistent side margins. Coloured blocks are contained and separated by compact white space.
- The hero uses the reference’s left-copy/right-vehicle balance. The supplied Ryde van is smaller than the previous implementation and crosses the visual boundary slightly without covering text.
- The separate `/about` route remains available from both navigation and the homepage About section.

## Focused region comparison

- Hero: checked at desktop and 390px mobile. H1, benefits, CTAs, licence line, van, 24/7 badge and call strip remain separated with no accidental collisions.
- Services: five desktop cards remain equal height; mobile cards use a compact image-and-copy split without horizontal overflow.
- About: checked at desktop and mobile. Image badges stay inside the photo boundary and do not cover the plumber’s face or the accompanying copy.
- How it works: four equal desktop steps and a single-column mobile stack. Step numbers sit inside their cards rather than overlapping adjacent content.
- Reviews and FAQs: three review cards align at desktop and stack on mobile. The first FAQ expands and exposes its full answer.

## Required fidelity surfaces

- Fonts and typography: passed. The condensed display face, compact uppercase labels and readable Barlow body copy match the reference hierarchy without imitating its business identity.
- Spacing and layout rhythm: passed. The 1200px frame, compact section spacing and responsive gutters are consistent. No accidental overlapping was found.
- Colours and tokens: passed. The Ryde navy, blue, red and white palette is retained across the new reference-led structure.
- Image quality and asset fidelity: passed. Only supplied Anton’s/Ryde photography and the approved site logo are used. Images are responsive and maintain their intended crops.
- Copy and content: passed. Australian English, Ryde locality wording, Anton’s operator disclosure, licence 210933C and phone number 0493 824 176 are retained.

## Interaction and technical checks

- Hero “View services” navigation: passed; opens `/services`.
- FAQ disclosure: passed; the first answer expanded successfully.
- Mobile persistent call action: present and unobstructed.
- Browser console: no warnings or errors.
- Google Maps: live embed retained with a visible contained fallback treatment for restricted local-browser environments.

## Comparison history

- Initial P2: service and About headings wrapped into too many lines, reducing the compact feel. Fixed by shortening the headings and widening their measure.
- Initial P2: process number badges crossed card boundaries. Fixed by placing each number entirely inside its card.
- Initial P2: a restricted local map frame visually merged into the white page. Fixed with a bordered, tinted map container while retaining the live Google Maps embed.
- Post-fix desktop and mobile captures show the corrected hierarchy and no remaining P0/P1/P2 issues.

Final result: passed
