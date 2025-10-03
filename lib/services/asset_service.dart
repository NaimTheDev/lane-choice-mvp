class AssetService {
  static const String _basePath = 'assets/images';

  // Car images
  static const Map<String, String> carImages = {
    'mustang_1966_sunset': '$_basePath/cars/mustang_1966_sunset.jpg',
    'mustang_1966_profile': '$_basePath/cars/mustang_1966_profile.jpg',
    'mustang_1966_garage': '$_basePath/cars/mustang_1966_garage.jpg',
    'silvia_s15_drift': '$_basePath/cars/silvia_s15_drift.jpg',
    'silvia_s15_profile': '$_basePath/cars/silvia_s15_profile.jpg',
    'civic_type_r': '$_basePath/cars/civic_type_r.jpg',
    'rx7_fd_night': '$_basePath/cars/rx7_fd_night.jpg',
    'bmw_m3_e92': '$_basePath/cars/bmw_m3_e92.jpg',
    'porsche_911_964': '$_basePath/cars/porsche_911_964.jpg',
    'jeep_wrangler_mud': '$_basePath/cars/jeep_wrangler_mud.jpg',
    'jeep_wrangler_trail': '$_basePath/cars/jeep_wrangler_trail.jpg',
    'lamborghini_urus': '$_basePath/cars/lamborghini_urus.jpg',
    'chevy_impala_1964': '$_basePath/cars/chevy_impala_1964.jpg',
  };

  // User profile images
  static const Map<String, String> userImages = {
    'alex_ryder': '$_basePath/users/alex_ryder.jpg',
    'mia_chen': '$_basePath/users/mia_chen.jpg',
    'ben_carter': '$_basePath/users/ben_carter.jpg',
    'chloe_davis': '$_basePath/users/chloe_davis.jpg',
    'marcus_holloway': '$_basePath/users/marcus_holloway.jpg',
    'sophia_rossi': '$_basePath/users/sophia_rossi.jpg',
    'leo_garcia': '$_basePath/users/leo_garcia.jpg',
    'isabelle_dubois': '$_basePath/users/isabelle_dubois.jpg',
    'kenji_tanaka': '$_basePath/users/kenji_tanaka.jpg',
    'fatima_al_jamil': '$_basePath/users/fatima_al_jamil.jpg',
  };

  // User cover images
  static const Map<String, String> coverImages = {
    'garage_cover_1': '$_basePath/users/garage_cover_1.jpg',
    'garage_cover_2': '$_basePath/users/garage_cover_2.jpg',
    'garage_cover_3': '$_basePath/users/garage_cover_3.jpg',
    'garage_cover_4': '$_basePath/users/garage_cover_4.jpg',
    'garage_cover_5': '$_basePath/users/garage_cover_5.jpg',
  };

  // Group banner images
  static const Map<String, String> groupImages = {
    'street_racers_banner': '$_basePath/groups/street_racers_banner.jpg',
    'drifters_banner': '$_basePath/groups/drifters_banner.jpg',
    'show_shine_banner': '$_basePath/groups/show_shine_banner.jpg',
    'jdm_legends_banner': '$_basePath/groups/jdm_legends_banner.jpg',
    'german_engineering_banner':
        '$_basePath/groups/german_engineering_banner.jpg',
    'offroad_trailblazers_banner':
        '$_basePath/groups/offroad_trailblazers_banner.jpg',
  };

  // Event cover images
  static const Map<String, String> eventImages = {
    'cars_coffee_downtown': '$_basePath/events/cars_coffee_downtown.jpg',
    'midnight_touge_run': '$_basePath/events/midnight_touge_run.jpg',
    'drag_strip_event': '$_basePath/events/drag_strip_event.jpg',
    'car_show_weekend': '$_basePath/events/car_show_weekend.jpg',
    'drift_competition': '$_basePath/events/drift_competition.jpg',
  };

  // Fallback placeholder URLs (used when local assets are not available)
  static const Map<String, String> _fallbackUrls = {
    // Car fallbacks
    'mustang_1966_sunset':
        'https://images.unsplash.com/photo-1494976688153-c785a4cb3d85?w=600&h=400&fit=crop',
    'mustang_1966_profile':
        'https://images.unsplash.com/photo-1494976688153-c785a4cb3d85?w=600&h=800&fit=crop',
    'silvia_s15_drift':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    'silvia_s15_profile':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    'civic_type_r':
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    'bmw_m3_e92':
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
    'porsche_911_964':
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
    'jeep_wrangler_mud':
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
    'lamborghini_urus':
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',

    // User fallbacks
    'alex_ryder':
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'mia_chen':
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    'ben_carter':
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'chloe_davis':
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    'marcus_holloway':
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',

    // Cover fallbacks
    'garage_cover_1':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=300&fit=crop',
    'garage_cover_2':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=300&fit=crop',

    // Group fallbacks
    'street_racers_banner':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    'drifters_banner':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    'show_shine_banner':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',

    // Event fallbacks
    'cars_coffee_downtown':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    'midnight_touge_run':
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
  };

  /// Get car image path with fallback
  static String getCarImage(String key) {
    return carImages[key] ??
        _fallbackUrls[key] ??
        'https://placehold.co/600x400';
  }

  /// Get user image path with fallback
  static String getUserImage(String key) {
    return userImages[key] ??
        _fallbackUrls[key] ??
        'https://placehold.co/100x100';
  }

  /// Get cover image path with fallback
  static String getCoverImage(String key) {
    return coverImages[key] ??
        _fallbackUrls[key] ??
        'https://placehold.co/1200x300';
  }

  /// Get group image path with fallback
  static String getGroupImage(String key) {
    return groupImages[key] ??
        _fallbackUrls[key] ??
        'https://placehold.co/800x450';
  }

  /// Get event image path with fallback
  static String getEventImage(String key) {
    return eventImages[key] ??
        _fallbackUrls[key] ??
        'https://placehold.co/800x450';
  }

  /// Check if local asset exists (for future implementation)
  static Future<bool> assetExists(String assetPath) async {
    try {
      // This would need to be implemented with a proper asset existence check
      // For now, we'll assume assets exist if they're in our maps
      return carImages.containsValue(assetPath) ||
          userImages.containsValue(assetPath) ||
          coverImages.containsValue(assetPath) ||
          groupImages.containsValue(assetPath) ||
          eventImages.containsValue(assetPath);
    } catch (e) {
      return false;
    }
  }

  /// Get garage photos for a user
  static List<String> getGaragePhotos(String userId) {
    // Return a mix of car images for garage photos
    switch (userId) {
      case 'u1': // Alex Ryder - Mustang owner
        return [
          getCarImage('mustang_1966_garage'),
          getCarImage('mustang_1966_profile'),
          getCarImage('mustang_1966_sunset'),
        ];
      case 'u2': // Mia Chen - JDM enthusiast
        return [
          getCarImage('silvia_s15_profile'),
          getCarImage('silvia_s15_drift'),
        ];
      case 'u3': // Ben Carter - BMW owner
        return [getCarImage('bmw_m3_e92')];
      case 'u4': // Chloe Davis - Off-road
        return [
          getCarImage('jeep_wrangler_mud'),
          getCarImage('jeep_wrangler_trail'),
        ];
      default:
        return [
          getCarImage('mustang_1966_garage'),
          getCarImage('silvia_s15_profile'),
        ];
    }
  }
}
