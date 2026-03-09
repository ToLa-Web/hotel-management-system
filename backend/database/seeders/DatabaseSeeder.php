<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Explore;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('reviews')->truncate();
        DB::table('payments')->truncate();
        DB::table('reservations')->truncate();
        DB::table('rooms')->truncate();
        DB::table('room_types')->truncate();
        DB::table('hotels')->truncate();
        DB::table('users')->truncate();
        DB::table('explores')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        
        $admin = User::create([
            'name'          => 'Admin User',
            'email'         => 'admin@example.com',
            'password'      => Hash::make('password'),
            'role'          => 'Admin',
            'phone'         => '1234567890',
            'address'       => 'Admin Address',
            'date_of_birth' => '1990-01-01',
        ]);

        $owner = User::create([
            'name'          => 'Hotel Owner',
            'email'         => 'owner@example.com',
            'password'      => Hash::make('password'),
            'role'          => 'Owner',
            'phone'         => '9876543210',
            'address'       => 'Owner Address',
            'date_of_birth' => '1985-06-15',
        ]);

        $owner2 = User::create([
            'name'          => 'Second Owner',
            'email'         => 'owner2@example.com',
            'password'      => Hash::make('password'),
            'role'          => 'Owner',
            'phone'         => '9876540000',
            'address'       => 'Second Owner Address',
            'date_of_birth' => '1980-03-10',
        ]);

        $user = User::create([
            'name'          => 'Regular User',
            'email'         => 'user@example.com',
            'password'      => Hash::make('password'),
            'role'          => 'User',
            'phone'         => '5555555555',
            'address'       => 'User Address',
            'date_of_birth' => '2000-08-21',
        ]);

    
        $hotelsData = [
            // Hotel 1
            [
                'owner_id'      => $owner->id,
                'name'          => 'Sunrise Hotel',
                'slug'          => 'sunrise-hotel',
                'description'   => 'A beautiful beachfront hotel with stunning ocean views and world-class amenities.',
                'address'       => '100 Beach Road',
                'city'          => 'Miami',
                'state'         => 'FL',
                'country'       => 'USA',
                'postal_code'   => '33101',
                'latitude'      => 25.7617,
                'longitude'     => -80.1918,
                'phone'         => '3051234567',
                'email'         => 'contact@sunrisehotel.com',
                'website'       => 'https://sunrisehotel.com',
                'amenities'     => ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753237148/hvahs0k03mzdfovv7ypq.jpg', // hotel 1 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236439/ae34rsjmz93wairaxwst.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236429/iuklxsr9g9xf9pprafc3.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236450/cp08jcmlk8czvusim24r.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236436/wc0w2c5sinkabyh89z3y.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236435/zo4suex02tqchruzofz0.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236341/du9yrxb9sv5db5fmcgaz.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828299/yccv6aqj546nlvdctork.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750822955/atuetpoyfkokcrzsm2mm.jpg', // hotel 1 - image 2
                ],
                'rating'        => 4.5,
                'total_reviews' => 128,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Standard Room',
                        'description' => 'Comfortable room with garden view, perfect for solo travelers.',
                        'base_price'  => 89.00,
                        'capacity'    => 1,
                        'size'        => 22.0,
                        'amenities'   => ['wifi', 'tv', 'ac'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236439/ae34rsjmz93wairaxwst.jpg', // hotel 1 - standard room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Deluxe Room',
                        'description' => 'Spacious room with ocean view and premium furnishings.',
                        'base_price'  => 150.00,
                        'capacity'    => 2,
                        'size'        => 30.5,
                        'amenities'   => ['wifi', 'tv', 'ac', 'minibar'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823204/fz7vhh2ominq0slpggzy.png', // hotel 1 - deluxe room
                        ],
                        'rooms'       => [
                            ['room_number' => '201', 'floor' => '2'],
                            ['room_number' => '202', 'floor' => '2'],
                        ],
                    ],
                    [
                        'name'        => 'Suite',
                        'description' => 'Luxury suite with panoramic ocean views and private balcony.',
                        'base_price'  => 280.00,
                        'capacity'    => 4,
                        'size'        => 60.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 1 - suite
                        ],
                        'rooms'       => [
                            ['room_number' => '501', 'floor' => '5'],
                        ],
                    ],
                ],
            ],
            // Hotel 2
            [
                'owner_id'      => $owner->id,
                'name'          => 'Grand Palace Hotel',
                'slug'          => 'grand-palace-hotel',
                'description'   => 'An iconic city-center hotel offering luxury stays, fine dining, and rooftop pool.',
                'address'       => '25 Parliament Square',
                'city'          => 'London',
                'state'         => 'England',
                'country'       => 'UK',
                'postal_code'   => 'SW1A 1AA',
                'latitude'      => 51.5074,
                'longitude'     => -0.1278,
                'phone'         => '442071234567',
                'email'         => 'info@grandpalace.co.uk',
                'website'       => 'https://grandpalacehotel.co.uk',
                'amenities'     => ['wifi', 'pool', 'gym', 'restaurant', 'bar', 'concierge'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753237254/xqeoisotxekn9hzwxku7.jpg', // hotel 2 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236431/wpqgo1s1bkulwthpqb7f.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828233/svmvfal9huws4sgkmxyp.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828226/tznv02avlaiktptt03pt.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823181/ioukxu62sjrsnnmwtv9y.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750777675/nns8nor2ehih2zcd4yoq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750752755/lq0gnx1fo5xnfqrdjfez.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750752751/qvsfbkeztsttlnwsobhq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750669917/ho8ceyeqd40bzqslnoca.jpg', // hotel 2 - image 2
                ],
                'rating'        => 4.8,
                'total_reviews' => 342,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Classic Room',
                        'description' => 'Elegant room with classic British décor and city views.',
                        'base_price'  => 200.00,
                        'capacity'    => 2,
                        'size'        => 28.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750669917/ho8ceyeqd40bzqslnoca.jpg', // hotel 2 - classic room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                            ['room_number' => '103', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Premier Suite',
                        'description' => 'Opulent suite with separate living area and butler service.',
                        'base_price'  => 550.00,
                        'capacity'    => 3,
                        'size'        => 75.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe', 'minibar', 'butler'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828233/svmvfal9huws4sgkmxyp.jpg', // hotel 2 - premier suite
                        ],
                        'rooms'       => [
                            ['room_number' => '801', 'floor' => '8'],
                        ],
                    ],
                    [
                        'name'        => 'Executive Room',
                        'description' => 'Refined room with a work desk, lounge chair, and premium city views.',
                        'base_price'  => 320.00,
                        'capacity'    => 2,
                        'size'        => 38.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe', 'minibar', 'work-desk'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg', // hotel 2 - executive room
                        ],
                        'rooms'       => [
                            ['room_number' => '501', 'floor' => '5'],
                            ['room_number' => '502', 'floor' => '5'],
                        ],
                    ],
                ],
            ],
            // Hotel 3
            [
                'owner_id'      => $owner->id,
                'name'          => 'Azure Bay Resort',
                'slug'          => 'azure-bay-resort',
                'description'   => 'A tropical resort nestled on a private bay with crystal-clear waters.',
                'address'       => '1 Bayview Drive',
                'city'          => 'Phuket',
                'state'         => 'Phuket Province',
                'country'       => 'Thailand',
                'postal_code'   => '83000',
                'latitude'      => 7.8804,
                'longitude'     => 98.3923,
                'phone'         => '6676123456',
                'email'         => 'hello@azurebay.th',
                'website'       => 'https://azurebayresort.com',
                'amenities'     => ['wifi', 'pool', 'spa', 'restaurant', 'beach', 'watersports'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236936/omevmlywequzakbgyili.jpg', // hotel 3 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828304/jat8svbesbfejc6pnmvl.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828299/yccv6aqj546nlvdctork.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828210/cwtlasbptukjglvceisv.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823185/im2rgakyjh4iv2rcsyut.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750776782/erqpjqvewjcjoxcnfadq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908384/fspvvg2g6zlrbgzhjx5b.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908126/ec0zsvkv3folh22rsjaf.jpg', // hotel 3 - image 2
                ],
                'rating'        => 4.7,
                'total_reviews' => 215,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Garden Bungalow',
                        'description' => 'Private bungalow surrounded by tropical gardens.',
                        'base_price'  => 120.00,
                        'capacity'    => 2,
                        'size'        => 35.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'outdoor-shower'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg', // hotel 3 - garden bungalow
                        ],
                        'rooms'       => [
                            ['room_number' => 'G01', 'floor' => '0'],
                            ['room_number' => 'G02', 'floor' => '0'],
                        ],
                    ],
                    [
                        'name'        => 'Beach Villa',
                        'description' => 'Overwater villa with direct beach access and private pool.',
                        'base_price'  => 450.00,
                        'capacity'    => 4,
                        'size'        => 90.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'private-pool', 'beach-access'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908384/fspvvg2g6zlrbgzhjx5b.jpg', // hotel 3 - beach villa
                        ],
                        'rooms'       => [
                            ['room_number' => 'V01', 'floor' => '0'],
                            ['room_number' => 'V02', 'floor' => '0'],
                        ],
                    ],
                    [
                        'name'        => 'Family Pool Suite',
                        'description' => 'Spacious suite with two bedrooms, shared pool, and kids play area.',
                        'base_price'  => 280.00,
                        'capacity'    => 5,
                        'size'        => 65.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'shared-pool', 'kids-area'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750776782/erqpjqvewjcjoxcnfadq.jpg', // hotel 3 - family pool suite
                        ],
                        'rooms'       => [
                            ['room_number' => 'FP01', 'floor' => '1'],
                        ],
                    ],
                ],
            ],
            // Hotel 4
            [
                'owner_id'      => $owner2->id,
                'name'          => 'Mountain Peak Lodge',
                'slug'          => 'mountain-peak-lodge',
                'description'   => 'A cozy alpine lodge with breathtaking mountain views and ski-in/ski-out access.',
                'address'       => '88 Summit Road',
                'city'          => 'Zermatt',
                'state'         => 'Valais',
                'country'       => 'Switzerland',
                'postal_code'   => '3920',
                'latitude'      => 46.0207,
                'longitude'     => 7.7491,
                'phone'         => '41279234567',
                'email'         => 'stay@mountainpeaklodge.ch',
                'website'       => 'https://mountainpeaklodge.ch',
                'amenities'     => ['wifi', 'spa', 'restaurant', 'ski', 'fireplace'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908375/bqlkrbkudkms0iqqbo1b.jpg', // hotel 4 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748676561/mek4xjsnjhqu9tpdzlic.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747141734/v49cqza3pqk0pamswfpj.jpg', // hotel 4 - image 2
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748533604/fbdwh6dgiikslp7u9f7u.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747148329/ocgupfqqsba26gc42lk3.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747143104/xbhztrneqsqkhq46klq0.png',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747141361/flqzj4ngwvfawkxyikqm.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747130351/xyzsthtvzqear1vhoebj.jpg',
                ],
                'rating'        => 4.6,
                'total_reviews' => 98,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Cozy Cabin Room',
                        'description' => 'Warm timber-clad room with mountain-view window.',
                        'base_price'  => 180.00,
                        'capacity'    => 2,
                        'size'        => 25.0,
                        'amenities'   => ['wifi', 'tv', 'heating', 'safe'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747141361/flqzj4ngwvfawkxyikqm.jpg', // hotel 4 - cabin room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Alpine Suite',
                        'description' => 'Spacious suite with fireplace and Matterhorn views.',
                        'base_price'  => 380.00,
                        'capacity'    => 3,
                        'size'        => 55.0,
                        'amenities'   => ['wifi', 'tv', 'heating', 'fireplace', 'balcony'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 4 - alpine suite
                        ],
                        'rooms'       => [
                            ['room_number' => '301', 'floor' => '3'],
                        ],
                    ],
                    [
                        'name'        => 'Family Chalet Room',
                        'description' => 'Large family room with bunk beds, ski storage, and mountain views.',
                        'base_price'  => 260.00,
                        'capacity'    => 5,
                        'size'        => 45.0,
                        'amenities'   => ['wifi', 'tv', 'heating', 'ski-storage', 'bunk-beds'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747143104/xbhztrneqsqkhq46klq0.png', // hotel 4 - family chalet room
                        ],
                        'rooms'       => [
                            ['room_number' => '201', 'floor' => '2'],
                            ['room_number' => '202', 'floor' => '2'],
                        ],
                    ],
                ],
            ],
            // Hotel 5
            [
                'owner_id'      => $owner2->id,
                'name'          => 'TARA Angkor Hotel',
                'slug'          => 'desert-oasis-hotel',
                'description'   => 'A luxurious desert escape with infinity pool and stargazing experiences.',
                'address'       => '15 Dune Street',
                'city'          => 'Dubai',
                'state'         => 'Dubai Emirate',
                'country'       => 'UAE',
                'postal_code'   => '00000',
                'latitude'      => 25.2048,
                'longitude'     => 55.2708,
                'phone'         => '97143456789',
                'email'         => 'reservations@desertoasis.ae',
                'website'       => 'https://desertoasishotel.ae',
                'amenities'     => ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'desert-tours'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830208/fu1f8pshunlf1fkwdzeb.jpg', // hotel 5 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830211/nees0ixnu86gd3czfv6u.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830217/ylggg9olm4bshkxkn3qb.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830224/kw2udkalylidylmxmhvi.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830222/ql3oz0efgcauiyymk8fy.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830227/dh1qeerjiqd6bwq8hvbx.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750830220/niktkvao0obl6iciwgnr.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750829565/mkfs4gpsebxjprkwajee.jpg', // hotel 5 - image 2
                ],
                'rating'        => 4.9,
                'total_reviews' => 412,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Desert View Room',
                        'description' => 'Modern room with floor-to-ceiling windows overlooking the dunes.',
                        'base_price'  => 250.00,
                        'capacity'    => 2,
                        'size'        => 32.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'minibar'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828329/sy7trckqxuklhhr0gguc.jpg', // hotel 5 - desert view room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Royal Desert Suite',
                        'description' => 'An extravagant suite with private terrace and butler service.',
                        'base_price'  => 900.00,
                        'capacity'    => 4,
                        'size'        => 120.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'minibar', 'private-pool', 'butler'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750829561/ya8lvle6dp2emu799rqr.jpg', // hotel 5 - royal suite
                        ],
                        'rooms'       => [
                            ['room_number' => '1001', 'floor' => '10'],
                        ],
                    ],
                    [
                        'name'        => 'Deluxe Oasis Room',
                        'description' => 'Upgraded room with infinity pool access, rainfall shower, and desert sunset views.',
                        'base_price'  => 420.00,
                        'capacity'    => 2,
                        'size'        => 48.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'minibar', 'pool-access', 'rainfall-shower'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750829565/mkfs4gpsebxjprkwajee.jpg', // hotel 5 - deluxe oasis room
                        ],
                        'rooms'       => [
                            ['room_number' => '301', 'floor' => '3'],
                            ['room_number' => '302', 'floor' => '3'],
                        ],
                    ],
                ],
            ],
            // Hotel 6
            [
                'owner_id'      => $owner->id,
                'name'          => 'Sakura Inn',
                'slug'          => 'sakura-inn',
                'description'   => 'A traditional Japanese ryokan-inspired hotel with onsen and tatami rooms.',
                'address'       => '5 Sakura Street',
                'city'          => 'Kyoto',
                'state'         => 'Kyoto Prefecture',
                'country'       => 'Japan',
                'postal_code'   => '604-0000',
                'latitude'      => 35.0116,
                'longitude'     => 135.7681,
                'phone'         => '817512345678',
                'email'         => 'info@sakurainn.jp',
                'website'       => 'https://sakurainn.jp',
                'amenities'     => ['wifi', 'onsen', 'spa', 'restaurant', 'garden'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828308/pcrr8cz7mvs7xpvwq6pn.jpg', // hotel 6 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828230/crm5mnpl3rpt1bekfi0q.png',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750777745/vw64ujkiarhhbxbcyawv.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750669915/htggh4hr91xtvmfipxee.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749909902/w1idoy7rx2b4ctwgrq69.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748533610/lte1vgdpnerhxnjrpdij.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748444487/lcc7ghmr60azwfzuea0f.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747236486/zbaphuwnuty6lflwtnfi.jpg', // hotel 6 - image 2
                ],
                'rating'        => 4.7,
                'total_reviews' => 176,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Tatami Room',
                        'description' => 'Traditional Japanese room with tatami flooring and futon beds.',
                        'base_price'  => 140.00,
                        'capacity'    => 2,
                        'size'        => 20.0,
                        'amenities'   => ['wifi', 'ac', 'yukata', 'tea-set'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1748533610/lte1vgdpnerhxnjrpdij.jpg', // hotel 6 - tatami room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Garden Suite',
                        'description' => 'Spacious suite with private Japanese garden view and onsen bath.',
                        'base_price'  => 320.00,
                        'capacity'    => 3,
                        'size'        => 50.0,
                        'amenities'   => ['wifi', 'ac', 'yukata', 'tea-set', 'private-onsen'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1749909902/w1idoy7rx2b4ctwgrq69.jpg', // hotel 6 - garden suite
                        ],
                        'rooms'       => [
                            ['room_number' => '301', 'floor' => '3'],
                        ],
                    ],
                    [
                        'name'        => 'Ryokan Family Room',
                        'description' => 'Traditional family room with two futons, shared onsen access, and bamboo garden view.',
                        'base_price'  => 220.00,
                        'capacity'    => 4,
                        'size'        => 36.0,
                        'amenities'   => ['wifi', 'ac', 'yukata', 'tea-set', 'shared-onsen'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1748422725/dfcjygqwgvrstmx4wwue.jpg', // hotel 6 - ryokan family room
                        ],
                        'rooms'       => [
                            ['room_number' => '201', 'floor' => '2'],
                            ['room_number' => '202', 'floor' => '2'],
                        ],
                    ],
                ],
            ],
            // Hotel 7
            [
                'owner_id'      => $owner2->id,
                'name'          => 'Harbor View Hotel',
                'slug'          => 'harbor-view-hotel',
                'description'   => 'A contemporary waterfront hotel with spectacular harbor views and seafood dining.',
                'address'       => '200 Harbor Boulevard',
                'city'          => 'Sydney',
                'state'         => 'NSW',
                'country'       => 'Australia',
                'postal_code'   => '2000',
                'latitude'      => -33.8688,
                'longitude'     => 151.2093,
                'phone'         => '61292345678',
                'email'         => 'bookings@harborview.com.au',
                'website'       => 'https://harborviewhotel.com.au',
                'amenities'     => ['wifi', 'pool', 'gym', 'restaurant', 'bar', 'parking'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753237049/wyit1x8ivhnkbmi5bf5g.jpg', // hotel 7 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828326/tl5zebayivtm4isgp4bq.png',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828329/sy7trckqxuklhhr0gguc.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828301/xkbkf6vyxki8lizth0bt.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828295/sysraqyugui6hxqqvmlr.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828226/tznv02avlaiktptt03pt.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828218/dq4igch5lptmz3yfdnnd.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828213/krcctla8k8t1ajpcp7hd.jpg', // hotel 7 - image 2
                ],
                'rating'        => 4.4,
                'total_reviews' => 263,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'City View Room',
                        'description' => 'Modern room with stunning Sydney CBD views.',
                        'base_price'  => 175.00,
                        'capacity'    => 2,
                        'size'        => 27.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828213/krcctla8k8t1ajpcp7hd.jpg', // hotel 7 - city view room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '102', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Harbor Suite',
                        'description' => 'Premium suite with Opera House views and private balcony.',
                        'base_price'  => 420.00,
                        'capacity'    => 3,
                        'size'        => 65.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe', 'minibar', 'balcony'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823185/im2rgakyjh4iv2rcsyut.jpg', // hotel 7 - harbor suite
                        ],
                        'rooms'       => [
                            ['room_number' => '1201', 'floor' => '12'],
                        ],
                    ],
                    [
                        'name'        => 'Deluxe Harbor Room',
                        'description' => 'Upgraded room with partial harbor views, king bed, and lounge seating.',
                        'base_price'  => 270.00,
                        'capacity'    => 2,
                        'size'        => 38.0,
                        'amenities'   => ['wifi', 'tv', 'ac', 'safe', 'minibar'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750822975/u33qlivg0rb6w9ud6b48.jpg', // hotel 7 - deluxe harbor room
                        ],
                        'rooms'       => [
                            ['room_number' => '601', 'floor' => '6'],
                            ['room_number' => '602', 'floor' => '6'],
                        ],
                    ],
                ],
            ],
            // Hotel 8
            [
                'owner_id'      => $owner->id,
                'name'          => 'La Bella Vista',
                'slug'          => 'la-bella-vista',
                'description'   => 'A romantic boutique hotel perched on the Amalfi cliffs with sea-view terraces.',
                'address'       => 'Via Positano 33',
                'city'          => 'Positano',
                'state'         => 'Campania',
                'country'       => 'Italy',
                'postal_code'   => '84017',
                'latitude'      => 40.6283,
                'longitude'     => 14.4855,
                'phone'         => '390892345678',
                'email'         => 'info@labellavista.it',
                'website'       => 'https://labellavistahotel.it',
                'amenities'     => ['wifi', 'pool', 'restaurant', 'bar', 'terrace'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1746523325/j6nxyfsmykobg6whwbed.jpg', // hotel 8 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1746439576/cld-sample-4.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747140744/jiljzw4xskymqqtxnxik.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828210/cwtlasbptukjglvceisv.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823185/im2rgakyjh4iv2rcsyut.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750776782/erqpjqvewjcjoxcnfadq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908384/fspvvg2g6zlrbgzhjx5b.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908126/ec0zsvkv3folh22rsjaf.jpg', // hotel 8 - image 2
                ],
                'rating'        => 4.8,
                'total_reviews' => 189,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Classic Sea View',
                        'description' => 'Charming room with terracotta tiles and Mediterranean sea view.',
                        'base_price'  => 220.00,
                        'capacity'    => 2,
                        'size'        => 24.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'balcony'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828213/krcctla8k8t1ajpcp7hd.jpg', // hotel 8 - sea view room
                        ],
                        'rooms'       => [
                            ['room_number' => '101', 'floor' => '1'],
                            ['room_number' => '201', 'floor' => '2'],
                        ],
                    ],
                    [
                        'name'        => 'Cliffside Suite',
                        'description' => 'Exclusive suite carved into the cliff with panoramic Amalfi views.',
                        'base_price'  => 600.00,
                        'capacity'    => 2,
                        'size'        => 58.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'balcony', 'plunge-pool'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828218/dq4igch5lptmz3yfdnnd.jpg', // hotel 8 - cliffside suite
                        ],
                        'rooms'       => [
                            ['room_number' => '401', 'floor' => '4'],
                        ],
                    ],
                    [
                        'name'        => 'Deluxe Terrace Room',
                        'description' => 'Bright room with a private terrace overlooking the colorful village.',
                        'base_price'  => 350.00,
                        'capacity'    => 2,
                        'size'        => 32.0,
                        'amenities'   => ['wifi', 'ac', 'tv', 'terrace', 'espresso-machine'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828210/cwtlasbptukjglvceisv.jpg', // hotel 8 - deluxe terrace room
                        ],
                        'rooms'       => [
                            ['room_number' => '301', 'floor' => '3'],
                            ['room_number' => '302', 'floor' => '3'],
                        ],
                    ],
                ],
            ],
            // Hotel 9
            [
                'owner_id'      => $owner2->id,
                'name'          => 'Neon Capsule Hotel',
                'slug'          => 'neon-capsule-hotel',
                'description'   => 'A futuristic capsule hotel in the heart of the city — affordable, stylish, and tech-forward.',
                'address'       => '77 Neon Alley',
                'city'          => 'Tokyo',
                'state'         => 'Tokyo Metropolis',
                'country'       => 'Japan',
                'postal_code'   => '100-0001',
                'latitude'      => 35.6762,
                'longitude'     => 139.6503,
                'phone'         => '81312345678',
                'email'         => 'hello@neoncapsule.jp',
                'website'       => 'https://neoncapsulehotel.jp',
                'amenities'     => ['wifi', 'lounge', 'luggage-storage', 'vending'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1746545367/a874adth5wjujpebkxua.jpg', // hotel 9 - image 1
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823185/im2rgakyjh4iv2rcsyut.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750776782/erqpjqvewjcjoxcnfadq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908384/fspvvg2g6zlrbgzhjx5b.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908126/ec0zsvkv3folh22rsjaf.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828213/krcctla8k8t1ajpcp7hd.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828218/dq4igch5lptmz3yfdnnd.jpg', // hotel 9 - image 2
                ],
                'rating'        => 4.2,
                'total_reviews' => 531,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Standard Capsule',
                        'description' => 'Compact smart capsule with privacy curtain and personal entertainment screen.',
                        'base_price'  => 45.00,
                        'capacity'    => 1,
                        'size'        => 4.0,
                        'amenities'   => ['wifi', 'tv', 'usb-charging', 'reading-light'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828213/krcctla8k8t1ajpcp7hd.jpg', // hotel 9 - standard capsule
                        ],
                        'rooms'       => [
                            ['room_number' => 'C01', 'floor' => '1'],
                            ['room_number' => 'C02', 'floor' => '1'],
                            ['room_number' => 'C03', 'floor' => '1'],
                        ],
                    ],
                    [
                        'name'        => 'Premium Pod',
                        'description' => 'Larger pod with sit-up space, Bluetooth speakers, and blackout blinds.',
                        'base_price'  => 70.00,
                        'capacity'    => 1,
                        'size'        => 7.0,
                        'amenities'   => ['wifi', 'tv', 'usb-charging', 'bluetooth', 'blackout'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828218/dq4igch5lptmz3yfdnnd.jpg', // hotel 9 - premium pod
                        ],
                        'rooms'       => [
                            ['room_number' => 'P01', 'floor' => '2'],
                            ['room_number' => 'P02', 'floor' => '2'],
                        ],
                    ],
                    [
                        'name'        => 'Twin Capsule',
                        'description' => 'Side-by-side double capsule ideal for friends or couples on a budget.',
                        'base_price'  => 85.00,
                        'capacity'    => 2,
                        'size'        => 9.0,
                        'amenities'   => ['wifi', 'tv', 'usb-charging', 'shared-curtain'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828210/cwtlasbptukjglvceisv.jpg', // hotel 9 - twin capsule
                        ],
                        'rooms'       => [
                            ['room_number' => 'T01', 'floor' => '1'],
                            ['room_number' => 'T02', 'floor' => '1'],
                        ],
                    ],
                ],
            ],
            // Hotel 10
            [
                'owner_id'      => $owner->id,
                'name'          => 'Rainforest Canopy Lodge',
                'slug'          => 'rainforest-canopy-lodge',
                'description'   => 'An eco-lodge nestled in the Amazon rainforest canopy for nature lovers.',
                'address'       => 'Kilometre 12, Forest Reserve Road',
                'city'          => 'Manaus',
                'state'         => 'Amazonas',
                'country'       => 'Brazil',
                'postal_code'   => '69000-000',
                'latitude'      => -3.1190,
                'longitude'     => -60.0217,
                'phone'         => '5592912345678',
                'email'         => 'stay@rainforestlodge.br',
                'website'       => 'https://rainforestcanopylodge.com',
                'amenities'     => ['wifi', 'restaurant', 'guided-tours', 'kayaking', 'wildlife-watching'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1746544643/e3s6qa45x0hakn67pwr1.jpg', 
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748676561/mek4xjsnjhqu9tpdzlic.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747141734/v49cqza3pqk0pamswfpj.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1748533604/fbdwh6dgiikslp7u9f7u.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747148329/ocgupfqqsba26gc42lk3.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747143104/xbhztrneqsqkhq46klq0.png',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747141361/flqzj4ngwvfawkxyikqm.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1747130351/xyzsthtvzqear1vhoebj.jpg', // hotel 10 - image 2
                ],
                'rating'        => 4.6,
                'total_reviews' => 87,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Treetop Room',
                        'description' => 'Rustic room elevated in the canopy with wraparound jungle views.',
                        'base_price'  => 130.00,
                        'capacity'    => 2,
                        'size'        => 22.0,
                        'amenities'   => ['wifi', 'fan', 'mosquito-net', 'hammock'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 10 - treetop room
                        ],
                        'rooms'       => [
                            ['room_number' => 'T01', 'floor' => '3'],
                            ['room_number' => 'T02', 'floor' => '3'],
                        ],
                    ],
                    [
                        'name'        => 'Family Jungle Suite',
                        'description' => 'Spacious two-bedroom suite with open-air living deck and jungle views.',
                        'base_price'  => 260.00,
                        'capacity'    => 5,
                        'size'        => 55.0,
                        'amenities'   => ['wifi', 'fan', 'mosquito-net', 'hammock', 'deck'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 10 - jungle suite
                        ],
                        'rooms'       => [
                            ['room_number' => 'JS01', 'floor' => '4'],
                        ],
                    ],
                    [
                        'name'        => 'Riverside Cabin',
                        'description' => 'Ground-level cabin on the Amazon riverbank with private dock and canoe.',
                        'base_price'  => 190.00,
                        'capacity'    => 3,
                        'size'        => 35.0,
                        'amenities'   => ['wifi', 'fan', 'mosquito-net', 'private-dock', 'canoe'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 10 - riverside cabin
                        ],
                        'rooms'       => [
                            ['room_number' => 'RC01', 'floor' => '0'],
                            ['room_number' => 'RC02', 'floor' => '0'],
                        ],
                    ],
                ],
            ],
            // Hotel 11
            [
                'owner_id'      => $owner2->id,
                'name'          => 'Arctic Northern Lights Hotel',
                'slug'          => 'arctic-northern-lights-hotel',
                'description'   => 'Glass-roofed aurora hotel offering unobstructed northern lights viewing from your bed.',
                'address'       => '1 Aurora Lane',
                'city'          => 'Tromsø',
                'state'         => 'Troms',
                'country'       => 'Norway',
                'postal_code'   => '9000',
                'latitude'      => 69.6492,
                'longitude'     => 18.9553,
                'phone'         => '4777012345',
                'email'         => 'info@arcticnorthernlights.no',
                'website'       => 'https://arcticnorthernlightshotel.no',
                'amenities'     => ['wifi', 'restaurant', 'aurora-tours', 'dog-sledding', 'sauna'],
                'images'        => [
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1753236936/omevmlywequzakbgyili.jpg', 
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828304/jat8svbesbfejc6pnmvl.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828299/yccv6aqj546nlvdctork.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750828210/cwtlasbptukjglvceisv.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823185/im2rgakyjh4iv2rcsyut.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1750776782/erqpjqvewjcjoxcnfadq.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908384/fspvvg2g6zlrbgzhjx5b.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908383/wvsez0eafkbvd0ew0xqn.jpg',
                    'https://res.cloudinary.com/djbtemkl1/image/upload/v1749908126/ec0zsvkv3folh22rsjaf.jpg', // hotel 11 - image 2
                ],
                'rating'        => 4.9,
                'total_reviews' => 143,
                'status'        => 'active',
                'room_types'    => [
                    [
                        'name'        => 'Glass Igloo',
                        'description' => 'Heated glass igloo with panoramic sky dome for aurora viewing.',
                        'base_price'  => 500.00,
                        'capacity'    => 2,
                        'size'        => 18.0,
                        'amenities'   => ['wifi', 'heating', 'electric-blanket', 'sky-view'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 11 - glass igloo
                        ],
                        'rooms'       => [
                            ['room_number' => 'I01', 'floor' => '0'],
                            ['room_number' => 'I02', 'floor' => '0'],
                            ['room_number' => 'I03', 'floor' => '0'],
                        ],
                    ],
                    [
                        'name'        => 'Aurora Luxury Cabin',
                        'description' => 'Private wooden cabin with glass ceiling panels and sauna.',
                        'base_price'  => 750.00,
                        'capacity'    => 3,
                        'size'        => 40.0,
                        'amenities'   => ['wifi', 'heating', 'electric-blanket', 'sky-view', 'sauna', 'fireplace'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 11 - luxury cabin
                        ],
                        'rooms'       => [
                            ['room_number' => 'LC01', 'floor' => '0'],
                        ],
                    ],
                    [
                        'name'        => 'Northern Lights Room',
                        'description' => 'Warm hotel room with skylights and guided aurora photography sessions.',
                        'base_price'  => 280.00,
                        'capacity'    => 2,
                        'size'        => 22.0,
                        'amenities'   => ['wifi', 'heating', 'electric-blanket', 'skylight', 'aurora-alert'],
                        'images'      => [
                            'https://res.cloudinary.com/djbtemkl1/image/upload/v1747142474/ziu5wvbkrnj7vchyjro4.jpg', // hotel 11 - northern lights room
                        ],
                        'rooms'       => [
                            ['room_number' => 'NL01', 'floor' => '1'],
                            ['room_number' => 'NL02', 'floor' => '1'],
                            ['room_number' => 'NL03', 'floor' => '1'],
                        ],
                    ],
                ],
            ],
        ];

    
        $firstHotel = null;
        $firstRoom  = null;

        foreach ($hotelsData as $hotelData) {
            $roomTypesData = $hotelData['room_types'];
            unset($hotelData['room_types']);

            $hotelData['amenities'] = json_encode($hotelData['amenities']);
            $hotelData['images']    = json_encode($hotelData['images']);

            $hotel = Hotel::create($hotelData);

            foreach ($roomTypesData as $rtData) {
                $roomsData = $rtData['rooms'];
                unset($rtData['rooms']);

                $rtData['hotel_id']  = $hotel->id;
                $rtData['amenities'] = json_encode($rtData['amenities']);
                $rtData['images']    = json_encode($rtData['images']);
                $rtData['status']    = 'active';

                $roomType = RoomType::create($rtData);

                foreach ($roomsData as $rmData) {
                    $room = Room::create([
                        'hotel_id'    => $hotel->id,
                        'room_type_id'=> $roomType->id,
                        'room_number' => $rmData['room_number'],
                        'floor'       => $rmData['floor'],
                        'status'      => 'available',
                    ]);

                    // Keep a reference to the first room for the sample reservation below
                    if ($firstRoom === null) {
                        $firstHotel = $hotel;
                        $firstRoom  = $room;
                    }
                }
            }
        }

        $reservation = Reservation::create([
            'reservation_code' => strtoupper(Str::random(8)),
            'user_id'          => $user->id,
            'hotel_id'         => $firstHotel->id,
            'room_id'          => $firstRoom->id,
            'check_in_date'    => now()->toDateString(),
            'check_out_date'   => now()->addDays(3)->toDateString(),
            'nights'           => 3,
            'adults'           => 2,
            'children'         => 1,
            'room_rate'        => 89,
            'total_amount'     => 267,
            'paid_amount'      => 267,
            'pending_amount'   => 0,
            'status'           => 'confirmed',
            'payment_status'   => 'paid',
            'special_requests' => 'Late check-in please',
            'confirmed_at'     => now(),
        ]);

        Payment::create([
            'reservation_id'   => $reservation->id,
            'payment_id'       => strtoupper(Str::random(10)),
            'amount'           => 267.00,
            'currency'         => 'USD',
            'payment_method'   => 'credit_card',
            'status'           => 'completed',
            'gateway'          => 'stripe',
            'gateway_response' => json_encode(['transaction' => 'success']),
            'processed_at'     => now(),
        ]);

        Review::create([
            'user_id'        => $user->id,
            'hotel_id'       => $firstHotel->id,
            'reservation_id' => $reservation->id,
            'rating'         => 5,
            'comment'        => 'Incredible experience, will definitely come back!',
            'ratings'        => json_encode(['cleanliness' => 5, 'service' => 5, 'location' => 5]),
            'status'         => 'approved',
        ]);

        // Explore items
        $exploreItems = [
            [
                'name'        => 'Beachfront Paradise',
                'description' => 'Sink your toes into pristine white sand and wake up to the sound of waves. Our beachfront hotels offer breathtaking ocean views, private beach access, and world-class amenities steps from the sea.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772784090/Beachfront-Paradise-Koh-Samui-Beachfront-Koh-Samui-6_frhzxu.jpg',
            ],
            [
                'name'        => 'Mountain Escapes',
                'description' => 'Breathe in crisp alpine air and explore dramatic landscapes. From cozy ski chalets to luxury mountain lodges, these retreats offer thrilling winter sports and serene summer hiking trails.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772784285/w1900_q65_da5i63.jpg',
            ],
            [
                'name'        => 'City Luxury',
                'description' => 'Experience the pulse of the world\'s greatest cities from the comfort of iconic five-star hotels. Rooftop bars, Michelin-starred restaurants, and prime locations put culture and nightlife at your doorstep.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772784450/HS-MBH-Exterior-03_b5gnaa.jpg',
            ],
            [
                'name'        => 'Tropical Island Retreats',
                'description' => 'Step into paradise on overwater bungalows and secluded island resorts. Crystal-clear lagoons, vibrant coral reefs, and lush tropical gardens await in the most remote and beautiful corners of the world.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772784822/TAL-mauritius-TROPVACAY0325-ab8fec1bafa94ef9881250098961ac68_1_dkoxz1.jpg',
            ],
            [
                'name'        => 'Desert Luxury',
                'description' => 'Discover the romance of endless golden dunes and starlit desert skies. Opulent desert camps and architectural masterpieces blend seamlessly with the raw, majestic beauty of the world\'s great deserts.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772784912/Qasr_Al_Sarab_Desert_Resort_by_Anantara_Guest_Room_Sahra_Exterior_View_Pool_wbtkfi.webp',
            ],
            [
                'name'        => 'Cultural Heritage Stays',
                'description' => 'Immerse yourself in centuries of history and tradition. From restored Japanese ryokan with tatami floors and onsen baths to Venetian palazzos overlooking ancient canals, every stay is a journey through time.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1750823183/frgdlggsqb8yflkxvfka.jpg',
            ],
            [
                'name'        => 'Rainforest Eco-Lodges',
                'description' => 'Reconnect with nature deep in ancient rainforests. Sustainable eco-lodges in the Amazon and Southeast Asia offer guided wildlife tours, canopy walks, and the rare experience of falling asleep to a jungle symphony.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1749909891/i1dny9fpcq8kvwjqzz0c.jpg',
            ],
            [
                'name'        => 'Arctic & Aurora Adventures',
                'description' => 'Chase the Northern Lights across snow-covered wilderness. Glass-roofted igloo suites and cozy Arctic lodges in Norway, Iceland, and Finland offer a front-row seat to the most spectacular natural light show on Earth.',
                'image'       => 'https://res.cloudinary.com/djbtemkl1/image/upload/v1772785264/TAL-hotel-ranga-NLIGHTSHOTELS1024-38e49100d67f43689c86693713554382_x8i28d.jpg',
            ],
        ];

        foreach ($exploreItems as $item) {
            Explore::create($item);
        }
    }
}
