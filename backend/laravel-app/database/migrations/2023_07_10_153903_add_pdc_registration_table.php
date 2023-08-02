<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPdcRegistrationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_client_pdc', function (Blueprint $table) {
            $table->id();
            $table->integer('client_id')->nullable(false);
            $table->integer('client_bank_id')->nullable(false);
            $table->string('check_number')->nullable(false);
            $table->date('check_date')->nullable(false);
            $table->decimal('amount',8,2)->nullable();
            $table->date('date_recieved')->nullable();
            $table->string('pdc_location')->nullable();
            $table->string('payment_details',500)->nullable();
            $table->string('status',255)->nullable();
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
        Schema::dropIfExists('tbl_client_pdc');
    }
}
