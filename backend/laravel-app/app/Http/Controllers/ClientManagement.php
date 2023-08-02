<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ClientRequest;
use App\Http\Requests\ClientPropertyRequest;
use App\Http\Requests\ClientBankRequest;
use App\Http\Requests\ClientPdcRequest; 
use App\Models\ClientProperty;
use App\Models\Client;
use App\Models\ClientBankAccount;
use App\Models\ClientPdc;
use App\Services\LogServices;

use Carbon\Carbon;

class ClientManagement extends Controller
{
    private $logService;

    public function __construct(LogServices $logServices)
    {
        $this->logService = $logServices;
    }

    public function createClient (ClientRequest $request) 
    {
        $client = Client::create([
            'client_number' => $request['client_number'],
            'first_name' => $request['first_name'],
            'middle_name' => $request['middle_name'],
            'last_name' => $request['last_name'],
            'suffix' => $request['suffix'],
            'email' => $request['email'],
            'contact_number' => $request['contact_number'],
            'phase_id' => $request['phase_id'],
            'property_id' => $request['property_id'],
        ]);

        Client::where('id', $client->id)->update(['client_code' => $client->id]);

        $this->logService->activity('Client Has been created by:');

        $response = [
            'data' => $client,
            'message' => 'success'
        ];

        return response($response,201); 
    }

    public function createClientProperty (ClientPropertyRequest $request)
    {
        $property = ClientProperty::create([
            'client_id' => $request['client_id'],
            'phase_id' => $request['phase_id'],
            'property_id' => $request['property_id'],
        ]);

        $this->logService->activity('Client Property Has been created by:');

        $response = [
            'data' => $property,
            'message' => 'success'
        ];

        return response($response,201);
    }

    public function getClients () 
    {
        return Client::where('is_deleted',0)->orderBy('id','asc')->get();
    }

    public function getClientsProperty (Request $request) {

        return ClientProperty::leftJoin('tbl_phase','tbl_clients_property.phase_id','=','tbl_phase.id')
                             ->leftJoin('tbl_phase_properties','tbl_clients_property.property_id','=','tbl_phase_properties.id')
                             ->leftJoin('tbl_clients','tbl_clients_property.client_id','=','tbl_clients.id')
                             ->select('tbl_clients_property.id',
                                        'tbl_clients_property.phase_id',
                                       'tbl_clients_property.property_id',
                                       'tbl_phase.phase_name',
                                       'tbl_phase_properties.block_lot_number',
                                       'tbl_phase_properties.block_number',
                                       'tbl_clients.first_name',
                                       'tbl_clients.middle_name',
                                       'tbl_clients.last_name',
                                )
                                ->where('tbl_clients_property.client_id', '=', $request->client_id)
                               ->get();

    }

    public function createClientBank (ClientBankRequest $request) 
    {
        $clientBank = ClientBankAccount::create([
            'client_id' => $request['client_id'],
            'property_id' => $request['property_id'],
            'account_number' => $request['account_number'],
            'amount' => $request['amount'],
            'bank_name' => $request['bank_name'],
            'bank_branch' => $request['bank_branch'],
            'remarks' => $request['remarks']
        ]);

        $this->logService->activity('Client Bank Has been created by:');

        $response = [
            'data' => $clientBank,
            'message' => 'success'
        ];

        return response($response,201);
    }

    public function updateClientBank (Request $request)
    {
        $clientBankID = $request['clientBankID'];

        ClientBankAccount::where('id', $clientBankID)
                        ->update([
                            'account_number' => $request['account_number'],
                            'amount' => $request['amount'],
                            'bank_name' => $request['bank_name'],
                            'bank_branch' => $request['bank_branch'],
                            'remarks' => $request['remarks']
                        ]);

          $this->logService->activity('Client Bank Has been updated by:');
        
        return response(['message' => 'success'],200);  
    }

    public function removeClientBank (Request $request)
    {
        ClientBankAccount::find($request['clientBankID'])->delete();

        $this->logService->activity('Client Bank Has been deleted by:');

        return response(['message' => 'success'],200); 
    }

    public function getClientBank ()
    {
        return ClientBankAccount::leftJoin('tbl_clients','tbl_client_bank.client_id','=','tbl_clients.id')
                                ->leftJoin('tbl_clients_property','tbl_client_bank.property_id','=','tbl_clients_property.id')
                                ->leftJoin('tbl_phase','tbl_clients_property.phase_id','=','tbl_phase.id')
                                ->leftJoin('tbl_phase_properties','tbl_clients_property.property_id','=','tbl_phase_properties.id')
                                ->select('tbl_client_bank.id',
                                        'tbl_client_bank.client_id',
                                        'tbl_client_bank.account_number',
                                        'tbl_clients.client_number',
                                        'tbl_clients.first_name',
                                        'tbl_clients.middle_name',
                                        'tbl_clients.last_name',
                                        'tbl_phase_properties.block_number',
                                        'tbl_phase_properties.block_lot_number',
                                        'tbl_client_bank.account_number',
                                        'tbl_client_bank.amount',
                                        'tbl_client_bank.bank_name',
                                        'tbl_client_bank.bank_branch',
                                        'tbl_client_bank.remarks',
                                        'tbl_phase.phase_name',
                                        'tbl_phase.phase_code'
                                )
                                ->where('tbl_client_bank.deleted_at', null)
                                ->get();
    }

    public function updateClient (Request $request)
    {
        $id = $request['clientID'];

        Client::where('id', $id)
            ->update([
                'client_number' => $request['client_number'],
                'first_name' => $request['first_name'],
                'middle_name' => $request['middle_name'],
                'last_name' => $request['last_name'],
                'suffix' => $request['suffix'],
                'email' => $request['email'],
                'contact_number' => $request['contact_number'],
            ]);

        $this->logService->activity('Client Has been updated by:');

        return response(['message' => 'success'],200);  
    }
    
    public function removeClient (Request $request) 
    {
        Client::find($request['clientID'])->delete();

        $this->logService->activity('Client Has been deleted by:');

        return response(['message' => 'success'],200); 
    }

}
