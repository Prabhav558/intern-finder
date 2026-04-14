import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateProfileInput {
  rollNo?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string[];
  interests?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  location?: string;
  profilePhotoUrl?: string;
}

export const studentService = {
  /**
   * Get student profile
   */
  async getProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePhotoUrl: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    return profile;
  },

  /**
   * Update student profile
   */
  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ) {
    // Verify profile exists
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new Error('Student profile not found');
    }

    // Calculate profile completion score
    let profileScore = 0;
    const scoreItems = [
      { field: 'rollNo', weight: 10 },
      { field: 'branch', weight: 10 },
      { field: 'graduationYear', weight: 10 },
      { field: 'cgpa', weight: 10 },
      { field: 'skills', weight: 15 },
      { field: 'interests', weight: 10 },
      { field: 'linkedinUrl', weight: 10 },
      { field: 'githubUrl', weight: 10 },
      { field: 'portfolioUrl', weight: 5 },
      { field: 'bio', weight: 10 },
    ];

    const updateData = { ...input };
    for (const item of scoreItems) {
      const fieldValue = updateData[item.field as keyof UpdateProfileInput];
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        profileScore += item.weight;
      }
    }

    // Update also the current fields
    for (const item of scoreItems) {
      const existingValue =
        existingProfile[item.field as keyof typeof existingProfile];
      if (
        existingValue !== undefined &&
        existingValue !== null &&
        (updateData[item.field as keyof UpdateProfileInput] === undefined ||
          updateData[item.field as keyof UpdateProfileInput] === null)
      ) {
        profileScore += item.weight;
      }
    }

    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        ...updateData,
        profileScore: Math.min(profileScore, 100),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    return profile;
  },

  /**
   * Get public student profile
   */
  async getPublicProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePhotoUrl: true,
            createdAt: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    return {
      ...profile,
      badges: profile.badges.map((sb) => ({
        badge: sb.badge,
        earnedAt: sb.earnedAt,
      })),
    };
  },

  /**
   * Get student applications
   */
  async getApplications(
    userId: string,
    status?: string,
    limit = 10,
    offset = 0
  ) {
    const where: any = {
      student: {
        id: userId,
      },
    };

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              companyName: true,
              deadline: true,
              type: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      total,
      limit,
      offset,
    };
  },

  /**
   * Get student bookmarks
   */
  async getBookmarks(userId: string, limit = 10, offset = 0) {
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { student: { id: userId } },
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              companyName: true,
              deadline: true,
              type: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.bookmark.count({ where: { student: { id: userId } } }),
    ]);

    return {
      bookmarks,
      total,
      limit,
      offset,
    };
  },

  /**
   * Get student badges
   */
  async getBadges(userId: string) {
    const badges = await prisma.studentBadge.findMany({
      where: { student: { id: userId } },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    return badges.map((sb) => ({
      ...sb.badge,
      earnedAt: sb.earnedAt,
    }));
  },

  /**
   * Save resume URL
   */
  async saveResume(userId: string, resumeUrl: string) {
    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: { resumeUrl },
    });

    return profile;
  },

  /**
   * Get student statistics
   */
  async getStatistics(userId: string) {
    const [
      applicationsCount,
      bookmarksCount,
      badgesCount,
      applicationsPerType,
    ] = await Promise.all([
      prisma.application.count({
        where: { student: { id: userId } },
      }),
      prisma.bookmark.count({
        where: { student: { id: userId } },
      }),
      prisma.studentBadge.count({
        where: { student: { id: userId } },
      }),
      prisma.application.groupBy({
        by: ['status'],
        where: { student: { id: userId } },
        _count: true,
      }),
    ]);

    return {
      applicationsCount,
      bookmarksCount,
      badgesCount,
      applicationsPerType: applicationsPerType.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  },
};

export default studentService;
