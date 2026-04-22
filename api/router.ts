import { authRouter } from "./auth-router.js";
import { tokenRouter } from "./token-router.js";
import { walletRouter } from "./wallet-router.js";
import { scanRouter } from "./scan-router.js";
import { graphRouter } from "./graph-router.js";
import { cerebrasRouter } from "./cerebras-router.js";
import { moralisRouter } from "./moralis-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  token: tokenRouter,
  wallet: walletRouter,
  scan: scanRouter,
  graph: graphRouter,
  cerebras: cerebrasRouter,
  moralis: moralisRouter,
});

export type AppRouter = typeof appRouter;
