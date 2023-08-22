<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'background' => $this->background,
            'order' => $this->order,
            'about' => $this->about,
            'posts' => $this->posts->sortByDesc('created_at')->map(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'createdAt' => $post->created_at
                ];
            })->values()
        ];
    }
}
