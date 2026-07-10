import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin";
import { getResend, resendFrom, adminEmail } from "../../../lib/email";

function formatTimecode(tSeconds: number): string {
  const t = Math.max(0, Math.floor(tSeconds));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

// Review-portal notifications: when one side acts (upload / comment / status),
// email the other side. The caller must send their Firebase ID token; their
// role comes from `_allowlist`, and direction follows from it:
//   admin action  → email the workspace's client contact(s)
//   client action → email the studio (ADMIN_EMAIL)
// If RESEND_API_KEY isn't configured yet, this no-ops with 200 so the portal
// keeps working before the email domain is verified.

type Payload = {
  event: "asset_uploaded" | "version_uploaded" | "comment_added" | "status_changed";
  workspaceId: string;
  assetId: string;
  assetTitle: string;
  versionN?: number;
  commentBody?: string;
  tSeconds?: number | null;
  newStatus?: string;
};

const STATUS_LABELS: Record<string, string> = {
  in_review: "In review",
  approved: "Approved",
  changes_requested: "Changes requested",
};

export async function POST(req: NextRequest) {
  // --- authenticate caller ---
  const authz = req.headers.get("authorization") ?? "";
  const idToken = authz.startsWith("Bearer ") ? authz.slice(7) : null;
  if (!idToken) {
    return NextResponse.json({ error: "missing token" }, { status: 401 });
  }

  let callerEmail: string;
  try {
    const decoded = await adminAuth().verifyIdToken(idToken);
    callerEmail = (decoded.email ?? "").toLowerCase();
    if (!callerEmail) throw new Error("token has no email");
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const body = (await req.json()) as Payload;
  if (!body?.event || !body.workspaceId || !body.assetId || !body.assetTitle) {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  // --- authorize: caller must be an admin or a member of this workspace ---
  const allowSnap = await adminDb().doc(`_allowlist/${callerEmail}`).get();
  if (!allowSnap.exists) {
    return NextResponse.json({ error: "not allowlisted" }, { status: 403 });
  }
  const caller = allowSnap.data() as { role: "admin" | "client"; workspaceId: string };
  if (caller.role !== "admin" && caller.workspaceId !== body.workspaceId) {
    return NextResponse.json({ error: "wrong workspace" }, { status: 403 });
  }

  // --- pick recipients (the counterpart) ---
  let recipients: string[];
  if (caller.role === "admin") {
    const clients = await adminDb()
      .collection("_clients")
      .where("workspaceId", "==", body.workspaceId)
      .get();
    recipients = clients.docs
      .map((d) => (d.data().contactEmail as string) ?? "")
      .filter(Boolean);
  } else {
    recipients = [adminEmail()];
  }
  if (recipients.length === 0) {
    return NextResponse.json({ sent: false, reason: "no recipients" });
  }

  // --- compose ---
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ayni-studios.com";
  const link = `${baseUrl}/workspace/${body.workspaceId}/review/${body.assetId}`;
  let subject = "";
  let detail = "";
  switch (body.event) {
    case "asset_uploaded":
      subject = `New cut ready for review — ${body.assetTitle}`;
      detail = "A new asset is ready for your review.";
      break;
    case "version_uploaded":
      subject = `v${body.versionN} uploaded — ${body.assetTitle}`;
      detail = `Version ${body.versionN} is ready for your review.`;
      break;
    case "comment_added": {
      const at =
        body.tSeconds != null ? ` at ${formatTimecode(body.tSeconds)}` : "";
      subject = `New comment${at} — ${body.assetTitle}`;
      detail = body.commentBody
        ? `"${body.commentBody.slice(0, 300)}"`
        : "A new comment was added.";
      break;
    }
    case "status_changed":
      subject = `${STATUS_LABELS[body.newStatus ?? ""] ?? body.newStatus} — ${body.assetTitle}`;
      detail = `The review status changed to: ${STATUS_LABELS[body.newStatus ?? ""] ?? body.newStatus}.`;
      break;
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;background:#080F11;color:#DCE4EB;padding:32px;border-radius:12px">
      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#FEB040;margin:0 0 12px">Ayni Studios — Review Portal</p>
      <h2 style="margin:0 0 8px;color:#fff">${body.assetTitle}</h2>
      <p style="margin:0 0 20px;color:#DCE4EBcc">${detail}</p>
      <a href="${link}" style="display:inline-block;background:#FEB040;color:#080F11;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:6px">Open in the portal →</a>
      <p style="margin:24px 0 0;font-size:12px;color:#7B878F">You're receiving this because you're part of this project's review loop.</p>
    </div>`;

  // --- send (graceful no-op when Resend isn't configured yet) ---
  if (!process.env.RESEND_API_KEY) {
    console.warn("portal notify: RESEND_API_KEY not set — skipping email", {
      event: body.event,
      recipients,
    });
    return NextResponse.json({ sent: false, reason: "email-not-configured" });
  }

  try {
    await getResend().emails.send({
      from: resendFrom(),
      to: recipients,
      subject,
      html,
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("portal notify: send failed", err);
    return NextResponse.json({ sent: false, reason: "send-failed" }, { status: 502 });
  }
}
