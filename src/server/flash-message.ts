import type { APIContext } from "astro";

interface FlashContent {
  message: string;
  type: "success" | "error";
}

const FLASH_COOKIE = "flash-message";

export const setFlash = ({ cookies }: APIContext, content: FlashContent) => {
  cookies.set(FLASH_COOKIE, content, { path: "/" });
};

export const getFlash = ({ cookies }: APIContext) => {
  const content: FlashContent | undefined = cookies.get(FLASH_COOKIE)?.json();
  cookies.delete(FLASH_COOKIE, { path: "/" });
  return content;
};
