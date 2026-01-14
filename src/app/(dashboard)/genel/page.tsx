"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useApplications,
  useMembers,
  useDashboardStats,
} from "@/hooks/use-api";
import { BASVURU_DURUMU_LABELS, STATUS_VARIANTS } from "@/lib/constants";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  const { data: applicationsData } = useApplications({
    page: 1,
    limit: 3,
    durum: "beklemede",
  });
  const { data: membersData } = useMembers({ page: 1, limit: 3 });
  const recentMembers = useMemo(
    () => membersData?.data?.slice(0, 3) || [],
    [membersData?.data],
  );

  if (isLoading || !stats) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Genel Bakış</h1>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Dashboard Yüklenemedi
            </CardTitle>
            <CardDescription>
              İstatistikler yüklenirken bir hata oluştu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Tekrar Dene</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Genel Bakış</h1>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Aktif Üye</CardDescription>
            <CardTitle className="text-xl">
              {stats.activeMembers?.toLocaleString("tr-TR") || "0"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                <IconTrendingUp className="w-3 h-3" />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">
              Bekleyen Başvuru
            </CardDescription>
            <CardTitle className="text-xl">
              {stats.pendingApplications || "0"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                <IconTrendingDown className="w-3 h-3" />
                -5.2%
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Bu Ay Ödenen</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(stats.monthlyAid || 0)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                <IconTrendingUp className="w-3 h-3" />
                +8.3%
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Toplam Bağış</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(stats.totalDonations || 0)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                <IconTrendingUp className="w-3 h-3" />
                +15.7%
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* Chart */}
      <ChartAreaInteractive />

      {/* Compact Lists */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bekleyen Başvurular</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sosyal-yardim/basvurular">
                  Tümü <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {applicationsData?.data && applicationsData.data.length > 0 ? (
                applicationsData.data.slice(0, 3).map((app) => (
                  <Link
                    key={app.id}
                    href={`/sosyal-yardim/basvurular/${app.id}`}
                    className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(
                            `${app.basvuranKisi.ad} ${app.basvuranKisi.soyad}`,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {app.basvuranKisi.ad} {app.basvuranKisi.soyad}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(app.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={STATUS_VARIANTS[app.durum] as any}
                        className="text-xs"
                      >
                        {BASVURU_DURUMU_LABELS[app.durum]}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {formatCurrency(app.talepEdilenTutar || 0)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  variant="no-data"
                  title="Bekleyen başvuru yok"
                  description="Şu anda bekleyen sosyal yardım başvurusu bulunmuyor."
                  className="py-2"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Son Üyeler</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/uyeler/liste">
                  Tümü <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentMembers.length > 0 ? (
                recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(`${member.ad} ${member.soyad}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.ad} {member.soyad}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.uyeNo}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.uyeTuru === "aktif" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {member.uyeTuru === "aktif" ? "Aktif" : member.uyeTuru}
                    </Badge>
                  </div>
                ))
              ) : (
                <EmptyState
                  variant="no-data"
                  title="Henüz üye kaydı yok"
                  description="Derneğe kayıtlı üye bulunmuyor."
                  className="py-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-16 bg-muted rounded animate-pulse" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
