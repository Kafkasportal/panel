"use client";

import { useState, useMemo } from "react";
import { Shield, Users, Settings, Plus, Edit, Trash2, Key } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";

type KullaniciRol = "admin" | "moderator" | "operator" | "viewer";
type KullaniciDurum = "aktif" | "pasif" | "bloke";

interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  rol: KullaniciRol;
  durum: KullaniciDurum;
  sonGiris: string;
  created_at: string;
  twoFactorEnabled: boolean;
  permissions: {
    users: boolean;
    donations: boolean;
    members: boolean;
    events: boolean;
    reports: boolean;
    settings: boolean;
  };
}

// Mock data - gerçekte API'den gelecek
const mockKullanicilar: Kullanici[] = [
  {
    id: "1",
    ad: "Ahmet",
    soyad: "Yılmaz",
    email: "ahmet.yilmaz@kafkasder.org",
    telefon: "+90 532 123 4567",
    rol: "admin",
    durum: "aktif",
    sonGiris: "2026-01-14T09:30:00Z",
    created_at: "2025-01-01T00:00:00Z",
    twoFactorEnabled: true,
    permissions: {
      users: true,
      donations: true,
      members: true,
      events: true,
      reports: true,
      settings: true,
    },
  },
  {
    id: "2",
    ad: "Ayşe",
    soyad: "Demir",
    email: "ayse.demir@kafkasder.org",
    telefon: "+90 533 987 6543",
    rol: "moderator",
    durum: "aktif",
    sonGiris: "2026-01-13T14:15:00Z",
    created_at: "2025-02-15T00:00:00Z",
    twoFactorEnabled: false,
    permissions: {
      users: true,
      donations: true,
      members: true,
      events: true,
      reports: true,
      settings: false,
    },
  },
  {
    id: "3",
    ad: "Mehmet",
    soyad: "Kaya",
    email: "mehmet.kaya@kafkasder.org",
    telefon: "+90 534 555 7777",
    rol: "operator",
    durum: "pasif",
    sonGiris: "2026-01-10T11:00:00Z",
    created_at: "2025-06-20T00:00:00Z",
    twoFactorEnabled: false,
    permissions: {
      users: false,
      donations: true,
      members: true,
      events: true,
      reports: false,
      settings: false,
    },
  },
];

const KullaniciRolLabels: Record<KullaniciRol, string> = {
  admin: "Yönetici",
  moderator: "Moderatör",
  operator: "Operatör",
  viewer: "İzleyici",
};

const KullaniciDurumLabels: Record<KullaniciDurum, string> = {
  aktif: "Aktif",
  pasif: "Pasif",
  bloke: "Bloke",
};

const rolColors: Record<KullaniciRol, string> = {
  admin: "bg-red-100 text-red-800 hover:bg-red-200",
  moderator: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  operator: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  viewer: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const durumColors: Record<KullaniciDurum, string> = {
  aktif: "bg-green-100 text-green-800 hover:bg-green-200",
  pasif: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  bloke: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function UsersPage() {
  const [kullanicilar, setKullanicilar] =
    useState<Kullanici[]>(mockKullanicilar);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Kullanici | null>(null);
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    rol: "operator" as KullaniciRol,
    durum: "aktif" as KullaniciDurum,
    sifre: "",
    permissions: {
      users: false,
      donations: false,
      members: false,
      events: false,
      reports: false,
      settings: false,
    },
  });

  const handleNewUser = () => {
    setEditingUser(null);
    setFormData({
      ad: "",
      soyad: "",
      email: "",
      telefon: "",
      rol: "operator",
      durum: "aktif",
      sifre: "",
      permissions: {
        users: false,
        donations: false,
        members: false,
        events: false,
        reports: false,
        settings: false,
      },
    });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: Kullanici) => {
    setEditingUser(user);
    setFormData({
      ad: user.ad,
      soyad: user.soyad,
      email: user.email,
      telefon: user.telefon,
      rol: user.rol,
      durum: user.durum,
      sifre: "",
      permissions: user.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    setKullanicilar(kullanicilar.filter((k) => k.id !== id));
  };

  const handleToggleUserStatus = (id: string) => {
    setKullanicilar(
      kullanicilar.map((k) =>
        k.id === id
          ? { ...k, durum: k.durum === "aktif" ? "pasif" : "aktif" }
          : k,
      ),
    );
  };

  const handleRoleChange = (rol: KullaniciRol) => {
    const defaultPermissions = {
      admin: {
        users: true,
        donations: true,
        members: true,
        events: true,
        reports: true,
        settings: true,
      },
      moderator: {
        users: true,
        donations: true,
        members: true,
        events: true,
        reports: true,
        settings: false,
      },
      operator: {
        users: false,
        donations: true,
        members: true,
        events: true,
        reports: false,
        settings: false,
      },
      viewer: {
        users: false,
        donations: true,
        members: true,
        events: false,
        reports: false,
        settings: false,
      },
    };

    setFormData({
      ...formData,
      rol,
      permissions: defaultPermissions[rol],
    });
  };

  const handleSubmit = () => {
    if (editingUser) {
      setKullanicilar(
        kullanicilar.map((k) =>
          k.id === editingUser.id ? { ...k, ...formData } : k,
        ),
      );
    } else {
      const yeniKullanici: Kullanici = {
        id: Date.now().toString(),
        ...formData,
        sonGiris: new Date().toISOString(),
        created_at: new Date().toISOString(),
        twoFactorEnabled: false,
      };
      setKullanicilar([...kullanicilar, yeniKullanici]);
    }
    setIsDialogOpen(false);
  };

  const stats = useMemo(
    () => ({
      toplam: kullanicilar.length,
      aktif: kullanicilar.filter((k) => k.durum === "aktif").length,
      admin: kullanicilar.filter((k) => k.rol === "admin").length,
      moderator: kullanicilar.filter((k) => k.rol === "moderator").length,
      operator: kullanicilar.filter((k) => k.rol === "operator").length,
      twoFactorEnabled: kullanicilar.filter((k) => k.twoFactorEnabled).length,
    }),
    [kullanicilar],
  );

  const columns = [
    {
      header: "Kullanıcı",
      accessorKey: "ad",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">
            {row.original.ad} {row.original.soyad}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      header: "Rol",
      accessorKey: "rol",
      cell: ({ row }: any) => {
        const kullanici = row.original as Kullanici;
        return (
          <Badge className={rolColors[kullanici.rol]}>
            {KullaniciRolLabels[kullanici.rol]}
          </Badge>
        );
      },
    },
    {
      header: "Durum",
      accessorKey: "durum",
      cell: ({ row }: any) => {
        const kullanici = row.original as Kullanici;
        return (
          <Badge className={durumColors[kullanici.durum]}>
            {KullaniciDurumLabels[kullanici.durum]}
          </Badge>
        );
      },
    },
    {
      header: "Son Giriş",
      accessorKey: "sonGiris",
      cell: ({ row }: any) => formatDate(row.original.sonGiris),
    },
    {
      header: "2FA",
      accessorKey: "twoFactorEnabled",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Key className="h-4 w-4" />
          {row.original.twoFactorEnabled ? (
            <Badge variant="outline" className="text-green-600">
              Aktif
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600">
              Pasif
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleEditUser(row.original)}
            aria-label="Kullanıcıyı düzenle"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleToggleUserStatus(row.original.id)}
            aria-label="Kullanıcı durumunu değiştir"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeleteUser(row.original.id)}
            aria-label="Kullanıcıyı sil"
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
        title="Kullanıcı Yönetimi"
        description="Sistem kullanıcılarını ve yetkilerini yönetin"
        action={
          <Button onClick={handleNewUser}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
          </Button>
        }
      />

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Toplam Kullanıcı
                </p>
                <p className="text-2xl font-bold">{stats.toplam}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.aktif}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Yönetici</p>
                <p className="text-2xl font-bold text-red-600">{stats.admin}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">2FA Aktif</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.twoFactorEnabled}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      {kullanicilar.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="Henüz kullanıcı yok"
          description="Sistemde kayıtlı kullanıcı bulunmuyor."
          action={
            <Button onClick={handleNewUser}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Kullanıcıyı Oluştur
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={kullanicilar}
          searchPlaceholder="Ad, soyad veya email ile ara..."
          searchColumn="ad"
          filters={[
            {
              column: "rol",
              title: "Rol",
              options: [
                { label: "Yönetici", value: "admin" },
                { label: "Moderatör", value: "moderator" },
                { label: "Operatör", value: "operator" },
                { label: "İzleyici", value: "viewer" },
              ],
            },
            {
              column: "durum",
              title: "Durum",
              options: [
                { label: "Aktif", value: "aktif" },
                { label: "Pasif", value: "pasif" },
                { label: "Bloke", value: "bloke" },
              ],
            },
          ]}
        />
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Kullanıcı bilgilerini ve yetkilerini güncelleyin."
                : "Yeni bir kullanıcı ve yetki ataması oluşturun."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ad">Ad</Label>
                <Input
                  id="ad"
                  value={formData.ad}
                  onChange={(e) =>
                    setFormData({ ...formData, ad: e.target.value })
                  }
                  placeholder="Kullanıcı adını girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soyad">Soyad</Label>
                <Input
                  id="soyad"
                  value={formData.soyad}
                  onChange={(e) =>
                    setFormData({ ...formData, soyad: e.target.value })
                  }
                  placeholder="Kullanıcı soyadını girin"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="kullanici@kafkasder.org"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefon">Telefon</Label>
                <Input
                  id="telefon"
                  value={formData.telefon}
                  onChange={(e) =>
                    setFormData({ ...formData, telefon: e.target.value })
                  }
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={formData.rol} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(KullaniciRolLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durum">Durum</Label>
                <Select
                  value={formData.durum}
                  onValueChange={(value: KullaniciDurum) =>
                    setFormData({ ...formData, durum: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(KullaniciDurumLabels).map(
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

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="sifre">Şifre</Label>
                <Input
                  id="sifre"
                  type="password"
                  value={formData.sifre}
                  onChange={(e) =>
                    setFormData({ ...formData, sifre: e.target.value })
                  }
                  placeholder="Güçlü bir şifre girin"
                />
              </div>
            )}

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <Label className="text-base font-medium">Yetkiler</Label>
              </div>

              <div className="grid gap-3">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {key === "users" && "Kullanıcı Yönetimi"}
                        {key === "donations" && "Bağış Yönetimi"}
                        {key === "members" && "Üye Yönetimi"}
                        {key === "events" && "Etkinlik Yönetimi"}
                        {key === "reports" && "Raporlama"}
                        {key === "settings" && "Sistem Ayarları"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {key === "users" &&
                          "Kullanıcı ekleme, düzenleme, silme"}
                        {key === "donations" && "Bağış kaydetme, düzenleme"}
                        {key === "members" && "Üye kayıtları, aidat takibi"}
                        {key === "events" && "Etkinlik planlama, yönetimi"}
                        {key === "reports" && "Rapor oluşturma, görüntüleme"}
                        {key === "settings" && "Sistem konfigürasyonu"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [key]: checked,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
