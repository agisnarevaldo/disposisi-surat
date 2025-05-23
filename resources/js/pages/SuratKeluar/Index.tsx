import React, { useState } from "react";
import { Head, Link, usePage, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SharedData } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Keluar', href: '/surat-keluar' },
];

type SuratKeluar = {
    id: number;
    no_surat: string;
    tanggal_surat: string;
    kepada: string;
    status: string;
    jenis_surat?: string;
    pembuat?: { name: string };
    keterangan_tindak_lanjut?: string;
};

export default function Index() {
    const { props } = usePage<SharedData>();
    const suratKeluars: SuratKeluar[] = (props.suratKeluars ?? []) as SuratKeluar[];
    const [status, setStatus] = useState<string>("all");
    const [jenis, setJenis] = useState<string>("all");
    const [openTindakLanjut, setOpenTindakLanjut] = useState<number | null>(null);
    const { auth } = usePage<SharedData>().props;

    // Ambil semua jenis unik dari data
    const jenisOptions = Array.from(new Set(suratKeluars.map(s => s.jenis_surat).filter((v): v is string => typeof v === "string")));
    const statusOptions = Array.from(new Set(suratKeluars.map(s => s.status).filter((v): v is string => typeof v === "string")));

    // Filter data client-side
    const filtered = suratKeluars.filter(surat => {
        const statusMatch = status === "all" || surat.status === status;
        const jenisMatch = jenis === "all" || surat.jenis_surat === jenis;
        return statusMatch && jenisMatch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Keluar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Daftar Surat Keluar</h1>
                    <div className="flex gap-2 items-center">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={jenis} onValueChange={setJenis}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Jenis Surat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                {jenisOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Link href="/surat-keluar/create">
                            <Button className="dark:text-white cursor-pointer">+ Tambah Surat</Button>
                        </Link>
                    </div>
                </div>
                <div className="rounded-xl shadow p-2 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No Surat</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Kepada</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Jenis Surat</TableHead>
                                <TableHead>Dibuat oleh</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-500">Belum ada surat keluar.</TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((surat) => (
                                    <TableRow key={surat.id}>
                                        <TableCell>{surat.no_surat}</TableCell>
                                        <TableCell>{surat.tanggal_surat}</TableCell>
                                        <TableCell>{surat.kepada}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${surat.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {surat.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{surat.jenis_surat ?? '-'}</TableCell>
                                        <TableCell>{surat.pembuat?.name ?? '—'}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Link
                                                href={`/surat-keluar/${surat.id}`}
                                                className="text-secondary bg-secondary/10 hover:bg-secondary/20 px-2 py-1 rounded border text-xs"
                                            >
                                                <EyeIcon />
                                            </Link>

                                            <Link
                                                href={`/surat-keluar/${surat.id}/edit`}
                                                className="text-accent bg-accent/10 hover:bg-accent/20 px-2 py-1 rounded border border-blue-10 text-xs"
                                            >
                                                <PencilIcon />
                                            </Link>

                                            {/* Tombol Tindak Lanjut hanya untuk kepala */}
                                            {auth?.user?.role === 'kepala' && (
                                                <>
                                                    <Button
                                                        variant="secondary"
                                                        className="px-2 py-1 rounded border text-xs cursor-pointer"
                                                        onClick={() => setOpenTindakLanjut(surat.id)}
                                                    >
                                                        Tindak Lanjut
                                                    </Button>
                                                    <TindakLanjutDialog
                                                        surat={surat}
                                                        open={openTindakLanjut === surat.id}
                                                        onOpenChange={open => setOpenTindakLanjut(open ? surat.id : null)}
                                                    />
                                                </>
                                            )}

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="px-2 py-1 rounded bordertext-xs cursor-pointer"
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
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

                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}

// Komponen dialog tindak lanjut
function TindakLanjutDialog({ surat, open, onOpenChange }: { surat: SuratKeluar, open: boolean, onOpenChange: (open: boolean) => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        keterangan_tindak_lanjut: surat.keterangan_tindak_lanjut || "",
        tanggal_tindak_lanjut: new Date().toISOString().slice(0, 10),
        status: surat.status === "selesai" ? "selesai" : "ditindaklanjuti",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/surat-keluar/${surat.id}/tindak-lanjut`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tindak Lanjut Surat Keluar</DialogTitle>
                    <DialogDescription>Isi keterangan, tanggal, dan status tindak lanjut surat keluar.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <div>
                        <Label htmlFor="keterangan_tindak_lanjut">Keterangan</Label>
                        <Input
                            id="keterangan_tindak_lanjut"
                            value={data.keterangan_tindak_lanjut}
                            onChange={e => setData("keterangan_tindak_lanjut", e.target.value)}
                            required
                        />
                        {errors.keterangan_tindak_lanjut && <div className="text-red-500 text-xs mt-1">{errors.keterangan_tindak_lanjut}</div>}
                    </div>
                    <div>
                        <Label htmlFor="tanggal_tindak_lanjut">Tanggal Tindak Lanjut</Label>
                        <Input
                            id="tanggal_tindak_lanjut"
                            type="date"
                            value={data.tanggal_tindak_lanjut}
                            onChange={e => setData("tanggal_tindak_lanjut", e.target.value)}
                            required
                        />
                        {errors.tanggal_tindak_lanjut && <div className="text-red-500 text-xs mt-1">{errors.tanggal_tindak_lanjut}</div>}
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={e => setData("status", e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="ditindaklanjuti">Ditindaklanjuti</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
