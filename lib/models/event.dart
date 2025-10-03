import 'package:equatable/equatable.dart';
import 'app_user.dart';

class Event extends Equatable {
  const Event({
    required this.id,
    required this.name,
    required this.date,
    required this.location,
    required this.description,
    required this.coverUrl,
    this.coverHint,
    this.attendees = const [],
    this.attendeeCount = 0,
    this.createdAt,
  });

  final String id;
  final String name;
  final String date;
  final String location;
  final String description;
  final String coverUrl;
  final String? coverHint;
  final List<AppUser> attendees;
  final int attendeeCount;
  final DateTime? createdAt;

  Event copyWith({
    String? id,
    String? name,
    String? date,
    String? location,
    String? description,
    String? coverUrl,
    String? coverHint,
    List<AppUser>? attendees,
    int? attendeeCount,
    DateTime? createdAt,
  }) {
    return Event(
      id: id ?? this.id,
      name: name ?? this.name,
      date: date ?? this.date,
      location: location ?? this.location,
      description: description ?? this.description,
      coverUrl: coverUrl ?? this.coverUrl,
      coverHint: coverHint ?? this.coverHint,
      attendees: attendees ?? this.attendees,
      attendeeCount: attendeeCount ?? this.attendeeCount,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'date': date,
      'location': location,
      'description': description,
      'coverUrl': coverUrl,
      'coverHint': coverHint,
      'attendees': attendees.map((x) => x.toMap()).toList(),
      'attendeeCount': attendeeCount,
      'createdAt': createdAt?.millisecondsSinceEpoch,
    };
  }

  factory Event.fromMap(Map<String, dynamic> map) {
    return Event(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      date: map['date'] ?? '',
      location: map['location'] ?? '',
      description: map['description'] ?? '',
      coverUrl: map['coverUrl'] ?? '',
      coverHint: map['coverHint'],
      attendees: List<AppUser>.from(
        map['attendees']?.map((x) => AppUser.fromMap(x)) ?? [],
      ),
      attendeeCount: map['attendeeCount'] ?? 0,
      createdAt: map['createdAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['createdAt'])
          : null,
    );
  }

  @override
  List<Object?> get props => [
    id,
    name,
    date,
    location,
    description,
    coverUrl,
    coverHint,
    attendees,
    attendeeCount,
    createdAt,
  ];
}
