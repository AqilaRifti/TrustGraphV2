import Cerebras from "@cerebras/cerebras_cloud_sdk";

const API_KEYS = [
  "csk-c9ddc69fd3pk9jj3py24jmhydft6c2ymmdk59tyt6em6derk",
  "csk-nrtfnn56xmvkyckdt9nwn3rh8ef8vwx9xxktvxwmk6yxw566",
  "csk-hrtwc24p9mtw48m4dmvf95j4xx539nth4y63wxympjhkdhfp",
  "csk-4r22m82n6pve9ywhd9hkpdneek6t52keethr5dn66jpw6fyw",
  "csk-wp589vwjn2hfhnxhv9rwyj54tnpexc6yfxev5en9x6ffej5m",
  "csk-6232phepe8nxn25vrwjenf2p9mpke9txvw6pjjd6jx8reh2n",
  "csk-4f9vfnrkmd898h5dyr98y8j2ftnjhvhee322mvy8tmhnfthh",
  "csk-mennk8jmdnxptr4r56xv9mc95t9vwjpwhhnr54jhp4382wjt",
];

let currentKeyIndex = 0;
let currentClient: Cerebras | null = null;
let requestCounts: number[] = new Array(API_KEYS.length).fill(0);

function getNextClient(): Cerebras {
  // Find the key with the lowest request count (round-robin with load balancing)
  const minCount = Math.min(...requestCounts);
  currentKeyIndex = requestCounts.indexOf(minCount);

  currentClient = new Cerebras({ apiKey: API_KEYS[currentKeyIndex] });
  requestCounts[currentKeyIndex]++;

  return currentClient;
}

export function getCerebrasClient(): Cerebras {
  if (currentClient) return currentClient;
  return getNextClient();
}

export function rotateKey(): Cerebras {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  currentClient = new Cerebras({ apiKey: API_KEYS[currentKeyIndex] });
  requestCounts[currentKeyIndex]++;
  return currentClient;
}

export function getKeyStats() {
  return API_KEYS.map((key, i) => ({
    key: key.slice(0, 12) + "...",
    requests: requestCounts[i],
  }));
}

// Retry wrapper with key rotation on failure
export async function cerebrasChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    maxCompletionTokens?: number;
    temperature?: number;
    topP?: number;
    stream?: boolean;
  } = {}
) {
  const {
    model = "qwen-3-235b-a22b-instruct-2507",
    maxCompletionTokens = 65536,
    temperature = 0.6,
    topP = 0.95,
    stream = false,
  } = options;

  let lastError: Error | null = null;

  // Try each key until one works
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const client = i === 0 ? getCerebrasClient() : rotateKey();
      const response = await client.chat.completions.create({
        messages: messages as any,
        model,
        stream,
        max_completion_tokens: maxCompletionTokens,
        temperature,
        top_p: topP,
      });
      return response;
    } catch (error: any) {
      lastError = error;
      console.warn(`Cerebras key ${i + 1} failed:`, error.message);
      // Continue to next key
    }
  }

  throw new Error(`All Cerebras API keys exhausted. Last error: ${lastError?.message}`);
}

export async function generateTrustExplanation(
  tokenName: string,
  tokenSymbol: string,
  score: number,
  tier: string,
  flags: Array<{ type: string; severity: string; description: string }>,
  holderCount: number,
  liquidityUsd: number,
  deployerReputation: number,
  rugCount: number
) {
  const systemPrompt = `You are TrustGraph AI, a specialized blockchain security analyst. Analyze the provided token data and generate a concise risk assessment in plain English. Be direct and actionable. Format your response as a single paragraph explanation, followed by "KEY_CONCERNS:" on a new line with bullet points, then "POSITIVE_SIGNALS:" on a new line with bullet points, then "RECOMMENDATION:" on a new line with a single actionable sentence.`;

  const flagsText = flags.length > 0
    ? flags.map((f) => `- [${f.severity}] ${f.type}: ${f.description}`).join("\n")
    : "No risk flags detected.";

  const userPrompt = `Analyze this token:
Name: ${tokenName} (${tokenSymbol})
Trust Score: ${score}/100 (Tier: ${tier})
Holders: ${holderCount}
Liquidity: $${liquidityUsd.toFixed(0)}
Deployer Reputation: ${deployerReputation}/100
Deployer Rug Count: ${rugCount}

Risk Flags:
${flagsText}

Provide your analysis.`;

  const response = await cerebrasChatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ], {
    maxCompletionTokens: 4096,
    temperature: 0.6,
    stream: false, // Explicitly set to false to ensure we get ChatCompletion type
  });

  // Type guard: ensure response is not a stream and has choices
  if (!response || !('choices' in response) || !Array.isArray(response.choices)) {
    throw new Error("Invalid response from Cerebras API");
  }

  const text = ((response.choices[0]?.message?.content || "") as string);

  // Parse the response
  const explanation = text.split("KEY_CONCERNS:")[0]?.trim() || text;
  const concernsMatch = text.match(/KEY_CONCERNS:?\s*([\s\S]*?)(?=POSITIVE_SIGNALS:|RECOMMENDATION:|$)/);
  const positivesMatch = text.match(/POSITIVE_SIGNALS:?\s*([\s\S]*?)(?=RECOMMENDATION:|$)/);
  const recommendationMatch = text.match(/RECOMMENDATION:?\s*([\s\S]*)/);

  const keyConcerns = concernsMatch
    ? concernsMatch[1].split("\n").filter((s) => s.trim().startsWith("-") || s.trim().startsWith("•")).map((s) => s.replace(/^[\s\-•]+/, "").trim())
    : [];

  const positiveSignals = positivesMatch
    ? positivesMatch[1].split("\n").filter((s) => s.trim().startsWith("-") || s.trim().startsWith("•")).map((s) => s.replace(/^[\s\-•]+/, "").trim())
    : [];

  const recommendation = recommendationMatch
    ? recommendationMatch[1].trim()
    : score >= 75 ? "This token shows strong trust signals. Consider as a potential opportunity." :
      score >= 50 ? "Proceed with caution. Monitor for changes in risk profile." :
        "High risk detected. Consider avoiding or minimal exposure.";

  return {
    explanation,
    keyConcerns: keyConcerns.length > 0 ? keyConcerns : undefined,
    positiveSignals: positiveSignals.length > 0 ? positiveSignals : undefined,
    recommendation,
    raw: text,
  };
}
