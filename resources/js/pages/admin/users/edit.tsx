import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Edit, ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/users' },
    { title: 'Edit User', href: '#' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    jabatan: string;
    nip: string;
    alamat: string | null;
    no_hp: string | null;
    can_dispose: boolean;
    keterangan_privilege: string | null;
}

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        jabatan: user.jabatan,
        nip: user.nip,
        alamat: user.alamat || '',
        no_hp: user.no_hp || '',
        can_dispose: user.can_dispose,
        keterangan_privilege: user.keterangan_privilege || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                        <p className="text-gray-600">Perbarui informasi pengguna {user.name}</p>
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
                            <Edit className="h-5 w-5" />
                            Informasi User
                        </CardTitle>
                        <CardDescription>
                            Perbarui informasi user sesuai kebutuhan
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
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Kosongkan jika tidak ingin mengubah password
                                    </p>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Konfirmasi Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password baru"
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
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="can_dispose" className="text-base font-medium">
                                            Hak Akses Disposisi
                                        </Label>
                                        <p className="text-sm text-gray-600">
                                            {data.role === 'kepala' || data.role === 'pmo' 
                                                ? 'Role ini secara otomatis memiliki hak disposisi'
                                                : 'Berikan hak untuk melakukan disposisi surat ke pegawai lain'
                                            }
                                        </p>
                                    </div>
                                    <Switch
                                        id="can_dispose"
                                        checked={data.can_dispose}
                                        onCheckedChange={(checked) => setData('can_dispose', checked)}
                                        disabled={data.role === 'kepala' || data.role === 'pmo'}
                                    />
                                </div>

                                {(data.can_dispose || data.role === 'kepala' || data.role === 'pmo') && (
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

                                {data.role === 'kepala' || data.role === 'pmo' ? (
                                    <div className="p-3 bg-blue-100 rounded-md">
                                        <p className="text-sm text-blue-800">
                                            <strong>Catatan:</strong> Role {data.role.toUpperCase()} secara otomatis memiliki hak disposisi sesuai hierarki sistem.
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
