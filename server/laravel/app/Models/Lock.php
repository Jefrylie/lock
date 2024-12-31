<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lock extends Model
{
    use HasFactory;

    public function tokenSessions()
    {
        return $this->hasMany(TokenSession::class, 'lockId');
    }

    public function connectedLock()
    {
        return $this->hasMany(ConnectedLock::class, 'lockId');
    }
}
?>