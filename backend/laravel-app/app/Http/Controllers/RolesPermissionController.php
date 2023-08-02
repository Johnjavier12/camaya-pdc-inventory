<?php

namespace App\Http\Controllers;

use App\Http\Resources\UsersPermissionResource;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Models\User;

class RolesPermissionController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return $request->user()->roles()->with('permissions')
        ->get()
        ->pluck('permissions')
        ->flatten()
        ->pluck('description')
        ->unique()
        ->values()
        ->toArray();
    }

    public function assignPermissionToRole(Request $request){
        $role = Role::find($request->roleID); // Get the role

        $permissions = [
            ['value' => $request->description]
        ]; 

        $role->givePermissionTo($permissions);
    }

    public function unAssignPermissionToRole(Request $request){
        $role = Role::find($request->roleID); // Get the role

        $permissionsToRemove = [
            ['value' => $request->description]
        ]; // The permissions to remove

        $role->withdrawPermissionsTo($permissionsToRemove);
    }
}
