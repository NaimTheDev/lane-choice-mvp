import '../models/app_user.dart';
import '../models/post.dart';
import '../models/group.dart';
import '../models/car_of_the_week.dart';
import '../models/event.dart';
import 'asset_service.dart';

class MockDataService {
  static final MockDataService _instance = MockDataService._internal();
  factory MockDataService() => _instance;
  MockDataService._internal();

  // Mock Users
  static final List<AppUser> _users = [
    AppUser(
      uid: 'u1',
      email: 'alex@example.com',
      name: 'Alex Ryder',
      handle: 'ryderauto',
      imageUrl: AssetService.getUserImage('alex_ryder'),
      coverUrl: AssetService.getCoverImage('garage_cover_1'),
      bio:
          'Just a guy and his Mustang. Living one quarter-mile at a time. Chasing sunsets and burnt rubber.',
      location: 'Los Angeles, CA',
      instagramUrl: 'https://instagram.com/ryderauto',
      isVerified: true,
      subscriptionTier: SubscriptionTier.pro,
      raceTypes: [RaceType.quarterMile, RaceType.rollRace],
      raceCarName: '1966 Ford Mustang',
      raceCardDescription:
          'Classic pony car with a modern heart. Ready to run.',
      raceCardImageUrls: [
        AssetService.getCarImage('mustang_1966_profile'),
        AssetService.getCarImage('mustang_1966_sunset'),
        AssetService.getCarImage('mustang_1966_garage'),
      ],
      followerCount: 1200,
      followingCount: 345,
      garagePhotos: AssetService.getGaragePhotos('u1'),
    ),
    AppUser(
      uid: 'u2',
      email: 'mia@example.com',
      name: 'Mia Chen',
      handle: 'miadrifts',
      imageUrl: AssetService.getUserImage('mia_chen'),
      coverUrl: AssetService.getCoverImage('garage_cover_2'),
      bio:
          'JDM queen. Drifting is my therapy. Building my dream S15 one part at a time.',
      location: 'Tokyo, JP',
      isVerified: true,
      subscriptionTier: SubscriptionTier.enthusiast,
      raceTypes: [RaceType.drift],
      raceCarName: 'Nissan Silvia S15',
      raceCardDescription:
          'Lover of all things JDM. Catch me at the track going sideways.',
      raceCardImageUrls: [
        AssetService.getCarImage('silvia_s15_profile'),
        AssetService.getCarImage('silvia_s15_drift'),
      ],
      followerCount: 25000,
      followingCount: 120,
      garagePhotos: AssetService.getGaragePhotos('u2'),
    ),
    AppUser(
      uid: 'u3',
      email: 'ben@example.com',
      name: 'Ben Carter',
      handle: 'euroben',
      imageUrl: AssetService.getUserImage('ben_carter'),
      coverUrl: AssetService.getCoverImage('garage_cover_3'),
      bio:
          'German engineering enthusiast. All about clean builds and performance.',
      location: 'Munich, DE',
      subscriptionTier: SubscriptionTier.player,
      raceCarName: 'BMW M3 E92',
      raceCardImageUrls: [AssetService.getCarImage('bmw_m3_e92')],
      followerCount: 5600,
      followingCount: 800,
      garagePhotos: AssetService.getGaragePhotos('u3'),
    ),
    AppUser(
      uid: 'u4',
      email: 'chloe@example.com',
      name: 'Chloe Davis',
      handle: 'offroadchloe',
      imageUrl: AssetService.getUserImage('chloe_davis'),
      coverUrl: AssetService.getCoverImage('garage_cover_4'),
      bio: 'The trail is my happy place. If it has dirt, I\'m there. ⛰️',
      location: 'Moab, UT',
      subscriptionTier: SubscriptionTier.free,
      raceCarName: 'Jeep Wrangler Rubicon',
      raceCardImageUrls: [
        AssetService.getCarImage('jeep_wrangler_trail'),
        AssetService.getCarImage('jeep_wrangler_mud'),
      ],
      followerCount: 8900,
      followingCount: 210,
      garagePhotos: AssetService.getGaragePhotos('u4'),
    ),
    AppUser(
      uid: 'u5',
      email: 'marcus@example.com',
      name: 'Marcus Holloway',
      handle: 'tunerlife',
      imageUrl: AssetService.getUserImage('marcus_holloway'),
      coverUrl: AssetService.getCoverImage('garage_cover_5'),
      bio: 'VTEC kicked in, yo. Building and tuning with my crew.',
      location: 'San Francisco, CA',
      subscriptionTier: SubscriptionTier.enthusiast,
      raceCarName: 'Honda Civic Type R',
      raceCardImageUrls: [AssetService.getCarImage('civic_type_r')],
      followerCount: 15200,
      followingCount: 450,
      garagePhotos: AssetService.getGaragePhotos('u5'),
    ),
  ];

  // Mock Posts
  static final List<Post> _posts = [
    Post(
      id: 'p1',
      author: _users[0],
      content:
          'Sunset drive with the classic. Nothing beats the feeling of an open road.',
      imageUrl: AssetService.getCarImage('mustang_1966_sunset'),
      imageHint: 'classic car sunset',
      car: '1966 Ford Mustang',
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      likes: 124,
      likedBy: ['u2', 'u3', 'u5'],
      comments: [
        Comment(
          id: 'c1',
          author: _users[1],
          text: 'Looks amazing! The scenery is perfect.',
          timestamp: DateTime.now().subtract(const Duration(hours: 1)),
        ),
        Comment(
          id: 'c2',
          author: _users[2],
          text: 'Clean Mustang! Love the color.',
          timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
        ),
      ],
    ),
    Post(
      id: 'p2',
      author: _users[1],
      content:
          'New aero parts finally installed on the S15! Ready for the next track day.',
      imageUrl: AssetService.getCarImage('silvia_s15_drift'),
      imageHint: 'nissan silvia modification',
      car: 'Nissan Silvia S15',
      timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      likes: 350,
      likedBy: ['u1', 'u5'],
    ),
    Post(
      id: 'p3',
      author: _users[3],
      content:
          'Got a little muddy today. The Wrangler didn\'t even break a sweat!',
      imageUrl: AssetService.getCarImage('jeep_wrangler_mud'),
      imageHint: 'jeep offroad mud',
      car: 'Jeep Wrangler Rubicon',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      likes: 215,
      likedBy: ['u4'],
    ),
  ];

  // Mock Groups
  static final List<Group> _groups = [
    Group(
      id: 'g1',
      name: 'Street Racers',
      description:
          'The official group for street racers. Share your slips, discuss tactics, and find your next race.',
      bannerUrl: AssetService.getGroupImage('street_racers_banner'),
      bannerHint: 'street race night city',
      memberCount: 15600,
      members: ['u1', 'u5'],
    ),
    Group(
      id: 'g2',
      name: 'Drifters',
      description:
          'For those who live life sideways. Share your best drifts, tuning setups, and find drift events.',
      bannerUrl: AssetService.getGroupImage('drifters_banner'),
      bannerHint: 'car drifting smoke',
      memberCount: 28900,
      members: ['u2'],
    ),
    Group(
      id: 'g3',
      name: 'Show & Shine',
      description:
          'This group is for the perfectionists. Show off your pristine builds, detailing work, and car show winners.',
      bannerUrl: AssetService.getGroupImage('show_shine_banner'),
      bannerHint: 'car show polished',
      memberCount: 42300,
      members: ['u3'],
    ),
  ];

  // Mock Car of the Week Entries
  static final List<CarOfTheWeekEntry> _carOfTheWeekEntries = [
    CarOfTheWeekEntry(
      id: 'cotw1',
      user: _users[0],
      carName: '1966 Ford Mustang',
      imageUrl: AssetService.getCarImage('mustang_1966_profile'),
      imageHint: 'classic mustang',
      votes: 128,
      wins: 2,
    ),
    CarOfTheWeekEntry(
      id: 'cotw2',
      user: _users[1],
      carName: 'Nissan Silvia S15',
      imageUrl: AssetService.getCarImage('silvia_s15_profile'),
      imageHint: 'nissan silvia',
      votes: 95,
    ),
    CarOfTheWeekEntry(
      id: 'cotw3',
      user: _users[2],
      carName: 'BMW M3 E92',
      imageUrl: AssetService.getCarImage('bmw_m3_e92'),
      imageHint: 'bmw m3',
      votes: 210,
      wins: 1,
    ),
  ];

  // Mock Events
  static final List<Event> _events = [
    Event(
      id: 'e1',
      name: 'Cars & Coffee - Downtown',
      date: 'Saturday, Dec 21st, 8:00 AM',
      location: 'Central City Coffee Roasters',
      description:
          'Join us for our weekly Cars & Coffee meetup. All are welcome. Please respect the property and no burnouts!',
      coverUrl: AssetService.getEventImage('cars_coffee_downtown'),
      coverHint: 'cars coffee shop',
      attendees: [_users[0], _users[2]],
      attendeeCount: 2,
      createdAt: DateTime.now().subtract(const Duration(days: 7)),
    ),
    Event(
      id: 'e2',
      name: 'Midnight Touge Run',
      date: 'Friday, Dec 20th, 11:00 PM',
      location: 'Mount Akina Pass',
      description:
          'A spirited drive through the mountain pass. Experienced drivers only. Safety is our top priority, respect the property and other drivers.',
      coverUrl: AssetService.getEventImage('midnight_touge_run'),
      coverHint: 'car mountain night',
      attendees: [_users[1]],
      attendeeCount: 1,
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
  ];

  // Getters
  List<AppUser> get users => List.unmodifiable(_users);
  List<Post> get posts => List.unmodifiable(_posts);
  List<Group> get groups => List.unmodifiable(_groups);
  List<CarOfTheWeekEntry> get carOfTheWeekEntries =>
      List.unmodifiable(_carOfTheWeekEntries);
  List<Event> get events => List.unmodifiable(_events);

  // Methods to simulate API calls
  Future<List<Post>> getPosts() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _posts;
  }

  Future<List<AppUser>> getUsers() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _users;
  }

  Future<List<Group>> getGroups() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _groups;
  }

  Future<List<CarOfTheWeekEntry>> getCarOfTheWeekEntries() async {
    await Future.delayed(const Duration(milliseconds: 600));
    return _carOfTheWeekEntries;
  }

  Future<List<Event>> getEvents() async {
    await Future.delayed(const Duration(milliseconds: 450));
    return _events;
  }

  Future<AppUser?> getUserById(String uid) async {
    await Future.delayed(const Duration(milliseconds: 200));
    try {
      return _users.firstWhere((user) => user.uid == uid);
    } catch (e) {
      return null;
    }
  }

  // Simulate liking a post
  Future<void> likePost(String postId, String userId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final postIndex = _posts.indexWhere((post) => post.id == postId);
    if (postIndex != -1) {
      final post = _posts[postIndex];
      final likedBy = List<String>.from(post.likedBy);
      if (!likedBy.contains(userId)) {
        likedBy.add(userId);
        _posts[postIndex] = post.copyWith(
          likes: post.likes + 1,
          likedBy: likedBy,
        );
      }
    }
  }

  // Simulate joining a group
  Future<void> joinGroup(String groupId, String userId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    final groupIndex = _groups.indexWhere((group) => group.id == groupId);
    if (groupIndex != -1) {
      final group = _groups[groupIndex];
      final members = List<String>.from(group.members);
      if (!members.contains(userId)) {
        members.add(userId);
        _groups[groupIndex] = group.copyWith(
          members: members,
          memberCount: group.memberCount + 1,
        );
      }
    }
  }

  // Simulate leaving a group
  Future<void> leaveGroup(String groupId, String userId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    final groupIndex = _groups.indexWhere((group) => group.id == groupId);
    if (groupIndex != -1) {
      final group = _groups[groupIndex];
      final members = List<String>.from(group.members);
      if (members.contains(userId)) {
        members.remove(userId);
        _groups[groupIndex] = group.copyWith(
          members: members,
          memberCount: group.memberCount - 1,
        );
      }
    }
  }

  // Simulate voting for car of the week
  Future<void> voteForCar(String entryId) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final entryIndex = _carOfTheWeekEntries.indexWhere(
      (entry) => entry.id == entryId,
    );
    if (entryIndex != -1) {
      final entry = _carOfTheWeekEntries[entryIndex];
      _carOfTheWeekEntries[entryIndex] = entry.copyWith(votes: entry.votes + 1);
    }
  }
}
