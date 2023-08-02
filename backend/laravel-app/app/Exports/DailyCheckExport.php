<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

use Illuminate\Http\Request;
use App\Models\ClientPdc;
use Carbon\Carbon;
use DB;

class DailyCheckExport implements FromView, WithColumnWidths, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */

    private $filterType;

    private $client;

    private $status;

    public function __construct($filterType, $client, $status)
    {
        $this->filterType = $filterType;
        $this->client = $client;
        $this->status = $status;
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

    private function dailyChecks ()
    {
        $today = Carbon::now('Asia/Manila')->format('Y-m-d');

        return ClientPdc::leftJoin('tbl_clients','tbl_client_pdc.client_id','=','tbl_clients.id')
                         ->leftJoin('tbl_client_bank','tbl_client_pdc.client_bank_id','=','tbl_client_bank.id')
                         ->select(
                            'tbl_client_pdc.id',
                            'tbl_client_pdc.client_id',
                            'tbl_client_pdc.client_bank_id',
                            'tbl_clients.client_code',
                            'tbl_clients.client_number',
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

    public function view(): View
    {
        
        if(!$this->filterType)
        {
            $data = $this->dailyChecks()->get();
        }

        if($this->filterType === 'client')
        {
            $data = $this->dailyChecks()->where(DB::raw('CONCAT(tbl_clients.first_name, " ", tbl_clients.last_name)'), 'LIKE', '%'. $this->client .'%')->get();
        }

        if($this->filterType === 'status')
        {
            $data = $this->dailyChecks()->where('tbl_client_pdc.status', '=', $this->status)->get();
        }

        return view('exports.dailyChecks', [
            'data' => $data
        ]);
    }
}
