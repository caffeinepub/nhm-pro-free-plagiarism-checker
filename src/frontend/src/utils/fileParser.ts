// ─── File Parser Utility ──────────────────────────────────────────────────────
// Extracts plain text from uploaded documents.
// Supports: .txt, .pdf (text extraction), .doc, .docx, .odt, .rtf

// ─── PDF parsing — extract embedded text via raw parsing ─────────────────────

async function parsePDF(file: File): Promise<string> {
  // Attempt to extract readable text streams from the PDF binary.
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const raw = new TextDecoder("latin1").decode(bytes);

  // Pull text from BT...ET blocks (basic PDF text stream extraction)
  const textParts: string[] = [];
  const btEtRegex = /BT([\s\S]*?)ET/g;
  const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*T[jJ]/g;
  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;

  for (const btMatch of raw.matchAll(btEtRegex)) {
    const block = btMatch[1];
    for (const tjMatch of block.matchAll(tjRegex)) {
      textParts.push(
        tjMatch[1]
          .replace(/\\n/g, "\n")
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")"),
      );
    }
    for (const arrMatch of block.matchAll(arrayTjRegex)) {
      const innerParts =
        arrMatch[1].match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g) ?? [];
      for (const p of innerParts) {
        textParts.push(p.slice(1, -1).replace(/\\n/g, "\n"));
      }
    }
  }

  const extracted = textParts.join(" ").replace(/\s+/g, " ").trim();
  if (extracted.length > 20) return extracted;

  // Fallback: read as plain text (works for text-based PDFs saved as text)
  return readAsText(file);
}

// ─── DOCX parsing — extract text from XML inside zip ─────────────────────────

async function parseDOCX(file: File): Promise<string> {
  // DOCX is a ZIP file. We'll try to read word/document.xml for plain text.
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    // Look for XML content between w:t tags
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    const textNodes = raw.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) ?? [];
    const text = textNodes
      .map((node) => node.replace(/<[^>]+>/g, ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 20) return text;
  } catch {
    // fall through to text read
  }
  return readAsText(file);
}

// ─── Plain text / fallback reader ─────────────────────────────────────────────

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";

  if (ext === "pdf") {
    return parsePDF(file);
  }

  if (ext === "docx" || ext === "doc") {
    return parseDOCX(file);
  }

  // .txt, .odt, .rtf — best-effort text read
  return readAsText(file);
}

export const ACCEPTED_FILE_TYPES =
  ".txt,.pdf,.doc,.docx,.odt,.rtf,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/rtf";
