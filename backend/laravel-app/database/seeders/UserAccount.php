<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserAccount extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = Role::where('name', 'System Administrator')->first();
        $user = User::create([
            'name' => 'john javier idmilao',
            'email' => 'jhayjhay2@gmail.com',
            'first_name' => 'john javier',
            'middle_name' => '-',
            'last_name' => 'idmilao',
            'user_type' => 'admin',
            'role_id' => 1,
            'is_active' => 1,
            'password' => bcrypt('jhayjhay')
        ]);
        $user->assignRoles([
            ['value' => $role->description]
        ]);
    }
}
