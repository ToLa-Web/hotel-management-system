<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up()
    {
        $tables = ['users', 'hotels', 'room_types', 'rooms', 'reservations', 'payments', 'reviews'];

        foreach ($tables as $tableName) {
            if (!Schema::hasColumn($tableName, 'uuid')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->uuid('uuid')->nullable()->unique()->after('id');
                });
            }
        }

        // Backfill existing rows with UUIDs
        foreach ($tables as $table) {
            $rows = DB::table($table)->whereNull('uuid')->get();
            foreach ($rows as $row) {
                DB::table($table)->where('id', $row->id)->update(['uuid' => Str::uuid()]);
            }
        }

        // Make uuid NOT NULL after backfill (raw SQL to avoid doctrine/dbal dependency)
        foreach ($tables as $tableName) {
            DB::statement("ALTER TABLE `{$tableName}` MODIFY `uuid` CHAR(36) NOT NULL");
        }
    }

    public function down()
    {
        $tables = ['users', 'hotels', 'room_types', 'rooms', 'reservations', 'payments', 'reviews'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropColumn('uuid');
            });
        }
    }
};
