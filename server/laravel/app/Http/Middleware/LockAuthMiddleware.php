<?php

namespace App\Http\Middleware;

use App\Models\ConnectedLock;
use App\Models\Lock;
use App\Models\TokenSession;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LockAuthMiddleware
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

        error_log($token);
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $newToken = 'Testing';
        //$newToken = Str::random(32);

        // Check if the token exists in the tokens table
        $tokenModel = TokenSession::where('token', $token)->first();

        error_log('testing');

        $checkConnectedLock = ConnectedLock::where('lockId', $tokenModel->lockId)->get();

        if (!$checkConnectedLock) {
            return response()->json(['error' => 'The lock is not connected to the user.'], 401);
        }

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

        $tokenModel->token = $newToken;
        $tokenModel->save();

        //$updateTokenLock = Lock::where('id', $tokenModel->lockId)->first();
       // $updateTokenLock->auth_token = $newToken;
        //$updateTokenLock->save();

        error_log('testing');

        $request->merge([
            'lockId' => $tokenModel->lockId,
        ]);

        return $next($request);
    }
}
