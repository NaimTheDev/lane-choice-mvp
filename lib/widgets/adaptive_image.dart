import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:cached_network_image/cached_network_image.dart';

/// A widget that handles both asset images and network images
/// Use this instead of CachedNetworkImage to support both local assets and network URLs
class AdaptiveImage extends StatelessWidget {
  const AdaptiveImage({
    super.key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.placeholder,
    this.errorWidget,
    this.width,
    this.height,
  });

  final String imageUrl;
  final BoxFit fit;
  final Widget Function(BuildContext, String)? placeholder;
  final Widget Function(BuildContext, String, dynamic)? errorWidget;
  final double? width;
  final double? height;

  bool get _isAsset =>
      imageUrl.startsWith('assets/') || !imageUrl.startsWith('http');

  @override
  Widget build(BuildContext context) {
    if (_isAsset) {
      // Use Image.asset for local assets
      return Image.asset(
        imageUrl,
        fit: fit,
        width: width,
        height: height,
        errorBuilder: (context, error, stackTrace) {
          return errorWidget?.call(context, imageUrl, error) ??
              Container(
                width: width,
                height: height,
                color: Colors.grey[300],
                child: const Icon(Icons.broken_image, color: Colors.grey),
              );
        },
      );
    } else {
      // Use CachedNetworkImage for network URLs
      return CachedNetworkImage(
        imageUrl: imageUrl,
        fit: fit,
        width: width,
        height: height,
        placeholder: placeholder,
        errorWidget:
            errorWidget ??
            (context, url, error) => Container(
              width: width,
              height: height,
              color: Colors.grey[300],
              child: const Icon(Icons.broken_image, color: Colors.grey),
            ),
      );
    }
  }
}

/// Provider for adaptive image (for use with CircleAvatar, etc.)
class AdaptiveImageProvider extends ImageProvider<AdaptiveImageProvider> {
  const AdaptiveImageProvider(this.imageUrl);

  final String imageUrl;

  bool get _isAsset =>
      imageUrl.startsWith('assets/') || !imageUrl.startsWith('http');

  @override
  ImageStreamCompleter loadImage(
    AdaptiveImageProvider key,
    ImageDecoderCallback decode,
  ) {
    if (_isAsset) {
      return AssetImage(
        imageUrl,
      ).loadImage(AssetImage(imageUrl) as AssetBundleImageKey, decode);
    } else {
      return AdaptiveImageProvider(
        imageUrl,
      ).loadImage(AdaptiveImageProvider(imageUrl), decode);
    }
  }

  @override
  Future<AdaptiveImageProvider> obtainKey(ImageConfiguration configuration) {
    return SynchronousFuture<AdaptiveImageProvider>(this);
  }

  @override
  bool operator ==(Object other) {
    if (other.runtimeType != runtimeType) {
      return false;
    }
    return other is AdaptiveImageProvider && other.imageUrl == imageUrl;
  }

  @override
  int get hashCode => imageUrl.hashCode;
}
