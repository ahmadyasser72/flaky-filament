import { getActionContext } from "astro:actions";
import { defineMiddleware } from "astro:middleware";

import { setFlash } from "~/server/flash-message";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const { action, setActionResult, serializeActionResult } =
    getActionContext(context);
  if (action?.calledFrom === "form") {
    const result = await action.handler();
    if (result.error?.message !== undefined) {
      setFlash(context, { message: result.error.message, type: "error" });
    }

    setActionResult(action.name, serializeActionResult(result));
  }

  return next();
});
