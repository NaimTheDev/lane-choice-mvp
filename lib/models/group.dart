import 'package:equatable/equatable.dart';

class Group extends Equatable {
  const Group({
    required this.id,
    required this.name,
    required this.description,
    required this.bannerUrl,
    this.bannerHint,
    this.memberCount = 0,
    this.members = const [],
  });

  final String id;
  final String name;
  final String description;
  final String bannerUrl;
  final String? bannerHint;
  final int memberCount;
  final List<String> members; // User IDs

  Group copyWith({
    String? id,
    String? name,
    String? description,
    String? bannerUrl,
    String? bannerHint,
    int? memberCount,
    List<String>? members,
  }) {
    return Group(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      bannerUrl: bannerUrl ?? this.bannerUrl,
      bannerHint: bannerHint ?? this.bannerHint,
      memberCount: memberCount ?? this.memberCount,
      members: members ?? this.members,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'bannerUrl': bannerUrl,
      'bannerHint': bannerHint,
      'memberCount': memberCount,
      'members': members,
    };
  }

  factory Group.fromMap(Map<String, dynamic> map) {
    return Group(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      description: map['description'] ?? '',
      bannerUrl: map['bannerUrl'] ?? '',
      bannerHint: map['bannerHint'],
      memberCount: map['memberCount'] ?? 0,
      members: List<String>.from(map['members'] ?? []),
    );
  }

  @override
  List<Object?> get props => [
    id,
    name,
    description,
    bannerUrl,
    bannerHint,
    memberCount,
    members,
  ];
}
