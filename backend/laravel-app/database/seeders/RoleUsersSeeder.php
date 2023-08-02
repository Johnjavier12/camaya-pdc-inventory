<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class RoleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles_users')->insert([
            'user_id' => 1,
            'role_id' => 1
        ]);
    }
}
