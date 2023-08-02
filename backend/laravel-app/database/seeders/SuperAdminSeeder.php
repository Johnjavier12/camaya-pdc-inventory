<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch all permissions
        $permissions = Permission::all();

        // Retrieve the existing system administrator role
        $role = Role::where('name', 'System Administrator')->first();

        // Create a new super admin user
        try{
            $superAdmin = User::firstOrCreate([
                'name' => "Super Admin",
                'email' => "super@admin.com",
                'first_name' => "Super",
                'middle_name' => "-",
                'last_name' => "Admin",
                'user_type' => "Admin",
                'role_id' => 1,
                'is_active' => true,
                'password' => Hash::make('admin_password')
            ]);
    
            foreach ($permissions as $permission) {
                if (!$role->hasPermissionTo($permission)) {
                    $permission->roles()->attach($role);
                }
            }
            
           if(!$superAdmin->hasRole($role)){
                $superAdmin->assignRole([
                    ['value' => $role->description]
                ]);
           }
        }
        catch(Exception $e){
            
        }
        
    }
}
