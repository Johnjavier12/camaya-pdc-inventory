<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhaseProperties extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_phase_properties';

    protected $fillable = [
        'phase_id',
        'block_number',
        'block_lot_number',
        'address',
        'street',
        'is_deleted'
    ];
}
