<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class WipeAllTables extends Command
{
    protected $signature = 'db:wipe-all';
    protected $description = 'Truncate all tables (CAREFUL!)';

    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $tables = DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            if ($tableName !== 'migrations') {
                DB::table($tableName)->truncate();
                $this->info("Truncated {$tableName}");
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->info('All tables truncated (except migrations).');
    }
}
