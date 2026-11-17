# Stage 4 change log

## Added
- `src/explode.js` exploded view: whole-layer vertical offsets from `P.explode` in `params.js`; sensors split at run time into surface (buoy, mast, gateway, wireless link) and underwater groups; data dots hidden while exploded; Assemble button and Reset return everything.
- `src/labels.js` 12 component labels that follow layers, including in the exploded view.
- `src/presentation.js` 7-step guided sequence with captions, smooth transitions, optional auto-play and projector styling.
- `src/selftest.js` in-browser self-test (key T) covering counts, all camera presets, all layer toggles, section views, explode and assemble, inspection lookups, risk states, presentation steps and reset.
- `checks/regression.mjs` plus `checks/stage3-baseline.json`: Stage 3 design values, counts, frame list and SHA-256 of the six geometry modules must be unchanged.
- `checks/inspect-check.mjs`: every named component resolves to an info entry with quantity and status.
- Risk scenarios (Normal, Alert, Action required, Stop-work) with explanations and an "illustrative, not live monitoring" notice.
- Views: Green systems, Exploded, Workflow (in `P.views`).

## Changed
- `src/interface.js`: collapsible controls menu, structured info panels (name, purpose, quantity, status chips), caption bar, tablet-friendly sizes, status text hidden on narrow screens, information panel limited to the lower right corner.
- `src/main.js`: wiring for the above; Reset now also clears section, explode, labels and risk; underwater look tuned (lighter fog, brighter ambient light below the surface).
- `src/scene.js`: returns the ambient light so it can be adjusted underwater.
- `src/params.js`: only added `P.explode` and three entries in `P.views`.
- `package.json`: version 0.4.0, new test scripts.

## Unchanged (verified by regression check)
`building.js`, `canopy.js`, `solar.js`, `rainwater.js`, `underwater.js`, `sensors.js` are byte-identical to Stage 3. All Stage 3 parameters, IDs and counts (32 frames, 28 treatment, 4 control, 3 habitat nodes, 1 reference node) are unchanged.

## Stage 4.1 (minimal fix)
- Self-test inspection lookup could not find the sea mesh, because it is added to the scene and not to the model group. `main.js` now passes the existing `sea` object into the self-test context and `selftest.js` checks it explicitly after searching the model. No duplicate mesh, no hierarchy change, test expectations unchanged.
- Browser self-test result for this change: NOT YET RUN by the author (no browser available). To be confirmed by the user.
