<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class KepalaMiddleware
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
        
        // Pastikan user memiliki role kepala
        if (Auth::user()->role !== 'kepala') {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
