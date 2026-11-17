# CORALIS — Reef Canopy (interactive 3D model, Stage 4)

Browser-based Three.js model of a **conceptual** marine research pavilion with a **proposed** coral restoration experiment.
Not an approved construction work. Hoi Ha Wan is a study reference area only, not an approved site.
No ecological outcome, coral survival, energy performance, solar output or engineering validation is calculated or claimed.

## Run locally
1. Install Node.js 18 or newer.
2. `npm install`
3. `npm run dev` and open the printed address (usually http://localhost:5173)
4. `npm run test` runs the geometry, regression and inspection checks (no browser needed).
5. After the page loads, press **T** (or Controls > Presentation > Run self-test) to run the in-browser self-test.

## Publish online
`npm run build` makes `dist/` (relative paths). Upload `dist` to Netlify Drop, GitHub Pages, Vercel or Cloudflare Pages.

## Using the viewer
- Mouse or touch: drag rotate, wheel or pinch zoom, right-drag or two-finger pan. Tap or click a part for its information panel.
- **Controls** menu (collapsible sections): Views (Overall, Building, Underwater, Restoration, Sensor network, Green systems), Section (long cut Y = 9, cross cut X = 24), Exploded view (Explode / Assemble), Layers (Building, Canopy, Solar, Rainwater, Habitat, Coral, Sensors, Marine life, Sea surface) and Component labels, Risk scenarios, Workflow chain, Presentation.
- **Reset camera** returns to the assembled overall view and clears section, explode, labels and risk scenario.
- **Presentation mode** (key P or Controls > Presentation): 7 guided steps with captions and smooth camera moves. Large high-contrast caption bar for projectors, all other panels hidden. Keys: Right arrow or Space next, Left arrow back, Esc exit. Auto-play is optional.
- Exploded view moves whole layers up or down (deck, interior, level 2, enclosure, rainwater, canopy, solar, surface communication, underwater sensors, habitat, seabed). Piles stay in place. Geometry is never edited.
- Information panels show name, purpose, quantity and status chips: **Proposed**, **Illustrative**, **Unverified**, **Assumption**, **Placeholder**.
- Risk scenarios (Normal, Alert, Action required, Stop-work) are illustrative workflow examples, not live monitoring. They recolour the status light and explain a possible response. No sensor readings or validated thresholds exist.

## What is in the model
Stage 2: 48 x 18 m deck at +6.0 m, two-level building, 4 branching canopy trees, 12 leaf strips, 228 PV panels (size assumed), rainwater pipes, 4 tanks.
Stage 3: 32 habitat frames (28 treatment, 4 unseeded control; 16 per depth tier), illustrative coral fragments on treatment frames only, 3 habitat sensor nodes and 1 reference node, buoy, wireless link, cables and gateway, seabed, generic fish, urchins and boulders.
Stage 4: exploded view, structured inspection, risk scenarios, guided presentation, component labels, underwater visibility, self-test, regression checks.

## Still provisional
- All dimensions are design parameters in `src/params.js`, not site measurements.
- Frames hang from suspension lines (a simplification of the masterplan guide rails). Fixings, loads and typhoon behaviour are not engineered.
- Node mounting, mooring and cable routes are conceptual. Reference node position needs a current and canopy-shadow survey.
- PV panel size (1.0 x 2.0 m) is an unconfirmed visual assumption.
- Coral shapes, fish, urchins and boulders are illustrative, not species-accurate or survey data.
- Alert thresholds, risk criteria and management actions are not yet defined.
- **Not yet browser-tested and not yet built by the author.** See TESTING.md for exactly what was and was not tested.
