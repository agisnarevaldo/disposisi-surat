import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardStats = {
    totalSuratMasuk: number;
    totalSuratKeluar: number;
    perluTindakLanjut: number;
    selesai: number;
}

export default function Staff() {
    const { props } = usePage<{ stats: DashboardStats, auth: { user: { name: string } } }>();
    const stats = props.stats ?? {
        totalSuratMasuk: 0,
        totalSuratKeluar: 0,
        perluTindakLanjut: 0,
        selesai: 0,
    };
    const userName = props.auth?.user?.name ?? "";
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 text-2xl font-semibold">Selamat datang, {userName}!</div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle><CardTitle>Total Surat Masuk</CardTitle></CardTitle>
                            <CardDescription>Jumlah Seluruh Surat Masuk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.totalSuratMasuk}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Surat Keluar</CardTitle>
                            <CardDescription>Jumlah Seluruh Surat Keluar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.totalSuratKeluar}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Perlu Tindak Lanjut</CardTitle>
                            <CardDescription>Jumlah Surat yang Perlu Tindak Lanjut</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.perluTindakLanjut}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Selesai</CardTitle>
                            <CardDescription>Jumlah Surat yang Selesai Diproses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stats.selesai}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
