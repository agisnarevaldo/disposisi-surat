import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";

interface SuratKeluarDetailProps {
    suratKeluar: {
        id: number;
        no_surat: string;
        tanggal_surat: string;
        kepada: string;
        hal_surat: string;
        jenis_surat: string;
        status: string;
        file_surat: string;
        pembuat?: { name: string };
    };
}

export default function Detail() {
    const { props } = usePage() as unknown as { props: SuratKeluarDetailProps };
    const surat = props.suratKeluar;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Surat Keluar", href: "/surat-keluar" },
        { title: `Detail`, href: `/surat-keluar/${surat.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`No Surat - ${surat.no_surat}`} />
            <div className="bg-accent w-full mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Detail Surat Keluar</h1>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 space-y-2">
                    <div><b>No Surat:</b> {surat.no_surat}</div>
                    <div><b>Tanggal Surat:</b> {surat.tanggal_surat}</div>
                    <div><b>Kepada:</b> {surat.kepada}</div>
                    <div><b>Hal Surat:</b> {surat.hal_surat}</div>
                    <div><b>Jenis Surat:</b> {surat.jenis_surat}</div>
                    <div><b>Status:</b> {surat.status}</div>
                    <div><b>Dibuat oleh:</b> {surat.pembuat?.name ?? "-"}</div>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold mb-2">Preview Dokumen</h2>
                    {surat.file_surat && (
                        <iframe
                            src={
                                surat.file_surat.startsWith("http")
                                    ? surat.file_surat
                                    : `/storage/${surat.file_surat}`
                            }
                            title="Preview Surat PDF"
                            className="w-full min-h-[500px] border rounded"
                        />
                    )}
                </div>
                <div className="flex gap-2 mt-4">
                    <Link href="/surat-keluar">
                        <Button variant="outline">Kembali</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
