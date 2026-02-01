import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { APP_CONFIG } from '../config/app.config';
import { getDeviceId } from './storage.service';

interface FraudCheckResult {
  allowed: boolean;
  reason?: string;
  riskScore?: number;
}

interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  screenSize: string;
  language: string;
  timezone: string;
  platform: string;
}

/**
 * Generate device fingerprint
 */
export const getDeviceFingerprint = (): DeviceInfo => {
  return {
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform
  };
};

/**
 * Check if device is already linked to another account
 */
export const checkDeviceLimit = async (userId: string): Promise<FraudCheckResult> => {
  try {
    const deviceInfo = getDeviceFingerprint();
    const deviceId = deviceInfo.deviceId;

    // Query for this device ID in other users
    const q = query(
      collection(db, 'userDevices'),
      where('deviceId', '==', deviceId)
    );

    const snapshot = await getDocs(q);
    const linkedUsers = snapshot.docs.map((doc) => doc.data().userId);

    // Filter out current user
    const otherUsers = linkedUsers.filter((uid) => uid !== userId);

    if (otherUsers.length >= APP_CONFIG.SECURITY.MAX_DEVICES) {
      return {
        allowed: false,
        reason: 'This device is already linked to maximum allowed accounts',
        riskScore: 100
      };
    }

    // Register this device for this user
    await setDoc(doc(db, 'userDevices', `${userId}_${deviceId}`), {
      userId,
      deviceId,
      userAgent: deviceInfo.userAgent,
      lastSeen: Date.now(),
      createdAt: Date.now()
    }, { merge: true });

    return { allowed: true, riskScore: 0 };
  } catch (error) {
    console.error('Device check error:', error);
    return { allowed: true, riskScore: 10 }; // Allow but flag
  }
};

/**
 * Rate limit check for actions
 */
export const checkRateLimit = async (
  userId: string,
  action: string,
  maxPerHour: number
): Promise<FraudCheckResult> => {
  try {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;

    const rateLimitRef = doc(db, 'rateLimits', `${userId}_${action}`);
    const rateLimitSnap = await getDoc(rateLimitRef);

    if (rateLimitSnap.exists()) {
      const data = rateLimitSnap.data();
      const recentActions = (data.timestamps || []).filter((t: number) => t > hourAgo);

      if (recentActions.length >= maxPerHour) {
        return {
          allowed: false,
          reason: `Rate limit exceeded for ${action}. Try again later.`,
          riskScore: 70
        };
      }

      // Update with new timestamp
      await updateDoc(rateLimitRef, {
        timestamps: [...recentActions, now],
        lastAction: now
      });
    } else {
      // Create new rate limit doc
      await setDoc(rateLimitRef, {
        userId,
        action,
        timestamps: [now],
        lastAction: now
      });
    }

    return { allowed: true, riskScore: 0 };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, riskScore: 10 };
  }
};

/**
 * Check for suspicious activity patterns
 */
export const checkSuspiciousActivity = async (userId: string): Promise<FraudCheckResult> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { allowed: false, reason: 'User not found', riskScore: 100 };
    }

    const userData = userSnap.data();
    let riskScore = 0;

    // Check 1: Account age
    const accountAgeDays = (Date.now() - userData.createdAt) / (1000 * 60 * 60 * 24);
    if (accountAgeDays < 1) {
      riskScore += 20; // New account
    }

    // Check 2: Warning count
    if (userData.warningCount >= 3) {
      return {
        allowed: false,
        reason: 'Account flagged for suspicious activity',
        riskScore: 100
      };
    }
    riskScore += userData.warningCount * 15;

    // Check 3: Is anonymous/guest
    if (userData.isAnonymous) {
      riskScore += 30;
    }

    // Check 4: No email
    if (!userData.email) {
      riskScore += 10;
    }

    return {
      allowed: riskScore < 80,
      reason: riskScore >= 80 ? 'High risk activity detected' : undefined,
      riskScore
    };
  } catch (error) {
    console.error('Suspicious activity check error:', error);
    return { allowed: true, riskScore: 20 };
  }
};

/**
 * Log user activity for fraud analysis
 */
export const logActivity = async (
  userId: string,
  action: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    const deviceInfo = getDeviceFingerprint();

    await setDoc(doc(collection(db, `users/${userId}/activityLog`)), {
      action,
      timestamp: Date.now(),
      deviceId: deviceInfo.deviceId,
      userAgent: deviceInfo.userAgent,
      ip: 'masked', // Would need server-side for real IP
      details
    });
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};

/**
 * Issue warning to user
 */
export const issueWarning = async (
  userId: string,
  reason: string
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      warningCount: increment(1)
    });

    // Log the warning
    await logActivity(userId, 'warning_issued', { reason });

    return true;
  } catch (error) {
    console.error('Warning issue error:', error);
    return false;
  }
};

/**
 * Comprehensive fraud check before rewarding
 */
export const performFraudCheck = async (
  userId: string,
  action: string
): Promise<FraudCheckResult> => {
  // Check 1: Device limit
  const deviceCheck = await checkDeviceLimit(userId);
  if (!deviceCheck.allowed) {
    return deviceCheck;
  }

  // Check 2: Rate limiting
  const rateLimit = await checkRateLimit(userId, action, 100); // 100 actions per hour
  if (!rateLimit.allowed) {
    return rateLimit;
  }

  // Check 3: Suspicious patterns
  const suspiciousCheck = await checkSuspiciousActivity(userId);
  if (!suspiciousCheck.allowed) {
    return suspiciousCheck;
  }

  // Calculate overall risk score
  const totalRisk = Math.min(
    100,
    (deviceCheck.riskScore || 0) +
    (rateLimit.riskScore || 0) +
    (suspiciousCheck.riskScore || 0)
  );

  if (totalRisk >= 80) {
    await issueWarning(userId, `High risk score: ${totalRisk}`);
    return {
      allowed: false,
      reason: 'Activity blocked due to security concerns',
      riskScore: totalRisk
    };
  }

  // Log successful action
  await logActivity(userId, action);

  return { allowed: true, riskScore: totalRisk };
};

/**
 * Validate withdrawal request
 */
export const validateWithdrawalRequest = async (
  userId: string,
  amount: number
): Promise<FraudCheckResult> => {
  // Check if user is allowed to withdraw
  const fraudCheck = await performFraudCheck(userId, 'withdrawal');
  if (!fraudCheck.allowed) {
    return fraudCheck;
  }

  // Additional withdrawal-specific checks
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { allowed: false, reason: 'User not found', riskScore: 100 };
  }

  const userData = userSnap.data();

  // Check 1: Account must be at least 24 hours old
  const accountAgeHours = (Date.now() - userData.createdAt) / (1000 * 60 * 60);
  if (accountAgeHours < 24) {
    return {
      allowed: false,
      reason: 'Account must be at least 24 hours old to withdraw',
      riskScore: 50
    };
  }

  // Check 2: Guest accounts cannot withdraw
  if (userData.isAnonymous) {
    return {
      allowed: false,
      reason: 'Please sign in with Google to withdraw',
      riskScore: 60
    };
  }

  // Check 3: Large withdrawals need extra verification
  if (amount > 10000) {
    // Would trigger manual review in real app
    console.log('Large withdrawal flagged for review:', amount);
  }

  return { allowed: true, riskScore: fraudCheck.riskScore };
};

export default {
  getDeviceFingerprint,
  checkDeviceLimit,
  checkRateLimit,
  checkSuspiciousActivity,
  logActivity,
  issueWarning,
  performFraudCheck,
  validateWithdrawalRequest
};
