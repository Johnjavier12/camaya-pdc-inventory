<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'name' => 'View Dashboard',
                'description' => 'view-dashboard',
                'module' => 'Dashboard',
            ],
            [
                'name' => 'Export Daily Checks',
                'description' => 'export-daily-checks-in-dashboard',
                'module' => 'Dashboard',
            ],
            [
                'name' => 'Update Daily Checks Status',
                'description' => 'update-daily-check-status-in-dashboard',
                'module' => 'Dashboard',
            ],
            [
                'name' => 'View Clients',
                'description' => 'view-client-registration',
                'module' => 'Client Registration',
            ],
            [
                'name' => 'Add Client',
                'description' => 'create-client-registration',
                'module' => 'Client Registration',
            ],
            [
                'name' => 'Update Client',
                'description' => 'update-client-registration',
                'module' => 'Client Registration',
            ],
            [
                'name' => 'Remove Client',
                'description' => 'remove-client-registration',
                'module' => 'Client Registration',
            ],
            [
                'name' => 'Assign Property to Client',
                'description' => 'assign-property-to-client-registration',
                'module' => 'Client Registration',
            ],
            [
                'name' => 'View PDC',
                'description' => 'view-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'Add Client Bank',
                'description' => 'create-client-bank-in-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'Export Bank List ',
                'description' => 'export-bank-list-in-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'Update PDC',
                'description' => 'update-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'Remove PDC',
                'description' => 'remove-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'Register PDC',
                'description' => 'create-pdc-registration',
                'module' => 'PDC Registration',
            ],
            [
                'name' => 'View Properties',
                'description' => 'view-property',
                'module' => 'Property Management',
            ],
            [
                'name' => 'Update Property',
                'description' => 'update-property',
                'module' => 'Property Management',
            ],
            [
                'name' => 'Remove Property',
                'description' => 'remove-property',
                'module' => 'Property Management',
            ],
            [
                'name' => 'Create Property',
                'description' => 'create-property',
                'module' => 'Property Management',
            ],
            [
                'name' => 'Create Phase',
                'description' => 'create-phase-property',
                'module' => 'Property Management',
            ],
            [
                'name' => 'View PDC Report',
                'description' => 'view-pdc-report',
                'module' => 'PDC Report',
            ],
            [
                'name' => 'Export PDC Report',
                'description' => 'export-pdc-report',
                'module' => 'PDC Report',
            ],
            [
                'name' => 'View User Management',
                'description' => 'view-user',
                'module' => 'User Management',
            ],
            [
                'name' => 'Update User',
                'description' => 'update-user',
                'module' => 'User Management',
            ],
            [
                'name' => 'Create User',
                'description' => 'create-user',
                'module' => 'User Management',
            ],
            [
                'name' => 'Remove User',
                'description' => 'remove-user',
                'module' => 'User Management',
            ],
            [
                'name' => 'Generate Password',
                'description' => 'generate-user-password',
                'module' => 'User Management',
            ],
            [
                'name' => 'View Roles',
                'description' => 'view-role',
                'module' => 'User Roles',
            ],
            [
                'name' => 'Update Role',
                'description' => 'update-role',
                'module' => 'User Roles',
            ],
            [
                'name' => 'Remove Role',
                'description' => 'remove-role',
                'module' => 'User Roles',
            ],
            [
                'name' => 'Edit Permission',
                'description' => 'update-permission',
                'module' => 'User Roles',
            ],
            [
                'name' => 'Create Role',
                'description' => 'create-role',
                'module' => 'User Roles',
            ],
        ];
        
        foreach ($data as $item) {
            $p = Permission::firstOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description'], 'module' => $item['module']]
            );            
        }
        
    }
}
