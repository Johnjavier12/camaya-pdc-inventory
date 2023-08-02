<table>   
    <tbody>                
         <tr>
                                                             
            <tr>
                <th align="center" style="font-weight: bold;">#</th>
                <th align="center" style="font-weight: bold;">Client No.</th>
                <th align="center" style="font-weight: bold;">Client Name</th>
                <th align="center" style="font-weight: bold;">Amount</th>
                <th align="center" style="font-weight: bold;">Check Date</th>
                <th align="center" style="font-weight: bold;">Check No.</th>
                <th align="center" style="font-weight: bold;">Status</th>
                <th align="center" style="font-weight: bold;">Transaction Date</th>
            </tr> 
            @foreach($data as $key => $d)
            <tr>
                <td align="center" >{{ $d->id }}</td>
                <td align="center">{{ $d->client_number }}</td>
                <td align="center" >{{ $d->first_name }} {{ $d->last_name }}</td>
                <td align="center" >{{ number_format($d->amount, 2) }}</td>
                <td align="center" >{{ $d->check_date }}</td>
                <td align="center" >{{ $d->check_number }}</td>
                <td align="center" >{{ $d->status }}</td>
                <td align="center" >{{ $d->transaction_date }}</td>
            </tr> 
            @endforeach
    </tbody>
</table>
