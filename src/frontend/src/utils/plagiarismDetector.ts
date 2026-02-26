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
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(w => w.length > 0);
}

function buildBigrams(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i + 1 < words.length; i++) {
    result.push(words[i] + ' ' + words[i + 1]);
  }
  return result;
}

function buildTrigrams(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i + 2 < words.length; i++) {
    result.push(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
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

const STOP_WORDS = new Set(['the','a','an','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','to','of','in','on','at','by','for','with','as','it','this','that','these','those','and','or','but','not','so','from','into','than','then','they','their','there','here','when','where','which','who','how','all','any','each','few','more','most','other','some','such','own','same','also','just','both','about','over','after','before','while','through','during','between','among','within','without','very','too','been','its','we','our','you','your','he','his','she','her']);

export function extractTopic(text: string): string {
  const words = tokenize(text);
  const meaningful = words.filter(w => w.length > 3 && !STOP_WORDS.has(w));
  if (meaningful.length === 0) return 'this topic';
  if (meaningful.length === 1) return meaningful[0];
  return meaningful[0] + ' ' + meaningful[1];
}

export function generateAlternatives(text: string, score: number): string[] {
  const topic = extractTopic(text);
  if (score > 0.6) {
    return [
      `Rewrite in your own words: explain ${topic} using your own analysis and observations.`,
      `Paraphrase: describe how ${topic} relates to your argument without using standard academic formulas.`,
    ];
  } else {
    return [
      `Try rephrasing: instead of common academic phrasing, directly state your own interpretation of ${topic}.`,
      `Alternative: express the idea about ${topic} more concisely and in your personal voice.`,
    ];
  }
}

export interface FrontendSegment {
  segmentId: bigint;
  text: string;
  score: number;
  flagged: boolean;
  alternatives: string[];
}

export interface FrontendCheckResult {
  id: bigint;
  overallScore: number;
  segments: FrontendSegment[];
}

export function analyzeText(text: string): FrontendCheckResult {
  // Split into sentences
  const rawSegments: string[] = [];
  let current = '';
  let prevChar = '';
  for (const ch of text) {
    if ((prevChar === '.' || prevChar === '!' || prevChar === '?') && ch === ' ') {
      const trimmed = current.trim();
      if (trimmed.length > 0) rawSegments.push(trimmed);
      current = '';
    } else {
      current += ch;
    }
    prevChar = ch;
  }
  const lastTrimmed = current.trim();
  if (lastTrimmed.length > 0) rawSegments.push(lastTrimmed);

  // If no sentence boundaries found, chunk by roughly 20 words
  let segTexts = rawSegments;
  if (segTexts.length <= 1 && text.trim().length > 0) {
    const words = text.trim().split(/\s+/);
    const chunkSize = 20;
    segTexts = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      segTexts.push(words.slice(i, i + chunkSize).join(' '));
    }
  }

  const segments: FrontendSegment[] = segTexts.map((seg, idx) => {
    const score = computeSegmentScore(seg);
    const flagged = score > 0.15;
    return {
      segmentId: BigInt(idx),
      text: seg,
      score,
      flagged,
      alternatives: flagged ? generateAlternatives(seg, score) : [],
    };
  });

  const overallScore = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.score, 0) / segments.length
    : 0;

  return {
    id: BigInt(0),
    overallScore,
    segments,
  };
}
