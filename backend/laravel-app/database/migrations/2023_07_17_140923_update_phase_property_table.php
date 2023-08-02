<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePhasePropertyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tbl_phase_properties', function (Blueprint $table) {
            $table->string('address')->nullable()->after('block_lot_number');
            $table->string('street')->nullable()->after('block_lot_number');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_phase_properties', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('street');
        });
    }
}
