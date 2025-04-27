<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConferenceUser extends Model
{
    use HasFactory;

    protected $table = 'conference_user'; // important if your table name is not pluralized ('conference_user' not 'conference_users')

    protected $fillable = [
        'conference_id',
        'user_id',
        'role',
        'status',
    ];

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
