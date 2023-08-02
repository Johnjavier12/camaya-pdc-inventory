<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class PaymentHistoryRequest extends FormRequest
{

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException($validator, response()->json($validator->errors(), 400));
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'pdc_id' => 'required',
            'client_id' => 'required',
            'bank_id' => 'required',
            'amount_paid' => 'required',
            'check_number' => 'required',
            'check_date' => 'required',
            'status' => 'required',
            'transaction_date' => 'required',
        ];
    }
}
