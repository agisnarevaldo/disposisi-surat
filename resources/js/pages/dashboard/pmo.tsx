import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardStats = {
    totalSuratMasuk: number;
    dibaca: number;
    belumDibaca: number;
    tindakLanjut: number;
    belumTindakLanjut: number;
    totalSuratKeluar: number;
    statusKeluar: Record<string, number>;
};

export default function PMO() {
    const { props } = usePage<{ stats: DashboardStats, auth: { user: { name: string } } }>();
    const stats = props.stats ?? {
        totalSuratMasuk: 0,
        dibaca: 0,
        belumDibaca: 0,
        tindakLanjut: 0,
        belumTindakLanjut: 0,
        totalSuratKeluar: 0,
        statusKeluar: {},
    };
    const userName = props.auth?.user?.name ?? "";
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PMO Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 text-2xl font-semibold">Selamat datang, {userName}!</div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Surat Masuk</CardTitle>
                            <CardDescription>Jumlah seluruh surat masuk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.totalSuratMasuk ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Surat Keluar</CardTitle>
                            <CardDescription>Jumlah seluruh surat keluar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.totalSuratKeluar ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Surat Masuk</CardTitle>
                            <CardDescription>Dibaca / Belum Dibaca</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                <span>Dibaca: <b>{stats.dibaca ?? 0}</b></span>
                                <span>Belum Dibaca: <b>{stats.belumDibaca ?? 0}</b></span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Tindak Lanjut Surat Masuk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                <span>Ditindaklanjuti: <b>{stats.tindakLanjut ?? 0}</b></span>
                                <span>Belum Ditindaklanjuti: <b>{stats.belumTindakLanjut ?? 0}</b></span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Surat Keluar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                {stats.statusKeluar && Object.entries(stats.statusKeluar).length > 0 ? (
                                    Object.entries(stats.statusKeluar).map(([status, count]) => (
                                        <span key={status}>{status}: <b>{count as number}</b></span>
                                    ))
                                ) : (
                                    <span>Tidak ada data</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
