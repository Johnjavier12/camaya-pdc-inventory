<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Illuminate\Http\Request;
use App\Models\ClientPdc;
use Carbon\Carbon;
use DB;

class PdcReportExport implements FromView, WithColumnWidths, ShouldAutoSize
{

    protected $filterType;

    protected $status;

    protected $client;

    protected $date;

    public function __construct($filterType, $status, $client, $date)
    {
        $this->filterType = $filterType;
        $this->status = $status;
        $this->client = $client;
        $this->date = $date;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25,
            'B' => 25,
            'C' => 25,
            'D' => 25,
            'E' => 25,
            'F' => 25,
            'G' => 25,
            'H' => 25,
            'I' => 25,
            'J' => 25,           
        ];
    }

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

    public function view(): View
    {
    
        switch ($this->filterType) {

            case 'client' :
                $data = $this->reportData()->where(DB::raw('CONCAT(tbl_clients.first_name, " ", tbl_clients.last_name)'), 'LIKE', '%'. $this->client .'%')->get();
            break;
            case 'date' :
                $date = Carbon::parse($this->date)->format('Y-m-d');
                
                $data = $this->reportData()->where('tbl_client_pdc.check_date', '=', $date)->get();
            break;
            case 'status' :
                $data = $this->reportData()->where('tbl_client_pdc.status', '=', $this->status)->get();
            break;
            default:break;

        }

        return view('exports.pdcReport', [
            'data' => $data
        ]);
  
    }
}
