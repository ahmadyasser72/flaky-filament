import type { APIContext } from "astro";
import { actions } from "astro:actions";
import { setFlash } from "~/server/flash-message";

export const handleActionResult = (
  context: APIContext,
  base: string,
  name: keyof typeof actions,
) => {
  const action = actions[name];

  const createResult = context.getActionResult(action.create);
  if (createResult && !createResult.error) {
    setFlash(context, {
      message: `Berhasil menambah ${name} (ID: ${createResult.data.id})`,
      type: "success",
    });
    return context.redirect(base);
  }

  const updateResult = context.getActionResult(action.update);
  if (updateResult && !updateResult.error) {
    setFlash(context, {
      message: `Berhasil menambah ${name} (ID: ${updateResult.data.id})`,
      type: "success",
    });
    return context.redirect(base);
  }

  const deleteResult = context.getActionResult(action.delete);
  if (deleteResult && !deleteResult.error) {
    setFlash(context, {
      message: `${name} berhasil dihapus (ID: ${deleteResult.data.id})`,
      type: "success",
    });
    return context.redirect(base);
  }
};
