<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ClientBankRequest;
use App\Http\Requests\ClientPdcRequest; 
use App\Http\Requests\PaymentHistoryRequest;
use App\Models\ClientBankAccount;
use App\Models\ClientPdc;
use App\Models\PaymentHistory;
use App\Services\LogServices;

use Illuminate\Support\Facades\Mail;
use App\Mail\UpdatePdcStatus;
use App\Models\Client;

use Carbon\Carbon;
use DB;

class PdcManagement extends Controller
{
    private $logService;

    public function __construct(LogServices $logServices)
    {
        $this->logService = $logServices;
    }

    public function createClientPdc (ClientPdcRequest $request)
    {
        $type = $request['type'];

        $clientID = $request['client_id'];

        $clientBankID = $request['client_bank_id'];

        if ($type === 'range') 
        {
            $checkNumberFrom = intval($request['check_number_from']);
            $checkNumberTo = intval($request['check_number_to']);
            $checkDateFrom = $request['check_date_from'];
            $dateRecieved = $request['date_recieved'];
            $count = 0;
        
            //$formatCheckDateFrom = Carbon::createFromDate('Y-m-d', $checkDateFrom);

            while($checkNumberFrom <= $checkNumberTo)
            {
                $newCheckDateFrom = Carbon::parse($checkDateFrom)->addMonths($count);

                ClientPdc::create([
                    'client_id' => $clientID,
                    'client_bank_id' => $clientBankID,
                    'check_number' => $checkNumberFrom,
                    'check_date' => $newCheckDateFrom,
                    'amount' => $request['amount'],
                    'date_recieved' => $dateRecieved,
                    'pdc_location' => $request['pdc_location']
                ]);

                $count++;
                $checkNumberFrom++;
            }
        }

        if ($type === 'percheck')
        {
            ClientPdc::create([
                'client_id' => $clientID,
                'client_bank_id' => $clientBankID,
                'check_number' => $request['check_number'],
                'check_date' => $request['check_date'],
                'amount' => $request['amount'],
                'date_recieved' => $request['date_received'],
                'pdc_location' => $request['pdc_location']
            ]);
        }

        $this->logService->activity('Client Pdc Has been created by:');

        return response(['message' => 'success'],200); 
    }

    public function getClientPdc (Request $request)
    {
        return ClientPdc::select('tbl_client_pdc.*',DB::raw('CONCAT(YEAR(tbl_client_pdc.created_at),"-",tbl_client_pdc.id) as pdc_number'))
                        ->where(['client_bank_id' => $request->client_bank_id, 'deleted_at' => null])
                        ->orderBy('id','asc')
                        ->get();
    }

    public function updateClientPdc (Request $request)
    {
        $pdcID = $request['pdcID'];

        ClientPdc::where('id', $pdcID)
                 ->update([
                    'check_number' => $request['check_number'],
                    'check_date' => $request['check_date'],
                    'amount' => $request['amount'],
                    'date_recieved' => $request['date_recieved'],
                    'pdc_location' => $request['pdc_location'],
                    'payment_details' => $request['payment_details']
                 ]);

        $this->logService->activity('Client Pdc Has been updated by:');
        
        return response(['message' => 'success'],200); 
    }

    public function removeClientPdc (Request $request)
    {
        ClientPdc::find($request['pdcID'])->delete();

        $this->logService->activity('Client Pdc Has been deleted by:');

        return response(['message' => 'success'],200); 
    }

    public function updatePdcStatus (PaymentHistoryRequest $request)
    {
        
        $id = $request['pdc_id'];
        $clientID = $request['client_id'];

        $status = $request['status'];
        $paymentDetails = $request['payment_details'];
        $transactionDate = $request['transaction_date'];
        $checkNumber = $request['check_number'];

        $client = Client::find($clientID);

        $payment = PaymentHistory::create([
            'pdc_id' => $id,
            'client_id' => $clientID,
            'bank_id' => $request['bank_id'],
            'amount_paid' => $request['amount_paid'],
            'check_number' => $checkNumber,
            'check_date' => $request['check_date'],
            'status' => $status,
            'payment_details' => $paymentDetails,
            'transaction_date' => $transactionDate,
        ]);

        $updatePdc = ClientPdc::where('id', $id)
                              ->update([
                                'status' => $status,
                                'payment_details' => $paymentDetails,
                                'transaction_date' => $transactionDate
                              ]);

        $this->logService->activity('Pdc Status Has been updated by:');
       
        if($client->email) {

            Mail::to($client->email)
            ->send(new UpdatePdcStatus($clientID, $status, $paymentDetails, $checkNumber));

        } 

        return response(['message' => 'success','data' => $payment],200); 
    }

    public function updatePdcStatusMultiple (Request $request)
    {
        $status = $request['status'];
        $paymentDetails = $request['payment_details'];
        $transactionDate = $request['transaction_date'];

        $itemsKeys = $request['items.keys'];
        $itemDatas = $request['items.data'];

        foreach ($itemDatas as $itemData)
        {
            $client = Client::find($itemData['client_id']);

            $payment = PaymentHistory::create([
                'pdc_id' => $itemData['id'],
                'client_id' => $itemData['client_id'],
                'bank_id' => $itemData['client_bank_id'],
                'amount_paid' => $itemData['amount'],
                'check_number' => $itemData['check_number'],
                'check_date' => $itemData['check_date'],
                'status' => $status,
                'payment_details' => $paymentDetails,
                'transaction_date' => $transactionDate,
            ]);

            if($client->email) {

                Mail::to($client->email)
                ->send(new UpdatePdcStatus($itemData['client_id'], $status, $paymentDetails, $itemData['check_number']));
    
            } 
        }

        foreach ($itemsKeys as $itemsKey)
        {
            $updatePdc = ClientPdc::where('id', $itemsKey)
                        ->update([
                            'status' => $status,
                            'payment_details' => $paymentDetails,
                            'transaction_date' => $transactionDate
                        ]);
        }

        $this->logService->activity('Pdc Status Multiple Has been updated by:');

        return response(['message' => 'success'],200); 

    }

    public function getClientPaymentHistory (Request $request)
    {
        $clientId =  $request['client_id'];

        $data = PaymentHistory::leftJoin('tbl_client_bank','tbl_client_payment_history.bank_id','=','tbl_client_bank.id')
                              ->leftJoin('tbl_clients_property','tbl_client_bank.property_id','=','tbl_clients_property.id')
                              ->leftJoin('tbl_phase','tbl_clients_property.phase_id','=','tbl_phase.id')
                              ->leftJoin('tbl_phase_properties','tbl_clients_property.property_id','=','tbl_phase_properties.id')
                              ->select(
                                'tbl_client_payment_history.id',
                                'tbl_phase.phase_name',
                                'tbl_phase.phase_code',
                                'tbl_phase_properties.block_number',
                                'tbl_phase_properties.block_lot_number',
                                'tbl_client_payment_history.amount_paid',
                                'tbl_client_payment_history.check_number',
                                'tbl_client_payment_history.check_date',
                                'tbl_client_bank.bank_name',
                                'tbl_client_bank.account_number',
                              )
                              ->where('tbl_client_payment_history.client_id', '=', $clientId)
                              ->get();
        
        return $data;
    }
}
