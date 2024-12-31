<?php

namespace App\Http\Controllers;

use App\Models\ConnectedLock;
use Illuminate\Http\Request;

class ConnectedLockController extends Controller
{
    public function getLock(Request $request)
    {
        try {
            $rows = $request->query("rows");
            $currentPage = $request->query("page");
            $HistoryQuery = ConnectedLock::with('lock')->where('userId', $request->user->id);
            $History = $HistoryQuery->paginate($rows);
            if ($currentPage > $History->lastPage()) {
                $lastPageUrl = $request->url() . '?' . $request->getQueryString() . '&page=' . $History->lastPage();
                return redirect($lastPageUrl);
            }
            return ['unlockHistory' => $History];
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
