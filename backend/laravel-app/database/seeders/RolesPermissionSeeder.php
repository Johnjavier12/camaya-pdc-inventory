<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
class RolesPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $superAdmin = Role::firstOrCreate(
        //     ['name' => 'System Administrator'],
        //     ['description' => 'system-administrator']
        // );
        
        // $showDashboardArmyNavy = Permission::firstOrCreate(
        //     ['name' => "Show All Users Access"],
        //     ['description' => "show-all-users-access"]
        // );
        // $showDashboardArmyNavy->roles()->attach($superAdmin);
    }
}
