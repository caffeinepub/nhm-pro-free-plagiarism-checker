// Large corpus of common academic/copied phrases (450+ entries)
const CORPUS_PHRASES = [
  // ── General academic / research ──────────────────────────────────────────
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

  // ── Expanded general academic phrases ───────────────────────────────────
  "the aim of this study",
  "research objectives include",
  "this paper argues that",
  "the central argument is",
  "evidence from multiple sources",
  "this analysis demonstrates",
  "cross-disciplinary approach to",
  "interdisciplinary research on",
  "comparative analysis of",
  "empirical data supports",
  "theoretical contributions of",
  "methodological approach used",
  "sampling method was",
  "research design employed",
  "validity and reliability",
  "internal consistency was",
  "construct validity confirmed",
  "convergent validity showed",
  "discriminant validity established",
  "measurement invariance tested",
  "structural equation modeling",
  "hierarchical regression analysis",
  "multivariate analysis showed",
  "descriptive statistics revealed",
  "inferential statistics used",
  "chi-square test showed",
  "t-test results indicated",
  "ANOVA revealed significant",
  "post-hoc analysis showed",
  "effect size was",
  "power analysis suggested",
  "sample characteristics included",
  "inclusion criteria were",
  "exclusion criteria included",
  "data saturation was",
  "member checking confirmed",
  "triangulation was used",
  "reflexivity was maintained",
  "positionality statement included",
  "peer debriefing used",
  "audit trail maintained",

  // ── Medicine / Healthcare ────────────────────────────────────────────────
  "clinical trials have demonstrated",
  "patient outcomes improved",
  "randomized controlled trial",
  "evidence-based medicine",
  "pharmacological intervention",
  "therapeutic efficacy of",
  "adverse drug reactions",
  "clinical significance of",
  "morbidity and mortality",
  "diagnostic accuracy of",
  "treatment protocol for",
  "systematic review revealed",
  "meta-analysis confirmed",
  "placebo-controlled study",
  "double-blind randomized",
  "clinical manifestations of",
  "pathophysiology of the",
  "risk factors associated",
  "epidemiological study showed",
  "public health implications",
  "prevalence of the disease",
  "incidence rate was",
  "prognosis of patients",
  "comorbidities were identified",
  "informed consent obtained",
  "biomarkers were measured",
  "laboratory findings revealed",
  "imaging studies showed",
  "surgical intervention was",
  "postoperative complications",

  // ── Law / Legal ──────────────────────────────────────────────────────────
  "legal framework provides",
  "constitutional provisions require",
  "judicial precedent establishes",
  "statutory interpretation of",
  "burden of proof",
  "due process requires",
  "rights and obligations",
  "legal implications of",
  "regulatory compliance with",
  "legislative intent was",
  "case law suggests",
  "legal doctrine of",
  "binding precedent in",
  "jurisdiction of the court",
  "civil liability for",
  "criminal intent requires",
  "standard of care",
  "fiduciary duty to",
  "contractual obligation of",
  "tort law principles",

  // ── Engineering / Technology ─────────────────────────────────────────────
  "finite element analysis",
  "computational fluid dynamics",
  "experimental results validated",
  "numerical simulation of",
  "prototype was developed",
  "performance metrics showed",
  "design optimization of",
  "structural integrity of",
  "failure mode analysis",
  "stress distribution in",
  "material properties of",
  "thermal analysis revealed",
  "signal processing technique",
  "algorithm was implemented",
  "system architecture of",
  "hardware implementation of",
  "software framework for",
  "machine learning model",
  "deep learning approach",
  "neural network trained",

  // ── Business / Economics ─────────────────────────────────────────────────
  "market analysis revealed",
  "competitive advantage of",
  "supply chain management",
  "return on investment",
  "strategic management framework",
  "organizational performance was",
  "financial performance of",
  "economic growth rate",
  "gross domestic product",
  "inflation rate showed",
  "market share increased",
  "consumer behavior study",
  "stakeholder analysis shows",
  "risk management strategy",
  "corporate governance practices",
  "business model innovation",
  "value chain analysis",
  "Porter's five forces",
  "SWOT analysis revealed",
  "balanced scorecard approach",

  // ── Psychology / Social Sciences ─────────────────────────────────────────
  "cognitive behavioral therapy",
  "psychological well-being of",
  "self-efficacy beliefs",
  "social learning theory",
  "attachment theory suggests",
  "cognitive dissonance occurs",
  "behavioral patterns observed",
  "emotional intelligence of",
  "mental health outcomes",
  "stress and coping mechanisms",
  "personality traits associated",
  "social influence on",
  "group dynamics revealed",
  "cross-sectional study examined",
  "longitudinal study followed",
  "survey data collected",
  "interview data analyzed",
  "grounded theory approach",
  "phenomenological study explored",
  "discourse analysis showed",

  // ── Education ────────────────────────────────────────────────────────────
  "learning outcomes improved",
  "pedagogical approaches to",
  "curriculum development for",
  "student achievement in",
  "formative assessment shows",
  "summative assessment revealed",
  "critical thinking skills",
  "collaborative learning approach",
  "problem-based learning",
  "active learning strategies",
  "educational technology in",
  "teacher professional development",
  "classroom environment affects",
  "motivation and engagement",
  "academic performance was",
  "higher education policy",
  "blended learning model",
  "instructional design for",
  "constructivist learning theory",
  "zone of proximal development",

  // ── Environmental Science ─────────────────────────────────────────────────
  "climate change impacts",
  "greenhouse gas emissions",
  "carbon footprint reduction",
  "biodiversity conservation of",
  "ecosystem services provide",
  "environmental impact assessment",
  "renewable energy sources",
  "sustainable development goals",
  "pollution levels exceeded",
  "deforestation rate increased",
  "water quality analysis",
  "soil contamination was",
  "air quality monitoring",
  "ecological footprint of",
  "environmental degradation of",
  "natural resource management",
  "habitat fragmentation affects",
  "species diversity was",
  "carbon sequestration potential",
  "environmental policy framework",

  // ── Humanities / Social Studies ───────────────────────────────────────────
  "historical analysis reveals",
  "cultural perspectives on",
  "social construction of",
  "postcolonial theory suggests",
  "feminist scholarship argues",
  "critical discourse analysis",
  "hermeneutic interpretation of",
  "ethnographic research showed",
  "archival research revealed",
  "theoretical framework draws",
  "ideological implications of",
  "power dynamics within",
  "narrative analysis of",
  "symbolic representation of",
  "social inequality persists",
  "cultural identity and",
  "historical context of",
  "philosophical perspective on",
  "sociological analysis of",
  "anthropological study examined",
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
    result.push(`${words[i]} ${words[i + 1]}`);
  }
  return result;
}

function buildTrigrams(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i + 2 < words.length; i++) {
    result.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
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

/** Replace key academic words with fresh synonyms (Strategy 1: synonym-heavy) */
function replaceSynonyms(text: string, variant: number): string {
  type SynGroup = [RegExp, string[]];
  const synMap: SynGroup[] = [
    [
      /\baccording to\b/gi,
      [
        "as outlined by",
        "per the findings of",
        "as documented by",
        "drawing from",
        "as reported by",
        "in the words of",
        "citing",
        "as evidenced by",
      ],
    ],
    [
      /\bprevious research\b/gi,
      [
        "earlier investigations",
        "prior studies",
        "past scholarship",
        "earlier academic work",
        "foundational research",
        "antecedent literature",
        "preceding work",
        "existing studies",
      ],
    ],
    [
      /\bhas been shown\b/gi,
      [
        "has been demonstrated",
        "has been established",
        "has been confirmed",
        "is well documented",
        "has been validated",
        "is widely acknowledged",
        "has been verified",
        "stands confirmed",
      ],
    ],
    [
      /\bit can be concluded\b/gi,
      [
        "the evidence leads to the conclusion",
        "one can reasonably infer",
        "the data supports the view",
        "analysis confirms",
        "the weight of evidence indicates",
        "it is reasonable to conclude",
        "the overall picture suggests",
        "the logical inference is",
      ],
    ],
    [
      /\bthe results indicate\b/gi,
      [
        "the findings reveal",
        "the data points to",
        "observations confirm",
        "evidence demonstrates",
        "the outcomes show",
        "the data reveal",
        "the evidence points toward",
        "the analysis highlights",
      ],
    ],
    [
      /\bfurthermore\b/gi,
      [
        "in addition",
        "beyond that",
        "building on this",
        "what is more",
        "adding to this",
        "equally important",
        "on top of this",
        "extending this further",
      ],
    ],
    [
      /\bmoreover\b/gi,
      [
        "additionally",
        "alongside this",
        "further still",
        "on top of that",
        "beyond this",
        "as a further point",
        "compounding this",
        "in like manner",
      ],
    ],
    [
      /\bin conclusion\b/gi,
      [
        "to summarize the findings",
        "drawing all threads together",
        "as a final observation",
        "in summary",
        "taken together",
        "to bring the discussion to a close",
        "all things considered",
        "as a closing remark",
      ],
    ],
    [
      /\bstudies have shown\b/gi,
      [
        "research consistently reveals",
        "academic work demonstrates",
        "investigations confirm",
        "scholarly evidence shows",
        "the body of literature suggests",
        "accumulated research indicates",
        "peer-reviewed work confirms",
        "empirical work reveals",
      ],
    ],
    [
      /\bit is important to note\b/gi,
      [
        "worth highlighting here is",
        "a key point to consider is",
        "notably",
        "one should acknowledge that",
        "it bears emphasizing that",
        "a critical observation is",
        "it deserves mention that",
        "of particular significance is",
      ],
    ],
    [
      /\bin recent years\b/gi,
      [
        "over the past decade",
        "in contemporary research",
        "in the modern era",
        "within current discourse",
        "in the present age",
        "across the recent literature",
        "in today's academic landscape",
        "throughout the current period",
      ],
    ],
    [
      /\bas mentioned above\b/gi,
      [
        "as discussed earlier",
        "as previously established",
        "referring back to the earlier point",
        "as noted",
        "as outlined previously",
        "returning to the earlier discussion",
        "as highlighted before",
        "consistent with what was said above",
      ],
    ],
    [
      /\bsignificant\b/gi,
      [
        "substantial",
        "considerable",
        "noteworthy",
        "meaningful",
        "pronounced",
        "marked",
        "consequential",
        "appreciable",
      ],
    ],
    [
      /\binvestigation\b/gi,
      [
        "examination",
        "analysis",
        "exploration",
        "inquiry",
        "study",
        "probe",
        "scrutiny",
        "assessment",
      ],
    ],
    [
      /\bdemonstrated\b/gi,
      [
        "shown",
        "revealed",
        "established",
        "confirmed",
        "illustrated",
        "made evident",
        "proven",
        "validated",
      ],
    ],
    [
      /\beffective\b/gi,
      [
        "successful",
        "productive",
        "impactful",
        "reliable",
        "efficacious",
        "potent",
        "capable",
        "robust",
      ],
    ],
    [
      /\butilize\b/gi,
      [
        "use",
        "apply",
        "employ",
        "leverage",
        "deploy",
        "make use of",
        "draw on",
        "harness",
      ],
    ],
    [
      /\bthus\b/gi,
      [
        "therefore",
        "as a result",
        "consequently",
        "hence",
        "accordingly",
        "for this reason",
        "as a consequence",
        "in turn",
      ],
    ],
    [
      /\bsuch as\b/gi,
      [
        "for example",
        "including",
        "like",
        "particularly",
        "among them",
        "as seen in",
        "for instance",
        "notably",
      ],
    ],
    [
      /\bhowever\b/gi,
      [
        "yet",
        "that said",
        "in contrast",
        "despite this",
        "nevertheless",
        "even so",
        "on the contrary",
        "notwithstanding this",
      ],
    ],
  ];

  let result = text;
  for (const [pattern, synonyms] of synMap) {
    const pick = synonyms[variant % synonyms.length];
    result = result.replace(pattern, pick);
  }
  return result;
}

/** Plain-language synonym map for Strategy 2 */
function applyPlainLanguage(text: string): string {
  const plainSynMap: Array<[RegExp, string]> = [
    [/\bit can be concluded\b/gi, "this means"],
    [/\bthe findings suggest\b/gi, "the results show"],
    [/\bdemonstrated that\b/gi, "proved that"],
    [/\bit was found that\b/gi, "researchers found that"],
    [/\bhas been established\b/gi, "is now known"],
    [/\baccording to\b/gi, "as noted by"],
    [/\bin order to\b/gi, "to"],
    [/\bdue to the fact that\b/gi, "because"],
    [/\bwith respect to\b/gi, "about"],
    [/\bin terms of\b/gi, "regarding"],
    [/\bit is important to note\b/gi, "importantly"],
    [/\ba significant\b/gi, "a major"],
    [/\bconducted\b/gi, "carried out"],
    [/\butilized\b/gi, "used"],
    [/\butilize\b/gi, "use"],
    [/\bsubsequent\b/gi, "later"],
    [/\bprior to\b/gi, "before"],
    [/\bsubsequent to\b/gi, "after"],
    [/\bin the event that\b/gi, "if"],
    [/\bat the present time\b/gi, "now"],
    [/\bfor the purpose of\b/gi, "for"],
    [/\bfurthermore\b/gi, "also"],
    [/\bmoreover\b/gi, "also"],
    [/\bnevertheless\b/gi, "still"],
    [/\bnotwithstanding\b/gi, "despite"],
    [/\bcommence\b/gi, "start"],
    [/\bterminate\b/gi, "end"],
    [/\bascertain\b/gi, "find out"],
    [/\bfacilitate\b/gi, "help"],
    [/\bimplement\b/gi, "carry out"],
  ];

  let result = text;
  for (const [pattern, replacement] of plainSynMap) {
    result = result.replace(pattern, replacement);
  }

  // Reorder: "According to X, Y" → "Y, as noted by X"
  const accordingMatch = result.match(
    /^(?:As noted by|According to)\s+([^,]+),\s+(.+)$/i,
  );
  if (accordingMatch) {
    const source = accordingMatch[1].trim();
    const claim = accordingMatch[2].trim();
    const claimCap = claim.charAt(0).toUpperCase() + claim.slice(1);
    result = `${claimCap}, as noted by ${source}`;
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
    .replace(/\bwas analyzed\b/gi, "the study analyzed")
    .replace(/\bwas examined\b/gi, "the researchers examined")
    .replace(/\bwere recorded\b/gi, "the study recorded");
}

/** Strategy 3: structural transformation */
function applyStructuralTransform(text: string): string {
  // "It was [verb] that [X]" → "[X] was [verb] by the analysis"
  const itWasMatch = text.match(/^It was (\w+) that (.+)\.?$/i);
  if (itWasMatch) {
    const verb = itWasMatch[1];
    const clause = itWasMatch[2].replace(/\.$/, "");
    const clauCap = clause.charAt(0).toUpperCase() + clause.slice(1);
    return `${clauCap} was ${verb} by the analysis.`;
  }

  // "The results indicate that [X]" → "[X], as the results indicate"
  const resultsMatch = text.match(
    /^The (?:results|findings|data|evidence) (?:indicate|suggest|show|reveal) that (.+)\.?$/i,
  );
  if (resultsMatch) {
    const clause = resultsMatch[1].replace(/\.$/, "");
    const clauCap = clause.charAt(0).toUpperCase() + clause.slice(1);
    return `${clauCap}, as the evidence indicates.`;
  }

  // "A [adj] [noun] was [verb]" → "The [noun], which was found to be [adj], was [verb]"
  const adjNounMatch = text.match(/^A (\w+) (\w+) was (\w+)(.*)\.?$/i);
  if (adjNounMatch) {
    const adj = adjNounMatch[1];
    const noun = adjNounMatch[2];
    const verb = adjNounMatch[3];
    const rest = adjNounMatch[4];
    return `The ${noun}, which was found to be ${adj}, was ${verb}${rest}.`;
  }

  // Flip passive: "[X] was studied by researchers" → "Researchers studied [X]"
  const passiveMatch = text.match(
    /^(.+?) was (\w+) by (researchers|the team|scholars|investigators|the authors)(.*)\.?$/i,
  );
  if (passiveMatch) {
    const subject = passiveMatch[1].trim();
    const verb = passiveMatch[2];
    const agent = passiveMatch[3];
    const rest = passiveMatch[4];
    const agentCap = agent.charAt(0).toUpperCase() + agent.slice(1);
    const subjectLow = subject.charAt(0).toLowerCase() + subject.slice(1);
    return `${agentCap} ${verb} ${subjectLow}${rest}.`;
  }

  // Move trailing clause: "main clause, in order to X" → "In order to X, main clause"
  const trailingMatch = text.match(
    /^(.*?),?\s+(in order to .+|to achieve .+|to examine .+|to investigate .+|to determine .+)\.?$/i,
  );
  if (trailingMatch) {
    const main = trailingMatch[1].trim();
    const purpose = trailingMatch[2].trim();
    const purCap = purpose.charAt(0).toUpperCase() + purpose.slice(1);
    const mainLow = main.charAt(0).toLowerCase() + main.slice(1);
    return `${purCap}, ${mainLow}.`;
  }

  // Fallback: split at comma/semicolon and reconnect with a different connective
  const connectives = ["while", "whereas", "although", "given that", "since"];
  const splitMatch = text.match(/^([^,;]+)[,;]\s+(.+)\.?$/);
  if (splitMatch) {
    const hashVal =
      text.charCodeAt(0) + text.charCodeAt(Math.floor(text.length / 2));
    const connective = connectives[hashVal % connectives.length];
    const partA = splitMatch[1].trim();
    const partB = splitMatch[2].replace(/\.$/, "").trim();
    const partACap = partA.charAt(0).toUpperCase() + partA.slice(1);
    const partBLow = partB.charAt(0).toLowerCase() + partB.slice(1);
    return `${partACap}, ${connective} ${partBLow}.`;
  }

  return text;
}

/** Simple character-level similarity ratio between two strings */
function charSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

/** Ensure a string starts with capital letter and ends with punctuation */
function polish(text: string): string {
  const cleaned = text.trim();
  const capped = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return capped.endsWith(".") || capped.endsWith("!") || capped.endsWith("?")
    ? capped
    : `${capped}.`;
}

/** Generate 3 humanized, structurally distinct rewrites of a sentence */
export function generateAlternatives(text: string, _score: number): string[] {
  const trimmed = text.trim();
  if (!trimmed || trimmed.split(/\s+/).length < 4) return [];

  // Deterministic hash for choosing openers
  const hashCode = trimmed
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) & 0xffffffff, 0);
  const transitionalOpeners = [
    "Research indicates that",
    "Evidence shows that",
    "Studies confirm that",
    "Available data suggests that",
    "The literature reveals that",
    "Scholarly work demonstrates that",
  ];
  const openerPick =
    transitionalOpeners[Math.abs(hashCode) % transitionalOpeners.length];

  // ── Strategy 1: Synonym-heavy + active voice + transitional opener ──────
  let alt1 = activateVoice(replaceSynonyms(trimmed, 0));
  const hasOpener =
    /^(research|evidence|studies|data|literature|scholarly)/i.test(alt1);
  if (!hasOpener) {
    // Lower-case the original sentence start before prepending opener
    alt1 = `${openerPick} ${alt1.charAt(0).toLowerCase()}${alt1.slice(1)}`;
  }

  // ── Strategy 2: Plain-language / reader-focused rewrite ─────────────────
  let alt2 = applyPlainLanguage(trimmed);
  // If unchanged, try a different synonym variant
  if (alt2 === trimmed) {
    alt2 = replaceSynonyms(trimmed, 3);
  }

  // ── Strategy 3: Structural transformation ────────────────────────────────
  let alt3 = applyStructuralTransform(trimmed);
  // If structural transform didn't change anything, apply replaceSynonyms with a high variant
  if (alt3 === trimmed) {
    alt3 = replaceSynonyms(trimmed, 6);
  }
  // Additionally layer active-voice on top
  alt3 = activateVoice(alt3);

  // Polish all three
  let alts: string[] = [alt1, alt2, alt3].map(polish);

  // ── Deduplication guard ──────────────────────────────────────────────────
  const fallbackPrefixes = [
    "To put it differently,",
    "Stated another way,",
    "In other words,",
    "From another angle,",
  ];

  for (let i = 0; i < alts.length; i++) {
    for (let j = i + 1; j < alts.length; j++) {
      if (charSimilarity(alts[i], alts[j]) > 0.8) {
        // Replace the later duplicate
        const prefix = fallbackPrefixes[j % fallbackPrefixes.length];
        const base = replaceSynonyms(trimmed, j + 5);
        alts[j] = polish(
          `${prefix} ${base.charAt(0).toLowerCase()}${base.slice(1)}`,
        );
      }
    }
  }

  // Final guard: never identical to original
  alts = alts.map((alt, i) => {
    if (alt === polish(trimmed)) {
      const prefix = fallbackPrefixes[i % fallbackPrefixes.length];
      const base = replaceSynonyms(trimmed, i + 8);
      return polish(
        `${prefix} ${base.charAt(0).toLowerCase()}${base.slice(1)}`,
      );
    }
    return alt;
  });

  return alts;
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

  const segments: FrontendSegment[] = segData.map(
    ({ text: seg, offset }, idx) => {
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
    },
  );

  // Overall score = fraction of flagged sentences * 100
  const flaggedCount = segments.filter((s) => s.flagged).length;
  const overallScore = segments.length > 0 ? flaggedCount / segments.length : 0;

  return {
    id: BigInt(0),
    overallScore,
    segments,
  };
}
