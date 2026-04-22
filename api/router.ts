import { authRouter } from "./auth-router";
import { tokenRouter } from "./token-router";
import { walletRouter } from "./wallet-router";
import { scanRouter } from "./scan-router";
import { graphRouter } from "./graph-router";
import { cerebrasRouter } from "./cerebras-router";
import { moralisRouter } from "./moralis-router";
import { createRouter, publicQuery } from "./middleware";

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
