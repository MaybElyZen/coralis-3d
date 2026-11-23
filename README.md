# CORALIS — Reef Canopy (interactive 3D model, Stage 5 — UNBUILT)

> ## STATUS: UNBUILT AND NOT BROWSER-TESTED
> This ZIP is the complete Stage 5 source project, but **`npm run build` has NOT been run** and **no browser testing has been done**
> (the preparation environment had no network, so `three` and `vite` could not be installed).
> What HAS been run: `npm test` (232 checks, using a three.js stand-in for the Stage 5 geometry checks) and the byte-identity check of the six protected files.
> Treat the in-browser behaviour (rendering, self-test, labels, HUD, animation, Sea-surface look) as UNVERIFIED until you complete the steps below.

## Exact build and test commands (run in this folder, Node.js 18+)
```
npm install
npm test
npm run build
npm run dev
```
1. `npm install` fetches `three` and `vite`.
2. `npm test` runs geometry, regression, inspection and Stage 5 checks (no browser needed). Expected last lines: `ALL CHECKS PASSED`, `REGRESSION: ALL PASSED`, `INSPECTION: ALL PASSED`, `STAGE 5: ALL PASSED`.
3. `npm run build` must finish without errors and create `dist/`. **Not yet done. Please report any error text.**
4. `npm run dev`, open the printed address, then press **T** for the in-browser self-test. Every line should read PASS. **Not yet done.**
5. Visually check: Sea surface (semi-transparent, hides nothing), Hybrid energy view, Water treatment view, Exploded view, and the 9-step presentation (Next, Previous, Auto-play, Pause, Reset).

Protected files that must stay unchanged (their SHA-256 is checked by `npm test`): `src/building.js`, `canopy.js`, `solar.js`, `rainwater.js`, `underwater.js`, `sensors.js`.
See `CHANGELOG-STAGE5.md` for the change report and `TESTING.md` for the test status.

Browser-based Three.js model of a **conceptual** marine research pavilion with a **proposed** coral restoration experiment.
Not an approved construction work. Hoi Ha Wan is a study reference area only, not an approved site.
No ecological outcome, coral survival, energy performance, solar output or engineering validation is calculated or claimed.

## Publish online
`npm run build` makes `dist/` (relative paths). Upload `dist` to Netlify Drop, GitHub Pages, Vercel or Cloudflare Pages.

## Using the viewer
- Mouse or touch: drag rotate, wheel or pinch zoom, right-drag or two-finger pan. Tap or click a part for its information panel.
- **Controls** menu (collapsible sections): Views (Overall, Building, Underwater, Restoration, Sensor network, Green systems, Hybrid energy, Water treatment), Section (long cut Y = 9, cross cut X = 24), Exploded view (Explode / Assemble), Layers (Building, Canopy, Solar, Rainwater, Habitat, Coral, Sensors, Marine life, Sea surface, Services annex, Hybrid energy, Water treatment) and Component labels, Risk scenarios, Workflow chain, Presentation.
- **Reset camera** returns to the assembled overall view and clears section, explode, labels and risk scenario.
- **Presentation mode** (key P or Controls > Presentation): 9 guided steps with captions and smooth camera moves. Large high-contrast caption bar for projectors, all other panels hidden. Keys: Right arrow or Space next, Left arrow back, Esc exit. Auto-play is optional.
- Exploded view moves whole layers up or down (deck, interior, level 2, enclosure, rainwater, canopy, solar, surface communication, underwater sensors, habitat, seabed). Piles stay in place. Geometry is never edited.
- Information panels show name, purpose, quantity and status chips: **Proposed**, **Illustrative**, **Unverified**, **Assumption**, **Placeholder**.
- Risk scenarios (Normal, Alert, Action required, Stop-work) are illustrative workflow examples, not live monitoring. They recolour the status light and explain a possible response. No sensor readings or validated thresholds exist.

## What is in the model
Stage 2: 48 x 18 m deck at +6.0 m, two-level building, 4 branching canopy trees, 12 leaf strips, 228 PV panels (size assumed), rainwater pipes, 4 tanks.
Stage 3: 32 habitat frames (28 treatment, 4 unseeded control; 16 per depth tier), illustrative coral fragments on treatment frames only, 3 habitat sensor nodes and 1 reference node, buoy, wireless link, cables and gateway, seabed, generic fish, urchins and boulders.
Stage 5: Services Annex, hybrid energy system, 13-stage rainwater treatment, 9-step tour (see CHANGELOG-STAGE5.md).
Stage 4: exploded view, structured inspection, risk scenarios, guided presentation, component labels, underwater visibility, self-test, regression checks.

## Still provisional
- All dimensions are design parameters in `src/params.js`, not site measurements.
- Frames hang from suspension lines (a simplification of the masterplan guide rails). Fixings, loads and typhoon behaviour are not engineered.
- Node mounting, mooring and cable routes are conceptual. Reference node position needs a current and canopy-shadow survey.
- PV panel size (1.0 x 2.0 m) is an unconfirmed visual assumption.
- Coral shapes, fish, urchins and boulders are illustrative, not species-accurate or survey data.
- Alert thresholds, risk criteria and management actions are not yet defined.
- **Not yet browser-tested and not yet built by the author.** See TESTING.md for exactly what was and was not tested.
