<?php

namespace App\Services;

use App\Interfaces\Logs\LogsInterface;
use App\Models\ActivityLog;
use App\Http\Resources\ActivityLogsResource;

class LogServices
{

    public function activity($description)
    {
        return ActivityLog::create([
            'user_id' => auth()->user()->id,
            'description' => $description . ' ' . auth()->user()->first_name
        ]);
    }
    public function show_activity()
    {
        return ActivityLogsResource::collection(ActivityLog::orderBy('id', 'DESC')->paginate(10));
    }
}
