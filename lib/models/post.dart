import 'package:equatable/equatable.dart';
import 'app_user.dart';

class Comment extends Equatable {
  const Comment({
    required this.id,
    required this.author,
    required this.text,
    required this.timestamp,
    this.replies = const [],
  });

  final String id;
  final AppUser author;
  final String text;
  final DateTime timestamp;
  final List<Comment> replies;

  Comment copyWith({
    String? id,
    AppUser? author,
    String? text,
    DateTime? timestamp,
    List<Comment>? replies,
  }) {
    return Comment(
      id: id ?? this.id,
      author: author ?? this.author,
      text: text ?? this.text,
      timestamp: timestamp ?? this.timestamp,
      replies: replies ?? this.replies,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'author': author.toMap(),
      'text': text,
      'timestamp': timestamp.millisecondsSinceEpoch,
      'replies': replies.map((x) => x.toMap()).toList(),
    };
  }

  factory Comment.fromMap(Map<String, dynamic> map) {
    return Comment(
      id: map['id'] ?? '',
      author: AppUser.fromMap(map['author']),
      text: map['text'] ?? '',
      timestamp: DateTime.fromMillisecondsSinceEpoch(map['timestamp']),
      replies: List<Comment>.from(
        map['replies']?.map((x) => Comment.fromMap(x)) ?? [],
      ),
    );
  }

  @override
  List<Object?> get props => [id, author, text, timestamp, replies];
}

class Post extends Equatable {
  const Post({
    required this.id,
    required this.author,
    required this.content,
    required this.timestamp,
    this.imageUrl,
    this.imageHint,
    this.car,
    this.likes = 0,
    this.likedBy = const [],
    this.comments = const [],
  });

  final String id;
  final AppUser author;
  final String content;
  final DateTime timestamp;
  final String? imageUrl;
  final String? imageHint;
  final String? car;
  final int likes;
  final List<String> likedBy;
  final List<Comment> comments;

  Post copyWith({
    String? id,
    AppUser? author,
    String? content,
    DateTime? timestamp,
    String? imageUrl,
    String? imageHint,
    String? car,
    int? likes,
    List<String>? likedBy,
    List<Comment>? comments,
  }) {
    return Post(
      id: id ?? this.id,
      author: author ?? this.author,
      content: content ?? this.content,
      timestamp: timestamp ?? this.timestamp,
      imageUrl: imageUrl ?? this.imageUrl,
      imageHint: imageHint ?? this.imageHint,
      car: car ?? this.car,
      likes: likes ?? this.likes,
      likedBy: likedBy ?? this.likedBy,
      comments: comments ?? this.comments,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'author': author.toMap(),
      'content': content,
      'timestamp': timestamp.millisecondsSinceEpoch,
      'imageUrl': imageUrl,
      'imageHint': imageHint,
      'car': car,
      'likes': likes,
      'likedBy': likedBy,
      'comments': comments.map((x) => x.toMap()).toList(),
    };
  }

  factory Post.fromMap(Map<String, dynamic> map) {
    return Post(
      id: map['id'] ?? '',
      author: AppUser.fromMap(map['author']),
      content: map['content'] ?? '',
      timestamp: DateTime.fromMillisecondsSinceEpoch(map['timestamp']),
      imageUrl: map['imageUrl'],
      imageHint: map['imageHint'],
      car: map['car'],
      likes: map['likes'] ?? 0,
      likedBy: List<String>.from(map['likedBy'] ?? []),
      comments: List<Comment>.from(
        map['comments']?.map((x) => Comment.fromMap(x)) ?? [],
      ),
    );
  }

  @override
  List<Object?> get props => [
    id,
    author,
    content,
    timestamp,
    imageUrl,
    imageHint,
    car,
    likes,
    likedBy,
    comments,
  ];
}
