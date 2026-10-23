# Visual and print review

Reviewed all sixteen [contact sheets](contact-sheets) covering 1,216 effective captures: 38 routes × four presets × light/dark × desktop/mobile × dev/Workers. The three documented network failures use passing rerun images in the contact sheets; originals remain available. [Image integrity](image-integrity.json) records decoding, dimensions and variance. Each implementation layer also includes inspected before/after four-state captures and meaningful variants.

Layout/hierarchy, light/dark consistency, clipping, wrapping and horizontal containment were checked across the overview. Enlarged owned-page renders and interaction variants were inspected during tasks 008–013. The Invoice mobile paper thumbnail was enlarged again against dev and live Workers DOM dimensions: it is intentionally fit within the 324px content area, with no new overflow. Long pages appear narrow in fit-to-page overview thumbnails; original PNGs are linked in the route comparison tables.

The bare /auth/v2 layout has no mobile child content by design; it remains in the matrix. Root fault images come from the QA-only harness, with recovery verified; no public production error route exists.

All 23 generated Invoice PDFs were rendered with Apple PDFKit and checked for one Letter page, neutral issuer Jordan Lee and whitespace-normalized $945.18 total. Dev and final Workers rendered pages were enlarged and inspected: no clipped totals, table rows or footer. [Print validation](print-validation.json) lists every file; original PDFs, extracted text JSON and page PNGs sit alongside live scenario captures. [PDF tool limitations](pdf-tooling.txt) are retained.
