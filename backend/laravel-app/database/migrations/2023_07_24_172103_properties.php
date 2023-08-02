<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Properties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::table('tbl_phase_properties', function (Blueprint $table) {
            $table->integer('area')->nullable()->after('address');
            $table->string('type', 255)->nullable()->after('area');
            $table->decimal('price_per_sqm',10,4)->nullable()->after('type');
            $table->string('status', 255)->nullable()->after('price_per_sqm');
            $table->string('status2', 255)->nullable()->after('status');
            $table->string('color', 255)->nullable()->after('status2');
            $table->text('remarks')->nullable()->after('color');
            $table->string('property_type', 255)->nullable()->after('remarks');
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
            $table->dropColumn('area');
            $table->dropColumn('type');
            $table->dropColumn('price_per_sqm');
            $table->dropColumn('status');
            $table->dropColumn('status2');
            $table->dropColumn('color');
            $table->dropColumn('remarks');
            $table->dropColumn('property_type');
        });
    }
}
