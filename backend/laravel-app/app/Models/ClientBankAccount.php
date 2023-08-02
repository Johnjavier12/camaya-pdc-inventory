<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientBankAccount extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'tbl_client_bank';

    protected $fillable = [
        'client_id',
        'property_id',
        'account_number',
        'amount',
        'bank_name',
        'bank_branch',
        'remarks',
    ];
}
