<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>

<style>

@media only screen and (max-width: 600px) {
    .inner-body {
    width: 100% !important;
    }

    .footer {
    width: 100% !important;
    }
}

@media only screen and (max-width: 500px) {
    .button {
    width: 100% !important;
    }
}
</style>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    
<tr>
<td align="center">

<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">

<tr>
    <td class="header">
        <a href="#" style="display: inline-block;"> Camaya PDC & Inventory System
          <!-- <img src="{{ env('APP_URL').'/images/camaya-logo.png' }}" style="vertical-align: middle;" width='100' /> -->
        </a>
    </td>
</tr>


<!-- Email Body -->
<tr>
    <td class="body" width="100%" cellpadding="0" cellspacing="0">
    <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
    <!-- Body content -->
<tr>
<td class="content-cell">
    <h4 style="text-align: center;">Camaya Payment Update</h4>

    <p>Good day Mr./Ms. {{ $client->first_name }} {{ $client->last_name }},</p>

    @if($status === 'TRANSACTED')

      <p>We are sending this email to inform you that your check number {{ $checkNumber }} has now been transacted.</p>

    @elseif($status === 'HOLD')

      <p>We are sending this email to inform you that your check number {{ $checkNumber }} has not been transacted and is currently on hold due to {{ $paymentDetails }}.</p>

    @elseif($status === 'CLOSED_ACCOUNT')

      <p>We are sending this email to inform you that your check number {{ $checkNumber }} has not been transacted as it is from a closed account. Please settle your bills through our payment gateways.</p>

    @endif

    <p>Thank you,<br/>

    Camaya Coast team</p>

</td>
</tr>
</table>
</td>
</tr>

<tr>
<td>
<table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="content-cell" align="center">&copy; Camaya Coast. All rights reserved.</td>
</tr>
</table>
</td>
</tr>


</table>
</td>
</tr>
</table>
</body>
</html>
