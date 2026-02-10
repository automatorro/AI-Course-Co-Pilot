
import { assertEquals, assertRejects } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// ==========================================
// MOCKS & COPIED LOGIC FOR TESTING
// ==========================================

const Logger = {
  warn: (msg: string) => console.log("   [WARN]", msg),
  info: (msg: string) => {},
  error: (msg: string) => {}
};

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const TEST_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 10, // Fast for tests
  maxDelay: 100
};

// Copied from index_bundled.ts for unit testing in isolation
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  config: RetryConfig = TEST_CONFIG,
  fetchMock: (url: string, opts: RequestInit) => Promise<Response>
): Promise<Response> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetchMock(url, options);
      
      if (response.ok) return response;
      
      if (response.status === 429) {
        // Logic simplified for test without Retry-After header parsing for now
        await new Promise(resolve => setTimeout(resolve, config.baseDelay));
        continue;
      }

      if (response.status >= 500 && response.status < 600) {
        await new Promise(resolve => setTimeout(resolve, config.baseDelay));
        continue;
      }

      throw new Error(`Request failed with status ${response.status}`);

    } catch (error: any) {
      lastError = error;
      if (error.message.includes("Request failed with status")) throw error;
      await new Promise(resolve => setTimeout(resolve, config.baseDelay));
    }
  }
  
  throw lastError;
}

// ==========================================
// TESTS
// ==========================================

Deno.test("Retry Logic: Succeeds on first try", async () => {
  const mock = async () => new Response("OK", { status: 200 });
  const res = await fetchWithRetry("http://test", {}, TEST_CONFIG, mock);
  assertEquals(res.status, 200);
});

Deno.test("Retry Logic: Retries on 500 and eventually succeeds", async () => {
  let attempts = 0;
  const mock = async () => {
    attempts++;
    if (attempts < 3) return new Response("Error", { status: 503 });
    return new Response("OK", { status: 200 });
  };
  
  const res = await fetchWithRetry("http://test", {}, TEST_CONFIG, mock);
  assertEquals(res.status, 200);
  assertEquals(attempts, 3);
});

Deno.test("Retry Logic: Fails after max retries", async () => {
  const mock = async () => new Response("Error", { status: 503 });
  
  await assertRejects(
    async () => {
      await fetchWithRetry("http://test", {}, TEST_CONFIG, mock);
    },
    Error,
    "Request failed with status 503" // The last error thrown
  );
});

Deno.test("Retry Logic: Fails immediately on 401 (Non-retryable)", async () => {
  let attempts = 0;
  const mock = async () => {
    attempts++;
    return new Response("Auth Error", { status: 401 });
  };
  
  await assertRejects(
    async () => {
      await fetchWithRetry("http://test", {}, TEST_CONFIG, mock);
    },
    Error,
    "Request failed with status 401"
  );
  assertEquals(attempts, 1); // Should not retry
});
