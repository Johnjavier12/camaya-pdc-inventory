<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $superAdmin = Role::firstOrCreate(
            ['name' => 'System Administrator'],
            ['description' => 'system-administrator']
        );
        
        $fullAdmin = Role::firstOrCreate(
            ['name' => 'Full Administrator'],
            ['description' => 'full-administrator']
        );
        
        $subAdmin = Role::firstOrCreate(
            ['name' => 'Subdivision Administrator'],
            ['description' => 'subdivision-administrator']
        );
        
    }
}
