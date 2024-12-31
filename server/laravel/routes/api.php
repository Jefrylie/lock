<?php

use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\LockAuthMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/media', 'App\Http\Controllers\ImageController@show');


Route::get('/user', 'App\Http\Controllers\UserController@index');
Route::get('/user/show/{id}', 'App\Http\Controllers\UserController@show');
Route::post('/user/edit/{id}', 'App\Http\Controllers\UserController@update');
Route::post('/user/edit/v3/{id}', 'App\Http\Controllers\UserController@changePassword');

Route::post('/user/v1', 'App\Http\Controllers\UserController@loginUser');
Route::post('/user/register', 'App\Http\Controllers\UserController@store');
Route::post('/user/token', 'App\Http\Controllers\UserController@getUserByToken');
Route::post('/user/recover-password', 'App\Http\Controllers\UserController@recoverPassword');
Route::post('/user/token-recover-password', 'App\Http\Controllers\UserController@tokenRecoverPassword');
Route::post('/user/check-token-recover-password', 'App\Http\Controllers\UserController@checkTokenRecoverPassword');
Route::post('/user/tokenup', 'App\Http\Controllers\UserController@updateTokenUser');

Route::middleware([AuthMiddleware::class])->group(function () {
    Route::get('/v1/lock', 'App\Http\Controllers\ConnectedLockController@getLock');
    Route::get('/v1/history/{lockId}', 'App\Http\Controllers\UnlockHistoryController@getLockHistory');

    Route::get('/user/logout', 'App\Http\Controllers\UserController@logout');
});

Route::middleware([LockAuthMiddleware::class])->group(function () {
    Route::post('/v1/upload-image', 'App\Http\Controllers\UnlockHistoryController@store');
});
