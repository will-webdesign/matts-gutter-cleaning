import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";
import { sendQuoteRequestToOwner } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const result = await sendQuoteRequestToOwner({
    ...parsed.data,
    message: parsed.data.message || undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Could not send your request" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
