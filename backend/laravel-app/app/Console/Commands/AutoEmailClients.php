<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\AutoEmailClients as AutoEmailClientsTemplate;
use Illuminate\Support\Facades\Log;

use App\Models\Client;
use App\Models\ClientPdc;
use Carbon\Carbon;
use DB;

class AutoEmailClients extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'auto notify client. 3 months before the pdc is consumed';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $today = Carbon::now('Asia/Manila')->format('M'); // get only the month today

        $PdcData = ClientPdc::select(
            'client_id',
            'client_bank_id',
            DB::raw('MAX(check_date) check_date')
        )
        ->groupBy(['client_id','client_bank_id'])
        ->get();

        foreach($PdcData as $data)
        {
            $clientID = $data['client_id'];

            $client = Client::find($clientID);

            $dueBeforeThreeMonths = Carbon::parse($data['check_date'])->subMonths(2)->format('M');

            if($client->email && $today === $dueBeforeThreeMonths) {

                try {
                    Mail::to($client->email)->send(new AutoEmailClientsTemplate($clientID, $data['check_date']));

                    Log::info('Successully send to: ' . $client->email);
                } catch(\Exception $e) {

                    Log::info('error: ' . $e->getMessage());
                } 
            } 
        }
    }
}
