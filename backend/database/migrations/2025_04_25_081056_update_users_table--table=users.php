<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // You can safely drop 'name' only if it exists and you're sure
            $table->dropColumn('name'); 

            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('country')->nullable()->after('email');
            $table->string('phone')->nullable()->after('country');
            $table->string('affiliation')->nullable()->after('phone');
            $table->string('role')->default('Participant')->after('affiliation');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'phone', 'affiliation', 'country', 'role']);
            $table->string('name')->after('id');
        });
    }
};
