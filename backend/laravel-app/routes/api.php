<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authenticate;
use App\Http\Controllers\UserManagement;
use App\Http\Controllers\PhaseManagement;
use App\Http\Controllers\ClientManagement;
use App\Http\Controllers\PdcDashBoard;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PdcManagement;
use App\Http\Controllers\RolesPermissionController;
use App\Http\Controllers\PdcReport;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//PUBLIC ROUTES
Route::post('/login',[Authenticate::class,'login']);
Route::post('/register',[UserManagement::class,'register']);

//PROTECTED ROUTES
Route::group(['middleware' => ['auth:sanctum']], function() {
    Route::get('/get-users',[UserManagement::class,'getUsers']);
    Route::get('/get-user-role',[UserManagement::class,'getUserRole']);
    Route::post('/update-user-account',[UserManagement::class,'updateAccount']);
    Route::post('/remove-user-account',[UserManagement::class,'removeUser']);
    Route::post('/update-password',[UserManagement::class,'updatePassword']);
    Route::post('/create-user-role',[UserManagement::class,'createUserRole']);
    Route::post('/update-user-role',[UserManagement::class,'updateUserRole']);
    Route::post('/remove-user-role',[UserManagement::class,'removeUserRole']);
    Route::post('/logout',[Authenticate::class,'logout']);

    Route::post('/phase/create',[PhaseManagement::class,'createPhase']);
    Route::post('/phase/update',[PhaseManagement::class,'updatePhase']);
    Route::post('/phase/remove',[PhaseManagement::class,'removePhase']);
    Route::get('/phase/get-phase',[PhaseManagement::class,'getPhase']);
    Route::post('/phase/create-phase-property',[PhaseManagement::class,'createPhaseProperty']);
    Route::post('/phase/update-phase-property',[PhaseManagement::class,'updatePhaseProperty']);
    Route::post('/phase/delete-phase-property',[PhaseManagement::class,'removePhaseProperty']);
    Route::get('/phase/get-phase-property/{phase_id}',[PhaseManagement::class,'getPhaseProperty']);

    Route::post('/client/create',[ClientManagement::class,'createClient']);
    Route::post('/client/update',[ClientManagement::class,'updateClient']);
    Route::post('/client/remove',[ClientManagement::class,'removeClient']);
    Route::post('/client/create-client-property',[ClientManagement::class,'createClientProperty']);
    Route::get('/client/get-client',[ClientManagement::class,'getClients']);
    Route::get('/client/get-client-property/{client_id}',[ClientManagement::class,'getClientsProperty']);
    Route::post('/client/create-client-bank',[ClientManagement::class,'createClientBank']);
    Route::post('/client/update-client-bank',[ClientManagement::class,'updateClientBank']);
    Route::post('/client/remove-client-bank',[ClientManagement::class,'removeClientBank']);

    Route::get('/client/get-client-bank',[ClientManagement::class,'getClientBank']);
    Route::post('/client/create-client-pdc',[PdcManagement::class,'createClientPdc']);
    Route::get('/client/get-client-pdc/{client_bank_id}',[PdcManagement::class,'getClientPdc']);
    Route::post('/client/update-client-pdc',[PdcManagement::class,'updateClientPdc']);
    Route::post('/client/remove-client-pdc',[PdcManagement::class,'removeClientPdc']);

    Route::post('/pdc/update-pdc-status',[PdcManagement::class,'updatePdcStatus']);
    Route::post('/pdc/update-pdc-status-multiple',[PdcManagement::class,'updatePdcStatusMultiple']);
    Route::get('/pdc/get-payment-history/{client_id}',[PdcManagement::class,'getClientPaymentHistory']);


    Route::get('/dashboard/daily-checks',[PdcDashBoard::class,'getDailyChecks']);
    Route::post('/dashboard/daily-checks-filter',[PdcDashBoard::class,'filterDailyChecks']);
    Route::post('/dashboard/daily-checks-download',[PdcDashBoard::class,'exportDailyChecks']);
    Route::get('/dashboard/pdc-amount-location',[PdcDashBoard::class,'getPdcAmountPerLocation']);
    Route::get('/dashboard/pdc-yearly-pdc/{year}',[PdcDashBoard::class,'getYearlyPdc']);

    Route::post('/pdc-report/filter-report',[PdcReport::class,'filterData']);
    Route::post('/pdc-report/filter-report-download',[PdcReport::class,'exportPdcReport']);

    Route::get('/user-permission',RolesPermissionController::class);
    Route::post('/permissions-by-module', [PermissionController::class, 'getPermissionsByModule']);
    Route::apiResource('/permission',PermissionController::class);
    Route::post('/role/assign', [RolesPermissionController::class, 'assignPermissionToRole']);
    Route::post('/role/unassign', [RolesPermissionController::class, 'unAssignPermissionToRole']);
});
