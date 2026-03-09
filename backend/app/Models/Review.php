<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasUuid;

class Review extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id', 'hotel_id', 'reservation_id', 'rating', 'comment', 'ratings', 'status'
    ];

    protected $casts = [
        'ratings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}

