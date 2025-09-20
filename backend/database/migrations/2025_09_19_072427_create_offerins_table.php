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
        Schema::create('offerings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->enum('offering_type', ['dog_walking', 'sitting', 'grooming', 'night_stay']);
            $table->decimal('price', 8, 2);
            $table->json('conditions')->nullable();
            $table->unsignedInteger('duration')->nullable();
            $table->timestamps();

            $table->index('offering_type');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
