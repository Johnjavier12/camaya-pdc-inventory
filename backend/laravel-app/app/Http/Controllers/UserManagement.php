<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Requests\UserRegistration;
use App\Http\Requests\UserRoleRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use App\Services\LogServices;

class UserManagement extends Controller
{

    private $logService;

    public function __construct(LogServices $logServices)
    {
        $this->logService = $logServices;
    }

    public function register(UserRegistration $request) 
    {
        $fullname = $request['first_name'] . ' ' . $request['middle_name'] . ' ' . $request['last_name'];

        $role = Role::find($request['role_id']);
        $user = User::create([
            'name' => $fullname,
            'email' => $request['email'],
            'first_name' => $request['first_name'],
            'middle_name' => $request['middle_name'],
            'last_name' => $request['last_name'],
            'user_type' => $request['user_type'],
            'role_id' => $request['role_id'],
            'is_active' => $request['is_active'],
            'password' => bcrypt(env('DEFAULT_KEY'))
        ]);

        $user->assignRoles([
            ['value' => $role->description]
        ]);

        $token = $user->createToken('user-tokens')->plainTextToken;

        $this->logService->activity('User account been created by:');

        $response = [
            'userdata' => $user,
            'token' => $token
        ];

        return response($response,201); 
    }

    public function updateAccount (Request $request)
    {
        $id = $request['clientID'];
        
        $fullname = $request['first_name'] . ' ' . $request['middle_name'] . ' ' . $request['last_name'];
        $user = User::find($id);
        $old_role = $user->roles()->first();
        $new_role = Role::find($request['role_id']);

        User::where('id', $id)
            ->update([
                'name' => $fullname,
                'first_name' => $request['first_name'],
                'middle_name' => $request['middle_name'],
                'last_name' => $request['last_name'],
                'email' => $request['email'],
                'user_type' => $request['user_type'],
                'is_active' => $request['is_active'],
                'role_id' => $request['role_id']
            ]);
        
        $user->updateRoles([
            ['value' => $new_role->description]
        ]);

        $this->logService->activity('User account been updated by:');

        return response(['message' => 'success'],200);    
    }

    public function removeUser (Request $request) 
    {
        User::find($request['clientID'])->delete();

        $this->logService->activity('User account been deleted by:');

        return response(['message' => 'success'],200); 
    }

    public function updatePassword (Request $request) 
    {
        $id = $request['clientID'];
        $password = Str::random(6);

        $passwordEncrypt = bcrypt($password);

        User::where('id', $id)
            ->update([
                'password' => $passwordEncrypt
            ]);
        
        $this->logService->activity('User account password been updated by:');
        
        return response(['message' => 'success','password' => $password],200);
    }

    public function getUsers () 
    {
        return User::where('deleted_at', null)->get();
    }
    
    public function getUserRole ()
    {
        return Role::all();
    }

    public function createUserRole (UserRoleRequest $request)
    {

        $role =  Role::create(
                ['name' => $request['role_name']],
                ['description' => str_replace(' ', '-', $request['role_name'])]
            );

        $this->logService->activity('User role been created by:');

        return response(['message' => 'success','data' => $role],200);
    }

    public function updateUserRole (UserRoleRequest $request)
    {
        $id = $request['id'];

        Role::where('id', $id)
            ->update([
                'name' => $request['role_name'],
                'description' => str_replace(' ', '-', $request['role_name'])
            ]);
        
        $this->logService->activity('User role been updated by:');
        
        return response(['message' => 'success'],200);
    }

    public function removeUserRole (Request $request)
    {
        Role::find($request['id'])->delete();

        $this->logService->activity('User role been deleted by:');

        return response(['message' => 'success'],200);
    }
}
