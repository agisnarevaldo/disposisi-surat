import React from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Keluar', href: '/surat-keluar' },
    { title: 'Edit Surat Keluar', href: '#' },
];

type SuratKeluar = {
    id: number;
    no_surat: string;
    tanggal_surat: string;
    kepada: string;
    status: string;
    jenis_surat?: string;
    file_surat?: string;
    pembuat?: { name: string };
};

export default function Edit() {
    const { props } = usePage();
    const surat: SuratKeluar = props.suratKeluar as SuratKeluar;
    const { data, setData, processing } = useForm({
        no_surat: surat.no_surat,
        tanggal_surat: surat.tanggal_surat,
        kepada: surat.kepada,
        status: surat.status,
        jenis_surat: surat.jenis_surat || '',
        file_surat: undefined as File | undefined,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });
                formData.append('_method', 'PUT');
                router.post(`/surat-keluar/${surat.id}`, formData, {
                    forceFormData: true,
                });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Keluar" />
            <div className="flex flex-col gap-4 p-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>No Surat</Label>
                        <Input type="text" value={data.no_surat} onChange={e => setData('no_surat', e.target.value)} />
                        <Label>Tanggal Surat</Label>
                        <Input type="date" value={data.tanggal_surat} onChange={e => setData('tanggal_surat', e.target.value)} />
                        <Label>Kepada</Label>
                        <Input type="text" value={data.kepada} onChange={e => setData('kepada', e.target.value)} />
                        <Label>Status</Label>
                        <select value={data.status} onChange={e => setData('status', e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="ditindaklanjuti">Ditindaklanjuti</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        <Label>Jenis Surat</Label>
                        <Input type="text" value={data.jenis_surat} onChange={e => setData('jenis_surat', e.target.value)} className="" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>File Surat (PDF, kosongkan jika tidak diganti)</Label>
                        <Input type="file" accept="application/pdf" onChange={e => setData('file_surat', e.target.files?.[0])} />
                        {surat.file_surat && (
                            <a href={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1">Lihat File Saat Ini</a>
                        )}
                        <Button type="submit" className="mt-4" disabled={processing}>Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
