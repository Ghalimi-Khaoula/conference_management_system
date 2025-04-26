<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('conferences', function (Blueprint $table) {
            $table->id();

            // Visibility: public or private
            $table->enum('visibility', ['public', 'private'])->default('public');

            // Basic details
            $table->string('installation_type')->default('conference');
            $table->string('title');
            $table->string('acronym')->nullable();

            // Location info
            $table->string('web_page')->nullable();
            $table->string('venue')->nullable();
            $table->string('city');
            $table->string('country');

            // Dates
            $table->date('start_date');
            $table->date('end_date');

            // Submission stats
            $table->integer('estimated_submissions')->default(0);

            // Research areas
            $table->string('primary_area');
            $table->string('secondary_area')->nullable();
            $table->text('area_notes')->nullable();

            // Organizer info
            $table->string('organizer_name');
            $table->string('organizer_web_page')->nullable();
            $table->string('contact_phone');

            // Additional info + request status
            $table->text('additional_info')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conferences');
    }
};
