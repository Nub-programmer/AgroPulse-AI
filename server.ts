import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load local environment variables if available
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parse middleware
app.use(express.json());

// Initialize Gemini Client Lazily if key is present
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. Falling back to offline dispatcher advisory.");
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", engine: "AgroPulse AI Server Core" });
});

// Direct endpoint to generate Executive Dispatch advisory using Gemini
app.post("/api/advisory", async (req, res) => {
  try {
    const { metrics, activeQueueSize, routes, simulationActive } = req.body;

    const formattedRoutes = (routes || [])
      .map((r: any) => `- Root ${r.id}: ${r.source} to ${r.destination} | Risk: ${r.currentRisk}% | Status: ${r.status}`)
      .join("\n");

    const promptText = `
You are the AgroPulse AI Expert Dispatch Advisor, an advanced automated system for Indian rural cooperatives.
A monsoon climate disruption simulation may be currently active. Based on the real-time operational payload below, provide a highly action-oriented, professional, and dense summary to assist dispatch managers.

OPERATIONAL PARAMETERS:
- Monsoon Shock Mode: ${simulationActive ? "ACTIVE (HEAVY DISRUPTION)" : "NORMAL / REGULAR OPERATIONS"}
- Spoilage Risk Metric: ${metrics?.spoilageRisk || 14}%
- Active Fleet Utilization: ${metrics?.fleetUtilization || 45}%
- Active Logistics Requests: ${activeQueueSize || 4}
- Safe Reroutes Completed: ${metrics?.safeReroutes || 0}

ROUTE STATUS ENTRIES:
${formattedRoutes || "No active routes monitored."}

INSTRUCTIONS:
1. Provide a professional, concise executive advisory strictly between 2 to 4 sentences.
2. Maintain an operational, urgent but calculated tone suitable for dispatchers facing severe weather.
3. Suggest specific priorities (e.g., focusing on critical requests, optimizing vehicle payloads, rerouting trucks from flooded pathways, or dry-storing vulnerable onion/tomato yields in local concrete silos).
4. Do NOT output markdown headers, intro filler like "Here is the advisory", or long essays. Go straight to the points.
`;

    const client = getGeminiClient();
    if (!client) {
      // High quality fallback advisory matching the state
      const fallbackAdvisory = simulationActive 
        ? `[FALLBACK OFFICE ADVISORY] Storm shock simulation is active. Critical hazard identified on flooded route nodes. Immediately suspend Eicher transport on standard pathways and execute rerouting through central bypassed state corridors. Prioritize salvage of highly shelf-vulnerable tomato yields over rice, and deploy rural dispatch fleet ID TA-P4 into high-elevation silos.`
        : `[FALLBACK OFFICE ADVISORY] Weather conditions clear. Base spoilage risk low at ${metrics?.spoilageRisk}%. Maintain active transport schedules with focus on bulk clearing onion harvests. Fleet capacity is standing by; standard cooperative routing limits remain unchanged.`;

      return res.json({
        advisory: fallbackAdvisory,
        source: "local-fallback-engine",
        message: "Gemini API key is not configured. Displaying high-fidelity local simulation output."
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    const text = response.text || "No response received from model.";
    return res.json({
      advisory: text.trim(),
      source: "gemini-3.5-flash"
    });
  } catch (error: any) {
    console.error("Gemini invocation failed, returning standard operational fallback.", error);
    return res.json({
      advisory: `[EMERGENCY BACKUP ADVISORY] Severe grid communication disruption. Operational stats alert high danger. Redirect transit drivers to concrete shelter nodes immediately and hold all pending village dispatches until route verification is cleared locally.`,
      source: "emergency-backup",
      error: error.message
    });
  }
});

// Configure Vite or Static Serve
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with compiled layouts...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgroPulse AI Core server initialized dynamically on port ${PORT}`);
  });
}

serveApp();
