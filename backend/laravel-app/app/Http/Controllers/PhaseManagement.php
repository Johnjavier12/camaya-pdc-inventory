<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Phase;
use App\Models\PhaseProperties;
use App\Http\Requests\PhaseRequest;
use App\Http\Requests\PhasePropertyRequest;
use App\Services\LogServices;

class PhaseManagement extends Controller
{
    private $logService;

    public function __construct(LogServices $logServices)
    {
        $this->logService = $logServices;
    }

    public function createPhase (PhaseRequest $request) 
    {
        $phase = Phase::create([
            'phase_name' => $request['phase_name'],
            'phase_code' => $request['phase_code']
        ]);

        $this->logService->activity('Phase Has been created by:');

        $response = [
            'data' => $phase,
            'message' => 'success'
        ];
        

        return response($response,201); 
    }

    public function updatePhase (PhaseRequest $request) 
    {
        $phaseID = $request['phaseID'];

        Phase::where('id', $phaseID)
            ->update([
                'phase_name' => $request['phase_name'],
                'phase_code' => $request['phase_code']
            ]);

        $this->logService->activity('Phase Has been updated by:');

        return response(['message' => 'success'],201);
    }
    
    public function removePhase (Request $request) 
    {
        Phase::find($request['phaseID'])->delete();

        $this->logService->activity('Phase Has been deleted by:');

        return response(['message' => 'success'],200); 
    }

    public function createPhaseProperty (PhasePropertyRequest $request) 
    {
        $phaseProperty = PhaseProperties::create([
            'phase_id' => $request['phase_id'],
            'block_number' => $request['block_number'],
            'block_lot_number' => $request['block_lot_number'],
            'address' => $request['address'],
            'street' => $request['street']
        ]);

        $this->logService->activity('Phase Property Has been created by:');

        $response = [
            'data' => $phaseProperty,
            'message' => 'success'
        ];

        return response($response,201); 
    }

    public function updatePhaseProperty (PhasePropertyRequest $request)
    {
        $propertyID = $request['property_id'];

        PhaseProperties::where('id', $propertyID)
                        ->update([
                            'block_number' => $request['block_number'],
                            'block_lot_number' => $request['block_lot_number'],
                            'address' => $request['address'],
                            'street' => $request['street']
                        ]);

         $this->logService->activity('Phase Property Has been updated by:');

        return response(['message' => 'success'],201);
    }

    public function removePhaseProperty (Request $request)
    {
        PhaseProperties::find($request['property_id'])->delete();

        $this->logService->activity('Phase Property Has been deleted by:');

        return response(['message' => 'success'],200); 
    }

    public function getPhase () 
    {
        return Phase::where('deleted_at',null)->orderBy('id','asc')->get();
    }

    public function getPhaseProperty (Request $request)
    {
        return PhaseProperties::where(['deleted_at' => null,'phase_id' => $request->phase_id])->get();
    }
}
