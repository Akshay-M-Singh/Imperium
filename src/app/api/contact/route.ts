// Contact form API route — alternate handler.
//
// The primary submission path is a React Server Action (Architecture §1).
// This route is provided for cases that prefer a REST endpoint (e.g. third-
// party integrations). Both paths delegate validation + delivery to
// `@/lib/email` so behaviour stays identical.
//
// Implementation is deferred to Phase 4 of the roadmap.

import { NextResponse } from "next/server";

export async function POST() {
  // TODO(Phase 4): parse form, validate, send via Resend, return result.
  return NextResponse.json({ ok: false, message: "Not implemented" }, { status: 501 });
}
