<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRolesTrait
{
    public function assignRoles(...$roles)
    {
        $roles = $this->getAllRoles($roles);
        if ($roles === null) {
            return $this;
        }
        $this->roles()->attach($roles);
        return $this;
    }

    public function updateRoles(...$roles){
        $roles = $this->getAllRoles($roles);
        if($roles === null){
            return $this;
        }
        $this->roles()->sync($roles);
        return $this;
    }
    public function withdrawRoles(...$roles)
    {

        $roles = $this->getAllRoles($roles);
        $this->roles()->detach($roles);
        return $this;
    }


    public function roles()
    {

        return $this->belongsToMany(Role::class, 'roles_users');
    }

    public function hasRole(...$roles)
    {

        foreach ($roles as $role) {
            if ($this->roles->contains('description', $role)) {
                return true;
            }
        }
        return false;
    }

    public function hasPermissionTo($permission)
    {
        return $this->hasPermissionThroughRole($permission);
    }

    public function hasPermissionThroughRole($permission)
    {
        $permissions = Permission::with('roles')->whereIn('description', $permission)->get();
        foreach ($permissions as $permit) {
            foreach ($permit->roles as $role) {
                if ($permit->roles->contains($role)) {
                    return true;
                }
            }
        }
        return false;
    }

    protected function getAllRoles(array $roles)
    {
        $datas = collect();
        if(isset($roles)){
            $descriptions = $roles;

            foreach($descriptions as $description){
                foreach($description as $data){
                    $datas->push($data['value']);
                }
            }
        }
        return Role::whereIn('description', $datas)->get();
    }
}
