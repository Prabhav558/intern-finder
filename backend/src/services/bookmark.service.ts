import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookmarkService = {
  /**
   * Save opportunity to bookmarks
   */
  async saveOpportunity(studentId: string, opportunityId: string) {
    // Check if opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId,
        },
      },
    });

    if (existing) {
      throw new Error('Opportunity already bookmarked');
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        student: { connect: { id: studentId } },
        opportunity: { connect: { id: opportunityId } },
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            deadline: true,
          },
        },
      },
    });

    return bookmark;
  },

  /**
   * Remove bookmark
   */
  async removeBookmark(studentId: string, opportunityId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId,
        },
      },
    });

    if (!bookmark) {
      throw new Error('Bookmark not found');
    }

    await prisma.bookmark.delete({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId,
        },
      },
    });

    return { message: 'Bookmark removed' };
  },

  /**
   * Get all bookmarks for student
   */
  async getBookmarks(
    studentId: string,
    limit = 20,
    offset = 0,
    sortBy = 'recent'
  ) {
    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'deadline') {
      orderBy = { opportunity: { deadline: 'asc' } };
    }

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { student: { id: studentId } },
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              companyName: true,
              type: true,
              deadline: true,
              location: true,
              mode: true,
              stipendPrize: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.bookmark.count({
        where: { student: { id: studentId } },
      }),
    ]);

    return {
      bookmarks: bookmarks.map((b) => ({
        id: b.id,
        opportunity: b.opportunity,
        savedAt: b.createdAt,
      })),
      total,
      limit,
      offset,
    };
  },

  /**
   * Check if opportunity is bookmarked
   */
  async isBookmarked(studentId: string, opportunityId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId,
        },
      },
    });

    return !!bookmark;
  },

  /**
   * Get bookmark count for opportunity
   */
  async getBookmarkCount(opportunityId: string): Promise<number> {
    return prisma.bookmark.count({
      where: { opportunity: { id: opportunityId } },
    });
  },

  /**
   * Get trending bookmarked opportunities
   */
  async getTrendingBookmarked(limit = 10) {
    const bookmarks = await prisma.opportunity.findMany({
      where: {
        bookmarks: { some: {} },
        isActive: true,
        isVerified: true,
      },
      include: {
        bookmarks: {
          select: { id: true },
        },
      },
      orderBy: {
        bookmarks: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return bookmarks;
  },
};

export default bookmarkService;
