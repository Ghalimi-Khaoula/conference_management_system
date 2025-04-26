<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Conference extends Model
{
    use HasFactory;

    protected $fillable = [
        'visibility',
        'installation_type',
        'title',
        'acronym',
        'web_page',
        'venue',
        'city',
        'country',
        'start_date',
        'end_date',
        'estimated_submissions',
        'primary_area',
        'secondary_area',
        'area_notes',
        'organizer_name',
        'organizer_web_page',
        'contact_phone',
        'additional_info',
        'status',
    ];


    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'conference_user',
            'conference_id',
            'user_id'
        )->withPivot('role', 'role_status')->withTimestamps();
    }
}
