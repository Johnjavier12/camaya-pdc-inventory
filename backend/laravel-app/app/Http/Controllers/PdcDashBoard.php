<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\ClientBankAccount;
use App\Models\ClientPdc;
use App\Models\ClientProperty;
use Carbon\Carbon;
use DB;
use App\Exports\DailyCheckExport;
use Maatwebsite\Excel\Facades\Excel;

class PdcDashBoard extends Controller
{

    private function dailyChecks ()
    {
        $today = Carbon::now('Asia/Manila')->format('Y-m-d');

        return ClientPdc::leftJoin('tbl_clients','tbl_client_pdc.client_id','=','tbl_clients.id')
                         ->leftJoin('tbl_client_bank','tbl_client_pdc.client_bank_id','=','tbl_client_bank.id')
                         ->select(
                            'tbl_client_pdc.id',
                            'tbl_client_pdc.client_id',
                            'tbl_client_pdc.client_bank_id',
                            'tbl_clients.client_number',
                            'tbl_clients.client_code',
                            'tbl_clients.first_name',
                            'tbl_clients.last_name',
                            'tbl_clients.middle_name',
                            'tbl_client_pdc.amount',
                            'tbl_client_pdc.check_date',
                            'tbl_client_pdc.check_number',
                            'tbl_client_pdc.status',
                            'tbl_client_pdc.transaction_date',
                            'tbl_client_bank.account_number',
                            'tbl_client_bank.bank_name',
                            'tbl_client_bank.remarks',
                            'tbl_client_pdc.payment_details',
                            DB::raw('CONCAT(YEAR(tbl_client_pdc.created_at),"-",tbl_client_pdc.id) as pdc_number')
                         )
                         ->where('tbl_client_pdc.check_date', '=', $today)
                         ->with(['paymentHistory' => function($p) {
                            $p->leftJoin('tbl_client_bank','tbl_client_payment_history.bank_id','=','tbl_client_bank.id')
                            ->leftJoin('tbl_clients_property','tbl_client_bank.property_id','=','tbl_clients_property.id')
                            ->leftJoin('tbl_phase','tbl_clients_property.phase_id','=','tbl_phase.id')
                            ->leftJoin('tbl_phase_properties','tbl_clients_property.property_id','=','tbl_phase_properties.id')
                            ->select(
                                'tbl_client_payment_history.*',
                                'tbl_phase.phase_name',
                                'tbl_phase.phase_code',
                                'tbl_phase_properties.block_number',
                                'tbl_phase_properties.block_lot_number',
                                'tbl_client_bank.bank_name',
                                'tbl_client_bank.account_number',
                            )
                            ->orderBy('tbl_client_payment_history.id','desc');
            }]);
    }

    public function getDailyChecks ()
    {
        return $this->dailyChecks()->get();
    }

    public function filterDailyChecks (Request $request)
    {
       $filterType = $request->filterType;
       $client = $request->client;
       $status = $request->status;

       if ($filterType === 'client')
       {
          $data = $this->dailyChecks()->where(DB::raw('CONCAT(tbl_clients.first_name, " ", tbl_clients.last_name)'), 'LIKE', '%'. $client .'%')->get();
       }

       if ($filterType === 'status')
       {
          $data = $this->dailyChecks()->where('tbl_client_pdc.status', '=', $status)->get();
       }

       return $data;
    }

    public function exportDailyChecks (Request $request)
    {
        return Excel::download(
            new DailyCheckExport($request->filterType, $request->client, $request->status), 
            'report.xlsx'
        ); 
    }

    public function getPdcAmountPerLocation ()
    {
        $data = ClientPdc::select(
            'pdc_location',
            DB::raw('SUM(amount) as total_amount')
        )
        ->whereNotNull('pdc_location')
        ->groupBy('pdc_location')
        ->get();

        return $data;
    }

    public function getYearlyPdc (Request $request)
    {
        $year_start_date = $request->year . '-01-01';
        $year_end_date = $request->year . '-12-31';
        $result = [];

        $pdcLocations = [
            'ON HAND',
            'PVB',
            'CBS',
            'PBB',
            'MBTC'
        ];

        $pdcData = ClientPdc::select(
            'pdc_location',
            'amount',
            DB::raw('month(check_date) check_month')
        )
        ->whereNotNull('pdc_location')
        ->where('check_date','>=', $year_start_date)
        ->where('check_date','<=', $year_end_date)
        ->get();

        foreach ($pdcLocations as $key => $location)
        {
            $result[$key]['label'] = $location;

            $result[$key]['fill'] = false;

            $result[$key]['backgroundColor'] = "rgb(".rand($key,255).",".rand($key,255).",".rand($key,255).")";

            $result[$key]['borderColor'] = 'rgba(200, 200, 200, 0.2)';

            $result[$key]['data'] = [0,0,0,0,0,0,0,0,0,0,0,0];

            $datas = $pdcData->where('pdc_location','=', $location)->groupBy('check_month');

            if($datas)
            {
                foreach($datas as $k => $d)
                {
                    $amount = collect($d)->sum('amount');
                    
                    $result[$key]['data'][$k] = $amount;
                }
            }
        }

        return $result;
    }
}
