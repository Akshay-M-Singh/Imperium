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
  // The primary submission path is the React Server Action in
  // src/app/actions/contact.ts. This REST endpoint is kept closed until a
  // third-party integration genuinely needs it (PRD F-1).
  return NextResponse.json({ ok: false, message: "Method not allowed" }, { status: 405 });
}
