# Stage 5 change report (from CORALIS-3D-stage4-seafix.zip)

## Unchanged (byte-identical, SHA-256 verified by `npm test`)
building.js, canopy.js, solar.js, rainwater.js, underwater.js, sensors.js. Still 228 PV panels, 4 tanks, 32 habitat frames, 4 sensor nodes. Sea-surface mesh and clipping untouched. Original 12 label anchors untouched.

## New files
stage5.js (pure data, exact notes, routes, solids), annex.js, hybrid.js, watertreat.js, mat5.js, s5util.js, info5.js (inspection text), hud.js (energy/water panels + Environmental integrity box), checks/stage5-check.mjs, checks/three-mock.mjs, checks/register-mock.mjs.

## Changed files (all non-geometry)
main.js, labels.js (extra anchors added beside the original 12), explode.js, presentation.js (9 steps), interface.js (2 views, Conditional chip), selftest.js (9-step test, 8 new tests), checks/inspect-check.mjs, package.json (0.5.0).

## Features
- Services Annex X 48-56, Y 6-18 (96 m2), deck +6, roof +10; Energy Room (Y 6-12) and Water Treatment Room (Y 12-18). Translucent shell; support structure NOT decided.
- Services pass only through sleeved openings in annex floor, roof and east wall. Pipes/cables cross to the annex BELOW the deck. The one crossing of the existing deck slab has a core sleeve (existing geometry is protected and stays uncut).
- Hybrid energy: 3 VAWT + 1 anemometer on the annex roof (outside canopy footprint), PV DC trunk from the existing panels, EMS, conceptual battery cabinets, distribution board, feeders to Building Loads and Marine Monitoring (joins the existing sensor riser). Animated flow pulses and static arrows. Exact conceptual note shown.
- Water treatment: 13 numbered stages (5 and 11 conditional, dashed badge + amber outline). Stages 1 and 4 are the existing canopy/tanks; 2-3 are inline on the existing collector main; 5-13 in the Water Treatment Room. Four pipe colours (raw blue, process amber, treated green, non-potable purple) with arrows. Separate potable outlet and 3 non-potable outlets (Irrigation, Cleaning, Toilet flushing) with "NON-POTABLE - DO NOT DRINK" signs. Exact potable note shown.
- New views: Hybrid energy, Water treatment (set layers, labels, HUD). New layers: Services annex, Hybrid energy, Water treatment. All originals kept.
- Exploded view includes all new groups. Presentation: 9 steps, new steps 4 and 5 after original step 3.
- Environmental integrity box + status line: Marine Park / study reference only; phase 1 desk research, non-intrusive baseline research, authority consultation; reviews and written approvals; relocate or land-based alternative. No bleaching-prevention or piles-are-safe claims.
- No invented generation, battery, efficiency, capacity, yield, water-quality or typhoon figures (enforced by a text check).
