<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\TokenSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $rows = $request->query("rows");
        $currentPage = $request->query("page");
        $search = $request->query('search');
        $sort = $request->query('sort');
        $user = $request->query('user');

        $usersQuery = User::all();

        if (!empty($search)) {
            $usersQuery->where(function ($query) use ($search) {
                $query->where('users.first_name', 'like', $search . '%')
                    ->orWhere('users.email', 'like', $search . '%')
                    ->orWhere('users.phone_number', 'like', $search . '%')
                    ->orWhere('users.id', 'like', $search . '%');
            });
        }

        if (!empty($sort)) {
            $usersQuery->orderBy("users." . $sort, $user);
        }

        $user = $usersQuery->paginate($rows);

        if ($currentPage > $user->lastPage()) {
            $lastPageUrl = $request->url() . '?' . $request->getQueryString() . '&page=' . $user->lastPage();
            return redirect($lastPageUrl);
        }

        return ['user' => $user];
    }

    public function show($id)
    {
        $user = User::where('id', $id)
            ->first();

        return ['user' => $user];
    }

    public function delete($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json([
                'message' => 'user successfully deleted.',
            ], 200);
        } else {
            return response()->json([
                'message' => 'user not found.',
            ], 404);
        }
    }

    public function loginUser(Request $request)
    {
        // Validate the request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Begin database transaction
        DB::beginTransaction();

        try {
            $email = $request->input('email');

            $user = User::where('email', $email)->firstOrFail();
            $password = $request->input('password');

            // if ($user->status === "inactive") {
            // throw new \Exception("This account is banned. Please contact support.");
            // }

            if (Hash::check($password, $user->password)) {
                // $user->last_login = now();
                // $user->save();

                $currentDateTime = Carbon::now();
                $futureDateTime = $currentDateTime->addDays(3);
                $findToken = tokenSession::where('userId', $user->id)->first();
                $token = Str::random(32);

                if (!empty($findToken)) {
                    $findToken->token = $token;
                    $findToken->expiry = $futureDateTime;
                    $findToken->purpose = "Login";
                    $findToken->valid = "1";
                    $findToken->save();
                } else {
                    $sessionToken = new tokenSession();
                    $sessionToken->token = $token;
                    $sessionToken->expiry = $futureDateTime;
                    $sessionToken->purpose = "Login";
                    $sessionToken->userId = $user->id;
                    $sessionToken->valid = "1";
                    $sessionToken->save();
                }

                DB::commit();
                return ['message' => 'Welcome back ' . $user->first_name . " " . $user->last_name, "token" => $token];
            } else {
                // Triggering an error
                throw new \Exception("Email or password is incorrect");
            }
        } catch (ModelNotFoundException $exception) {
            DB::rollBack();
            return response()->json(['message' => 'Email or password is incorrect'], 404);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => $exception->getMessage()], 401);
        }
    }

    public function getUserByToken(Request $request)
    {
        // Begin database transaction
        DB::beginTransaction();

        try {
            $token = $request->input('token');
            $userId = tokenSession::where('token', $token)
                ->where('expiry', '>', now()) // Assuming `expiry` is a datetime column
                ->where('valid', true)
                ->first()->userId;
            $user = user::where('id', $userId)->first()->toArray();

            DB::commit();
            return response()->json(['message' => 'success', 'user' => $user]);
            // return ['message' => "success", "user" => $user];
        } catch (\Exception $exception) {
            // Roll back the transaction on error
            DB::rollBack();
            // Return error response
            return response()->json(['message' => 'Invalid token or token expired'], 401);
        }
    }

    public function updateTokenUser(Request $request)
    {
        $tokenSession = $request->input('token');
        $request->validate([
            'token' => 'required',
        ]);
        $futureDateTime = Carbon::now()->addDays(3);
        $findToken = TokenSession::where('token', $tokenSession)->first();
        $findToken->expiry = $futureDateTime;
        $findToken->purpose = "Login";
        $findToken->valid = "1";
        $findToken->save();

        return response()->json([
            'message' => 'Token successfully updated',
            'user' => $findToken->user,
        ]);
    }

    public function changePassword(Request $request)
    {
        DB::beginTransaction();
        try {
            // Validation rules            
            $validator = Validator::make($request->all(), [
                'passwordOld' => 'required|string',
                'passwordNew' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
                ],
                'passwordConfirm' => 'required|string|same:passwordNew',
            ], [
                'passwordNew.required' => 'The new password is required.',
                'passwordNew.string' => 'The new password must be a string.',
                'passwordNew.min' => 'The new password must be at least :min characters long.',
                'passwordNew.regex' => 'The new password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
                'passwordConfirm.required' => 'The password confirmation is required.',
                'passwordConfirm.string' => 'The password confirmation must be a string.',
                'passwordConfirm.same' => 'The password confirmation must match the new password.',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                $messages = $validator->errors()->all();
                $formattedErrors = implode(' ', $messages);
                return response()->json(['errors' => $formattedErrors], 422);
            }

            // Find the user by ID
            $user = user::findOrFail($request->input('id'));

            // Verify the old password
            if (!Hash::check($request->passwordOld, $user->password)) {
                return response()->json(['errors' => $request->errors()], 401);
            }

            // Update the user's password
            $user->password = Hash::make($request->passwordNew);
            $user->last_change_pass = now();
            $user->save();
            DB::commit();

            // Return success message
            return response()->json(['message' => 'Password updated successfully'], 200);
        } catch (\Exception $exception) {
            // Roll back the transaction on error
            DB::rollBack();

            // Return error response
            return response()->json(['message' => 'Incorrect old password'], 401);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'first_name' => 'required',
            'image' => 'nullable|max:20480'
        ]);
        // Begin database transaction
        DB::beginTransaction();
        try {
            // Find the user by ID
            $user = user::findOrFail($id);

            // Update data

            $user->first_name = $validatedData['first_name'];
            $user->last_name = $request->input('last_name');

            // Uncomment this section if you want to handle image upload

            $userImagesPath = 'media/user/' . $id;
            $userImagesURL = 'user/' . $id;

            if ($request->hasFile('image')) {
                // Delete previous image if exists
                if (File::exists($user->image_url)) {
                    File::delete($user->image_url);
                }

                // Upload new image
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();

                if (!File::isDirectory(public_path($userImagesPath))) {
                    File::makeDirectory(public_path($userImagesPath), 0755, true);
                }

                $image->move(public_path($userImagesPath), $imageName);
                $user->image_url = $userImagesURL . '/' . $imageName;
            }

            $user->save();
            DB::commit();
            // Return success message
            return response()->json(['message' => 'user profile successfully updated', 'data' => $user], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception
            Log::error('Error updating user profile: ' . $e->getMessage());

            // Return error response
            return response()->json(['error' => 'Failed to update user profile'], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Validate the request data                       
            $validator = Validator::make($request->all(), [
                'first_name' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/',
                ],
                'phone_number' => 'nullable|numeric',
            ], [
                'first_name.required' => 'The first name is required.',
                'email.required' => 'The email is required.',
                'email.email' => 'The email must be a valid email address.',
                'email.unique' => 'The email has already been taken.',
                'password.required' => 'The password is required.',
                'password.string' => 'The password must be a string.',
                'password.min' => 'The password must be at least :min characters long.',
                'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
                'phone_number.numeric' => 'The phone number must be a number.',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                $messages = $validator->errors()->all();
                $formattedErrors = implode(' ', $messages);
                return response()->json(['errors' => $formattedErrors], 422);
            }

            // Hash the password
            $hashedPassword = Hash::make($request->input('password'));

            // Create a new user instance
            $user = new user();
            $user->email = $request->input('email');
            $user->first_name = $request->input('first_name');
            $user->last_name = $request->input('last_name');
            $user->password = $hashedPassword;
            $user->phone = $request->input('phone_number');
            $user->save();

            DB::commit();
            // Return success response
            return response()->json(['message' => 'user created successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception
            Log::error('Error creating user: ' . $e->getMessage());

            // Return error response
            return response()->json(['error' => 'Failed to create user'], 500);
        }
    }

    public function recoverPassword(Request $request)
    {
        DB::beginTransaction();
        try {
            $validator = Validator::make($request->all(), [
                'token' => [
                    'required',
                    'exists:tokens,token',
                ],
                'passwordNew' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
                ],
                'passwordConfirm' => 'required|string|same:passwordNew',
            ], [
                'token.required' => 'The token field is mandatory.',
                'token.exists' => 'The token is invalid.',
                'passwordNew.required' => 'The new password is required.',
                'passwordNew.string' => 'The new password must be a string.',
                'passwordNew.min' => 'The new password must be at least :min characters long.',
                'passwordNew.regex' => 'The new password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
                'passwordConfirm.required' => 'The password confirmation is required.',
                'passwordConfirm.string' => 'The password confirmation must be a string.',
                'passwordConfirm.same' => 'The password confirmation must match the new password.',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                $messages = $validator->errors()->all();
                $formattedErrors = implode(' ', $messages);
                return response()->json(['errors' => $formattedErrors], 422);
            }

            $token = Token::where('token', $request->input('token'))
                ->where('valid', 1)
                ->where('expiry', '>', Carbon::now())
                ->first();

            if ($token) {
                // Find the user by ID
                $user = user::findOrFail($token->userId);
                $user->password = Hash::make($request->passwordNew);
                $user->last_change_pass = now();
                $user->save();

                $token->valid = 0;
                $token->save();
            } else {
                // Token is invalid or expired
                return response()->json(['message' => 'The token is invalid or has expired.'], 400);
            }
            DB::commit();

            // Return success message
            return response()->json(['message' => 'Recover Password successfully'], 200);
        } catch (\Exception $exception) {
            // Roll back the transaction on error
            DB::rollBack();

            // Return error response
            return response()->json(['message' => 'An error occurred while updating the password.'], 401);
        }
    }

    public function checkTokenRecoverPassword(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'token' => [
                'required',
                'exists:tokens,token',
            ],
        ], [
            'token.required' => 'The token field is mandatory.',
            'token.exists' => 'The token is invalid.',
        ]);

        if ($validator->fails()) {
            $messages = $validator->errors()->all();
            $formattedErrors = implode(' ', $messages);
            return response()->json(['errors' => $formattedErrors], 422);
        }

        // Retrieve and check the token
        $token = Token::where('token', $request->input('token'))
            ->where('valid', 1)
            ->where('expiry', '>', Carbon::now())
            ->first();

        if ($token) {
            // Token is valid
            return response()->json(['token' => $token], 200);
        } else {
            // Token is invalid or expired
            return response()->json(['message' => 'The token is invalid or has expired.'], 400);
        }
    }

    public function tokenRecoverPassword(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'email' => [
                    'required',
                    'email',
                    'exists:users,email',
                ],
            ], [
                'email.required' => 'The email field is mandatory.',
                'email.email' => 'Please provide a valid email address.',
                'email.exists' => 'Email is incorrect.',
            ]);

            if ($validator->fails()) {
                $messages = $validator->errors()->all();
                $formattedErrors = implode(' ', $messages);
                return response()->json(['errors' => $formattedErrors], 422);
            }

            // Retrieve
            $user = user::where('email', $request->input('email'))->firstOrFail();
            $token = Token::where('userId', $user->id)->where('valid', 1)->first();

            if (empty($token)) {
                // Create token
                $token = new Token();
                $token->token = Str::random(64);
                $token->expiry = Carbon::now()->addHours(1);
                $token->userId = $user->id;
                $token->purpose = 'Recover Password';
                $token->valid = 1;
            } else {
                $token->token = Str::random(64);
                $token->expiry = Carbon::now()->addHours(2);
                $token->valid = 1;
            }
            $token->save();

            DB::commit();

            $details = [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'verificationURL' => 'http://localhost:3000/recover-password/' . $token->token,
            ];

            // Return success message
            return response()->json(['message' => 'Recovery email has been sent.'], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            // Return error response
            return response()->json(['errors' => 'An error occurred while creating the recovery token.'], 500);
        }
    }

    public function logout(Request $request)
    {
        DB::beginTransaction();
        try {
            $token = $request->tokenMiddleware;

            $tokenSession = TokenSession::where('token', $token)->first();
            $tokenSession->valid = false;
            $tokenSession->save();

            DB::commit();
            return response()->json(['message' => 'user successfully Logout'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating user: ' . $e->getMessage());
            // Return error response
            return response()->json(['error' => 'Failed to Logout'], 500);
        }
    }
}
