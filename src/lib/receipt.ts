// src/lib/receipt.ts
import type { Registration } from "../types/tournament"
import type { TournamentSettings } from "./tournamentSettings"
import { formatFee } from "./tournamentSettings"
import { escapeHtml } from "./utils"

export function receiptHtml(
  item: Registration,
  settings: TournamentSettings,
) {
  const rowsWithProofs = (
    names: string[],
    start: number,
    proofOffset: number,
  ) =>
    names
      .map((name, i) => {
        const proof = item.playerProofs?.[proofOffset + i]
        const proofLabel = proof?.name ? escapeHtml(proof.name) : "Not provided"
        return `<tr><td>${start + i}</td><td>${escapeHtml(
          name,
        )}</td><td>${proofLabel}</td></tr>`
      })
      .join("")

  const uploadedProofs =
    item.playerProofs?.filter((p) => p?.data).length ?? 0

  const feeLine = formatFee(settings.registrationFee)

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Receipt ${escapeHtml(
    item.registrationId,
  )}</title><style>body{font:15px Arial,sans-serif;color:#193125;max-width:720px;margin:50px auto;padding:0 24px}header{border-bottom:3px solid #193125;padding-bottom:25px}h1{font-size:26px;margin:12px 0}h2{font-size:17px;margin:30px 0 12px}small{color:#65756a}table{width:100%;border-collapse:collapse}td{padding:10px;border-bottom:1px solid #ddd}td:first-child{width:60px;color:#65756a}.id{background:#edf3e7;padding:18px;margin:25px 0;font-size:20px;font-weight:bold}footer{border-top:1px solid #ddd;margin-top:40px;padding-top:18px;color:#65756a}.meta{color:#65756a;font-size:13px;margin-top:6px}@media print{body{margin:20px auto}}</style></head><body><header><small>OFFICIAL REGISTRATION RECEIPT</small><h1>${escapeHtml(
    settings.title,
  )}</h1><small>Submitted ${escapeHtml(
    new Date(item.createdAt).toLocaleString("en-IN"),
  )}</small></header><div class="id">Registration ID: ${escapeHtml(
    item.registrationId,
  )}</div><h2>Team details</h2><table><tr><td>Team</td><td colspan="2">${escapeHtml(
    item.teamName,
  )}</td></tr><tr><td>Captain</td><td colspan="2">${escapeHtml(
    item.captainName,
  )}</td></tr><tr><td>WhatsApp</td><td colspan="2">${escapeHtml(
    item.contactNumber,
  )}</td></tr><tr><td>Email</td><td colspan="2">${escapeHtml(
    item.email,
  )}</td></tr></table><h2>Starting 5</h2><table>${rowsWithProofs(
    item.players.starting,
    1,
    0,
  )}</table><h2>Substitutes</h2><table>${rowsWithProofs(
    item.players.substitutes,
    6,
    5,
  )}</table><p class="meta">Player ID proofs attached: ${uploadedProofs}/8</p><h2>Payment details</h2><table><tr><td>Fee</td><td colspan="2">${escapeHtml(
    feeLine,
  )}</td></tr><tr><td>Transaction ID</td><td colspan="2">${escapeHtml(
    item.payment.transactionId || "Not provided",
  )}</td></tr><tr><td>Payment proof</td><td colspan="2">${escapeHtml(
    item.payment.paymentProofName || "Not provided",
  )}</td></tr><tr><td>Status</td><td colspan="2">${escapeHtml(
    item.status,
  )}</td></tr></table><h2>Tournament details</h2><table><tr><td>Date</td><td colspan="2">${escapeHtml(
    settings.date,
  )}</td></tr><tr><td>Venue</td><td colspan="2">${escapeHtml(
    settings.venue,
  )}</td></tr><tr><td>Prize money</td><td colspan="2">${escapeHtml(
    settings.prizeMoney,
  )}</td></tr></table><footer>This receipt confirms a local browser registration record only. Payment is subject to organizer verification.</footer></body></html>`
}