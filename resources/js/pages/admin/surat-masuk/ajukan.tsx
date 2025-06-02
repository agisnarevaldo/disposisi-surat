import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, Send, Crown, Shield, UserCheck, Users } from "lucide-react";
import { BreadcrumbItem } from "@/types";

type User = {
    id: number;
    name: string;
    role: string;
    jabatan: string;
};

type SuratMasuk = {
    id: number;
    no_agenda: string;
    no_surat: string;
    tanggal_surat: string;
    tanggal_diterima: string;
    pengirim: string;
    hal_surat: string;
    jenis_surat: string;
    file_surat: string;
    tujuan_surat: string;
    status_disposisi: string;
    pesan_tambahan?: string;
};

type AjukanProps = {
    suratMasuk: SuratMasuk;
    usersCanDispose: User[];
};

export default function Ajukan() {
    const { props } = usePage<AjukanProps>();
    const { suratMasuk, usersCanDispose } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Surat Masuk', href: '/admin/surat-masuk' },
        { title: suratMasuk.no_surat, href: `/admin/surat-masuk/${suratMasuk.id}` },
        { title: 'Ajukan Surat', href: `/admin/surat-masuk/${suratMasuk.id}/ajukan` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        pesan_tambahan: suratMasuk.pesan_tambahan || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/surat-masuk/${suratMasuk.id}/ajukan-ke-user`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'kepala': return 'bg-purple-100 text-purple-800';
            case 'pmo': return 'bg-blue-100 text-blue-800';
            case 'pegawai': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'kepala': return <Shield className="h-3 w-3" />;
            case 'pmo': return <UserCheck className="h-3 w-3" />;
            case 'pegawai': return <Users className="h-3 w-3" />;
            default: return <Users className="h-3 w-3" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ajukan Surat - ${suratMasuk.no_surat}`} />
            
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/surat-masuk/${suratMasuk.id}`} className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-50">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Ajukan Surat</h1>
                        <p className="text-gray-600">Ajukan ke Kepala atau User dengan Privilege: {suratMasuk.no_surat}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informasi Surat */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Surat</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">No Agenda</label>
                                <p className="text-base">{suratMasuk.no_agenda}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">No Surat</label>
                                <p className="text-base font-medium">{suratMasuk.no_surat}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Hal/Perihal</label>
                                <p className="text-base">{suratMasuk.hal_surat}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Pengirim</label>
                                <p className="text-base">{suratMasuk.pengirim}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Tanggal Surat</label>
                                <p className="text-base">{formatDate(suratMasuk.tanggal_surat)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Jenis Surat</label>
                                <p className="text-base">{suratMasuk.jenis_surat}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Pengajuan */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Form Pengajuan</h2>
                        
                        <form onSubmit={submit} className="space-y-6">
                            {/* Pilih User */}
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Ajukan ke User *</Label>
                                <Select value={data.user_id} onValueChange={(value) => setData("user_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih user yang akan menangani surat ini" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usersCanDispose.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{user.name}</span>
                                                        <span className="text-xs text-gray-400">{user.jabatan}</span>
                                                    </div>
                                                    <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 ml-2`}>
                                                        {getRoleIcon(user.role)}
                                                        {user.role.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && (
                                    <p className="text-sm text-red-500">{errors.user_id}</p>
                                )}
                                <div className="p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Catatan:</strong> Anda dapat mengajukan surat ke Kepala atau user lain yang memiliki privilege disposisi.
                                    </p>
                                </div>
                            </div>

                            {/* Pesan Tambahan */}
                            <div className="space-y-2">
                                <Label htmlFor="pesan_tambahan">Pesan Tambahan</Label>
                                <Textarea
                                    id="pesan_tambahan"
                                    value={data.pesan_tambahan}
                                    onChange={(e) => setData("pesan_tambahan", e.target.value)}
                                    placeholder="Tambahkan catatan atau instruksi khusus untuk penerima surat..."
                                    rows={4}
                                />
                                {errors.pesan_tambahan && (
                                    <p className="text-sm text-red-500">{errors.pesan_tambahan}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    Gunakan kolom ini untuk memberikan konteks, prioritas, atau instruksi khusus yang diperlukan.
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Send className="h-4 w-4" />
                                    {processing ? "Mengajukan..." : "Ajukan Surat"}
                                </Button>
                                <Link href={`/admin/surat-masuk/${suratMasuk.id}`}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">💡 Informasi Pengajuan</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Setelah diajukan, surat akan muncul di dashboard kepala yang dipilih</li>
                        <li>• Kepala dapat melakukan disposisi lebih lanjut ke PMO atau pegawai</li>
                        <li>• Status surat akan berubah menjadi "diajukan" dan tidak dapat diedit</li>
                        <li>• Anda akan tetap dapat melihat progress disposisi surat ini</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
