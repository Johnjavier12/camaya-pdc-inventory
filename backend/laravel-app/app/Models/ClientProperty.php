<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientProperty extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_clients_property';

    protected $fillable = [
        'client_id',
        'phase_id',
        'property_id',
    ];
}
