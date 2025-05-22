import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DetailInfoItem from "@/components/detail-info-item";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
        pembuat: { name: string };
        keterangan_tindak_lanjut: string;
        tanggal_tindak_lanjut: string;
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
            <div className="w-full mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/surat-keluar">
                        <ArrowLeft className="md:inline" />
                    </Link>
                    <h1 className="text-2xl font-bold">Detail Surat Keluar</h1>
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-4 pb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Informasi Surat</h2>
                            <div className="flex gap-2">
                                <Link href={`/surat-keluar/${surat.id}/edit`} className="text-blue-500 hover:underline">
                                    Edit
                                </Link>
                                {/* Hapus */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <span className="text-red-500 cursor-pointer hover:underline">
                                            Hapus
                                        </span>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Surat Keluar?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Apakah Anda yakin ingin menghapus surat keluar ini? Tindakan ini tidak dapat dibatalkan.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-neutral-50 hover:bg-destructive/90 cursor-pointer"
                                                onClick={() => router.delete(`/surat-keluar/${surat.id}`, { preserveScroll: true })}
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                        <DetailInfoItem label="No Surat" value={surat.no_surat} />
                        <DetailInfoItem label="Tanggal Surat" value={surat.tanggal_surat} />
                        <DetailInfoItem label="Kepada" value={surat.kepada} />
                        <DetailInfoItem label="Hal Surat" value={surat.hal_surat} />
                        <DetailInfoItem label="Jenis Surat" value={surat.jenis_surat} />
                        <DetailInfoItem label="Status" value={surat.status} />
                        <DetailInfoItem label="Pembuat" value={surat.pembuat.name} />
                        <DetailInfoItem label="Keterangan Tindak Lanjut" value={surat.keterangan_tindak_lanjut || "-"} />
                        <DetailInfoItem label="Tanggal Tindak Lanjut" value={surat.tanggal_tindak_lanjut || "-"} />
                    </CardContent>
                </Card>
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
            </div>
        </AppLayout>
    );
}
