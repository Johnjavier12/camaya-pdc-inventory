<?php

namespace App\Models;

use App\Traits\HasPermissionTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    use HasPermissionTrait;

    protected $guarded = [];
}
