<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'description' => 'required',

            'variants' => 'array|required',
            'variants.*.name' => 'string|required',
            'variants.*.variants' => 'array|required',
            'variants.*.variants.*.name' => 'string|required',
            'variants.*.variants.*.price' => 'numeric|required',
            'variants.*.variants.*.active' => 'boolean|required',

            'images' => 'nullable|array',
            'images.*.path' => 'string',
            'images.*.order' => 'numeric',
            'categories' => 'array|required'
        ];
    }
}
