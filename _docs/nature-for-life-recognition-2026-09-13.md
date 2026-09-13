# Nature for Life recognition

Published claim: Ayni Studios’ film “They Live in Our World” was selected to be featured at UNDP’s Nature for Life Hub 2024 virtual event.

The official Day 3 programme lists the film under “Behavioral Change and Environmental Impact,” credits Ayni Studios, and links to the same YouTube video QELtdAIjjs0 already in the Ayni library:
https://www.learningfornature.org/en/nature-for-life-hub-2024/day3/

UNDP describes the event here:
https://www.undp.org/nature/our-flagship-initiatives/nature-development

The user-mentioned natureforlife.org is a separate foundation, so the event’s official branding is used instead. Both assets were sourced from the official Learning for Nature site:
- Nature for Life: https://www.learningfornature.org/wp-content/uploads/2021/08/NfL-Hub-2021-LOGO-SVG.svg (unchanged SVG, also used on the 2024 programme)
- UNDP: https://www.learningfornature.org/wp-content/uploads/2022/01/UNDP_Logo_White_Large-1.png (proportional resize to lossless WebP)

Logos identify the event/organizer in a clearly labelled recognition section. The copy describes selection, not an award, a commissioned UNDP project, or UNDP endorsement.

## Implementation

- Original film title restored; “Orphaned Monkeys of the Amazon Rainforest” remains a visible subtitle and VideoObject alternateName.
- Existing /films/orphaned-monkeys-of-the-amazon URL retained.
- Shared recognition section with official source and both logos on homepage, about, library, film, and environmental / documentary / NGO service pages.
- Library film card includes selection text.
- Updated homepage, about, library, conservation service and film metadata; VideoObject description and citation; Organization description and subjectOf linking the official programme.
- Existing video sitemap consumes the updated title and description automatically; no new URLs.

## Validation

Lint, production build, seven existing tests, and all 30 public-page HTTP/metadata checks passed locally. Targeted assertions passed for recognition on all seven pages, film JSON-LD, sitemap title/description, and both logo assets. Desktop visual check passed; mobile DOM check confirmed loaded logos and no horizontal overflow at 390px.

## Indexing guidance

Sitemap URL remains unchanged; no resubmission required. Continue the existing list from #5. An optional fresh request for homepage (#1) and NGO service (#4) is reasonable for this substantive new recognition after deployment; neither is required. If #5 was already submitted before deployment, an optional fresh request can include it too. Prioritize the film (#26 in the original list) next. #2 and #3 did not change. Do not repeat requests to try to speed up crawling.
