<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Phase extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_phase';

    protected $fillable = [
        'phase_name',
        'phase_code',
        'is_deleted'
    ];
}
