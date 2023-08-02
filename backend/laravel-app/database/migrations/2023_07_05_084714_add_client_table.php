<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_clients', function (Blueprint $table) {
            $table->id();
            $table->integer('client_code')->nullable(false);
            $table->string('first_name',255)->nullable(false);
            $table->string('middle_name',255)->nullable();
            $table->string('last_name',255)->nullable(false);
            $table->string('suffix',255)->nullable();
            $table->string('email',255)->nullable();
            $table->string('contact_number',255)->nullable();
            $table->integer('phase_id')->nullable();
            $table->integer('property_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        /*
          ALTER TABLE `pdc_db`.`tbl_clients` CHANGE COLUMN `client_code` `client_code` INT(6) UNSIGNED ZEROFILL NOT NULL ;
       */
      
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_clients');
    }
}
