<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use App\Models\Role;
use App\Services\PermissionServices;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    private $permissionService;
    public function __construct(PermissionServices $permissionService)
    {
        $this->permissionService = $permissionService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $permissions = ['show-all-permissions'];
        $permission = Permission::orderBy('id', 'DESC')->paginate(10);
        $response = $this->permissionService->all($request,$permissions,$permission);
        return $response;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionRequest $request,Permission $permission)
    {
        $permissions = ['create-permissions'];
        $response = $this->permissionService->create($request,$permissions,$permission);
        return $response;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function show(Permission $permission,Request $request)
    {
        $permissions = ['show-permission'];
        $response = $this->permissionService->findById($request,$permissions,$permission);
        return $response;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function update(PermissionRequest $request, Permission $permission)
    {
        $permissions = ['update-permission'];
        $response = $this->permissionService->update($request,$permissions,$permission);
        return $response;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Permission $permission,Request $request)
    {
        $permissions = ['delete-permission'];
        $response = $this->permissionService->delete($request,$permissions,$permission);
        return $response;
    }

    public function getPermissionsByModule(Request $request){
        $roleId = $request->roleId;
        $role = Role::with('permissions')->find($roleId);
    
        $permissions = Permission::all()->map(function ($permission) use ($role) {
            $permission->enabled = $role->permissions->contains($permission->id);
            if (empty($permission->module)) {
                $permission->module = 'Other';
            }
            return $permission;
        });
    
        return $permissions->groupBy('module');
    }
    
    
    
}
