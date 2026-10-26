# PR 78 — Review round 2 evidence

Before: 2a18306. Implementation: e2bb248. Default and Kit have 8/8 pixel-identical full-page captures at 1440×900 and 390×844 in light/dark, from the repository screenshot runner. The comparison uses decoded RGBA pixels, without masks or tolerances. Tokens, CSS and protected primitives are unchanged.

Commands and exact output are in logs/. The final catalog report is in verify/. The minimal PageHeader route was created only in a temporary source copy with independently copied dependencies, then verified on port 3079; its source and four-state report are in throwaway/. It was never added to the implementation branch or route catalog.

Official routing reference consulted for the throwaway file: https://tanstack.com/router/latest/docs/api/router/createFileRouteFunction .

The first temporary-copy experiment shared node_modules and caused Vite dependency/cache conflicts; it was discarded and rerun with independent dependencies and caches. A subsequent catalog run detected Playwright's injected caret style racing lazy hydration. The verifier now uses caret: initial, retaining error diagnostics. The interrupted run's exact console warning is preserved in logs/catalog-caret-race.log. The final matrix is a complete fresh run after that fix.

The T3 collaborative browser snapshot timed out twice: “Preview automation snapshot timed out after 15000ms.” Visual and interaction verification used the documented repository Playwright workflow. The standalone control-name smoke checks dynamic selection/account names, keyboard opening and Escape/focus return, and the search dialog in all four states.

A local evidence copy initially retained the `.tsx` extension under screenshots, so TypeScript discovered the throwaway route outside the generated route tree. Renaming only that evidence copy to `.tsx.txt` restored typecheck; the actual route remained solely in the isolated temporary application copy. See logs/typecheck-evidence-copy-failed.log for the exact diagnostic.

Final catalog: 105/148 cases pass (22/37 routes pass all four states), 43 cases retain route-specific axe findings, zero runtime errors, exit 1.
