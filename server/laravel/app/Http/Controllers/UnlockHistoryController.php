<?php

namespace App\Http\Controllers;

use App\Models\UnlockHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UnlockHistoryController extends Controller
{
    public function getLockHistory(Request $request, $lockId)
    {
        try {
            $rows = $request->query("rows");
            $currentPage = $request->query("page");
            $HistoryQuery = UnlockHistory::where('lockId', $lockId);
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

    public function store(Request $request)
    {
        try {
            error_log('start');
            $validated = $request->validate([
                'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:10000',
                'status' => 'required|string|in:pass,fail',
            ]);

            $unlockHistory = new UnlockHistory();
            $unlockHistory->lockId = 1;
            //$unlockHistory->userId = $request->input('userId');
            $unlockHistory->status = $validated['status'];

            error_log('save history');

            $imagesPath = 'media/unlockHistory';
            $imagesURL = 'unlockHistory';

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();

                if (!File::isDirectory(public_path($imagesPath))) {
                    File::makeDirectory(public_path($imagesPath), 0755, true);
                }

                $image->move(public_path($imagesPath), $imageName);

                $unlockHistory->image_url = $imagesURL . '/' . $imageName;
            }

            $unlockHistory->save();

            error_log('end');

            return response()->json(['message' => 'Unlock history saved successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
