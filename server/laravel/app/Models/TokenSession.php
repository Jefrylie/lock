<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenSession extends Model
{
    use HasFactory;

    public function lock()
    {
        return $this->belongsTo(Lock::class, 'lockId'); // Foreign key 'lockId'
    }

    // Menentukan relasi dengan model User
    public function user()
    {
        return $this->belongsTo(User::class, 'userId'); // Foreign key 'userId'
    }
}
?>