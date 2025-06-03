import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/users' },
    { title: 'Tambah User', href: '/admin/users/create' },
];

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        jabatan: '',
        nip: '',
        alamat: '',
        no_hp: '',
        can_dispose: false as boolean,
        keterangan_privilege: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            preserveScroll: true,
        });
    };

    // Reset can_dispose when role changes
    useEffect(() => {
        if (data.role && data.role !== 'pegawai') {
            setData('can_dispose', false);
            setData('keterangan_privilege', '');
        }
    }, [data.role]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah User" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tambah User</h1>
                        <p className="text-gray-600">Buat akun pengguna baru untuk sistem</p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Informasi User
                        </CardTitle>
                        <CardDescription>
                            Lengkapi informasi berikut untuk membuat akun pengguna baru
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Lengkap */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Dr. Ahmad Susanto"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Contoh: ahmad.susanto@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Konfirmasi Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="kepala">Kepala</SelectItem>
                                            <SelectItem value="pmo">PMO</SelectItem>
                                            <SelectItem value="pegawai">Pegawai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">{errors.role}</p>
                                    )}
                                </div>

                                {/* Jabatan */}
                                <div className="space-y-2">
                                    <Label htmlFor="jabatan">Jabatan *</Label>
                                    <Input
                                        id="jabatan"
                                        type="text"
                                        value={data.jabatan}
                                        onChange={(e) => setData('jabatan', e.target.value)}
                                        placeholder="Contoh: Kepala Divisi IT"
                                    />
                                    {errors.jabatan && (
                                        <p className="text-sm text-red-500">{errors.jabatan}</p>
                                    )}
                                </div>

                                {/* NIP */}
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP *</Label>
                                    <Input
                                        id="nip"
                                        type="text"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        placeholder="Contoh: 198712345678901234"
                                    />
                                    {errors.nip && (
                                        <p className="text-sm text-red-500">{errors.nip}</p>
                                    )}
                                </div>

                                {/* No HP */}
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp">No. Handphone</Label>
                                    <Input
                                        id="no_hp"
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                    />
                                    {errors.no_hp && (
                                        <p className="text-sm text-red-500">{errors.no_hp}</p>
                                    )}
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    placeholder="Alamat lengkap pengguna"
                                    rows={3}
                                />
                                {errors.alamat && (
                                    <p className="text-sm text-red-500">{errors.alamat}</p>
                                )}
                            </div>

                            {/* Privilege Section */}
                            {data.role && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                    {data.role === 'pegawai' ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="can_dispose" className="text-base font-medium">
                                                        Hak Akses Disposisi
                                                    </Label>
                                                    <p className="text-sm text-gray-600">
                                                        Berikan hak untuk melakukan disposisi surat ke pegawai lain
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="can_dispose"
                                                    checked={data.can_dispose}
                                                    onCheckedChange={(checked) => setData('can_dispose', checked)}
                                                />
                                            </div>

                                            {data.can_dispose && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="keterangan_privilege">Keterangan Privilege</Label>
                                                    <Textarea
                                                        id="keterangan_privilege"
                                                        value={data.keterangan_privilege}
                                                        onChange={(e) => setData('keterangan_privilege', e.target.value)}
                                                        placeholder="Jelaskan alasan memberikan hak disposisi (opsional)"
                                                        rows={2}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center text-sm text-gray-600">
                                            <p className="font-medium text-blue-700">
                                                Role {data.role} secara otomatis memiliki hak disposisi
                                            </p>
                                            <p>Tidak perlu pengaturan tambahan untuk privilege</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Role Information */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Informasi Role:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li><strong>Admin:</strong> Akses penuh ke sistem, dapat mengelola user dan surat</li>
                                    <li><strong>Kepala:</strong> Dapat menerima dan mendisposisi surat dari admin</li>
                                    <li><strong>PMO:</strong> Dapat menerima disposisi dari kepala dan mendisposisi ke pegawai</li>
                                    <li><strong>Pegawai:</strong> Menerima disposisi, dapat diberi hak disposisi khusus</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
