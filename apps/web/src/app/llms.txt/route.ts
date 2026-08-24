import { buildLlmsIndex, MARKDOWN_CONTENT_TYPE } from "@/lib/agent-content";

export const revalidate = false;

export function GET() {
  return new Response(buildLlmsIndex([]), {
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}
