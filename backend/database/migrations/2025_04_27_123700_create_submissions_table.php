<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();

            // Foreign key to conference_user
            $table->unsignedBigInteger('conference_user_id');
            $table->foreign('conference_user_id')
                ->references('id')
                ->on('conference_user')
                ->onDelete('cascade');

            // Foreign key to users (reviewer)
            $table->unsignedBigInteger('reviewer_id')->nullable();
            $table->foreign('reviewer_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete(); // If reviewer gets deleted, set reviewer_id to NULL

            // EasyChair-like fields
            $table->string('title');
            $table->text('abstract');
            $table->text('keywords'); // Each keyword on a new line
            $table->text('authors');  // Each author on a new line

            $table->string('file_name'); // Original file name (e.g., "mypaper.pdf")
            $table->string('file_path'); // Hashed version stored here (e.g., "uP82h23h87dh23hd.pdf")

            // Submission status: pending, accepted, rejected
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            $table->timestamps(); // created_at = submission time, updated_at = last modification
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
