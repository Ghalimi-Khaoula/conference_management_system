<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'conference_user_id',
        'reviewer_id',
        'title',
        'abstract',
        'keywords',
        'authors',
        'file_name',
        'file_path',
        'status',
    ];

    // Relationships

    public function conferenceUser()
    {
        return $this->belongsTo(ConferenceUser::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    // Helpers (optional but super useful)

    public function getKeywordsArray(): array
    {
        return explode("\n", $this->keywords);
    }

    public function getAuthorsArray(): array
    {
        return explode("\n", $this->authors);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
