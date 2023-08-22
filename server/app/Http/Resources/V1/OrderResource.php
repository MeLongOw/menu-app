<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->guest_name,
            'phone' => $this->guest_phone,
            'note' => $this->guest_note,
            'products' => $this->products,
            'isRead' => $this->is_read,
            'status' => $this->status,
            'createdAt' => $this->created_at
        ];
    }
}
