import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import SampleFunction from "./sample_function.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester("sample_function");

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/chat.postMessage", () => {
  return new Response(
    `{"ok": true}`,
    {
      status: 200,
    },
  );
});

Deno.test("Create a ticket successfully", async () => {
  const inputs = { 
    title: "Webservices down", 
    description: "AMER region down",
    severity: "high",
    channel: "C01234567"
    user: "U01234567" };
  const { outputs } = await SampleFunction(createContext({ inputs }));
  await assertEquals(
    outputs?.title,
    "Webservices down",
  );
  await assertEquals(
    outputs?.description,
    "AMER region down",
  );
  await assertEquals(
    outputs?.severity,
    "high",
  );
  await assertEquals(
    outputs?.channel,
    "C01234567",
  );
  await assertEquals(
    outputs?.user,
    "U01234567",
  );
});
