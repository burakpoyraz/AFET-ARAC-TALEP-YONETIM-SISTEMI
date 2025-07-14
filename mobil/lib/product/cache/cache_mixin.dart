/// Mixin for providing smart caching functionality to ViewModels
///
/// **[CacheMixin]** Provides reusable caching logic with:
/// - Configurable cache duration
/// - Cache validity checks
/// - Force refresh capability
/// - Debug logging
mixin CacheMixin {
  DateTime? _lastFetchTime;
  Duration get cacheDuration => const Duration(minutes: 5);

  /// Check if cache is still valid based on duration
  bool get isCacheValid =>
      _lastFetchTime != null &&
      DateTime.now().difference(_lastFetchTime!) < cacheDuration;

  /// Update cache timestamp to current time
  void updateCacheTimestamp() {
    _lastFetchTime = DateTime.now();
  }

  /// Clear cache timestamp (forces next call to fetch from API)
  void invalidateCache() {
    _lastFetchTime = null;
  }

  /// Get cache status info for debugging
  String get cacheStatusInfo {
    if (_lastFetchTime == null) return 'No cache';
    final expiresAt = _lastFetchTime!.add(cacheDuration);
    final remaining = expiresAt.difference(DateTime.now());
    return 'Cache expires in ${remaining.inMinutes}m ${remaining.inSeconds % 60}s';
  }
}
