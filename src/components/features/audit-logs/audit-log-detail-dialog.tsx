"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import type { AuditLog } from "@/types"

interface AuditLogDetailDialogProps {
  log: AuditLog
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ACTION_COLORS = {
  INSERT: "bg-green-500/10 text-green-700 dark:text-green-400",
  UPDATE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400",
} as const

export function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Audit Log Detayı</DialogTitle>
          <DialogDescription>
            {format(log.createdAt, "dd MMMM yyyy HH:mm:ss", { locale: tr })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  İşlem
                </label>
                <div className="mt-1">
                  <Badge
                    className={ACTION_COLORS[log.action]}
                    variant="outline"
                  >
                    {log.action}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tablo
                </label>
                <div className="mt-1 font-mono text-sm">{log.tableName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Kayıt ID
                </label>
                <div className="mt-1 font-mono text-sm">{log.recordId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  IP Adresi
                </label>
                <div className="mt-1 font-mono text-sm">
                  {log.ipAddress || "-"}
                </div>
              </div>
            </div>

            {/* User Info */}
            {log.user && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Kullanıcı
                  </label>
                  <div className="mt-1">
                    <div className="font-medium">{log.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.user.email}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Old Data */}
            {log.oldData && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Eski Veri
                  </label>
                  <div className="rounded-md bg-muted p-4">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(log.oldData, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {/* New Data */}
            {log.newData && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Yeni Veri
                  </label>
                  <div className="rounded-md bg-muted p-4">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(log.newData, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {/* Diff View for Updates */}
            {log.action === "UPDATE" && log.oldData && log.newData && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Değişiklikler
                  </label>
                  <div className="space-y-2">
                    {Object.keys({ ...log.oldData, ...log.newData }).map(
                      (key) => {
                        const oldValue = log.oldData?.[key]
                        const newValue = log.newData?.[key]
                        const changed = oldValue !== newValue

                        if (!changed) return null

                        return (
                          <div
                            key={key}
                            className="rounded-md border p-3 space-y-1"
                          >
                            <div className="font-medium text-sm">{key}</div>
                            <div className="grid md:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-red-600 dark:text-red-400">
                                  - {JSON.stringify(oldValue)}
                                </span>
                              </div>
                              <div>
                                <span className="text-green-600 dark:text-green-400">
                                  + {JSON.stringify(newValue)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
