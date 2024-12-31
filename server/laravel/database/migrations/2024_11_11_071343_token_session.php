<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('token_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('token');
            $table->timestamp('expiry')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('purpose');
            $table->foreignId('lockId')->nullable()->constrained('locks')->onDelete('cascade');
            $table->foreignId('userId')->nullable()->constrained('users')->onDelete('cascade');
            $table->boolean('valid');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('token_sessions');
    }
};
