import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/app_user.dart';
import '../services/mock_data_service.dart';
import '../theme/torque_theme_extension.dart';

final racingUsersProvider = FutureProvider<List<AppUser>>((ref) async {
  return MockDataService().getUsers();
});

final swipeCountProvider = StateProvider<int>((ref) => 0);
final currentUserIndexProvider = StateProvider<int>((ref) => 0);
final matchesProvider = StateProvider<List<AppUser>>((ref) => []);

class SpeedDatingScreen extends ConsumerStatefulWidget {
  const SpeedDatingScreen({super.key});

  @override
  ConsumerState<SpeedDatingScreen> createState() => _SpeedDatingScreenState();
}

class _SpeedDatingScreenState extends ConsumerState<SpeedDatingScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;

  final PageController _pageController = PageController();
  bool _isAnimating = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _slideAnimation =
        Tween<Offset>(begin: Offset.zero, end: const Offset(1.5, 0)).animate(
          CurvedAnimation(
            parent: _animationController,
            curve: Curves.easeInOut,
          ),
        );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.8).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _handleSwipe(bool isLike, AppUser user) async {
    if (_isAnimating) return;

    setState(() {
      _isAnimating = true;
    });

    // Animate the card
    await _animationController.forward();

    // Update providers
    final currentIndex = ref.read(currentUserIndexProvider);
    final swipeCount = ref.read(swipeCountProvider);

    ref.read(currentUserIndexProvider.notifier).state = currentIndex + 1;
    ref.read(swipeCountProvider.notifier).state = swipeCount + 1;

    if (isLike) {
      // Simulate a match (50% chance)
      if (DateTime.now().millisecond % 2 == 0) {
        final matches = ref.read(matchesProvider);
        ref.read(matchesProvider.notifier).state = [...matches, user];

        _showMatchDialog(user);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Sent interest to ${user.name}!'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }

    // Reset animation
    _animationController.reset();
    setState(() {
      _isAnimating = false;
    });
  }

  void _showMatchDialog(AppUser user) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('🏁', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 16),
            const Text(
              'It\'s a Match!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'You and ${user.name} are ready to race!',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundImage: user.imageUrl != null
                      ? CachedNetworkImageProvider(user.imageUrl!)
                      : null,
                  child: user.imageUrl == null
                      ? Text(
                          user.name?.substring(0, 1).toUpperCase() ?? 'U',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      : null,
                ),
                const Icon(Icons.favorite, color: Colors.red, size: 32),
                const CircleAvatar(
                  radius: 40,
                  child: Icon(Icons.person, size: 32),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Keep Racing'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Message feature coming soon!')),
              );
            },
            child: const Text('Send Message'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final usersAsync = ref.watch(racingUsersProvider);
    final currentIndex = ref.watch(currentUserIndexProvider);
    final swipeCount = ref.watch(swipeCountProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      appBar: AppBar(
        title: const Text(
          'Speed Dating',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: torqueTheme.cardBackground,
        foregroundColor: torqueTheme.racingGreen,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Filters feature coming soon!')),
              );
            },
          ),
        ],
      ),
      body: usersAsync.when(
        data: (users) {
          if (currentIndex >= users.length) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.flag_circle,
                    size: 80,
                    color: torqueTheme.racingGreen,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No more racers!',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Check back later for more racing partners.',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      ref.read(currentUserIndexProvider.notifier).state = 0;
                      ref.read(swipeCountProvider.notifier).state = 0;
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: torqueTheme.racingGreen,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Start Over'),
                  ),
                ],
              ),
            );
          }

          final currentUser = users[currentIndex];

          return Column(
            children: [
              // Stats bar
              Container(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        Text(
                          '$swipeCount',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: torqueTheme.racingGreen,
                          ),
                        ),
                        Text(
                          'Swipes',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text(
                          '${ref.watch(matchesProvider).length}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        Text(
                          'Matches',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text(
                          '${users.length - currentIndex}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                        Text(
                          'Remaining',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // User card
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: _slideAnimation.value,
                        child: Transform.scale(
                          scale: _scaleAnimation.value,
                          child: Card(
                            color: torqueTheme.cardBackground,
                            elevation: 8,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: Column(
                                children: [
                                  // User images
                                  Expanded(
                                    flex: 3,
                                    child: Stack(
                                      children: [
                                        PageView(
                                          controller: _pageController,
                                          children:
                                              currentUser
                                                  .raceCardImageUrls
                                                  .isNotEmpty
                                              ? currentUser.raceCardImageUrls
                                                    .map(
                                                      (
                                                        url,
                                                      ) => CachedNetworkImage(
                                                        imageUrl: url,
                                                        width: double.infinity,
                                                        fit: BoxFit.cover,
                                                        placeholder:
                                                            (
                                                              context,
                                                              url,
                                                            ) => Container(
                                                              color: torqueTheme
                                                                  .surfaceVariant,
                                                              child: const Center(
                                                                child:
                                                                    CircularProgressIndicator(),
                                                              ),
                                                            ),
                                                        errorWidget:
                                                            (
                                                              context,
                                                              url,
                                                              error,
                                                            ) => Container(
                                                              color: torqueTheme
                                                                  .surfaceVariant,
                                                              child:
                                                                  const Center(
                                                                    child: Icon(
                                                                      Icons
                                                                          .error,
                                                                    ),
                                                                  ),
                                                            ),
                                                      ),
                                                    )
                                                    .toList()
                                              : [
                                                  Container(
                                                    color: torqueTheme
                                                        .surfaceVariant,
                                                    child: const Center(
                                                      child: Icon(
                                                        Icons.person,
                                                        size: 80,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                        ),

                                        // Gradient overlay
                                        Positioned(
                                          bottom: 0,
                                          left: 0,
                                          right: 0,
                                          child: Container(
                                            height: 100,
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                begin: Alignment.topCenter,
                                                end: Alignment.bottomCenter,
                                                colors: [
                                                  Colors.transparent,
                                                  Colors.black.withOpacity(0.7),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),

                                        // User info overlay
                                        Positioned(
                                          bottom: 16,
                                          left: 16,
                                          right: 16,
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                children: [
                                                  Text(
                                                    currentUser.name ??
                                                        'Unknown',
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 24,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                  if (currentUser
                                                      .isVerified) ...[
                                                    const SizedBox(width: 8),
                                                    const Icon(
                                                      Icons.verified,
                                                      color: Colors.blue,
                                                      size: 20,
                                                    ),
                                                  ],
                                                ],
                                              ),
                                              Text(
                                                '@${currentUser.handle ?? 'unknown'}',
                                                style: const TextStyle(
                                                  color: Colors.white70,
                                                  fontSize: 16,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // User details
                                  Expanded(
                                    flex: 2,
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          if (currentUser.raceCarName !=
                                              null) ...[
                                            Row(
                                              children: [
                                                Icon(
                                                  Icons.directions_car,
                                                  color:
                                                      torqueTheme.racingGreen,
                                                  size: 20,
                                                ),
                                                const SizedBox(width: 8),
                                                Expanded(
                                                  child: Text(
                                                    currentUser.raceCarName!,
                                                    style: TextStyle(
                                                      color: torqueTheme
                                                          .racingGreen,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                          ],

                                          if (currentUser.location != null) ...[
                                            Row(
                                              children: [
                                                Icon(
                                                  Icons.location_on,
                                                  color: Colors.grey[600],
                                                  size: 20,
                                                ),
                                                const SizedBox(width: 8),
                                                Text(
                                                  currentUser.location!,
                                                  style: TextStyle(
                                                    color: Colors.grey[600],
                                                    fontSize: 14,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                          ],

                                          if (currentUser.raceCardDescription !=
                                              null) ...[
                                            Text(
                                              currentUser.raceCardDescription!,
                                              style: const TextStyle(
                                                fontSize: 14,
                                              ),
                                              maxLines: 3,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 12),
                                          ],

                                          // Race types
                                          if (currentUser
                                              .raceTypes
                                              .isNotEmpty) ...[
                                            Wrap(
                                              spacing: 8,
                                              runSpacing: 4,
                                              children: currentUser.raceTypes
                                                  .map((type) {
                                                    String displayName;
                                                    switch (type) {
                                                      case RaceType.eighthMile:
                                                        displayName =
                                                            '1/8 Mile';
                                                        break;
                                                      case RaceType.quarterMile:
                                                        displayName =
                                                            '1/4 Mile';
                                                        break;
                                                      case RaceType.rollRace:
                                                        displayName =
                                                            'Roll Race';
                                                        break;
                                                      case RaceType.drift:
                                                        displayName = 'Drift';
                                                        break;
                                                    }
                                                    return Chip(
                                                      label: Text(
                                                        displayName,
                                                        style: const TextStyle(
                                                          fontSize: 12,
                                                        ),
                                                      ),
                                                      backgroundColor:
                                                          torqueTheme
                                                              .racingGreen
                                                              .withOpacity(0.1),
                                                      side: BorderSide(
                                                        color: torqueTheme
                                                            .racingGreen
                                                            .withOpacity(0.3),
                                                      ),
                                                    );
                                                  })
                                                  .toList(),
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              // Action buttons
              Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Pass button
                    GestureDetector(
                      onTap: _isAnimating
                          ? null
                          : () => _handleSwipe(false, currentUser),
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          border: Border.all(color: Colors.red, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.close,
                          color: Colors.red,
                          size: 30,
                        ),
                      ),
                    ),

                    // Like button
                    GestureDetector(
                      onTap: _isAnimating
                          ? null
                          : () => _handleSwipe(true, currentUser),
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          border: Border.all(color: Colors.green, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.favorite,
                          color: Colors.green,
                          size: 30,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.red[400]),
              const SizedBox(height: 16),
              Text(
                'Failed to load racers',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(racingUsersProvider);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
