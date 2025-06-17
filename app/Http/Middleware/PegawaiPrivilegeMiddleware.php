<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PegawaiPrivilegeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $user = Auth::user();
        
        // Pastikan user memiliki role pegawai dan memiliki privilege disposisi
        if ($user->role !== 'pegawai' || !$user->can_dispose) {
            abort(403, 'Anda tidak memiliki hak akses untuk halaman ini. Hanya pegawai dengan privilege disposisi yang dapat mengakses.');
        }

        return $next($request);
    }
}
