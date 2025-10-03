import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/car_of_the_week.dart';
import '../services/mock_data_service.dart';
import '../theme/torque_theme_extension.dart';

final carOfTheWeekProvider = FutureProvider<List<CarOfTheWeekEntry>>((
  ref,
) async {
  return MockDataService().getCarOfTheWeekEntries();
});

final votedCarsProvider = StateProvider<Set<String>>((ref) => <String>{});

class VoteScreen extends ConsumerWidget {
  const VoteScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final entriesAsync = ref.watch(carOfTheWeekProvider);
    final votedCars = ref.watch(votedCarsProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      appBar: AppBar(
        title: const Text(
          'Car of the Week',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: torqueTheme.cardBackground,
        foregroundColor: torqueTheme.racingGreen,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Enter your car feature coming soon!'),
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(carOfTheWeekProvider);
        },
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Vote for your favorite car to see it crowned as this week\'s winner. The car with the most votes at the end of the week wins!',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: torqueTheme.racingGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: torqueTheme.racingGreen.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: torqueTheme.racingGreen,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'You can vote once per car. Voting ends Sunday at midnight.',
                              style: TextStyle(
                                color: torqueTheme.racingGreen,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            entriesAsync.when(
              data: (entries) => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    childAspectRatio: 1.1,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final entry = entries[index];
                    final hasVoted = votedCars.contains(entry.id);

                    return Card(
                      color: torqueTheme.cardBackground,
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Car image
                          Expanded(
                            flex: 3,
                            child: ClipRRect(
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                              child: Stack(
                                children: [
                                  CachedNetworkImage(
                                    imageUrl: entry.imageUrl,
                                    width: double.infinity,
                                    height: double.infinity,
                                    fit: BoxFit.cover,
                                    placeholder: (context, url) => Container(
                                      color: torqueTheme.surfaceVariant,
                                      child: const Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                    ),
                                    errorWidget: (context, url, error) =>
                                        Container(
                                          color: torqueTheme.surfaceVariant,
                                          child: const Center(
                                            child: Icon(Icons.error),
                                          ),
                                        ),
                                  ),

                                  // Winner badge
                                  if (entry.wins > 0)
                                    Positioned(
                                      top: 12,
                                      right: 12,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 4,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.amber,
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(
                                              Icons.emoji_events,
                                              size: 16,
                                              color: Colors.white,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              entry.wins > 1
                                                  ? '${entry.wins}x Winner'
                                                  : 'Winner',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ),

                          // Car info and voting
                          Expanded(
                            flex: 2,
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    entry.carName,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          color: torqueTheme.racingGreen,
                                        ),
                                  ),
                                  const SizedBox(height: 8),

                                  // Owner info
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 16,
                                        backgroundColor:
                                            torqueTheme.racingGreen,
                                        backgroundImage:
                                            entry.user.imageUrl != null
                                            ? CachedNetworkImageProvider(
                                                entry.user.imageUrl!,
                                              )
                                            : null,
                                        child: entry.user.imageUrl == null
                                            ? Text(
                                                entry.user.name
                                                        ?.substring(0, 1)
                                                        .toUpperCase() ??
                                                    'U',
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              )
                                            : null,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Text(
                                                  entry.user.name ?? 'Unknown',
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    fontSize: 14,
                                                  ),
                                                ),
                                                if (entry.user.isVerified) ...[
                                                  const SizedBox(width: 4),
                                                  Icon(
                                                    Icons.verified,
                                                    size: 14,
                                                    color:
                                                        torqueTheme.racingGreen,
                                                  ),
                                                ],
                                              ],
                                            ),
                                            Text(
                                              '@${entry.user.handle ?? 'unknown'}',
                                              style: TextStyle(
                                                color: Colors.grey[600],
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),

                                  const Spacer(),

                                  // Votes and vote button
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.how_to_vote,
                                            size: 20,
                                            color: torqueTheme.racingGreen,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            '${entry.votes} votes',
                                            style: TextStyle(
                                              color: torqueTheme.racingGreen,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ],
                                      ),
                                      ElevatedButton(
                                        onPressed: hasVoted
                                            ? null
                                            : () {
                                                final notifier = ref.read(
                                                  votedCarsProvider.notifier,
                                                );
                                                final currentVotes =
                                                    Set<String>.from(votedCars);
                                                currentVotes.add(entry.id);
                                                notifier.state = currentVotes;

                                                MockDataService().voteForCar(
                                                  entry.id,
                                                );

                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  SnackBar(
                                                    content: Text(
                                                      'Voted for ${entry.carName}!',
                                                    ),
                                                    backgroundColor:
                                                        torqueTheme.racingGreen,
                                                  ),
                                                );
                                              },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: hasVoted
                                              ? Colors.grey[300]
                                              : torqueTheme.racingGreen,
                                          foregroundColor: hasVoted
                                              ? Colors.grey[600]
                                              : Colors.white,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              20,
                                            ),
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 16,
                                            vertical: 8,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              hasVoted
                                                  ? Icons.check
                                                  : Icons.how_to_vote,
                                              size: 16,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              hasVoted ? 'Voted' : 'Vote',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }, childCount: entries.length),
                ),
              ),
              loading: () => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    childAspectRatio: 1.1,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => Card(
                      color: torqueTheme.cardBackground,
                      child: const Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              flex: 3,
                              child: SizedBox(
                                width: double.infinity,
                                child: LinearProgressIndicator(),
                              ),
                            ),
                            SizedBox(height: 16),
                            SizedBox(
                              width: 150,
                              height: 20,
                              child: LinearProgressIndicator(),
                            ),
                            SizedBox(height: 8),
                            Row(
                              children: [
                                SizedBox(
                                  width: 32,
                                  height: 32,
                                  child: CircularProgressIndicator(),
                                ),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SizedBox(
                                        width: 100,
                                        height: 14,
                                        child: LinearProgressIndicator(),
                                      ),
                                      SizedBox(height: 4),
                                      SizedBox(
                                        width: 80,
                                        height: 12,
                                        child: LinearProgressIndicator(),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            Spacer(),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                SizedBox(
                                  width: 80,
                                  height: 16,
                                  child: LinearProgressIndicator(),
                                ),
                                SizedBox(
                                  width: 60,
                                  height: 32,
                                  child: LinearProgressIndicator(),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    childCount: 3,
                  ),
                ),
              ),
              error: (error, stack) => SliverToBoxAdapter(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Failed to load entries',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Please check your connection and try again',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: Colors.grey[600]),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            ref.invalidate(carOfTheWeekProvider);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: torqueTheme.racingGreen,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
