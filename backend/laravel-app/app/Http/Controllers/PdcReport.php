<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClientPdc;
use Carbon\Carbon;
use App\Exports\PdcReportExport;
use Maatwebsite\Excel\Facades\Excel;
use DB;

class PdcReport extends Controller
{
    private function reportData ()
    {

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
                            'tbl_client_pdc.payment_details'
                         );
    }

    public function filterData (Request $request)
    {
        $filterType = $request->filterType;
        
        switch ($filterType) {
            case 'client' :
                $data = $this->reportData()->where(DB::raw('CONCAT(tbl_clients.first_name, " ", tbl_clients.last_name)'), 'LIKE', '%'. $request->client .'%')->get();
            break;
            case 'date' :
                $date = Carbon::parse($request->date)->format('Y-m-d');
                
                $data = $this->reportData()->where('tbl_client_pdc.check_date', '=', $date)->get();
            break;
            case 'status' :
                $data = $this->reportData()->where('tbl_client_pdc.status', '=', $request->status)->get();
            break;
            default:break;
        }

        return $data;
    }

    public function exportPdcReport (Request $request)
    {
        return Excel::download(
            new PdcReportExport($request->filterType, $request->status, $request->client, $request->date), 
            'report.xlsx'
        ); 
    }
}
