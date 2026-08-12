<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('request_logs', function (Blueprint $table) {

        $table->id();

        $table->string('user_id')->nullable();

        $table->string('method');

        $table->string('url');

        $table->string('controller')->nullable();

        $table->integer('status');

        $table->string('result');

        $table->string('ip');

        $table->json('request')->nullable();

        $table->decimal('response_time', 8, 2);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_logs');
    }
};
