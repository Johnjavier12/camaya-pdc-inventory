<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Client;
use Carbon\Carbon;

class AutoEmailClients extends Mailable
{
    use Queueable, SerializesModels;

    protected $clientID;

    protected $pdcEndingDate;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($clientID, $pdcEndingDate)
    {
        $this->clientID = $clientID;
        $this->pdcEndingDate = $pdcEndingDate;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $client = Client::find($this->clientID);

        $endingDateFormat = Carbon::parse($this->pdcEndingDate)->format('F');

        return $this->subject('Payment Update')
                ->from('johnjavieradmilao12@gmail.com', 'PDC & Inventory System')
                ->with([
                    'client' => $client,
                    'endingDate' => $endingDateFormat
                ])
                ->markdown('mail.autoEmailClients');
    }
}
