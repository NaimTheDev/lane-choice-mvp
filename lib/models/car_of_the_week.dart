import 'package:equatable/equatable.dart';
import 'app_user.dart';

class CarOfTheWeekEntry extends Equatable {
  const CarOfTheWeekEntry({
    required this.id,
    required this.user,
    required this.carName,
    required this.imageUrl,
    this.imageHint,
    this.votes = 0,
    this.wins = 0,
  });

  final String id;
  final AppUser user;
  final String carName;
  final String imageUrl;
  final String? imageHint;
  final int votes;
  final int wins;

  CarOfTheWeekEntry copyWith({
    String? id,
    AppUser? user,
    String? carName,
    String? imageUrl,
    String? imageHint,
    int? votes,
    int? wins,
  }) {
    return CarOfTheWeekEntry(
      id: id ?? this.id,
      user: user ?? this.user,
      carName: carName ?? this.carName,
      imageUrl: imageUrl ?? this.imageUrl,
      imageHint: imageHint ?? this.imageHint,
      votes: votes ?? this.votes,
      wins: wins ?? this.wins,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user': user.toMap(),
      'carName': carName,
      'imageUrl': imageUrl,
      'imageHint': imageHint,
      'votes': votes,
      'wins': wins,
    };
  }

  factory CarOfTheWeekEntry.fromMap(Map<String, dynamic> map) {
    return CarOfTheWeekEntry(
      id: map['id'] ?? '',
      user: AppUser.fromMap(map['user']),
      carName: map['carName'] ?? '',
      imageUrl: map['imageUrl'] ?? '',
      imageHint: map['imageHint'],
      votes: map['votes'] ?? 0,
      wins: map['wins'] ?? 0,
    );
  }

  @override
  List<Object?> get props => [
    id,
    user,
    carName,
    imageUrl,
    imageHint,
    votes,
    wins,
  ];
}
