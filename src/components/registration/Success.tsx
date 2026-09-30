// src/components/registration/Success.tsx
import { ArrowRight, CheckCircle2, Download, Printer } from "lucide-react"
import Button from "../ui/Button"
import Receipt from "../Receipt"
import { outlineClass, primaryClass } from "../../lib/styles"
import { receiptHtml } from "../../lib/receipt"
import { downloadFile } from "../../lib/registration"
import { useTournamentSettings } from "../../lib/tournamentSettings"
import type { Registration } from "../../types/tournament"

type Props = { item: Registration; reset: () => void }

export default function Success({ item, reset }: Props) {
  const settings = useTournamentSettings()
  const uploadedProofs =
    item.playerProofs?.filter((p) => p?.data).length ?? 0

  const downloadReceipt = () =>
    downloadFile(
      receiptHtml(item, settings),
      `${item.registrationId}-receipt.html`,
      "text/html;charset=utf-8",
    )

  return (
    <div className="mx-auto max-w-[760px] text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f2d2] text-[#4b7b3d]">
        <CheckCircle2 size={43} strokeWidth={1.6} />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
        YOU'RE IN THE GAME
      </p>
      <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-[#183a29] sm:text-6xl">
        Registration
        <br />
        received.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#657768]">
        Your team is on the list in this browser. Keep your registration ID
        handy; payment is pending organizer verification.
      </p>

      <div className="mt-9 rounded-2xl border border-[#dce5d7] bg-white p-6 text-left shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7ebe4] pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#819283]">
              Your registration ID
            </p>
            <p className="mt-2 break-all font-display text-2xl font-bold text-[#1d452d] sm:text-3xl">
              {item.registrationId}
            </p>
          </div>
          <span className="rounded-full bg-[#fff2d9] px-3 py-1.5 text-xs font-bold text-[#8b672b]">
            {item.status}
          </span>
        </div>

        <div className="grid gap-x-8 gap-y-5 pt-6 text-sm sm:grid-cols-2">
          <div>
            <span className="text-[#839185]">Team name</span>
            <strong className="mt-1 block text-[#243f2d]">{item.teamName}</strong>
          </div>
          <div>
            <span className="text-[#839185]">Captain</span>
            <strong className="mt-1 block text-[#243f2d]">{item.captainName}</strong>
          </div>
          <div>
            <span className="text-[#839185]">Contact number</span>
            <strong className="mt-1 block text-[#243f2d]">{item.contactNumber}</strong>
          </div>
          <div>
            <span className="text-[#839185]">Tournament</span>
            <strong className="mt-1 block text-[#243f2d]">
              {settings.date} · {settings.venue}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Starting 5</span>
            <strong className="mt-1 block leading-6 text-[#243f2d]">
              {item.players.starting.join(", ")}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Substitutes</span>
            <strong className="mt-1 block leading-6 text-[#243f2d]">
              {item.players.substitutes.join(", ")}
            </strong>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#839185]">Player ID proofs</span>
            <strong
              className={
                uploadedProofs === 8
                  ? "mt-1 block text-[#2f7a3e]"
                  : "mt-1 block text-[#a6513d]"
              }
            >
              {uploadedProofs}/8 attached
            </strong>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className={primaryClass} onClick={downloadReceipt}>
          <Download size={17} /> Download receipt
        </button>
        <button onClick={() => window.print()} className={outlineClass}>
          <Printer size={17} /> Print receipt
        </button>
      </div>

      <Button
        variant="outline"
        className="mt-7 !border-0 !bg-transparent !px-0 !text-[#4a7546] hover:!bg-transparent hover:underline"
        onClick={reset}
      >
        Register another team <ArrowRight size={16} />
      </Button>

      <Receipt item={item} />
    </div>
  )
}