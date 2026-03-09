<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth consent screen.
     */
    public function redirect()
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver('google');

        return $driver->stateless()->redirect();
    }

    /**
     * Handle callback from Google, create/find user, issue JWT, redirect to frontend.
     */
    public function callback()
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');
            $googleUser = $driver->stateless()->user();

            // Find existing user by google_id or email
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // Link google_id if not already set
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                    $user->save();
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(24)),
                    'role' => 'User',
                ]);
            }

            // Generate JWT tokens
            $accessToken = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::customClaims([
                'sub' => $user->id,
                'typ' => 'refresh',
                'exp' => time() + (60 * 60 * 24 * 30),
            ])->fromUser($user);

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

            return redirect()->to(
                $frontendUrl . '/auth/google/callback'
                . '?access_token=' . $accessToken
                . '&refresh_token=' . $refreshToken
            );
        } catch (\Exception $e) {
            Log::error('Google OAuth error: ' . $e->getMessage());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

            return redirect()->to(
                $frontendUrl . '/login?error=google_auth_failed'
            );
        }
    }
}
