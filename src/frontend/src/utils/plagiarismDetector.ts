// Large corpus of common academic/copied phrases
const CORPUS_PHRASES = [
  "the purpose of this study is to",
  "according to the findings of",
  "it can be concluded that",
  "the results indicate that",
  "in this paper we present",
  "a significant correlation was found",
  "the data shows that",
  "previous research has shown",
  "this research aims to",
  "based on the analysis",
  "the evidence suggests that",
  "in conclusion",
  "as stated by",
  "research has demonstrated",
  "the study found that",
  "it is widely accepted that",
  "the literature review reveals",
  "this study examines",
  "the findings suggest that",
  "it has been argued that",
  "according to",
  "in order to",
  "as a result of",
  "on the other hand",
  "in addition to this",
  "it is important to note",
  "there is a need for",
  "the present study",
  "the aim of this paper",
  "this paper presents",
  "the objective of this research",
  "it should be noted that",
  "a number of studies have",
  "this is consistent with",
  "in the context of",
  "with respect to",
  "due to the fact that",
  "in terms of",
  "with regard to",
  "it is essential to",
  "this approach allows",
  "it has been shown that",
  "the main contribution of",
  "we can observe that",
  "it is worth noting that",
  "for the purpose of",
  "this can be explained by",
  "it is necessary to",
  "further research is needed",
  "as mentioned above",
  "in the following section",
  "this section describes",
  "the main objective is",
  "it is clear that",
  "the key findings of",
  "statistical analysis revealed",
  "the null hypothesis",
  "the alternative hypothesis",
  "the independent variable",
  "the dependent variable",
  "the sample size",
  "standard deviation was",
  "this phenomenon has",
  "the theoretical framework",
  "conceptual framework for",
  "systematic review of",
  "meta analysis of",
  "qualitative research was",
  "quantitative research was",
  "mixed methods approach",
  "case study of",
  "data collection was",
  "data analysis showed",
  "the research question",
  "hypothesis was tested",
  "literature review shows",
  "the conclusion drawn from",
  "implications for future research",
  "limitations of this study",
  "future studies should",
  "the scope of this research",
  "ethical considerations were",
  "informed consent was obtained",
  "the primary objective",
  "secondary objective of",
  "research methodology was",
  "thematic analysis was",
  "content analysis showed",
  "factor analysis revealed",
  "regression analysis showed",
  "the correlation between",
  "causal relationship between",
  "has been widely studied",
  "proposed framework for",
  "empirical evidence suggests",
  "theoretical implications of",
  "practical implications for",
  "key variables include",
  "significant difference between",
  "no significant difference",
  "statistically significant at",
  "p value was",
  "confidence interval",
  "the overall results show",
  "the control group",
  "the experimental group",
  "positive correlation between",
  "negative correlation between",
  "further investigation is",
  "the proposed method",
  "the existing literature",
  "the current study",
  "demonstrated that the",
  "it was found that",
  "results showed that",
  "in particular the",
  "plays an important role",
  "plays a key role",
  "a wide range of",
  "various factors affecting",
  "significant impact on",
  "positive impact on",
  "negative impact on",
  "highly significant results",
  "growing body of evidence",
  "it is suggested that",
  "it was observed that",
  "it was reported that",
  "it may be concluded",
  "prior studies have",
  "earlier studies showed",
  "recent studies have",
  "seminal work on",
  "pioneering work in",
  "fundamental principles of",
  "in light of",
  "taking into account",
  "on the basis of",
  "an important aspect of",
  "it is hypothesized that",
  "compared to previous studies",
  "compared with other",
  "relatively little research",
  "to the best of our knowledge",
  "the above discussion shows",
  "our analysis shows that",
  "these results suggest that",
  "these findings are consistent with",
  "these results confirm",
  "the mechanism underlying",
  "the role of",
  "the relationship between",
  "a major challenge is",
  "the underlying mechanism",
  "is responsible for the",
  "is associated with the",
  "correlated with the",
  "significantly higher than",
  "significantly lower than",
  "greater than the",
  "as a whole the",
  "as expected the",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((w) => w.length > 0);
}

function buildBigrams(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i + 1 < words.length; i++) {
    result.push(words[i] + " " + words[i + 1]);
  }
  return result;
}

function buildTrigrams(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i + 2 < words.length; i++) {
    result.push(words[i] + " " + words[i + 1] + " " + words[i + 2]);
  }
  return result;
}

function ngramMatchesCorpus(ngram: string): boolean {
  for (const phrase of CORPUS_PHRASES) {
    if (phrase.includes(ngram)) return true;
  }
  return false;
}

export function computeSegmentScore(text: string): number {
  const words = tokenize(text);
  if (words.length === 0) return 0;

  const bigrams = buildBigrams(words);
  const trigrams = buildTrigrams(words);

  let matchCount = 0;
  let total = bigrams.length + trigrams.length;

  for (const bg of bigrams) {
    if (ngramMatchesCorpus(bg)) matchCount += 1;
  }
  for (const tg of trigrams) {
    if (ngramMatchesCorpus(tg)) matchCount += 2; // trigrams weighted double
    total += 1; // extra weight in denominator
  }

  if (total === 0) return 0;
  return Math.min(1.0, matchCount / total);
}

// ─── Synonym & structural paraphrase engine ───────────────────────────────────

/** Replace key academic words with fresh synonyms */
function replaceSynonyms(text: string, variant: number): string {
  type SynGroup = [RegExp, string[]];
  const synMap: SynGroup[] = [
    [/\baccording to\b/gi, ["as outlined by", "per the findings of", "as documented by", "drawing from"]],
    [/\bprevious research\b/gi, ["earlier investigations", "prior studies", "past scholarship", "earlier academic work"]],
    [/\bhas been shown\b/gi, ["has been demonstrated", "has been established", "has been confirmed", "is well documented"]],
    [/\bit can be concluded\b/gi, ["the evidence leads to the conclusion", "one can reasonably infer", "the data supports the view", "analysis confirms"]],
    [/\bthe results indicate\b/gi, ["the findings reveal", "the data points to", "observations confirm", "evidence demonstrates"]],
    [/\bfurthermore\b/gi, ["in addition", "beyond that", "building on this", "what is more"]],
    [/\bmoreover\b/gi, ["additionally", "alongside this", "further still", "on top of that"]],
    [/\bin conclusion\b/gi, ["to summarize the findings", "drawing all threads together", "as a final observation", "in summary"]],
    [/\bstudies have shown\b/gi, ["research consistently reveals", "academic work demonstrates", "investigations confirm", "scholarly evidence shows"]],
    [/\bit is important to note\b/gi, ["worth highlighting here is", "a key point to consider is", "notably", "one should acknowledge that"]],
    [/\bin recent years\b/gi, ["over the past decade", "in contemporary research", "in the modern era", "within current discourse"]],
    [/\bas mentioned above\b/gi, ["as discussed earlier", "as previously established", "referring back to the earlier point", "as noted"]],
    [/\bsignificant\b/gi, ["substantial", "considerable", "noteworthy", "meaningful"]],
    [/\binvestigation\b/gi, ["examination", "analysis", "exploration", "inquiry"]],
    [/\bdemonstrated\b/gi, ["shown", "revealed", "established", "confirmed"]],
    [/\beffective\b/gi, ["successful", "productive", "impactful", "reliable"]],
    [/\butilize\b/gi, ["use", "apply", "employ", "leverage"]],
    [/\bthus\b/gi, ["therefore", "as a result", "consequently", "hence"]],
    [/\bsuch as\b/gi, ["for example", "including", "like", "particularly"]],
    [/\bhowever\b/gi, ["yet", "that said", "in contrast", "despite this"]],
  ];

  let result = text;
  for (const [pattern, synonyms] of synMap) {
    const pick = synonyms[variant % synonyms.length];
    result = result.replace(pattern, pick);
  }
  return result;
}

/** Convert passive-voice-like patterns to active voice */
function activateVoice(text: string): string {
  return text
    .replace(/\bwas found that\b/gi, "revealed that")
    .replace(/\bwere observed\b/gi, "the team observed")
    .replace(/\bhas been established\b/gi, "researchers established")
    .replace(/\bhas been reported\b/gi, "scholars have reported")
    .replace(/\bwas demonstrated\b/gi, "the data demonstrated")
    .replace(/\bwere identified\b/gi, "the analysis identified")
    .replace(/\bwas conducted\b/gi, "the team conducted")
    .replace(/\bwas analyzed\b/gi, "the study analyzed");
}

/** Reorder sentence by moving trailing clause to the front */
function reorderClauses(text: string): string {
  // Move a trailing "in order to X" or "to achieve X" to the beginning
  const match = text.match(/^(.*?),?\s+(in order to .+|to achieve .+|to examine .+|to investigate .+)\.?$/i);
  if (match) {
    const main = match[1].trim();
    const purpose = match[2].trim();
    const capitalized = purpose.charAt(0).toUpperCase() + purpose.slice(1);
    return `${capitalized}, ${main.charAt(0).toLowerCase()}${main.slice(1)}.`;
  }

  // Move a leading "It has been..." framing to a subject-first form
  const itMatch = text.match(/^It (?:has been|was|is) (\w+) (?:that|by) (.+)$/i);
  if (itMatch) {
    return `${itMatch[2].charAt(0).toUpperCase()}${itMatch[2].slice(1)} ${itMatch[1]} this.`;
  }

  return text;
}

/** Generate 3 humanized, structurally distinct rewrites of a sentence */
export function generateAlternatives(text: string, _score: number): string[] {
  const trimmed = text.trim();
  if (!trimmed || trimmed.split(/\s+/).length < 4) return [];

  // Three different transformation strategies
  const alt1 = activateVoice(replaceSynonyms(trimmed, 0));
  const alt2 = replaceSynonyms(trimmed, 1);
  const alt3 = reorderClauses(replaceSynonyms(activateVoice(trimmed), 2));

  // Ensure each alternative is meaningfully different from the original
  const alts = [alt1, alt2, alt3];

  // If a transformation didn't change the text, use a word-swap on the full sentence
  return alts.map((alt, i) => {
    if (alt === trimmed) {
      // Force a minimal synonym swap
      return replaceSynonyms(trimmed, i + 3);
    }
    // Ensure capital first letter and proper ending
    const cleaned = alt.trim();
    const result = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return result.endsWith(".") || result.endsWith("!") || result.endsWith("?")
      ? result
      : result + ".";
  });
}

export interface FrontendSegment {
  segmentId: bigint;
  text: string;
  score: number;
  flagged: boolean;
  alternatives: string[];
  /** Character offset of this segment in the original text (undefined for backend-retrieved results) */
  charOffset?: number;
}

export interface FrontendCheckResult {
  id: bigint;
  overallScore: number;
  segments: FrontendSegment[];
}

export function analyzeText(text: string): FrontendCheckResult {
  // Split into sentences
  const rawSegments: Array<{ text: string; offset: number }> = [];
  let current = "";
  let segStart = 0;
  let prevChar = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (
      (prevChar === "." || prevChar === "!" || prevChar === "?") &&
      ch === " "
    ) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        rawSegments.push({ text: trimmed, offset: segStart });
      }
      segStart = i + 1;
      current = "";
    } else {
      current += ch;
    }
    prevChar = ch;
  }

  const lastTrimmed = current.trim();
  if (lastTrimmed.length > 0) {
    rawSegments.push({ text: lastTrimmed, offset: segStart });
  }

  // If no sentence boundaries found, chunk by roughly 20 words
  let segData = rawSegments;
  if (segData.length <= 1 && text.trim().length > 0) {
    const words = text.trim().split(/\s+/);
    const chunkSize = 20;
    segData = [];
    let offset = 0;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      const idx = text.indexOf(chunk, offset);
      segData.push({ text: chunk, offset: idx >= 0 ? idx : offset });
      offset = idx >= 0 ? idx + chunk.length : offset + chunk.length;
    }
  }

  const segments: FrontendSegment[] = segData.map(({ text: seg, offset }, idx) => {
    const score = computeSegmentScore(seg);
    const flagged = score > 0.15;
    return {
      segmentId: BigInt(idx),
      text: seg,
      score,
      flagged,
      alternatives: flagged ? generateAlternatives(seg, score) : [],
      charOffset: offset,
    };
  });

  // Overall score = fraction of flagged sentences * 100
  const flaggedCount = segments.filter((s) => s.flagged).length;
  const overallScore =
    segments.length > 0 ? flaggedCount / segments.length : 0;

  return {
    id: BigInt(0),
    overallScore,
    segments,
  };
}
