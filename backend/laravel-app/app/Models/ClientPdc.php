<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientPdc extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_client_pdc';

    protected $fillable = [
        'client_id',
        'client_bank_id',
        'check_number',
        'check_date',
        'amount',
        'date_recieved',
        'pdc_location',
        'payment_details',
        'status'
    ];

    public function paymentHistory ()
    {
        return $this->hasMany('App\Models\PaymentHistory','client_id','client_id');
    }
}
