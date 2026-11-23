# Stage 5 status (read first)
| Item | Result |
|---|---|
| `npm test` (geometry 40 + regression 27 + inspection + Stage 5 checks) | ALL PASSED, 232 checks |
| Protected geometry files byte-identical | PASSED |
| Stage 5 builders executed against a three.js STAND-IN (checks/three-mock.mjs) for wall/sleeve clash tests | PASSED (the real three.js was not available) |
| `npm install` / `npm run build` | NOT RUN: the build sandbox had no network access |
| In-browser self-test (key T), visual check, sea-surface look | NOT RUN: no browser |

Run `npm install && npm run build && npm run dev`, then press T in the page.

# Testing record, Stage 5 (supersedes Stage 4 record below)

Environment used to build this version: no web browser and no internet access (npm install timed out). Therefore NO browser test and NO `npm run build` was performed.

## Performed (Node.js, no browser)
| Check | Result |
|---|---|
| Geometry checks (`npm run check`) | 40 checks, all passed |
| Regression vs Stage 3 (`npm run regression`) | 27 checks, all passed |
| Inspection coverage (`npm run inspect`) | 66 checks, all passed |
| JavaScript syntax (`node --check` on every file in src and checks) | no errors |
| `npm install` | NOT completed (timed out, no network) |
| `npm run build` | NOT run |

## Browser checklist (NOT TESTED by the author; please run and tick)
Quick route: open the page, press **T**. The self-test panel lists PASS or FAIL for each item marked (auto). It checks function behaviour, not appearance.

| Item | Tested by author | Your result |
|---|---|---|
| Page loads, model visible at start | NO | |
| No red errors in the console | NO | |
| Overall, Building, Underwater, Restoration, Sensor network, Green systems presets (auto) | NO | |
| Drag, wheel, right-drag, touch rotate, zoom, pan | NO | |
| 9 layer toggles (auto) | NO | |
| Long and cross section views (auto) | NO | |
| Explode and Assemble (auto), exploded view looks readable | NO | |
| Component labels readable, not cluttered | NO | |
| Click or tap inspection on frames, coral, nodes, buoy, canopy, PV, tanks, deck, piles, seabed (auto lookup) | NO | |
| Risk scenarios change status light and show explanation (auto) | NO | |
| Guided presentation, 7 steps, captions readable on projector (auto for steps) | NO | |
| Reset camera restores everything | NO | |
| Underwater view is clear enough | NO | |
| Tablet touch and layout | NO | |
| Frame rate acceptable on an ordinary laptop | NO | |
| `npm run build` then open `dist` | NO | |

## Screenshots
None were produced, because no browser was available. Please capture overall, exploded, underwater and presentation views after running the model.
