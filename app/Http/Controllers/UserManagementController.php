<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class UserManagementController extends Controller
{
    // Tampilkan daftar users
    public function index(Request $request)
    {
        $search = $request->get('search');
        $roleFilter = $request->get('role');
        
        $users = User::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%")
                           ->orWhere('nip', 'like', "%{$search}%");
            })
            ->when($roleFilter, function ($query, $role) {
                return $query->where('role', $role);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return inertia('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'stats' => [
                'total' => User::count(),
                'admin' => User::where('role', 'admin')->count(),
                'kepala' => User::where('role', 'kepala')->count(),
                'pmo' => User::where('role', 'pmo')->count(),
                'pegawai' => User::where('role', 'pegawai')->count(),
                'can_dispose' => User::where('can_dispose', true)->count(),
            ]
        ]);
    }

    // Tampilkan form tambah user
    public function create()
    {
        return inertia('admin/users/create');
    }

    // Simpan user baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,kepala,pmo,pegawai',
            'jabatan' => 'required|string|max:255',
            'nip' => 'required|string|max:50|unique:users',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'can_dispose' => 'sometimes|boolean',
            'keterangan_privilege' => 'nullable|string',
        ]);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);
        
        // Set can_dispose default for roles
        if (!isset($validated['can_dispose'])) {
            $validated['can_dispose'] = false;
        }
        
        // Automatically set can_dispose for kepala and pmo roles
        if (in_array($validated['role'], ['kepala', 'pmo'])) {
            $validated['can_dispose'] = true;
        }
        
        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil ditambahkan.');
    }

    // Tampilkan detail user
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        return inertia('admin/users/show', [
            'user' => $user,
        ]);
    }

    // Tampilkan form edit user
    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        return inertia('admin/users/edit', [
            'user' => $user,
        ]);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', Rules\Password::defaults()],
            'role' => 'required|in:admin,kepala,pmo,pegawai',
            'jabatan' => 'required|string|max:255',
            'nip' => 'required|string|max:50|unique:users,nip,' . $user->id,
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'can_dispose' => 'boolean',
            'keterangan_privilege' => 'nullable|string',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        
        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbarui.');
    }

    // Hapus user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Jangan hapus admin sendiri
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }
        
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus.');
    }

    // Toggle privilege disposisi
    public function togglePrivilege($id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'can_dispose' => !$user->can_dispose
        ]);

        $status = $user->can_dispose ? 'diberikan' : 'dicabut';
        
        return back()->with('success', "Privilege disposisi {$status} untuk {$user->name}.");
    }
}
