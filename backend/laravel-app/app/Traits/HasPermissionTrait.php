<?php

namespace App\Traits;

use App\Models\Permission;

trait HasPermissionTrait
{
    public function givePermissionTo(...$permisions)
    {
        $permisions = $this->getAllPermissions($permisions);
        if ($permisions === null) {
            return $this;
        }

        $this->permissions()->saveMany($permisions);
        return $this;
    }
    public function withdrawPermissionsTo(...$permissions)
    {

        $permissions = $this->getAllPermissions($permissions);
        $this->permissions()->detach($permissions);
        return $this;
    }

    public function refreshPermissions(...$permissions)
    {

        $this->permissions()->detach();
        return $this->givePermissionsTo($permissions);
    }

    public function hasPermissionTo($permission)
    {

        return $this->hasPermission($permission);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'roles_permissions');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'roles_users');
    }

    protected function hasPermission($permission)
    {

        return (bool) $this->permissions->where('description', $permission->description)->count();
    }

    protected function getAllPermissions(array $permissions)
    {
        $roles = collect();
        if(isset($permissions)){
            $descriptions = $permissions;

            foreach($descriptions as $description){
                foreach($description as $data){
                    $roles->push($data['value']);
                }
            }
        }
        return Permission::whereIn('description', $roles)->get();
    }
}
