<?php

namespace App\Http\Middleware;

use App\Models\Token;
use App\Models\TokenSession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Get the token from the request header
        $token = $request->header('Authorization');
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Check if the token exists in the tokens table
        $tokenModel = TokenSession::where('token', $token)
            ->join('users', 'token_sessions.userId', '=', 'users.id')
            ->first();

        if (!$tokenModel) {
            return response()->json(['error' => 'Invalid token or token has expired'], 401);
        }

        // Check if the token is expired
        if ($tokenModel->expiry && now()->gt($tokenModel->expiry)) {
            return response()->json(['error' => 'Token expired'], 401);
        }

        if (empty($tokenModel->valid)) {
            return response()->json(['error' => 'Invalid token or token has expired'], 401);
        }

        $request->merge([
            'user' => $tokenModel->user,
            'tokenMiddleware' => $token,
        ]);

        return $next($request);
    }
}
