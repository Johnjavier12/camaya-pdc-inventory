<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Services\LogServices;
use Illuminate\Http\Request;
use App\Services\PermissionServices;
use App\Http\Resources\RolesResource;
use Illuminate\Support\Facades\DB;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private $permissionService;
    private $logService;
    public function __construct(PermissionServices $permissionService,LogServices $logServices)
    {
        $this->permissionService = $permissionService;
        $this->logService = $logServices;
    }

    public function index(Request $request)
    {
        $permission = ['show-all-roles'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }
        $role = Role::orderBy('id', 'DESC')->paginate(10);
        return  RolesResource::collection($role);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,Role $role)
    {
        $permission = ['create-roles'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        $data = $request->validated();
        DB::transaction(function () use ($role, $data) {
            $role = $role->create([
                'name' => $data['name'],
                'description' => $data['description']
            ]);
            $role->givePermissionTo($data['permission_description']);
            $this->logService->activity('Roles Has been created by:');
            return new RolesResource($role);
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show(Role $role,Request $request)
    {
        $permission = ['show-role'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        return new RolesResource($role);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        $permission = ['update-role'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);
        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        $data = $request->validated();
        DB::transaction(function () use ($role, $data) {
            $role = $role->update([
                'name' => $data['name'],
                'description' => $data['description']
            ]);
            $this->logService->activity('Roles Has been updated by:');
            return new RolesResource($role);
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Role $role,Request $request)
    {
        $permission = ['delete-role'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        DB::transaction(function () use ($role) {
            $role = $role->detach($role->permissions);
            $role = $role->delete();
            $this->logService->activity('Roles Has been deleted by:');
            return;
        });
    }

   

}
