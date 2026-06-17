import { redirect } from "next/navigation"
import { AlertCircle, HelpCircle, Lightbulb } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { getUnansweredQuestions } from "@/app/actions/customer"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Preguntas sin respuesta — Mindware Nexus",
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  )
}

export default async function UnansweredPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "customer") redirect("/login")

  let questions: Awaited<ReturnType<typeof getUnansweredQuestions>> = []
  let loadError: string | null = null

  try {
    questions = await getUnansweredQuestions(30)
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Error al cargar los datos"
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Preguntas sin respuesta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preguntas que tu bot no pudo responder en los últimos 30 días. Úsalas para enriquecer
          la configuración del chatbot.
        </p>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 rounded-xl border border-nexus-lavender/30 bg-nexus-lavender/5 px-4 py-3">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-nexus-lavender" />
        <p className="text-sm text-muted-foreground">
          Cada pregunta de la lista es una oportunidad para mejorar tu bot. Agrégalas a{" "}
          <strong className="text-foreground">Productos &amp; Servicios</strong>,{" "}
          <strong className="text-foreground">Reglas de negocio</strong> o al{" "}
          <strong className="text-foreground">Prompt base</strong> en la configuración del chatbot.
        </p>
      </div>

      {/* Error */}
      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Stat */}
      {!loadError && (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-nexus-purple/10">
            <HelpCircle className="size-4 text-nexus-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{questions.length}</p>
            <p className="text-xs text-muted-foreground">
              {questions.length === 1
                ? "pregunta distinta sin respuesta"
                : "preguntas distintas sin respuesta"}{" "}
              en los últimos 30 días
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-xl border bg-card">
        {!loadError && questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <HelpCircle className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Sin preguntas sin respuesta</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu bot está respondiendo todo correctamente en los últimos 30 días.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Pregunta</TableHead>
                <TableHead className="w-28 text-center">Veces</TableHead>
                <TableHead className="w-44">Última vez</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm text-foreground">{q.question}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={q.frequency >= 5 ? "destructive" : q.frequency >= 2 ? "warning" : "outline"}
                      className="tabular-nums"
                    >
                      {q.frequency}×
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(q.last_asked_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
