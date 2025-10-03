import 'package:equatable/equatable.dart';

class AppUser extends Equatable {
  const AppUser({
    required this.uid,
    required this.email,
    this.name,
    this.imageUrl,
    this.createdAt,
    this.lastLoginAt,
  });

  final String uid;
  final String email;
  final String? name;
  final String? imageUrl;
  final DateTime? createdAt;
  final DateTime? lastLoginAt;

  AppUser copyWith({
    String? uid,
    String? email,
    String? name,
    String? imageUrl,
    DateTime? createdAt,
    DateTime? lastLoginAt,
  }) {
    return AppUser(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      name: name ?? this.name,
      imageUrl: imageUrl ?? this.imageUrl,
      createdAt: createdAt ?? this.createdAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'name': name,
      'imageUrl': imageUrl,
      'createdAt': createdAt?.millisecondsSinceEpoch,
      'lastLoginAt': lastLoginAt?.millisecondsSinceEpoch,
    };
  }

  factory AppUser.fromMap(Map<String, dynamic> map) {
    return AppUser(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      name: map['name'],
      imageUrl: map['imageUrl'],
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
    imageUrl,
    createdAt,
    lastLoginAt,
  ];

  @override
  String toString() {
    return 'AppUser(uid: $uid, email: $email, name: $name)';
  }
}
