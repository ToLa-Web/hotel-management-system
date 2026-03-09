<?php

namespace App\Services;

use Cloudinary\Cloudinary;

class CloudinaryService
{
    protected $cloudinary = null;

    public function __construct()
    {
        // Lazy-initialized: Cloudinary is only connected when an upload is attempted.
        // This prevents a ConfigurationException from crashing every controller
        // when CLOUDINARY_URL is not set.
    }

    protected function getClient(): Cloudinary
    {
        if ($this->cloudinary === null) {
            $this->cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key'    => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
                'url' => [
                    'secure' => config('cloudinary.secure', true),
                ],
            ]);
        }

        return $this->cloudinary;
    }

    public function uploadImage($file, $options = [])
    {
        try {
            $result = $this->getClient()->uploadApi()->upload($file, $options);
            return [
                'success' => true,
                'url' => $result['secure_url'],
                'public_id' => $result['public_id']
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function uploadVideo($file, $options = [])
    {
        try {
            $options['resource_type'] = 'video';
            $result = $this->getClient()->uploadApi()->upload($file, $options);
            return [
                'success' => true,
                'url' => $result['secure_url'],
                'public_id' => $result['public_id']
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($publicId, $resourceType = 'image')
    {
        try {
            $this->getClient()->uploadApi()->destroy($publicId, ['resource_type' => $resourceType]);
            return [
                'success' => true,
                'message' => 'Resource deleted successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
} 