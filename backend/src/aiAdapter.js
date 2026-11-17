const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mockGenerate({ topic, audience, tone }) {
  const subject = topic.trim();
  const reader = audience.trim() || "business decision-makers";
  return {
    title: subject.length > 70 ? subject.slice(0, 67) + "..." : subject,
    summary: `A focused content direction for ${reader}, written in a ${tone.toLowerCase()} voice.`,
    ideas: [
      { title: `The practical case for ${subject}`, angle: "Lead with the business problem, then show the operational shift and measurable value." },
      { title: `${subject}: from concept to operating model`, angle: "Explain the transition as a sequence of decisions, trade-offs and implementation steps." },
      { title: `What leaders should ask about ${subject}`, angle: "Frame the topic around evidence, risk, adoption and the questions buyers should ask before committing." }
    ],
    outline: [
      "The problem worth solving",
      "What changes in the operating model",
      "Where value appears first",
      "Risks and implementation guardrails",
      "A practical next step"
    ]
  };
}

export async function generateContent(input, context) {
  const mode = (process.env.AI_MODE || "mock").toLowerCase();
  if (mode === "mock") {
    await sleep(450);
    return { provider: "local-poc-adapter", data: mockGenerate(input) };
  }

  if (mode !== "python") throw new Error("AI_MODE must be mock or python");
  const base = process.env.PYTHON_AI_URL;
  const key = process.env.PYTHON_AI_SERVICE_KEY;
  if (!base || !key) throw new Error("Python AI integration is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/v1/content/ideas`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-service-key": key },
      body: JSON.stringify({ context, input }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Python AI service returned ${response.status}`);
    return { provider: "python-ai-service", data: await response.json() };
  } finally {
    clearTimeout(timer);
  }
}


export async function generateImage(input, context) {
  const base = process.env.IRMA_IMAGE_API_URL || process.env.IRMA_NODE_URL;
  const key = process.env.IRMA_IMAGE_SERVICE_KEY;
  if (!base || !key) throw new Error("IRMA image integration is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 135000);
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/api/integrations/image-generation/generate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-service-key": key },
      body: JSON.stringify({ context, input }),
      signal: controller.signal
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || `IRMA image service returned ${response.status}`);
    return body;
  } finally {
    clearTimeout(timer);
  }
}
