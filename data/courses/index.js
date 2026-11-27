function L(id, title, durationMin, body, deepDive, takeaway, language, code) {
  return { id, title, durationMin, body, deepDive, takeaway, language, code };
}

function expandModule(prefix, modIdx, title, baseLessons) {
  const extras = [
    L(
      `${prefix}-m${modIdx}-l4`,
      `${title.split(":")[1]?.trim() || title} — Production Patterns`,
      12,
      `Applying ${title.split(":")[1]?.trim() || title} in real production systems requires explicit boundaries, clean logging, and predictable fallbacks. Rather than relying on ad-hoc fixes, standardize the pattern across your codebase so every teammate can review and maintain it safely.`,
      `In practice, start with a minimal baseline test suite covering normal inputs and edge-case failures. Verify behavior before and after every change so regressions are caught immediately.`,
      `Standardize ${title.split(":")[1]?.trim() || title} with clear boundaries and repeatable checks.`,
      "javascript",
      `// Production checklist for ${prefix}-m${modIdx}
export const guard = { verified: true, module: ${modIdx} };`
    ),
    L(
      `${prefix}-m${modIdx}-l5`,
      `${title.split(":")[1]?.trim() || title} — Common Pitfalls & Audit`,
      11,
      `Even experienced engineers trip over subtle edge cases when scaling from prototypes to real users. Auditing assumptions—such as untrusted inputs, missing validation, or inconsistent state—prevents costly incidents later.`,
      `Before marking this module done, review your implementation against three questions: Is it deterministic? Are errors handled gracefully? Is every assumption documented?`,
      `Audit edge cases early so prototype shortcuts never leak into production.`,
      "javascript",
      `// Audit helper
function assertInvariant(cond, msg) { if (!cond) throw new Error(msg); }`
    ),
  ];
  return { id: `${prefix}-m${modIdx}`, title, lessons: [...baseLessons, ...extras] };
}

/** @type {import("@/lib/types").Course[]} */
const courses = [
  {
    id: "c1",
    slug: "prompt-engineering-fundamentals",
    title: "Prompt Engineering Fundamentals",
    subtitle: "Write clear, structured prompts that produce reliable outputs from modern language models.",
    category: "AI Engineering",
    level: "Beginner",
    durationHours: 4.5,
    rating: 4.8,
    learnersCount: 3420,
    coverImage: "/images/courses/ai-agents.jpg",
    accentColor: "#7C5CFF",
    instructor: { name: "Aarav Kulkarni", role: "Staff Applied AI Engineer", bio: "Leads prompt evaluation and agentic workflow design for enterprise developer tools." },
    outcomes: [
      "Structure system prompts using role, task, context, and explicit constraints",
      "Choose between zero-shot and few-shot prompting based on task ambiguity",
      "Enforce predictable JSON schemas without brittle post-processing",
      "Reduce hallucinations using source grounding and chain-of-thought verification",
    ],
    tags: ["Prompting", "LLMs", "Structured Output"],
    modules: [
      expandModule("c1", 1, "Module 1: Foundations of Structured Prompting", [
        L("c1-m1-l1", "Tokenization & Context Windows", 10,
          "Large language models split text into subword units called tokens rather than reading whole words. In English, 1,000 tokens roughly equals 750 words, while code and punctuation consume more tokens.",
          "Every model has a fixed context window holding both your prompt and its generated reply. Place critical instructions at the beginning and end of your prompt where attention is strongest.",
          "Keep prompts concise and place non-negotiable rules at the edges of the context window.",
          "javascript", `const systemPrompt = "<role>SQL Analyst</role><constraints>SELECT only</constraints>";`),
        L("c1-m1-l2", "Role, Task, Context & Constraints", 12,
          "Separating a prompt into Role, Task, Context, and Constraints removes guesswork and makes outputs repeatable across runs.",
          "Using XML tags or Markdown headings clearly separates your system instructions from untrusted user input.",
          "Always define what the model must NOT do alongside its primary task.",
          "text", `<role>Senior Reviewer</role>
<task>List 3 edge cases</task>
<constraints>Max 80 words</constraints>`),
        L("c1-m1-l3", "Prompt Injection Defense Basics", 11,
          "Untrusted user text can contain adversarial instructions like 'Ignore previous rules'. Isolate user data inside explicit delimiters.",
          "Pair delimiters with an explicit instruction telling the model to treat enclosed text strictly as passive data.",
          "Never concatenate untrusted user input directly into system instructions.",
          "text", `<untrusted_input>
{{userText}}
</untrusted_input>`),
      ]),
      expandModule("c1", 2, "Module 2: Shot Prompting & Formatting", [
        L("c1-m2-l1", "Zero-Shot vs Few-Shot Examples", 11,
          "Zero-shot prompting works well for straightforward summaries, while few-shot prompting provides 2–5 input/output pairs to anchor strict taxonomies.",
          "Including one negative or refusal example inside your few-shot set stabilizes edge-case boundaries dramatically.",
          "Use high-contrast few-shot pairs whenever output format or tone must stay consistent.",
          "javascript", `const examples = [{ in: "Drop table", out: { allowed: false } }];`),
        L("c1-m2-l2", "Enforcing JSON Schemas & Validation", 13,
          "Conversational filler breaks JSON.parse(). Pair an explicit schema with runtime validation before updating UI state.",
          "If validation fails, feed the exact schema error back to the model for a single bounded repair pass.",
          "Never trust raw LLM text in downstream code without schema validation.",
          "javascript", `const PlanSchema = { steps: ["string"], risk: "low | med | high" };`),
        L("c1-m2-l3", "Iterative Prompt Debugging", 10,
          "Maintain a 10–30 case golden dataset covering normal, messy, and adversarial inputs, and change one variable at a time.",
          "Measure pass/fail rates after each prompt edit instead of relying on single-run intuition.",
          "Treat prompt engineering with the same regression discipline as unit-tested code.",
          "javascript", `const evalCase = { id: "e1", input: "Summarize Q3", mustInclude: ["revenue"] };`),
      ]),
      expandModule("c1", 3, "Module 3: Reliability & Grounding", [
        L("c1-m3-l1", "Chain-of-Thought Reasoning", 12,
          "Asking for intermediate reasoning steps before a final conclusion improves accuracy on multi-step logic and policy checks.",
          "In JSON outputs, place a 'reasoning' field before the 'decision' field so autoregressive generation conditions the conclusion.",
          "Let the model show its work before committing to a final decision.",
          "javascript", `const schema = { reasoning: "string", decision: "approve | reject" };`),
        L("c1-m3-l2", "Reducing Hallucinations with Grounding", 13,
          "Supply verified source text and explicitly permit the model to say 'Not covered in provided material' when facts are missing.",
          "Never ask a model to cite URLs from memory without providing those sources in context.",
          "Grounding + explicit abstention eliminates fabricated citations.",
          "text", `Answer ONLY from <source>. If absent, reply: "Not covered."`),
        L("c1-m3-l3", "Prefix Caching & Cost Control", 10,
          "Place static instructions and reference docs at the top of your prompt prefix to maximize provider prompt caching.",
          "Keep dynamic user queries at the very end so leading tokens remain identical across requests.",
          "Static prefix first, dynamic input last cuts both latency and token spend.",
          "javascript", `const messages = [{ role: "system", content: STATIC_RULES }, { role: "user", content: query }];`),
      ]),
    ],
    quiz: {
      id: "c1-quiz", passingScore: 70,
      questions: [
        { id: "c1-q1", prompt: "What basic unit do LLMs split text into before processing?", options: ["Pixels", "Subword tokens", "SQL rows", "CSS selectors"], correctIndex: 1, explanation: "Tokenizers split text into subword units called tokens.", difficulty: "easy" },
        { id: "c1-q2", prompt: "Which four parts form a strong structured prompt blueprint?", options: ["Font, Color, Margin, Padding", "Role, Task, Context, Constraints", "GET, POST, PUT, DELETE", "HTML, CSS, SQL, Bash"], correctIndex: 1, explanation: "Role, Task, Context, and Constraints eliminate ambiguity.", difficulty: "easy" },
        { id: "c1-q3", prompt: "When is few-shot prompting most useful?", options: ["To increase latency", "When you need a specific style or edge-case boundary anchored by examples", "To bypass context limits", "Only for CSS"], correctIndex: 1, explanation: "Few-shot examples anchor formatting and refusal boundaries.", difficulty: "medium" },
        { id: "c1-q4", prompt: "What reliably prevents fabricated facts in Q&A?", options: ["Temperature 1.8", "Source grounding + explicit abstention rule", "Removing constraints", "All-caps prose"], correctIndex: 1, explanation: "Grounding with abstention prevents guessing.", difficulty: "medium" },
        { id: "c1-q5", prompt: "Why put 'reasoning' before 'decision' in a JSON schema?", options: ["Compresses JSON", "Sequential generation conditions the final decision on reasoning tokens", "Skips tokenization", "Caches CSS"], correctIndex: 1, explanation: "Autoregressive models condition later tokens on earlier ones.", difficulty: "hard" },
      ],
    },
  },

  {
    id: "c2",
    slug: "building-with-llm-apis",
    title: "Building with LLM APIs",
    subtitle: "Integrate streaming responses, structured tool calling, and resilient error handling in production.",
    category: "AI Engineering",
    level: "Intermediate",
    durationHours: 6.0,
    rating: 4.9,
    learnersCount: 2180,
    coverImage: "/images/courses/rag-systems.jpg",
    accentColor: "#7C5CFF",
    instructor: { name: "Meera Subramanian", role: "Principal AI Platform Architect", bio: "Designed high-throughput inference gateways serving 40M+ daily API requests." },
    outcomes: [
      "Configure system, user, and assistant message roles plus sampling parameters",
      "Stream real-time token responses to the UI using Server-Sent Events",
      "Define JSON tool schemas and execute bounded tool-calling loops safely",
      "Implement exponential backoff with jitter, timeouts, and token budgets",
    ],
    tags: ["APIs", "Streaming", "Tool Calling"],
    modules: [
      expandModule("c2", 1, "Module 1: API Core & Streaming", [
        L("c2-m1-l1", "Messages Array & System Prompts", 12, "Stateless LLM APIs take an ordered messages array with system, user, and assistant roles.", "Always proxy API keys through a server route so credentials never leak in browser bundles.", "Keep keys server-side and pass explicit message roles.", "javascript", `messages: [{ role: "system", content: "Be concise." }, { role: "user", content: "Audit this." }]`),
        L("c2-m1-l2", "Temperature, Top-P & Max Tokens", 11, "Use temperature 0.0–0.2 for deterministic JSON/code and cap max_tokens to protect latency.", "Tune either temperature or top_p, not both simultaneously.", "Low temperature stabilizes structured extraction.", "javascript", `{ temperature: 0.2, max_tokens: 400 }`),
        L("c2-m1-l3", "Streaming Tokens with SSE", 12, "Streaming via Server-Sent Events delivers the first token in under 400ms for snappy UX.", "Wire AbortController so users navigating away cancel in-flight streams cleanly.", "Stream long responses and handle [DONE] sentinel frames.", "javascript", `const reader = res.body.getReader();`),
      ]),
      expandModule("c2", 2, "Module 2: Tool Calling & Structured Data", [
        L("c2-m2-l1", "Defining JSON Tool Schemas", 14, "Clear tool descriptions and parameter enums prevent invalid model arguments.", "State explicitly in tool descriptions when NOT to call a tool.", "Atomic, well-described schemas yield accurate tool selection.", "javascript", `{ name: "lookupCourse", parameters: { type: "object", required: ["slug"] } }`),
        L("c2-m2-l2", "Executing & Returning Tool Results", 13, "Execute the requested function locally and return a tool-role message with the exact tool_call_id.", "Cap tool-calling loops at a max step budget (e.g. 5 turns) to prevent infinite loops.", "Always link tool outputs with tool_call_id.", "javascript", `messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(res) });`),
        L("c2-m2-l3", "Schema Validation & Repair", 11, "Validate model JSON with Zod or JSON Schema and trigger at most one repair pass on failure.", "Fall back to a safe UI state if repair still fails.", "Validate every structured payload before rendering.", "javascript", `if (!parsed.success) return retryRepair(parsed.error);`),
      ]),
      expandModule("c2", 3, "Module 3: Production Resilience", [
        L("c2-m3-l1", "Retries, Backoff & Jitter", 13, "Retry only transient 429 and 5xx errors using exponential backoff plus random jitter.", "Never retry 400 Bad Request or 401 Unauthorized responses.", "Jitter prevents synchronized thundering-herd retry storms.", "javascript", `const wait = 500 * 2 ** attempt + Math.random() * 250;`),
        L("c2-m3-l2", "Token Budgeting & TTFT Metrics", 11, "Monitor Time to First Token (TTFT) and total tokens per completed task.", "Summarize older turns in long sessions to keep context windows lean.", "Track TTFT and per-session token cost.", "javascript", `const ttftMs = firstTokenAt - startedAt;`),
        L("c2-m3-l3", "Idempotency & Safe Side Effects", 10, "Attach idempotency keys to mutating tool calls so network retries never duplicate actions.", "Require explicit confirmation for destructive or external actions.", "Protect mutating endpoints with idempotency keys.", "javascript", `sendAlert({ idempotencyKey: requestId });`),
      ]),
    ],
    quiz: {
      id: "c2-quiz", passingScore: 70, timeLimitSec: 300,
      questions: [
        { id: "c2-q1", prompt: "Which temperature range is best for deterministic JSON extraction?", options: ["0.0 to 0.2", "0.8 to 1.0", "1.5 to 2.0", "No effect"], correctIndex: 0, explanation: "Low temperatures concentrate probability on top tokens.", difficulty: "easy" },
        { id: "c2-q2", prompt: "Why keep LLM API keys out of browser code?", options: ["Browsers block JSON", "Visitors can inspect bundles and steal keys", "HTTPS strips keys", "Keys expire in 5s"], correctIndex: 1, explanation: "Client code is public; proxy keys server-side.", difficulty: "easy" },
        { id: "c2-q3", prompt: "Which status codes should trigger exponential backoff?", options: ["400 & 401", "429 & 5xx", "200 OK", "404"], correctIndex: 1, explanation: "429 and 5xx are transient server/rate errors.", difficulty: "medium" },
        { id: "c2-q4", prompt: "What links a tool output back to the model's call?", options: ["CSS class", "tool_call_id", "New system prompt", "Password hash"], correctIndex: 1, explanation: "tool_call_id pairs each tool result with its request.", difficulty: "medium" },
        { id: "c2-q5", prompt: "Why add random jitter to backoff delays?", options: ["Compress SSE", "Prevent synchronized thundering-herd retry storms", "Increase max_tokens", "Skip validation"], correctIndex: 1, explanation: "Jitter spreads retry timestamps across clients.", difficulty: "hard" },
      ],
    },
  },

  {
    id: "c3",
    slug: "web-security-essentials",
    title: "Web Security Essentials",
    subtitle: "Defend modern web applications against XSS, SQL injection, CSRF, and broken access control.",
    category: "Cybersecurity",
    level: "Beginner",
    durationHours: 5.0,
    rating: 4.8,
    learnersCount: 2890,
    coverImage: "/images/courses/owasp-appsec.jpg",
    accentColor: "#14B8A6",
    instructor: { name: "Rohan Deshmukh", role: "Lead Application Security Engineer", bio: "Conducts threat modeling, penetration tests, and developer security training." },
    outcomes: [
      "Explain the CIA triad and map trust boundaries in web architectures",
      "Prevent Cross-Site Scripting (XSS) with safe DOM APIs and CSP",
      "Stop SQL Injection using parameterized queries",
      "Implement HttpOnly/SameSite cookies, Argon2id hashing, and IDOR checks",
    ],
    tags: ["OWASP", "AppSec", "XSS"],
    modules: [
      expandModule("c3", 1, "Module 1: Threat Foundations", [
        L("c3-m1-l1", "The CIA Triad & Attack Surfaces", 10, "Every control maps to Confidentiality, Integrity, or Availability.", "Client-side validation improves UX, while server-side validation enforces security.", "Shrink your attack surface by removing unused endpoints.", "text", `CIA = Confidentiality + Integrity + Availability`),
        L("c3-m1-l2", "HTTPS, TLS & HSTS", 11, "TLS encrypts data in transit and verifies server identity via X.509 certificates.", "Enable Strict-Transport-Security (HSTS) to block plain HTTP downgrades.", "Serve 100% of pages and assets over HTTPS.", "text", `Strict-Transport-Security: max-age=31536000; includeSubDomains`),
        L("c3-m1-l3", "Essential HTTP Security Headers", 10, "Ship X-Content-Type-Options: nosniff, Referrer-Policy, and frame-ancestors directives.", "Security headers block MIME-sniffing and clickjacking at the edge.", "Audit response headers in DevTools before launch.", "text", `X-Content-Type-Options: nosniff`),
      ]),
      expandModule("c3", 2, "Module 2: Injection & Client-Side Attacks", [
        L("c3-m2-l1", "Preventing Cross-Site Scripting (XSS)", 13, "Never pass untrusted user strings to innerHTML; use textContent or framework auto-escaping.", "Sanitize rich HTML with DOMPurify and pair with a strict Content-Security-Policy.", "Treat untrusted input strictly as plain text.", "javascript", `bioEl.textContent = untrustedBio;`),
        L("c3-m2-l2", "Parameterized Queries Against SQLi", 12, "Prepared statements send SQL structure and parameter values separately.", "Bound parameters can never alter query syntax.", "Zero string-concatenated SQL anywhere in the codebase.", "javascript", `await db.query("SELECT id FROM users WHERE email = $1", [email]);`),
        L("c3-m2-l3", "SameSite Cookies & CSRF Defense", 10, "Combine SameSite=Lax cookies with anti-CSRF tokens on state-changing routes.", "Never mutate server state inside GET handlers.", "Use SameSite + CSRF tokens on mutating endpoints.", "javascript", `res.cookie("sid", tok, { httpOnly: true, secure: true, sameSite: "lax" });`),
      ]),
      expandModule("c3", 3, "Module 3: Auth & Access Control", [
        L("c3-m3-l1", "Password Hashing with Argon2id", 12, "Fast hashes like MD5 or SHA-256 are unsafe for passwords; use memory-hard Argon2id.", "Pair strong hashing with sliding-window login rate limits.", "Always salt and hash passwords with Argon2id.", "javascript", `await argon2.hash(password, { type: argon2.argon2id });`),
        L("c3-m3-l2", "Server-Side Ownership Checks (IDOR)", 11, "Broken Access Control is #1 on OWASP. Always verify resource ownership against the session user.", "Hiding UI buttons or Base64-encoding IDs never stops IDOR.", "Scope every query to both record ID and session.userId.", "javascript", `db.invoices.findFirst({ where: { id: req.params.id, ownerId: session.userId } });`),
        L("c3-m3-l3", "Generic Auth Errors & Rate Limits", 10, "Return identical generic errors ('Invalid credentials') so attackers cannot enumerate emails.", "Rate limit login, OTP, and password-reset routes per IP and account.", "Prevent account enumeration with uniform responses.", "javascript", `return res.status(401).json({ error: "Invalid credentials" });`),
      ]),
    ],
    quiz: {
      id: "c3-quiz", passingScore: 70,
      questions: [
        { id: "c3-q1", prompt: "What does the CIA triad stand for?", options: ["Code, Input, API", "Confidentiality, Integrity, Availability", "Cookies, Identity, Auth", "Cache, Index, Array"], correctIndex: 1, explanation: "Confidentiality, Integrity, and Availability.", difficulty: "easy" },
        { id: "c3-q2", prompt: "Which DOM property safely renders plain text?", options: ["innerHTML", "outerHTML", "textContent", "document.write"], correctIndex: 2, explanation: "textContent never parses HTML.", difficulty: "easy" },
        { id: "c3-q3", prompt: "Why do parameterized queries stop SQL injection?", options: ["Encrypts disk", "Binds input strictly as data, not SQL syntax", "Disables WHERE", "Runs in CSS"], correctIndex: 1, explanation: "Prepared statements separate SQL from data.", difficulty: "medium" },
        { id: "c3-q4", prompt: "Which cookie flag blocks JavaScript access?", options: ["HttpOnly", "Max-Age", "Path=/", "Domain"], correctIndex: 0, explanation: "HttpOnly blocks document.cookie.", difficulty: "medium" },
        { id: "c3-q5", prompt: "How do you fix an IDOR vulnerability?", options: ["Base64-encode IDs", "Verify ownership against the authenticated session server-side", "Hide UI buttons", "Switch GET to POST"], correctIndex: 1, explanation: "Server-side ownership verification stops IDOR.", difficulty: "hard" },
      ],
    },
  },

  {
    id: "c4",
    slug: "cloud-iam-zero-trust",
    title: "Cloud IAM, Zero Trust & Threat Modeling",
    subtitle: "Apply STRIDE threat modeling, least-privilege IAM policies, and short-lived workload identity.",
    category: "Cybersecurity",
    level: "Advanced",
    durationHours: 7.0,
    rating: 4.8,
    learnersCount: 1450,
    coverImage: "/images/courses/zero-trust.jpg",
    accentColor: "#14B8A6",
    instructor: { name: "Kabir Sen", role: "Principal Cloud Security Architect", bio: "Builds zero-trust workload identity and threat modeling programs for cloud-native teams." },
    outcomes: [
      "Run structured STRIDE threat models across data-flow trust boundaries",
      "Write least-privilege IAM policies without wildcard traps",
      "Replace static CI/CD keys with short-lived OIDC federation",
      "Design tamper-evident security audit logs and rotation runbooks",
    ],
    tags: ["Zero Trust", "IAM", "STRIDE"],
    modules: [
      expandModule("c4", 1, "Module 1: Threat Modeling with STRIDE", [
        L("c4-m1-l1", "Data Flow Diagrams & Trust Boundaries", 14, "Map processes, data stores, external actors, and every line crossing a trust boundary.", "Every boundary crossing requires authentication, validation, and audit logging.", "Draw trust boundaries before writing service code.", "text", `[Browser] --HTTPS/JWT--> |Boundary| --> [API] --> [DB]`),
        L("c4-m1-l2", "Applying STRIDE Per Component", 15, "STRIDE covers Spoofing, Tampering, Repudiation, Information Disclosure, DoS, and Elevation of Privilege.", "Walk each category systematically against every trust boundary.", "Pair each identified threat with a concrete mitigation.", "javascript", `// Verify HMAC-SHA256 webhook signature to stop Tampering`),
        L("c4-m1-l3", "Prioritizing by Blast Radius", 12, "Score risks by likelihood × impact and fix high-blast-radius identity paths first.", "Document accepted assumptions explicitly.", "Focus engineering time on high-impact exposure paths.", "javascript", `const riskScore = likelihood * impact;`),
      ]),
      expandModule("c4", 2, "Module 2: Least-Privilege Cloud IAM", [
        L("c4-m2-l1", "Eliminating Wildcard Permissions", 14, "Wildcard Action: '*' policies turn any compromised service into an admin account.", "Scope actions to exact verbs and specific resource ARN prefixes.", "Never ship wildcard admin policies to production workloads.", "json", `{ "Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::exports/*" }`),
        L("c4-m2-l2", "Keyless CI/CD with OIDC Federation", 15, "Replace static long-lived IAM keys with short-lived OIDC tokens issued per CI job.", "Ephemeral 15-minute tokens eliminate static secret sprawl.", "Use OIDC federation instead of static CI secrets.", "yaml", `permissions:
  id-token: write
  contents: read`),
        L("c4-m2-l3", "Service-to-Service mTLS", 13, "Zero Trust assumes internal networks are untrusted; mutual TLS verifies both client and server certs.", "Automate short-lived certificate rotation across services.", "Verify identity on every internal RPC call.", "javascript", `tls.createServer({ cert, key, ca, requestCert: true });`),
      ]),
      expandModule("c4", 3, "Module 3: Detection & Incident Readiness", [
        L("c4-m3-l1", "Tamper-Evident Audit Logging", 12, "Log actor, action, timestamp, source IP, and correlation ID—never log raw passwords or tokens.", "Stream logs to an append-only security bucket.", "Audit logs must be complete yet free of secrets.", "javascript", `logger.warn({ event: "auth_failed", userId, requestId });`),
        L("c4-m3-l2", "Detecting Anomalous Token Usage", 13, "Alert on impossible travel, permission enumeration bursts, or off-hours role assumptions.", "Pair alerts with clear on-call runbooks.", "Detect credential misuse early via behavioral rules.", "javascript", `if (event === "AssumeRole" && !isTrustedCIDR(ip)) alertSecOps();`),
        L("c4-m3-l3", "Rapid Credential Rotation Drills", 11, "Practice 15-minute secret revocation before an incident occurs.", "Protect break-glass admin accounts with hardware MFA.", "Automate key rotation and test revocation quarterly.", "text", `aws iam update-access-key --status Inactive`),
      ]),
    ],
    quiz: {
      id: "c4-quiz", passingScore: 70,
      questions: [
        { id: "c4-q1", prompt: "What does the 'E' in STRIDE stand for?", options: ["Encryption", "Elevation of Privilege", "Endpoint", "Enumeration"], correctIndex: 1, explanation: "Elevation of Privilege.", difficulty: "easy" },
        { id: "c4-q2", prompt: "Why prefer OIDC federation over static IAM keys in CI/CD?", options: ["OIDC tokens are short-lived and eliminate static secrets", "Skips auth", "Works without HTTPS", "Faster CSS"], correctIndex: 0, explanation: "OIDC issues ephemeral scoped tokens per job.", difficulty: "easy" },
        { id: "c4-q3", prompt: "What is Zero Trust's core assumption?", options: ["Internal traffic is always safe", "Verify every request regardless of network location", "Firewalls stop everything", "Only external users need MFA"], correctIndex: 1, explanation: "Never trust implicitly; always verify.", difficulty: "medium" },
        { id: "c4-q4", prompt: "What must NEVER appear in audit logs?", options: ["Correlation IDs", "Timestamps", "Raw passwords or tokens", "Event names"], correctIndex: 2, explanation: "Never log secrets.", difficulty: "medium" },
        { id: "c4-q5", prompt: "In mTLS, who presents a certificate?", options: ["Server only", "Client only", "Both client and server", "Neither"], correctIndex: 2, explanation: "Mutual TLS authenticates both sides.", difficulty: "hard" },
      ],
    },
  },

  {
    id: "c5",
    slug: "design-systems-token-architecture",
    title: "Design Systems & Token Architecture",
    subtitle: "Build scalable multi-theme UI foundations using semantic design tokens and composable primitives.",
    category: "Product Design",
    level: "Beginner",
    durationHours: 4.5,
    rating: 4.9,
    learnersCount: 2640,
    coverImage: "/images/courses/design-systems.jpg",
    accentColor: "#FF6B5E",
    instructor: { name: "Nandini Kulkarni", role: "Staff Design Systems Architect", bio: "Built multi-brand design token pipelines shared across web and mobile product teams." },
    outcomes: [
      "Structure primitive, semantic, and component token tiers",
      "Build light and dark themes without duplicating component CSS",
      "Verify WCAG AA contrast pairs across both themes",
      "Document spacing, elevation, and interactive states for engineering handoff",
    ],
    tags: ["Design Tokens", "UI Systems", "Theming"],
    modules: [
      expandModule("c5", 1, "Module 1: Token Hierarchy & Color", [
        L("c5-m1-l1", "Primitive vs Semantic Tokens", 12, "Primitives name raw values (--indigo-600); semantic tokens name intent (--bg-surface, --text-primary).", "Themes swap cleanly by redefining semantic tokens at the root.", "Decouple component CSS from raw hex values.", "css", `:root { --bg-surface: #FAFAFD; }
.dark { --bg-surface: #0E0E1A; }`),
        L("c5-m1-l2", "WCAG AA Contrast Pairing", 14, "Body text requires >= 4.5:1 contrast; large text and UI controls require >= 3:1.", "Test every semantic pair in both light and dark modes—bright amber on white often fails AA!", "Always verify contrast ratios before shipping tokens.", "text", `#14142B on #FAFAFD = 16.4:1 (AAA)`),
        L("c5-m1-l3", "Fluid Typography Scales", 11, "Use clamp() for display headings and maintain 1.5–1.65 line-height for body copy.", "Clear type hierarchy replaces heavy decorative borders.", "Pair expressive display headings with legible body sans.", "css", `h1 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.15; }`),
      ]),
      expandModule("c5", 2, "Module 2: Composable UI Primitives", [
        L("c5-m2-l1", "5 Interactive Component States", 12, "Every control needs default, hover, active, focus-visible, and disabled states.", "Use :focus-visible so keyboard users get crisp rings without mouse-click clutter.", "Never remove focus outlines without a high-contrast replacement.", "css", `.btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }`),
        L("c5-m2-l2", "4px/8px Spatial Grids", 11, "Consistent spacing tokens (4, 8, 12, 16, 24, 32px) create visual rhythm.", "Avoid arbitrary one-off pixel margins.", "Stick to a shared 4px spatial scale.", "javascript", `const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };`),
        L("c5-m2-l3", "Dark Mode Elevation Stepping", 12, "In dark mode, drop shadows disappear—use subtle surface lightness steps and 1px borders.", "Keep borders crisp (#2A2A44) so cards separate cleanly.", "Use surface stepping + 1px borders in dark mode.", "css", `.dark .card { background: #17172A; border: 1px solid #2A2A44; }`),
      ]),
      expandModule("c5", 3, "Module 3: Governance & Handoff", [
        L("c5-m3-l1", "Figma Variables to CSS", 12, "Mirror Figma variable names 1:1 with CSS custom properties.", "Shared naming eliminates handoff translation errors.", "Keep design and code token names identical.", "text", `tokens.json -> CSS custom properties`),
        L("c5-m3-l2", "Composition Over Mega-Props", 11, "Prefer composable slots (<Card><CardHeader /></Card>) over 20 boolean props.", "Composition scales cleanly as layouts evolve.", "Build small, composable UI primitives.", "javascript", `<Card><CardHeader /><CardBody /></Card>`),
        L("c5-m3-l3", "Do/Don't Component Docs", 10, "Show interactive states, keyboard maps, and concrete Do/Don't examples.", "Docs should answer 'when should I use this?' in 10 seconds.", "Document accessibility alongside visual specs.", "text", `Spec: Props + Keyboard Map + Contrast Check`),
      ]),
    ],
    quiz: {
      id: "c5-quiz", passingScore: 70,
      questions: [
        { id: "c5-q1", prompt: "Why use semantic tokens like --bg-surface over raw hex values?", options: ["Larger CSS", "Allows theme switching without rewriting components", "Safari only", "Disables dark mode"], correctIndex: 1, explanation: "Semantic tokens decouple intent from raw colors.", difficulty: "easy" },
        { id: "c5-q2", prompt: "Minimum WCAG AA contrast ratio for normal body text?", options: ["1.5:1", "2.5:1", "4.5:1", "10:1"], correctIndex: 2, explanation: "WCAG AA requires 4.5:1 for normal text.", difficulty: "easy" },
        { id: "c5-q3", prompt: "How should elevation be shown in dark mode?", options: ["Heavy black shadows", "Subtle surface lightness steps and 1px borders", "Neon glow", "Zero padding"], correctIndex: 1, explanation: "Surface stepping + crisp 1px borders work best on dark surfaces.", difficulty: "medium" },
        { id: "c5-q4", prompt: "Which pseudo-class targets keyboard focus cleanly?", options: [":hover", ":focus-visible", ":visited", ":first-child"], correctIndex: 1, explanation: ":focus-visible highlights keyboard navigation.", difficulty: "medium" },
        { id: "c5-q5", prompt: "Why prefer component composition over 20 boolean props?", options: ["Prevents API bloat and improves flexibility", "Disables JS", "Breaks Grid", "Requires jQuery"], correctIndex: 0, explanation: "Composition scales cleanly.", difficulty: "hard" },
      ],
    },
  },

  {
    id: "c6",
    slug: "accessible-ux-micro-interactions",
    title: "Accessible UX & Micro-Interactions",
    subtitle: "Craft interfaces that feel effortless for everyone—combining semantic HTML, keyboard flow, and motion care.",
    category: "Product Design",
    level: "Intermediate",
    durationHours: 5.0,
    rating: 4.8,
    learnersCount: 1910,
    coverImage: "/images/courses/accessible-ux.jpg",
    accentColor: "#FF6B5E",
    instructor: { name: "Rohan Chatterjee", role: "Lead Product Designer", bio: "Specializes in inclusive interaction design, WCAG auditing, and tactile micro-interactions." },
    outcomes: [
      "Design quiz, error, and status states that never rely on color alone",
      "Build keyboard-navigable modals, drawers, and focus traps",
      "Respect prefers-reduced-motion across all animations",
      "Craft ethical gamification and helpful empty states",
    ],
    tags: ["Accessibility", "UX", "Micro-Interactions"],
    modules: [
      expandModule("c6", 1, "Module 1: Inclusive Visual Design", [
        L("c6-m1-l1", "Never Rely on Color Alone", 13, "Always pair red/green status colors with icons (✓ / ✕), text labels, or border patterns.", "1 in 12 men experience color vision deficiency—labels make feedback unambiguous.", "Color + Icon + Text = accessible status.", "html", `<span class="text-emerald-600">✓ Correct</span>`),
        L("c6-m1-l2", "Skeletons & Thoughtful Empty States", 12, "Use layout-matched skeleton shimmers while loading and clear recovery CTAs on empty screens.", "Empty states should explain why it's empty and offer one primary action.", "Never leave users staring at a blank white box.", "text", `Empty State = Illustration + Reason + Next Action`),
        L("c6-m1-l3", "44px Touch Targets & Thumb Zones", 11, "Keep mobile tap targets at least 44×44px and place core navigation in the bottom thumb zone.", "Generous spacing prevents accidental mis-taps.", "Design mobile-first for comfortable thumb reach.", "css", `.tap { min-width: 44px; min-height: 44px; }`),
      ]),
      expandModule("c6", 2, "Module 2: Keyboard & Screen Readers", [
        L("c6-m2-l1", "Semantic Landmarks & Buttons", 13, "Use header, main, nav, and native button elements before reaching for clickable divs.", "Screen reader users navigate rapidly by landmarks and headings.", "Native HTML gives keyboard and ARIA support for free.", "html", `<button type="button" aria-expanded="true">Module 1</button>`),
        L("c6-m2-l2", "ARIA Live Regions for Toasts & Timers", 12, "Use aria-live='polite' so dynamic XP toasts and timer warnings announce without stealing focus.", "Keep live announcements concise and timely.", "Announce dynamic updates politely via aria-live.", "html", `<div aria-live="polite">+20 XP earned</div>`),
        L("c6-m2-l3", "Modal Focus Trap & Restore", 14, "Move focus inside modals on open, allow Escape to close, and restore focus to the trigger button.", "Restoring focus keeps keyboard users from losing their place.", "Capture activeElement before opening any modal.", "javascript", `if (e.key === "Escape") { closeModal(); lastFocusEl?.focus(); }`),
      ]),
      expandModule("c6", 3, "Module 3: Purposeful Motion", [
        L("c6-m3-l1", "Timing, Easing & Tactile Feedback", 12, "Transitions between 150ms and 280ms with ease-out curves feel crisp and responsive.", "Avoid sluggish 600ms+ animations on frequent UI controls.", "Keep UI transitions snappy (180–260ms).", "css", `transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);`),
        L("c6-m3-l2", "Respecting prefers-reduced-motion", 11, "Wrap decorative animations and confetti in prefers-reduced-motion checks.", "Provide instant static fallbacks for motion-sensitive users.", "Always honor OS reduced-motion preferences.", "css", `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }`),
        L("c6-m3-l3", "Ethical EdTech Gamification", 12, "Celebrate genuine mastery (streaks, badges, certificates) without dark patterns or artificial locks.", "Make learning feel encouraging, never punitive.", "Reward consistency and mastery transparently.", "text", `Reward mastery, never punish exploration.`),
      ]),
    ],
    quiz: {
      id: "c6-quiz", passingScore: 70,
      questions: [
        { id: "c6-q1", prompt: "Why pair quiz colors with icons and labels?", options: ["Supports colorblind users and screen readers", "Increases CSS size", "Safari only", "Hides answers"], correctIndex: 0, explanation: "Never convey status by color alone.", difficulty: "easy" },
        { id: "c6-q2", prompt: "Recommended minimum touch target size on mobile?", options: ["16px", "24px", "44px", "100px"], correctIndex: 2, explanation: "44×44px prevents mis-taps.", difficulty: "easy" },
        { id: "c6-q3", prompt: "Which attribute announces dynamic toasts politely?", options: ["aria-hidden", "aria-live='polite'", "tabindex='-1'", "role='presentation'"], correctIndex: 1, explanation: "aria-live='polite' queues announcements.", difficulty: "medium" },
        { id: "c6-q4", prompt: "Which media query detects reduced-motion preferences?", options: ["prefers-color-scheme", "prefers-reduced-motion", "min-width", "orientation"], correctIndex: 1, explanation: "prefers-reduced-motion honors OS motion settings.", difficulty: "medium" },
        { id: "c6-q5", prompt: "What should happen when a modal closes?", options: ["Focus stays lost", "Focus returns to the trigger element", "Page reloads", "Navbar hides"], correctIndex: 1, explanation: "Restore focus to the element that opened the modal.", difficulty: "hard" },
      ],
    },
  },
];

export default courses;
