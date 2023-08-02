<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ClientBank extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_client_bank', function (Blueprint $table) {
            $table->id();
            $table->integer('client_id')->nullable(false);
            $table->integer('property_id')->nullable(false);
            $table->string('account_number', 255)->nullable(false);
            $table->decimal('amount',8,2)->nullable();
            $table->string('bank_name', 255)->nullable(false);
            $table->string('bank_branch', 255)->nullable();
            $table->string('remarks', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_clients_property');
    }
}
