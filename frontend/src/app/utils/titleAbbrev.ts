export function abbreviateTitle(input: string | undefined | null): string {
  if (!input) return "";
  let s = String(input).replace(/_/g, " ").trim();
  if (!s) return "";
  const stripParen = s.split("(")[0].trim();
  s = stripParen || s;
  const U = s.toUpperCase();

  const map: Record<string, string> = {
    "ASSISTANT PROGRAM ADMINISTRATOR": "Ass PA",
    "ASSISTANT PROGRAM DIRECTOR": "APD",
    "PROGRAM DIRECTOR": "PD",
    "ASSISTANT FACILITY ADMINISTRATOR": "AFA",
    "FACILITY ADMINISTRATOR": "FA",
    "DIRECTOR OF FACILITY OPERATIONS": "DFO",

    "JUVENILE JUSTICE YOUTH DEVELOPMENT SPECIALIST I": "JJYDS-I",
    "JUVENILE JUSTICE YOUTH DEVELOPMENT SPECIALIST II": "JJYDS-II",
    "JUVENILE JUSTICE YOUTH DEVELOPMENT SPECIALIST III": "JJYDS-III",
    "MASTER JUVENILE JUSTICE YOUTH DEVELOPMENT SPECIALIST": "M-JJYDS",
    "YOUTH SERVICES GROUP WORKER": "YSGW",

    "CLINICAL SOCIAL WORKER I": "CSW-I",
    "CLINICAL SOCIAL WORKER II": "CSW-II",
    "CLINICAL SOCIAL WORKER SUPERVISOR": "CSWS",
    "PSYCHOLOGIST": "PSY",
    "LICENSED MENTAL HEALTH COUNSELOR": "LMHC",
    "DIRECTOR OF CLINICAL SERVICES": "DCS",
    "REGIONAL CLINICAL COORDINATOR": "RCC",
    "BEHAVIOR ANALYST": "BCBA",
    "BEHAVIOR ANALYST / BCBA": "BCBA",

    "CASEWORKER I": "CW-I",
    "CASEWORKER II": "CW-II",
    "CASEWORKER I / II": "CW-I / CW-II",
    "CASEWORK SUPERVISOR": "CWS",
    "COMMUNITY SERVICES COORDINATOR": "CSC",
    "REGIONAL RE-ENTRY COORDINATOR": "RRC",
    "REGIONAL PLACEMENT COORDINATOR": "RPC",
    "DETENTION COORDINATOR": "DC",
    "TRANSPORT OFFICER": "TO",
    "TRANSPORT OFFICER / DRIVER": "TO",

    "TEACHER": "TCH",
    "ACADEMIC INSTRUCTOR": "TCH",
    "TEACHER / ACADEMIC INSTRUCTOR": "TCH",
    "SPECIAL EDUCATION TEACHER": "SPED-T",
    "EDUCATION COORDINATOR": "EDC",
    "DIRECTOR OF EDUCATION PROGRAMS": "DEP",

    "REGISTERED NURSE": "RN",
    "NURSE PRACTITIONER": "NP",
    "NURSING SUPERVISOR": "NS",
    "MEDICAL DIRECTOR": "MD",

    "HUMAN RESOURCES GENERALIST": "HRG",
    "HUMAN RESOURCES DIRECTOR": "HRD",
    "LABOR RELATIONS SPECIALIST": "LRS",
    "PAYROLL & TIME ADMINISTRATOR": "PTA",

    "BUDGET ANALYST": "BA",
    "FISCAL MANAGER": "FM",

    "GENERAL COUNSEL": "GC",
    "ATTORNEY": "GC",
    "DEPUTY GENERAL COUNSEL": "DGC",

    "ADMINISTRATIVE ASSISTANT": "AA",
    "ADMINISTRATIVE COORDINATOR": "AC",
    "ADMINISTRATIVE ASSISTANT / COORDINATOR": "AA / AC",

    "TRAINING SPECIALIST": "TS",
    "DIRECTOR OF STAFF DEVELOPMENT & TRAINING": "DSDT",

    "COMPLIANCE OFFICER": "CO",
    "LICENSING COORDINATOR": "LC",
    "QUALITY ASSURANCE MANAGER": "QAM",

    "INFORMATION TECHNOLOGY SPECIALIST": "ITS",
    "NETWORK ADMINISTRATOR": "NA",
    "SYSTEMS ADMINISTRATOR": "SA",
    "IT MANAGER": "ITM",
    "DIRECTOR OF INFORMATION TECHNOLOGY": "DIT",
    "CHIEF INFORMATION OFFICER": "CIO",

    "REGIONAL DIRECTOR": "RD",
    "ASSISTANT REGIONAL DIRECTOR": "ARD",
    "DEPUTY COMMISSIONER": "DCOM",
    "COMMISSIONER OF DYS": "COM",
    "CHIEF OF STAFF": "COS",
    "DIRECTOR OF OPERATIONS": "DO",
    "DIRECTOR OF POLICY & PROGRAM DEVELOPMENT": "DPPD",
  };

  if (map[U]) return map[U];

  const cleaned = U.replace(/\s+/g, " ").trim();
  if (map[cleaned]) return map[cleaned];

  const slashParts = cleaned.split("/").map((p) => p.trim());
  if (slashParts.length > 1) {
    const abbrs = slashParts.map((part) => map[part] || genericAbbrev(part));
    return abbrs.join(" / ");
  }

  return genericAbbrev(s);
}

function genericAbbrev(title: string): string {
  const words = title.replace(/_/g, " ").trim().split(/\s+/);
  if (words.length === 1) {
    const w = words[0];
    if (w.length <= 4) return w.toUpperCase();
    return (w.slice(0, 3) + (w.length > 3 ? w[3].toUpperCase() : "")).trim();
  }
  const first = words[0];
  const head = first.slice(0, 3);
  const tail = words.slice(1).map((w) => (w[0] || "").toUpperCase()).join("");
  return `${capitalize(head)} ${tail}`.trim();
}

function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
