// ─── AI Writing Detection Engine ──────────────────────────────────────────────
// Heuristics-based detector using multiple signals:
// 1. AI phrase corpus matching
// 2. Burstiness / sentence-length variance
// 3. Transition word overuse
// 4. Lexical complexity uniformity
// 5. Hedging language density

export interface AISegment {
  text: string;
  score: number; // 0-1
  flagged: boolean; // score > 0.45
  triggeredPatterns: string[];
  charOffset?: number;
}

export interface AIDetectionResult {
  overallScore: number; // 0-1
  label: "Likely Human" | "Mixed/Uncertain" | "Likely AI-Generated";
  segments: AISegment[];
  heuristicBreakdown: {
    phraseScore: number;
    burstiessScore: number;
    transitionScore: number;
    lexicalScore: number;
    hedgingScore: number;
  };
}

// ─── AI Phrase Corpus (100+ entries) ─────────────────────────────────────────

const AI_PHRASES: string[] = [
  // Core AI tells
  "it is worth noting that",
  "it is important to note",
  "it is crucial to",
  "it is essential to",
  "delve into",
  "in the realm of",
  "as an ai language model",
  "i cannot",
  "tapestry",
  "multifaceted",
  "nuanced approach",
  "pivotal role",
  "utilize",
  "landscape",
  "foster",
  "navigate",
  "embark",
  "vibrant",
  "comprehensive overview",
  "intricate",
  "testament to",
  "shed light on",
  "in today's world",
  "in today's digital age",
  "in today's fast-paced",
  "it goes without saying",
  "on the other hand",
  "in conclusion",
  "to summarize",
  "in summary",
  "to begin with",
  "first and foremost",
  "a wide range of",
  "a variety of",
  "in terms of",
  "with regard to",
  "with respect to",
  "plays a crucial role",
  "plays a pivotal role",
  "plays a vital role",
  "plays an important role",
  "significantly",
  "substantial",
  "notable",
  "remarkable",
  "innovative",
  "cutting-edge",
  "state-of-the-art",
  "addresses the question of",
  "examines the relationship between",
  "provides insights into",
  "ai-generated",
  "language model",
  "large language model",
  "chatgpt",
  "gpt",
  "artificial intelligence generated",
  // Additional patterns
  "it is worth mentioning",
  "it is important to understand",
  "it is vital to",
  "it is necessary to consider",
  "diving deeper into",
  "taking a closer look",
  "at its core",
  "holistic approach",
  "robust framework",
  "dynamic landscape",
  "ever-evolving",
  "rapidly changing",
  "game-changing",
  "paradigm shift",
  "leverage",
  "synergy",
  "synergize",
  "transformative",
  "ecosystem",
  "empower",
  "empowering",
  "seamlessly",
  "streamline",
  "optimize",
  "facilitate",
  "furthermore",
  "moreover",
  "additionally",
  "consequently",
  "therefore",
  "nevertheless",
  "nonetheless",
  "in addition to",
  "as a result",
  "due to",
  "because of this",
  "it can be seen that",
  "it is clear that",
  "it should be noted that",
  "it must be acknowledged",
  "one must consider",
  "one should note",
  "it becomes evident",
  "it is evident that",
  "it is undeniable that",
  "without a doubt",
  "it is imperative",
  "of utmost importance",
  "cannot be overstated",
  "a myriad of",
  "plethora of",
  "in light of the fact",
  "it is apparent that",
  "as previously mentioned",
  "as stated above",
  "in the context of",
  "with this in mind",
  "taking into consideration",
  "it is worth exploring",
  "this raises the question",
  "this begs the question",
  "at the end of the day",
  "all things considered",
  "in the grand scheme",
  "to paint a clearer picture",
  "to put it simply",
  "to put it another way",
  "in other words",
  "needless to say",
  "goes without saying",
  "it is widely accepted",
  "it is generally agreed",
  "experts agree that",
];

// ─── Transition Words ─────────────────────────────────────────────────────────

const TRANSITION_WORDS: string[] = [
  "furthermore",
  "moreover",
  "additionally",
  "consequently",
  "therefore",
  "nevertheless",
  "nonetheless",
  "however",
  "in addition",
  "as a result",
  "due to",
  "because of",
  "thus",
  "hence",
  "accordingly",
  "subsequently",
  "meanwhile",
  "conversely",
  "on the contrary",
  "in contrast",
  "despite",
  "although",
  "even though",
  "while",
  "whereas",
  "for instance",
  "for example",
  "specifically",
  "in particular",
  "that is to say",
  "in other words",
  "to illustrate",
  "to clarify",
  "to elaborate",
  "in conclusion",
  "to summarize",
  "in summary",
  "overall",
  "ultimately",
  "in essence",
  "to begin with",
  "first and foremost",
  "last but not least",
  "by the same token",
  "in the same vein",
  "along the same lines",
  "on the other hand",
  "at the same time",
  "in any case",
  "above all",
];

// ─── Hedging Phrases ─────────────────────────────────────────────────────────

const HEDGING_PHRASES: string[] = [
  "it may be",
  "it might be",
  "it could be",
  "it would be",
  "it is possible that",
  "arguably",
  "potentially",
  "seemingly",
  "apparently",
  "perhaps",
  "possibly",
  "likely",
  "probably",
  "presumably",
  "in some cases",
  "in many cases",
  "in most cases",
  "to some extent",
  "to a certain degree",
  "it appears that",
  "it seems that",
  "this suggests that",
  "this implies that",
  "may indicate",
  "might suggest",
  "could represent",
  "tends to",
  "generally speaking",
  "broadly speaking",
  "in general",
  "for the most part",
];

// ─── Utility: Sentence Splitter ───────────────────────────────────────────────

function splitSentences(text: string): Array<{ text: string; offset: number }> {
  const results: Array<{ text: string; offset: number }> = [];
  // Match sentence-ending punctuation followed by space/end
  const re = /[^.!?]+[.!?]+(?:\s|$)/g;
  const allMatches = [...text.matchAll(re)];
  for (const match of allMatches) {
    const trimmed = match[0].trim();
    if (trimmed.length > 5) {
      results.push({ text: trimmed, offset: match.index ?? 0 });
    }
  }
  // If no matches, treat entire text as one segment
  if (results.length === 0 && text.trim().length > 0) {
    results.push({ text: text.trim(), offset: 0 });
  }
  return results;
}

// ─── Heuristic 1: AI Phrase Matching ─────────────────────────────────────────

function computePhraseScore(lower: string): {
  score: number;
  patterns: string[];
} {
  const patterns: string[] = [];
  let hits = 0;
  const words = lower.split(/\s+/).length;

  for (const phrase of AI_PHRASES) {
    if (lower.includes(phrase)) {
      hits++;
      // Capitalise for display
      const display = phrase.charAt(0).toUpperCase() + phrase.slice(1);
      patterns.push(`AI phrase: "${display}"`);
    }
  }

  // Scale by density (hits per 20 words)
  const density = words > 0 ? hits / Math.max(1, words / 20) : 0;
  const score = Math.min(1, density * 0.55 + (hits > 0 ? 0.25 : 0));
  return { score, patterns };
}

// ─── Heuristic 2: Sentence-Length Burstiness ─────────────────────────────────
// Low variance in sentence lengths = AI-like

function computeBurstiessScore(sentences: string[]): {
  score: number;
  patterns: string[];
} {
  if (sentences.length < 3) return { score: 0.2, patterns: [] };

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((acc, l) => acc + (l - mean) ** 2, 0) / lengths.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 0; // Coefficient of variation

  // Low CV (< 0.25) = very uniform = likely AI
  // High CV (> 0.55) = bursty = likely human
  const score = cv < 0.25 ? 0.8 : cv < 0.4 ? 0.55 : cv < 0.55 ? 0.3 : 0.1;
  const patterns: string[] = [];
  if (cv < 0.3) {
    patterns.push(
      `Low burstiness (CV=${cv.toFixed(2)}) — uniform sentence lengths`,
    );
  }
  return { score, patterns };
}

// ─── Heuristic 3: Transition Word Overuse ────────────────────────────────────

function computeTransitionScore(lower: string): {
  score: number;
  patterns: string[];
} {
  const words = lower.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return { score: 0, patterns: [] };

  let transitionCount = 0;
  for (const tw of TRANSITION_WORDS) {
    if (lower.includes(tw)) {
      transitionCount++;
    }
  }

  const ratio = transitionCount / Math.max(1, words.length / 10);
  const score = Math.min(1, ratio * 0.5);
  const patterns: string[] = [];
  if (transitionCount >= 2) {
    patterns.push(
      `High transition word density (${transitionCount} transitions)`,
    );
  }
  return { score, patterns };
}

// ─── Heuristic 4: Lexical Complexity Uniformity ───────────────────────────────

function computeLexicalScore(lower: string): {
  score: number;
  patterns: string[];
} {
  const words = lower
    .replace(/[^a-z ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (words.length === 0) return { score: 0, patterns: [] };

  const longWords = words.filter((w) => w.length > 7);
  const longRatio = longWords.length / words.length;
  const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;

  // High proportion of long words + high avg word length = AI-like formal vocabulary
  const score = Math.min(
    1,
    longRatio * 0.7 + Math.max(0, (avgLen - 4.5) / 5) * 0.3,
  );
  const patterns: string[] = [];
  if (longRatio > 0.28) {
    patterns.push(
      `High lexical complexity (${Math.round(longRatio * 100)}% long words)`,
    );
  }
  return { score, patterns };
}

// ─── Heuristic 5: Hedging Language ───────────────────────────────────────────

function computeHedgingScore(lower: string): {
  score: number;
  patterns: string[];
} {
  let hits = 0;
  const words = lower.split(/\s+/).length;

  for (const phrase of HEDGING_PHRASES) {
    if (lower.includes(phrase)) {
      hits++;
    }
  }

  const density = words > 0 ? hits / Math.max(1, words / 15) : 0;
  const score = Math.min(1, density * 0.6);
  const patterns: string[] = [];
  if (hits >= 2) {
    patterns.push(`Hedging language overuse (${hits} hedge phrases)`);
  }
  return { score, patterns };
}

// ─── Per-Segment Scorer ───────────────────────────────────────────────────────

function scoreSegment(
  segText: string,
  burstiessScore: number,
): { score: number; patterns: string[] } {
  const lower = segText.toLowerCase().trim();

  const phrase = computePhraseScore(lower);
  const transition = computeTransitionScore(lower);
  const lexical = computeLexicalScore(lower);
  const hedging = computeHedgingScore(lower);

  const patterns = [
    ...phrase.patterns,
    ...(burstiessScore > 0.5
      ? ["Low burstiness — uniform sentence rhythm"]
      : []),
    ...transition.patterns,
    ...lexical.patterns,
    ...hedging.patterns,
  ];

  // Weighted combination (phrase matching is strongest signal)
  const score =
    phrase.score * 0.4 +
    burstiessScore * 0.2 +
    transition.score * 0.15 +
    lexical.score * 0.15 +
    hedging.score * 0.1;

  return { score: Math.min(1, score), patterns };
}

// ─── Main Detector ────────────────────────────────────────────────────────────

export function detectAI(text: string): AIDetectionResult {
  if (!text.trim()) {
    return {
      overallScore: 0,
      label: "Likely Human",
      segments: [],
      heuristicBreakdown: {
        phraseScore: 0,
        burstiessScore: 0,
        transitionScore: 0,
        lexicalScore: 0,
        hedgingScore: 0,
      },
    };
  }

  const rawSentences = splitSentences(text);
  const sentenceTexts = rawSentences.map((s) => s.text);

  // Global heuristics (apply to full text)
  const lower = text.toLowerCase();
  const { score: burstiessScore } = computeBurstiessScore(sentenceTexts);
  const { score: globalTransition } = computeTransitionScore(lower);
  const { score: globalLexical } = computeLexicalScore(lower);
  const { score: globalHedging } = computeHedgingScore(lower);
  const { score: globalPhrase } = computePhraseScore(lower);

  // Score each segment
  const segments: AISegment[] = rawSentences.map(
    ({ text: segText, offset }) => {
      const { score, patterns } = scoreSegment(segText, burstiessScore);
      return {
        text: segText,
        score,
        // Lower threshold: flag any sentence with AI score >= 0.35
        flagged: score >= 0.35,
        triggeredPatterns: patterns,
        charOffset: offset,
      };
    },
  );

  // Overall score = weighted combo of global heuristics
  const overallScore = Math.min(
    1,
    globalPhrase * 0.4 +
      burstiessScore * 0.2 +
      globalTransition * 0.15 +
      globalLexical * 0.15 +
      globalHedging * 0.1,
  );

  const label: AIDetectionResult["label"] =
    overallScore < 0.3
      ? "Likely Human"
      : overallScore <= 0.65
        ? "Mixed/Uncertain"
        : "Likely AI-Generated";

  return {
    overallScore,
    label,
    segments,
    heuristicBreakdown: {
      phraseScore: globalPhrase,
      burstiessScore,
      transitionScore: globalTransition,
      lexicalScore: globalLexical,
      hedgingScore: globalHedging,
    },
  };
}
