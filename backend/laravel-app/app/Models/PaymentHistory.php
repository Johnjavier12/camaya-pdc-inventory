<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_client_payment_history';

    protected $fillable = [
        'pdc_id',
        'client_id',
        'bank_id',
        'amount_paid',
        'check_number',
        'check_date',
        'status',
        'payment_details',
        'transaction_date'
    ];
}
