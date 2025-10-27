import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_user.dart';

/// Service for managing user data in Firestore.
///
/// This service handles CRUD operations for user profiles stored in the
/// `users` collection. It is separate from [AuthService] to maintain a
/// clear separation between authentication logic and user data management.
class UserService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Fetches a user profile from Firestore by UID.
  ///
  /// Returns `null` if the user document does not exist.
  ///
  /// Throws [FirebaseException] if there's an error fetching the data.
  Future<AppUser?> getUserById(String uid) async {
    try {
      final docSnapshot = await _firestore.collection('users').doc(uid).get();

      if (!docSnapshot.exists) {
        return null;
      }

      final data = docSnapshot.data();
      if (data == null) {
        return null;
      }

      return AppUser.fromMap(data);
    } catch (e) {
      // Log the error or handle it appropriately
      rethrow;
    }
  }

  /// Updates a user profile in Firestore.
  ///
  /// Only updates the fields that are provided. Uses merge to avoid
  /// overwriting unspecified fields.
  ///
  /// Throws [FirebaseException] if there's an error updating the data.
  Future<void> updateUser(String uid, Map<String, dynamic> updates) async {
    try {
      await _firestore
          .collection('users')
          .doc(uid)
          .set(updates, SetOptions(merge: true));
    } catch (e) {
      // Log the error or handle it appropriately
      rethrow;
    }
  }

  /// Streams a user profile from Firestore by UID.
  ///
  /// This is useful for real-time updates to the user profile.
  ///
  /// Returns a stream that emits `null` if the user document does not exist.
  Stream<AppUser?> streamUserById(String uid) {
    return _firestore.collection('users').doc(uid).snapshots().map((snapshot) {
      if (!snapshot.exists) {
        return null;
      }

      final data = snapshot.data();
      if (data == null) {
        return null;
      }

      return AppUser.fromMap(data);
    });
  }

  /// Deletes a user profile from Firestore.
  ///
  /// This does NOT delete the Firebase Auth account, only the Firestore
  /// document. Use [AuthService.deleteAccount] for full account deletion.
  ///
  /// Throws [FirebaseException] if there's an error deleting the data.
  Future<void> deleteUser(String uid) async {
    try {
      await _firestore.collection('users').doc(uid).delete();
    } catch (e) {
      // Log the error or handle it appropriately
      rethrow;
    }
  }

  /// Checks if a handle is available (not taken by another user).
  ///
  /// Returns `true` if the handle is available, `false` otherwise.
  Future<bool> isHandleAvailable(String handle) async {
    try {
      final querySnapshot = await _firestore
          .collection('users')
          .where('handle', isEqualTo: handle)
          .limit(1)
          .get();

      return querySnapshot.docs.isEmpty;
    } catch (e) {
      // Log the error or handle it appropriately
      rethrow;
    }
  }
}
