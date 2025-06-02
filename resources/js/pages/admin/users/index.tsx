import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { 
    Users, UserPlus, Edit, Trash2, Eye, Shield, Search, 
    Filter, MoreHorizontal, Crown, UserCheck, UserX,
    Building, Phone, Mail, Badge as BadgeIcon
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/users' },
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

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        role?: string;
    };
    stats: {
        total: number;
        admin: number;
        kepala: number;
        pmo: number;
        pegawai: number;
        can_dispose: number;
    };
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
        case 'admin': return <Crown className="h-3 w-3" />;
        case 'kepala': return <Shield className="h-3 w-3" />;
        case 'pmo': return <UserCheck className="h-3 w-3" />;
        case 'pegawai': return <Users className="h-3 w-3" />;
        default: return <Users className="h-3 w-3" />;
    }
};

export default function UsersIndex({ users, filters, stats }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const handleSearch = () => {
        router.get('/admin/users', {
            search: search || undefined,
            role: roleFilter === 'all' ? undefined : roleFilter,
        }, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setRoleFilter('all');
        router.get('/admin/users');
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            preserveState: true,
        });
    };

    const handleTogglePrivilege = (id: number) => {
        router.post(`/admin/users/${id}/toggle-privilege`, {}, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
                        <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Tambah User
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-sm text-gray-600">Total User</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Crown className="h-5 w-5 text-red-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.admin}</p>
                                    <p className="text-sm text-gray-600">Admin</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.kepala}</p>
                                    <p className="text-sm text-gray-600">Kepala</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.pmo}</p>
                                    <p className="text-sm text-gray-600">PMO</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.pegawai}</p>
                                    <p className="text-sm text-gray-600">Pegawai</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <BadgeIcon className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.can_dispose}</p>
                                    <p className="text-sm text-gray-600">Can Dispose</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Cari nama, email, atau NIP..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Role</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="kepala">Kepala</SelectItem>
                                        <SelectItem value="pmo">PMO</SelectItem>
                                        <SelectItem value="pegawai">Pegawai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSearch}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-4 font-medium text-gray-900">User</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Role</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Jabatan</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Kontak</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Privilege</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-400">NIP: {user.nip}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-900">{user.jabatan}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    {user.no_hp && (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Phone className="h-3 w-3 mr-1" />
                                                            {user.no_hp}
                                                        </div>
                                                    )}
                                                    {user.alamat && (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Building className="h-3 w-3 mr-1" />
                                                            {user.alamat.length > 30 ? user.alamat.substring(0, 30) + '...' : user.alamat}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={user.can_dispose}
                                                        onCheckedChange={() => handleTogglePrivilege(user.id)}
                                                        disabled={user.role === 'kepala'}
                                                    />
                                                    <span className="text-xs text-gray-600">
                                                        {user.can_dispose ? 'Dapat Disposisi' : 'Tidak Dapat'}
                                                    </span>
                                                </div>
                                                {user.keterangan_privilege && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {user.keterangan_privilege}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/users/${user.id}/edit`}>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>? 
                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {users.from} sampai {users.to} dari {users.total} user
                        </p>
                        <div className="flex space-x-2">
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === users.current_page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => router.get(`/admin/users?page=${page}`)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
