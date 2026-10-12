// BVMAC AI — retrieval.
//
// Lightweight, dependency-free keyword retrieval over the content index.
// Scores each entry by how well its title / keywords / content match the
// query tokens (title matches weigh most), then returns the top hits. Good
// enough for "where is the page about X" navigation questions without needing
// an embedding provider.

import type { AiEntry } from "./index";

const normalise = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Common words in fr / en / es that carry no retrieval signal.
const STOPWORDS = new Set(
  "le la les de des du un une et ou ou a au aux en pour sur avec dans par que qui quoi comment trouver liste page site est sont ce cette ces il elle on nous vous je tu mon ma mes ton ta tes son sa ses leur leurs plus moins tres bien tout tous toute toutes ne pas se d l j n c m t y qu the a an and or of to in on for with at by from is are was were be been it its this that these those i you he she we they my your his her our their el los las del al lo como donde cual cuales y o para con por que es son este esta estos estas su sus se si no me te mi mis tu tus".split(
    " ",
  ),
);

const tokenise = (text: string) => normalise(text).split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));

export function retrieve(query: string, index: AiEntry[], limit = 8): AiEntry[] {
  const q = normalise(query.trim());
  if (!q) return [];

  const tokens = tokenise(query);
  if (tokens.length === 0) return [];

  const scored = index
    .map((entry) => {
      const title = normalise(entry.title);
      const keywords = normalise(entry.keywords);
      const content = normalise(entry.content);

      let score = 0;
      let matched = 0;
      for (const t of tokens) {
        let hit = false;
        if (t === title) {
          // Exact title match — strongest signal (e.g. a glossary term).
          score += 30;
          hit = true;
        } else if (title.includes(t)) {
          score += 8;
          hit = true;
        }
        if (keywords.includes(t)) {
          score += 5;
          hit = true;
        }
        if (content.includes(t)) {
          score += 1.5;
          hit = true;
        }
        if (hit) matched++;
      }

      // Bonus when several query terms land in the title (strong signal).
      const titleHits = tokens.filter((t) => title.includes(t)).length;
      if (titleHits >= 2) score += titleHits * 6;

      return { entry, score, matched };
    })
    .filter((s) => s.matched > 0 && s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.entry);
}
