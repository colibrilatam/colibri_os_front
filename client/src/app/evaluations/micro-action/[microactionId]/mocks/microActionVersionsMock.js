export function getMockVersions(microAction) {
  if (!microAction?.versions || microAction.versions.length > 0) {
    return microAction?.versions ?? [];
  }

  const baseVersion = {
    microActionInstanceId: microAction.id,
    executionNotes: microAction.executionNotes ?? null,
    attemptNumber: microAction.attemptNumber ?? 1,
    reopenedCount: microAction.reopenedCount ?? 0,
    canonicalUri: null,
    createdByUserId: microAction.actorUserId,
  };

  if (microAction.status === 'completed') {
    return [
      {
        ...baseVersion,
        id: `${microAction.id}-mock-version-1`,
        versionNumber: 1,
        changeType: 'completed',
        status: 'completed',
        previousStatus: 'submitted',
        changeSummary: 'Primera versión completada',
        supersedesVersionNumber: null,
        createdAt: microAction.createdAt,
      },
      {
        ...baseVersion,
        id: `${microAction.id}-mock-version-2`,
        versionNumber: 2,
        changeType: 'completed',
        status: 'completed',
        previousStatus: 'completed',
        changeSummary: 'Versión final completada',
        supersedesVersionNumber: 1,
        createdAt: microAction.updatedAt ?? microAction.createdAt,
      },
    ];
  }

  if (microAction.status === 'pending') {
    return [
      {
        ...baseVersion,
        id: `${microAction.id}-mock-version-1`,
        versionNumber: 1,
        changeType: 'rejected',
        status: 'rejected',
        previousStatus: 'submitted',
        changeSummary: 'La versión fue rechazada por el evaluador',
        supersedesVersionNumber: null,
        createdAt: microAction.createdAt,
      },
      {
        ...baseVersion,
        id: `${microAction.id}-mock-version-2`,
        versionNumber: 2,
        changeType: 'submitted',
        status: 'pending',
        previousStatus: 'rejected',
        changeSummary: 'Nueva versión enviada y pendiente de evaluación',
        supersedesVersionNumber: 1,
        createdAt: microAction.updatedAt ?? microAction.createdAt,
      },
    ];
  }

  return [];
}
