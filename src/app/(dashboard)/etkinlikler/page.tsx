"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";

type EtkinlikDurumu = "planlanan" | "devam eden" | "tamamlandi" | "iptal";
type EtkinlikTuru = "toplanti" | "egitim" | "sosyal" | "bagis" | "diger";

interface Etkinlik {
  id: string;
  ad: string;
  aciklama: string;
  tur: EtkinlikTuru;
  durum: EtkinlikDurumu;
  tarih: string;
  saat: string;
  yer: string;
  katilimciSayisi: number;
  bütçe: number;
  created_at: string;
}

// Mock data - gerçekte API'den gelecek
const mockEtkinlikler: Etkinlik[] = [
  {
    id: "1",
    ad: "Genel Kurul Toplantısı",
    aciklama: "Yıllık genel kurul toplantısı ve yönetim seçimi",
    tur: "toplanti",
    durum: "planlanan",
    tarih: "2026-02-15",
    saat: "14:00",
    yer: "Dernek Merkezi",
    katilimciSayisi: 45,
    bütçe: 5000,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    ad: "Kermes Etkinliği",
    aciklama: "Geleneksel kermes ve bağış toplama etkinliği",
    tur: "bagis",
    durum: "tamamlandi",
    tarih: "2025-12-20",
    saat: "10:00",
    yer: "Şehir Parkı",
    katilimciSayisi: 120,
    bütçe: 8000,
    created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "3",
    ad: "Eğitim Semineri",
    aciklama: "Gençlere yönelik meslek edindirme semineri",
    tur: "egitim",
    durum: "devam eden",
    tarih: "2026-01-20",
    saat: "18:00",
    yer: "Eğitim Merkezi",
    katilimciSayisi: 30,
    bütçe: 2000,
    created_at: "2026-01-10T00:00:00Z",
  },
];

const ETkinlikDurumLabels: Record<EtkinlikDurumu, string> = {
  planlanan: "Planlanan",
  "devam eden": "Devam Eden",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

const EtkinlikTurLabels: Record<EtkinlikTuru, string> = {
  toplanti: "Toplantı",
  egitim: "Eğitim",
  sosyal: "Sosyal",
  bagis: "Bağış",
  diger: "Diğer",
};

const durumColors: Record<EtkinlikDurumu, string> = {
  planlanan: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "devam eden": "bg-amber-100 text-amber-800 hover:bg-amber-200",
  tamamlandi: "bg-green-100 text-green-800 hover:bg-green-200",
  iptal: "bg-red-100 text-red-800 hover:bg-red-200",
};

const turColors: Record<EtkinlikTuru, string> = {
  toplanti: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  egitim: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  sosyal: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  bagis: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  diger: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

export default function EventsPage() {
  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>(mockEtkinlikler);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEtkinlik, setEditingEtkinlik] = useState<Etkinlik | null>(null);
  const [formData, setFormData] = useState({
    ad: "",
    aciklama: "",
    tur: "" as EtkinlikTuru,
    durum: "planlanan" as EtkinlikDurumu,
    tarih: "",
    saat: "",
    yer: "",
    katilimciSayisi: 0,
    bütçe: 0,
  });

  const handleNewEtkinlik = () => {
    setEditingEtkinlik(null);
    setFormData({
      ad: "",
      aciklama: "",
      tur: "toplanti",
      durum: "planlanan",
      tarih: "",
      saat: "",
      yer: "",
      katilimciSayisi: 0,
      bütçe: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditEtkinlik = (etkinlik: Etkinlik) => {
    setEditingEtkinlik(etkinlik);
    setFormData({
      ad: etkinlik.ad,
      aciklama: etkinlik.aciklama,
      tur: etkinlik.tur,
      durum: etkinlik.durum,
      tarih: etkinlik.tarih,
      saat: etkinlik.saat,
      yer: etkinlik.yer,
      katilimciSayisi: etkinlik.katilimciSayisi,
      bütçe: etkinlik.bütçe,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEtkinlik = (id: string) => {
    setEtkinlikler(etkinlikler.filter((e) => e.id !== id));
  };

  const handleSubmit = () => {
    if (editingEtkinlik) {
      setEtkinlikler(
        etkinlikler.map((e) =>
          e.id === editingEtkinlik.id
            ? { ...e, ...formData, updated_at: new Date().toISOString() }
            : e,
        ),
      );
    } else {
      const yeniEtkinlik: Etkinlik = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setEtkinlikler([...etkinlikler, yeniEtkinlik]);
    }
    setIsDialogOpen(false);
  };

  const stats = useMemo(
    () => ({
      toplam: etkinlikler.length,
      planlanan: etkinlikler.filter((e) => e.durum === "planlanan").length,
      devam: etkinlikler.filter((e) => e.durum === "devam eden").length,
      tamamlandi: etkinlikler.filter((e) => e.durum === "tamamlandi").length,
      toplamKatilimci: etkinlikler.reduce(
        (sum, e) => sum + e.katilimciSayisi,
        0,
      ),
      toplamBütçe: etkinlikler.reduce((sum, e) => sum + (e.bütçe || 0), 0),
    }),
    [etkinlikler],
  );

  const columns = [
    {
      header: "Etkinlik Adı",
      accessorKey: "ad",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.ad}</div>
          <div className="text-sm text-muted-foreground truncate max-w-xs">
            {row.original.aciklama}
          </div>
        </div>
      ),
    },
    {
      header: "Tür",
      accessorKey: "tur",
      cell: ({ row }: any) => {
        const etkinlik = row.original as Etkinlik;
        return (
          <Badge className={turColors[etkinlik.tur]}>
            {EtkinlikTurLabels[etkinlik.tur]}
          </Badge>
        );
      },
    },
    {
      header: "Durum",
      accessorKey: "durum",
      cell: ({ row }: any) => {
        const etkinlik = row.original as Etkinlik;
        return (
          <Badge className={durumColors[etkinlik.durum]}>
            {ETkinlikDurumLabels[etkinlik.durum]}
          </Badge>
        );
      },
    },
    {
      header: "Tarih & Saat",
      accessorKey: "tarih",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{formatDate(row.original.tarih)}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.saat}
          </div>
        </div>
      ),
    },
    {
      header: "Yer",
      accessorKey: "yer",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.yer}</span>
        </div>
      ),
    },
    {
      header: "Katılımcı",
      accessorKey: "katilimciSayisi",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.katilimciSayisi}</span>
        </div>
      ),
    },
    {
      header: "Bütçe",
      accessorKey: "bütçe",
      cell: ({ row }: any) => formatCurrency(row.original.bütçe),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleEditEtkinlik(row.original)}
            aria-label="Etkinliği düzenle"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeleteEtkinlik(row.original.id)}
            aria-label="Etkinliği sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etkinlikler"
        description="Dernek etkinliklerini planlayın ve yönetin"
        action={
          <Button onClick={handleNewEtkinlik}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Etkinlik
          </Button>
        }
      />

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Toplam Etkinlik</p>
                <p className="text-2xl font-bold">{stats.toplam}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Planlanan</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.planlanan}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Toplam Katılımcı
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.toplamKatilimci}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Toplam Bütçe</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.toplamBütçe)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <div className="text-xl font-bold text-purple-600">₺</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      {etkinlikler.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="Henüz etkinlik yok"
          description="Dernekte planlanmış etkinlik bulunmuyor."
          action={
            <Button onClick={handleNewEtkinlik}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Etkinliği Oluştur
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={etkinlikler}
          searchPlaceholder="Etkinlik adı veya türü ile ara..."
          searchColumn="ad"
          filters={[
            {
              column: "durum",
              title: "Durum",
              options: [
                { label: "Planlanan", value: "planlanan" },
                { label: "Devam Eden", value: "devam eden" },
                { label: "Tamamlandı", value: "tamamlandi" },
                { label: "İptal", value: "iptal" },
              ],
            },
            {
              column: "tur",
              title: "Tür",
              options: [
                { label: "Toplantı", value: "toplanti" },
                { label: "Eğitim", value: "egitim" },
                { label: "Sosyal", value: "sosyal" },
                { label: "Bağış", value: "bagis" },
                { label: "Diğer", value: "diger" },
              ],
            },
          ]}
        />
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEtkinlik ? "Etkinlik Düzenle" : "Yeni Etkinlik"}
            </DialogTitle>
            <DialogDescription>
              {editingEtkinlik
                ? "Etkinlik bilgilerini güncelleyin."
                : "Yeni bir etkinlik oluşturun."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ad">Etkinlik Adı</Label>
                <Input
                  id="ad"
                  value={formData.ad}
                  onChange={(e) =>
                    setFormData({ ...formData, ad: e.target.value })
                  }
                  placeholder="Etkinlik adını girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tur">Etkinlik Türü</Label>
                <Select
                  value={formData.tur}
                  onValueChange={(value: EtkinlikTuru) =>
                    setFormData({ ...formData, tur: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EtkinlikTurLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aciklama">Açıklama</Label>
              <Textarea
                id="aciklama"
                value={formData.aciklama}
                onChange={(e) =>
                  setFormData({ ...formData, aciklama: e.target.value })
                }
                placeholder="Etkinlik açıklaması"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tarih">Tarih</Label>
                <Input
                  id="tarih"
                  type="date"
                  value={formData.tarih}
                  onChange={(e) =>
                    setFormData({ ...formData, tarih: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saat">Saat</Label>
                <Input
                  id="saat"
                  type="time"
                  value={formData.saat}
                  onChange={(e) =>
                    setFormData({ ...formData, saat: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yer">Yer</Label>
                <Input
                  id="yer"
                  value={formData.yer}
                  onChange={(e) =>
                    setFormData({ ...formData, yer: e.target.value })
                  }
                  placeholder="Etkinlik yeri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durum">Durum</Label>
                <Select
                  value={formData.durum}
                  onValueChange={(value: EtkinlikDurumu) =>
                    setFormData({ ...formData, durum: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ETkinlikDurumLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="katilimciSayisi">Katılımcı Sayısı</Label>
                <Input
                  id="katilimciSayisi"
                  type="number"
                  value={formData.katilimciSayisi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      katilimciSayisi: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bütçe">Bütçe (TL)</Label>
                <Input
                  id="bütçe"
                  type="number"
                  value={formData.bütçe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bütçe: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              {editingEtkinlik ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
