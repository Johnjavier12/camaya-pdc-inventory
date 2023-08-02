<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Client;

class UpdatePdcStatus extends Mailable
{
    use Queueable, SerializesModels;

    protected $clientID;

    protected $status;

    protected $paymentDetails;

    protected $checkNumber;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($clientID, $status, $paymentDetails, $checkNumber)
    {
        $this->clientID = $clientID;
        $this->status = $status;
        $this->paymentDetails = $paymentDetails;
        $this->checkNumber = $checkNumber;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $client = Client::find($this->clientID);

        return $this->subject('Payment Update')
                ->from('johnjavieradmilao12@gmail.com', 'PDC & Inventory System')
                ->with([
                    'status' => $this->status,
                    'client' => $client,
                    'checkNumber' => $this->checkNumber,
                    'paymentDetails' => $this->paymentDetails
                ])
                ->markdown('mail.updatePdcStatus');
    }
}
