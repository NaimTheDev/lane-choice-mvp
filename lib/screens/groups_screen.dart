import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/group.dart';
import '../services/mock_data_service.dart';
import '../theme/torque_theme_extension.dart';

final groupsProvider = FutureProvider<List<Group>>((ref) async {
  return MockDataService().getGroups();
});

final userGroupsProvider = StateProvider<Set<String>>((ref) => <String>{});

class GroupsScreen extends ConsumerWidget {
  const GroupsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final groupsAsync = ref.watch(groupsProvider);
    final userGroups = ref.watch(userGroupsProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      appBar: AppBar(
        title: const Text(
          'Official Groups',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: torqueTheme.cardBackground,
        foregroundColor: torqueTheme.racingGreen,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(groupsProvider);
        },
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Join official communities for different styles of racing and car culture.',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                ),
              ),
            ),

            groupsAsync.when(
              data: (groups) => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    childAspectRatio: 1.2,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final group = groups[index];
                    final isMember = userGroups.contains(group.id);

                    return Card(
                      color: torqueTheme.cardBackground,
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Banner image
                          Expanded(
                            flex: 2,
                            child: ClipRRect(
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                              child: CachedNetworkImage(
                                imageUrl: group.bannerUrl,
                                width: double.infinity,
                                fit: BoxFit.cover,
                                placeholder: (context, url) => Container(
                                  color: torqueTheme.surfaceVariant,
                                  child: const Center(
                                    child: CircularProgressIndicator(),
                                  ),
                                ),
                                errorWidget: (context, url, error) => Container(
                                  color: torqueTheme.surfaceVariant,
                                  child: const Center(child: Icon(Icons.error)),
                                ),
                              ),
                            ),
                          ),

                          // Group info
                          Expanded(
                            flex: 3,
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    group.name,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          color: torqueTheme.racingGreen,
                                        ),
                                  ),
                                  const SizedBox(height: 8),
                                  Expanded(
                                    child: Text(
                                      group.description,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(color: Colors.grey[600]),
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(height: 16),

                                  // Member count and join button
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.people,
                                            size: 16,
                                            color: Colors.grey[600],
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            '${group.memberCount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')} members',
                                            style: TextStyle(
                                              color: Colors.grey[600],
                                              fontSize: 14,
                                            ),
                                          ),
                                        ],
                                      ),
                                      ElevatedButton(
                                        onPressed: () {
                                          final notifier = ref.read(
                                            userGroupsProvider.notifier,
                                          );
                                          final currentGroups =
                                              Set<String>.from(userGroups);

                                          if (isMember) {
                                            currentGroups.remove(group.id);
                                            MockDataService().leaveGroup(
                                              group.id,
                                              'current_user',
                                            );
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                  'Left ${group.name}',
                                                ),
                                                backgroundColor: Colors.orange,
                                              ),
                                            );
                                          } else {
                                            currentGroups.add(group.id);
                                            MockDataService().joinGroup(
                                              group.id,
                                              'current_user',
                                            );
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                  'Joined ${group.name}!',
                                                ),
                                                backgroundColor:
                                                    torqueTheme.racingGreen,
                                              ),
                                            );
                                          }

                                          notifier.state = currentGroups;
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: isMember
                                              ? Colors.grey[300]
                                              : torqueTheme.racingGreen,
                                          foregroundColor: isMember
                                              ? Colors.grey[700]
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
                                              isMember
                                                  ? Icons.check
                                                  : Icons.add,
                                              size: 16,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              isMember ? 'Joined' : 'Join',
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
                  }, childCount: groups.length),
                ),
              ),
              loading: () => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    childAspectRatio: 1.2,
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
                              flex: 2,
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
                            Expanded(
                              child: SizedBox(
                                width: double.infinity,
                                child: LinearProgressIndicator(),
                              ),
                            ),
                            SizedBox(height: 16),
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
                          'Failed to load groups',
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
                            ref.invalidate(groupsProvider);
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
