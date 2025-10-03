import 'package:equatable/equatable.dart';

enum SubscriptionTier { free, player, enthusiast, pro }

enum RaceType { eighthMile, quarterMile, rollRace, drift }

class AppUser extends Equatable {
  const AppUser({
    required this.uid,
    required this.email,
    this.name,
    this.handle,
    this.imageUrl,
    this.coverUrl,
    this.bio,
    this.location,
    this.instagramUrl,
    this.isPrivate = false,
    this.isVerified = false,
    this.themeColor,
    this.subscriptionTier = SubscriptionTier.free,
    this.raceTypes = const [],
    this.raceCardImageUrls = const [],
    this.raceCarName,
    this.raceCardDescription,
    this.followerCount = 0,
    this.followingCount = 0,
    this.garagePhotos = const [],
    this.createdAt,
    this.lastLoginAt,
  });

  final String uid;
  final String email;
  final String? name;
  final String? handle;
  final String? imageUrl;
  final String? coverUrl;
  final String? bio;
  final String? location;
  final String? instagramUrl;
  final bool isPrivate;
  final bool isVerified;
  final String? themeColor;
  final SubscriptionTier subscriptionTier;
  final List<RaceType> raceTypes;
  final List<String> raceCardImageUrls;
  final String? raceCarName;
  final String? raceCardDescription;
  final int followerCount;
  final int followingCount;
  final List<String> garagePhotos;
  final DateTime? createdAt;
  final DateTime? lastLoginAt;

  AppUser copyWith({
    String? uid,
    String? email,
    String? name,
    String? handle,
    String? imageUrl,
    String? coverUrl,
    String? bio,
    String? location,
    String? instagramUrl,
    bool? isPrivate,
    bool? isVerified,
    String? themeColor,
    SubscriptionTier? subscriptionTier,
    List<RaceType>? raceTypes,
    List<String>? raceCardImageUrls,
    String? raceCarName,
    String? raceCardDescription,
    int? followerCount,
    int? followingCount,
    List<String>? garagePhotos,
    DateTime? createdAt,
    DateTime? lastLoginAt,
  }) {
    return AppUser(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      name: name ?? this.name,
      handle: handle ?? this.handle,
      imageUrl: imageUrl ?? this.imageUrl,
      coverUrl: coverUrl ?? this.coverUrl,
      bio: bio ?? this.bio,
      location: location ?? this.location,
      instagramUrl: instagramUrl ?? this.instagramUrl,
      isPrivate: isPrivate ?? this.isPrivate,
      isVerified: isVerified ?? this.isVerified,
      themeColor: themeColor ?? this.themeColor,
      subscriptionTier: subscriptionTier ?? this.subscriptionTier,
      raceTypes: raceTypes ?? this.raceTypes,
      raceCardImageUrls: raceCardImageUrls ?? this.raceCardImageUrls,
      raceCarName: raceCarName ?? this.raceCarName,
      raceCardDescription: raceCardDescription ?? this.raceCardDescription,
      followerCount: followerCount ?? this.followerCount,
      followingCount: followingCount ?? this.followingCount,
      garagePhotos: garagePhotos ?? this.garagePhotos,
      createdAt: createdAt ?? this.createdAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'name': name,
      'handle': handle,
      'imageUrl': imageUrl,
      'coverUrl': coverUrl,
      'bio': bio,
      'location': location,
      'instagramUrl': instagramUrl,
      'isPrivate': isPrivate,
      'isVerified': isVerified,
      'themeColor': themeColor,
      'subscriptionTier': subscriptionTier.name,
      'raceTypes': raceTypes.map((e) => e.name).toList(),
      'raceCardImageUrls': raceCardImageUrls,
      'raceCarName': raceCarName,
      'raceCardDescription': raceCardDescription,
      'followerCount': followerCount,
      'followingCount': followingCount,
      'garagePhotos': garagePhotos,
      'createdAt': createdAt?.millisecondsSinceEpoch,
      'lastLoginAt': lastLoginAt?.millisecondsSinceEpoch,
    };
  }

  factory AppUser.fromMap(Map<String, dynamic> map) {
    return AppUser(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      name: map['name'],
      handle: map['handle'],
      imageUrl: map['imageUrl'],
      coverUrl: map['coverUrl'],
      bio: map['bio'],
      location: map['location'],
      instagramUrl: map['instagramUrl'],
      isPrivate: map['isPrivate'] ?? false,
      isVerified: map['isVerified'] ?? false,
      themeColor: map['themeColor'],
      subscriptionTier: SubscriptionTier.values.firstWhere(
        (e) => e.name == map['subscriptionTier'],
        orElse: () => SubscriptionTier.free,
      ),
      raceTypes:
          (map['raceTypes'] as List<dynamic>?)
              ?.map(
                (e) => RaceType.values.firstWhere(
                  (type) => type.name == e,
                  orElse: () => RaceType.quarterMile,
                ),
              )
              .toList() ??
          [],
      raceCardImageUrls: List<String>.from(map['raceCardImageUrls'] ?? []),
      raceCarName: map['raceCarName'],
      raceCardDescription: map['raceCardDescription'],
      followerCount: map['followerCount'] ?? 0,
      followingCount: map['followingCount'] ?? 0,
      garagePhotos: List<String>.from(map['garagePhotos'] ?? []),
      createdAt: map['createdAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['createdAt'])
          : null,
      lastLoginAt: map['lastLoginAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['lastLoginAt'])
          : null,
    );
  }

  @override
  List<Object?> get props => [
    uid,
    email,
    name,
    handle,
    imageUrl,
    coverUrl,
    bio,
    location,
    instagramUrl,
    isPrivate,
    isVerified,
    themeColor,
    subscriptionTier,
    raceTypes,
    raceCardImageUrls,
    raceCarName,
    raceCardDescription,
    followerCount,
    followingCount,
    garagePhotos,
    createdAt,
    lastLoginAt,
  ];

  @override
  String toString() {
    return 'AppUser(uid: $uid, email: $email, name: $name, handle: $handle)';
  }
}
