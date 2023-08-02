<?php

namespace App\Services;

use App\Http\Resources\PermissionResource;
use Illuminate\Support\Facades\DB;
use App\Services\LogServices;

class PermissionServices{
    private $logs;
    public function __construct(LogServices $logsServices)
    {
        $this->logs = $logsServices;
    }
    public function hasNoPermission($request, $permission)
    {
        if (!$request->user()->hasPermissionTo($permission)) {
            return response('', 401);
        }
    }

    public function all($request, $permissions, $permission)
    {
        $hasNoPermission = $this->hasNoPermission($request, $permissions);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        return PermissionResource::collection($permission);
    }

    public function findById($request, $permissions, $permission)
    {
        $hasNoPermission = $this->hasNoPermission($request, $permissions);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        return new PermissionResource($permission);
    }

    public function create($request, $permissions, $permission)
    {
        $hasNoPermission = $this->hasNoPermission($request, $permissions);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }
        $data = $request->validated();
        DB::transaction(function () use ($permission, $data) {
            $permission  = $permission->create([
                'name' => $data['name'],
                'description' => $data['description']
            ]);
            $this->logs->activity('Permissions Has been created by:');
            return new PermissionResource($permission);
        });
    }

    public function update($request, $permissions,$permission){
        $hasNoPermission = $this->hasNoPermission($request,$permissions);

        if($hasNoPermission){
            return $hasNoPermission;
        }
        $data = $request->validated();
        DB::transaction(function() use ($permission,$data){
            $permission = $permission->update([
                'name'=>$data['name'],
                'description'=>$data['description']
            ]);
            $this->logs->activity('Permissions Has been updated by:');
            return new PermissionResource($permission);
        });

    }

    public function delete($request,$permissions,$permission){
        $hasNoPermission = $this->hasNoPermission($request,$permissions);

        if($hasNoPermission){
            return $hasNoPermission;
        }

        DB::transaction(function() use ($permission){
            $permission->delete();
            $this->logs->activity('Permissionss Has been deleted by:');
            return;
        });
    }

}
