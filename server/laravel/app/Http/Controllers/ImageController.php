<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ImageController extends Controller
{
    public function show(Request $request)
    {
        try {
            $filename = $request->query('media');

            $filePath = public_path('media/' . $filename);
            if (!file_exists($filePath)) {
                return response()->json(['error' => 'Media not found'], 404);
                // abort(404);
            }

            $fileContents = file_get_contents($filePath);
            $response = Response::make($fileContents, 200);

            $mimeType = mime_content_type($filePath);
            $response->header('Content-Type', $mimeType);

            return $response;
        } catch (\Exception $e) {
            // Rollback transaction on error            
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
