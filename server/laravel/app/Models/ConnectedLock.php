<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConnectedLock extends Model
{
    use HasFactory;

    public function lock()
    {
        return $this->belongsTo(Lock::class, 'lockId');
    }   

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }  
}
?>