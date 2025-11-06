/**
 * MKF > KF Merge Utility
 * 
 * Per MKF_00 Invariants: Master Knowledge Framework (MKF) takes precedence
 * over legacy Knowledge Files (KF). This utility performs deep merges with
 * MKF values always winning in conflicts.
 * 
 * CI ENFORCEMENT: Build fails if KF attempts to override MKF keys.
 */

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export interface MergeResult<T> {
  merged: T;
  conflicts: string[];
  mkfKeys: string[];
  kfKeys: string[];
}

/**
 * Deep merge two objects with MKF precedence
 * 
 * @param mkf - Master Knowledge Framework data (dominant)
 * @param kf - Legacy Knowledge Files data (fallback)
 * @param path - Current path for conflict tracking (internal)
 * @returns Merged result with MKF values taking precedence
 */
export function mergeWithPrecedence<T extends Record<string, unknown>>(
  mkf: DeepPartial<T>,
  kf: DeepPartial<T>,
  path: string = ''
): MergeResult<T> {
  const merged: any = {};
  const conflicts: string[] = [];
  const mkfKeys: string[] = [];
  const kfKeys: string[] = [];

  // Collect all unique keys
  const allKeys = new Set([
    ...Object.keys(mkf || {}),
    ...Object.keys(kf || {}),
  ]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const mkfValue = mkf?.[key];
    const kfValue = kf?.[key];

    // MKF exists - always use it
    if (mkfValue !== undefined) {
      mkfKeys.push(currentPath);

      // Detect conflict: both exist and differ
      if (kfValue !== undefined && mkfValue !== kfValue) {
        if (isObject(mkfValue) && isObject(kfValue)) {
          // Recurse for nested objects
          const nestedResult = mergeWithPrecedence(
            mkfValue as any,
            kfValue as any,
            currentPath
          );
          merged[key] = nestedResult.merged;
          conflicts.push(...nestedResult.conflicts);
          mkfKeys.push(...nestedResult.mkfKeys);
          kfKeys.push(...nestedResult.kfKeys);
        } else {
          // Primitive conflict - MKF wins
          conflicts.push(currentPath);
          merged[key] = mkfValue;
        }
      } else {
        // No conflict or same value
        merged[key] = mkfValue;
      }
    }
    // Only KF exists - use as fallback
    else if (kfValue !== undefined) {
      kfKeys.push(currentPath);
      merged[key] = kfValue;
    }
  }

  return {
    merged: merged as T,
    conflicts,
    mkfKeys,
    kfKeys,
  };
}

/**
 * Validate that KF does not override MKF keys
 * Used in CI to enforce MKF > KF precedence
 * 
 * @throws Error if KF attempts to override MKF keys
 */
export function validateNoKFOverrides<T extends Record<string, unknown>>(
  mkf: DeepPartial<T>,
  kf: DeepPartial<T>
): void {
  const result = mergeWithPrecedence(mkf, kf);

  if (result.conflicts.length > 0) {
    throw new Error(
      `[MKF_00 VIOLATION] KF attempting to override MKF keys:\n` +
        result.conflicts.map((k) => `  - ${k}`).join('\n') +
        '\n\nMKF (Master Knowledge Framework) must take precedence.\n' +
        'Remove conflicting keys from KF or update MKF instead.'
    );
  }
}

/**
 * Safely merge with fallback to empty object
 */
export function safeMerge<T extends Record<string, unknown>>(
  mkf: DeepPartial<T> | null | undefined,
  kf: DeepPartial<T> | null | undefined
): T {
  const result = mergeWithPrecedence(mkf || ({} as any), kf || ({} as any));
  return result.merged;
}

// ==================== HELPERS ====================

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Generate merge report for debugging
 */
export function generateMergeReport<T extends Record<string, unknown>>(
  mkf: DeepPartial<T>,
  kf: DeepPartial<T>
): string {
  const result = mergeWithPrecedence(mkf, kf);

  return [
    '=== MKF > KF Merge Report ===',
    '',
    `MKF Keys (${result.mkfKeys.length}):`,
    ...result.mkfKeys.map((k) => `  ✓ ${k}`),
    '',
    `KF Fallback Keys (${result.kfKeys.length}):`,
    ...result.kfKeys.map((k) => `  ○ ${k}`),
    '',
    `Conflicts Resolved (${result.conflicts.length}):`,
    ...result.conflicts.map((k) => `  ! ${k} (MKF won)`),
    '',
    '=== End Report ===',
  ].join('\n');
}
