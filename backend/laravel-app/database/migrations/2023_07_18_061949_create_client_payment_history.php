<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientPaymentHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_client_payment_history', function (Blueprint $table) {
            $table->id();
            $table->integer('pdc_id')->nullable(false);
            $table->integer('client_id')->nullable(false);
            $table->integer('bank_id')->nullable(false);
            $table->decimal('amount_paid',8,2)->nullable(false);
            $table->string('check_number',255)->nullable(false);
            $table->date('check_date')->nullable(false);
            $table->string('status',255)->nullable(false);
            $table->string('payment_details',500)->nullable();
            $table->date('transaction_date')->nullable(false);
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
        Schema::dropIfExists('tbl_client_payment_history');
    }
}
