import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ArrowLeft, Edit, User, Mail, Phone, Building, 
    Badge as BadgeIcon, Calendar, Shield, Crown, 
    UserCheck, Users, Key, MapPin
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/users' },
    { title: 'Detail User', href: '#' },
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
    created_at: string;
    updated_at: string;
}

interface ShowUserProps {
    user: User;
}

const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-100 text-red-800';
        case 'kepala': return 'bg-purple-100 text-purple-800';
        case 'pmo': return 'bg-blue-100 text-blue-800';
        case 'pegawai': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'admin': return <Crown className="h-4 w-4" />;
        case 'kepala': return <Shield className="h-4 w-4" />;
        case 'pmo': return <UserCheck className="h-4 w-4" />;
        case 'pegawai': return <Users className="h-4 w-4" />;
        default: return <Users className="h-4 w-4" />;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function ShowUser({ user }: ShowUserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail User - ${user.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detail User</h1>
                        <p className="text-gray-600">Informasi lengkap pengguna sistem</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <User className="h-10 w-10 text-gray-500" />
                                </div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription className="flex items-center justify-center gap-2">
                                    <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                                        {getRoleIcon(user.role)}
                                        {user.role.toUpperCase()}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <BadgeIcon className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">NIP</p>
                                        <p className="text-sm text-gray-600">{user.nip}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Jabatan</p>
                                        <p className="text-sm text-gray-600">{user.jabatan}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>

                                {user.no_hp && (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium">No. Handphone</p>
                                            <p className="text-sm text-gray-600">{user.no_hp}</p>
                                        </div>
                                    </div>
                                )}

                                {user.alamat && (
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Alamat</p>
                                            <p className="text-sm text-gray-600">{user.alamat}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Access Privileges */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Hak Akses & Privilege
                                </CardTitle>
                                <CardDescription>
                                    Informasi hak akses dan privilege dalam sistem
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Role Sistem</p>
                                                <p className="text-sm text-gray-600">Level akses pengguna</p>
                                            </div>
                                            <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                                                {getRoleIcon(user.role)}
                                                {user.role.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Hak Disposisi</p>
                                                <p className="text-sm text-gray-600">Dapat mendisposisi surat</p>
                                            </div>
                                            <Badge className={user.can_dispose || user.role === 'kepala' || user.role === 'pmo' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                            }>
                                                {user.can_dispose || user.role === 'kepala' || user.role === 'pmo' ? 'Ya' : 'Tidak'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Role Explanation */}
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Deskripsi Role:</h4>
                                    <div className="text-sm text-blue-800">
                                        {user.role === 'admin' && (
                                            <p>Memiliki akses penuh ke sistem termasuk mengelola user, surat masuk, dan semua fitur administrasi.</p>
                                        )}
                                        {user.role === 'kepala' && (
                                            <p>Dapat menerima surat dari admin dan mendisposisi ke PMO atau user dengan privilege khusus.</p>
                                        )}
                                        {user.role === 'pmo' && (
                                            <p>Dapat menerima disposisi dari kepala dan mendisposisi surat ke pegawai lainnya.</p>
                                        )}
                                        {user.role === 'pegawai' && (
                                            <p>Menerima disposisi surat. {user.can_dispose ? 'Memiliki privilege khusus untuk mendisposisi ke pegawai lain.' : 'Tidak memiliki hak disposisi.'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Privilege Notes */}
                                {user.keterangan_privilege && (
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <h4 className="font-medium text-yellow-900 mb-2">Catatan Privilege:</h4>
                                        <p className="text-sm text-yellow-800">{user.keterangan_privilege}</p>
                                    </div>
                                )}

                                {/* Default Privileges by Role */}
                                {(user.role === 'kepala' || user.role === 'pmo') && (
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-medium text-green-900 mb-2">Privilege Default:</h4>
                                        <p className="text-sm text-green-800">
                                            Role {user.role.toUpperCase()} secara otomatis memiliki hak disposisi sesuai dengan hierarki sistem disposisi surat.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* System Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Informasi Sistem
                                </CardTitle>
                                <CardDescription>
                                    Data pembuatan dan pembaruan akun
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Tanggal Dibuat</p>
                                        <p className="text-sm text-gray-600">{formatDate(user.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Terakhir Diperbarui</p>
                                        <p className="text-sm text-gray-600">{formatDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
