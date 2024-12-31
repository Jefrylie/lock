<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DatasetController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $image = $request->file('image');
            
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            $imagePath = $image->storeAs('images', $imageName, 'public');
            
            return response()->json([
                'message' => 'Image uploaded successfully!',
                'image_path' => $imagePath,
            ]);
        } else {
            return response()->json([
                'message' => 'Invalid image file.',
            ], 400);
        }
    }
}
