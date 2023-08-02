<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRegistration;
use App\Http\Resources\UsersResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\LogServices;
use App\Services\PermissionServices;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
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
        $permission = ['show-all-users-access'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        $user = User::query()->with('roles')->orderBy('id', 'desc')->paginate(10);
        return UsersResource::collection($user);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRegistration $request,User $user)
    {
        $permission = ['create-user-access'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        $data = $request->validated();
        $fullname = $data['first_name'].' '.$data['last_name'];
        DB::transaction(function () use ($user, $data,$fullname) {
            $user = User::create([
                'name' => $fullname,
                'email' => $data['email'],
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'],
                'last_name' => $data['last_name'],
                'user_type' => $data['user_type'],
                'role_id' => $data['role_id'],
                'is_active' => $data['is_active'],
                'password' => bcrypt(env('DEFAULT_KEY'))
            ]);
            $roles = $data['description'];
            $user->assignRoles($roles);
            $this->logService->activity('Users Has been created by:');
            return new UsersResource($user);
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user,Request $request)
    {
        $permission = ['show-users-access'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }
        return new UsersResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRegistration $request, User $user)
    {
        $permission = ['update-user-access'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);
        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        $data = $request->validated();

        DB::transaction(function () use ($user, $data) {
            $users = $user->update([
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'middlename' => $data['middlename'],
                'suffix' => $data['suffix'],
                'contact_number' => $data['contact_number'],
                'email' => $data['email'],
                // 'password' => bcrypt($data['password']),
            ]);
            $roles = $data['description'];
            $user->updateRoles($roles);
            $this->logService->activity('Users Has been updated by:');
            return new UsersResource($users);
        });

        return new UsersResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user,Request $request)
    {
        $permission = ['delete-user-access'];
        $hasNoPermission = $this->permissionService->hasNoPermission($request, $permission);

        if ($hasNoPermission) {
            return $hasNoPermission;
        }

        DB::transaction(function () use ($user) {
            $user->withdrawRoles($user->roles);
            $user->delete();
            $this->logService->activity('Users Has been deleted by:');
            return response('',204);
        });
    }
}
