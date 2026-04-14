import { PrismaClient, OpportunityType, OpportunityMode } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateOpportunityInput {
  title: string;
  description: string;
  companyName: string;
  type: OpportunityType;
  domains: string[];
  deadline: Date;
  location: string;
  mode: OpportunityMode;
  requiredSkills: string[];
  minCgpa?: number;
  allowedBranches?: string[];
  allowedYears?: number[];
  stipendPrize?: string;
  applicationLink?: string;
  externalUrl?: string;
  tags?: string[];
  eligibilityCriteria?: Record<string, any>;
}

export interface FilterOpportunitiesInput {
  type?: string;
  domain?: string;
  location?: string;
  mode?: string;
  minStipend?: number;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export const opportunityService = {
  /**
   * Create opportunity (admin only)
   */
  async createOpportunity(
    input: CreateOpportunityInput,
    adminId: string
  ) {
    const opportunity = await prisma.opportunity.create({
      data: {
        ...input,
        postedBy: adminId,
        isVerified: true,
        isActive: true,
      },
    });

    return opportunity;
  },

  /**
   * Get opportunity by ID
   */
  async getOpportunityById(opportunityId: string, studentId?: string) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Check if bookmarked by student
    let isBookmarked = false;
    if (studentId) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          studentId_opportunityId: {
            studentId,
            opportunityId,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    // Increment views count
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { viewsCount: { increment: 1 } },
    });

    return {
      ...opportunity,
      isBookmarked,
    };
  },

  /**
   * List opportunities with filters
   */
  async listOpportunities(filters: FilterOpportunitiesInput) {
    const {
      type,
      domain,
      location,
      mode,
      search,
      sort = 'latest',
      limit = 20,
      offset = 0,
    } = filters;

    const where: any = {
      isActive: true,
      isVerified: true,
      deadline: { gt: new Date() },
    };

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (mode) {
      where.mode = mode;
    }

    if (domain) {
      where.domains = { hasSome: [domain] };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'deadline') {
      orderBy = { deadline: 'asc' };
    } else if (sort === 'popular') {
      orderBy = { viewsCount: 'desc' };
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.opportunity.count({ where }),
    ]);

    return {
      opportunities,
      total,
      limit,
      offset,
    };
  },

  /**
   * Update opportunity (admin only)
   */
  async updateOpportunity(
    opportunityId: string,
    input: Partial<CreateOpportunityInput>
  ) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const updated = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: input,
    });

    return updated;
  },

  /**
   * Delete opportunity (soft delete - admin only)
   */
  async deleteOpportunity(opportunityId: string) {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const updated = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { isActive: false },
    });

    return updated;
  },

  /**
   * Get opportunities by type
   */
  async getOpportunitiesByType(type: string, limit = 10) {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        type: type as OpportunityType,
        isActive: true,
        isVerified: true,
        deadline: { gt: new Date() },
      },
      orderBy: { deadline: 'asc' },
      take: limit,
    });

    return opportunities;
  },

  /**
   * Get trending opportunities
   */
  async getTrendingOpportunities(limit = 10) {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        isActive: true,
        isVerified: true,
        deadline: { gt: new Date() },
      },
      orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return opportunities;
  },

  /**
   * Get applications for opportunity (admin only)
   */
  async getApplications(opportunityId: string, limit = 20, offset = 0) {
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { opportunityId },
        include: {
          student: {
            select: {
              id: true,
              email: true,
              name: true,
              profilePhotoUrl: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.application.count({ where: { opportunityId } }),
    ]);

    return {
      applications,
      total,
      limit,
      offset,
    };
  },

  /**
   * Search opportunities (full-text)
   */
  async searchOpportunities(query: string, limit = 20, offset = 0) {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        isActive: true,
        isVerified: true,
        OR: [
          { title: { search: query } },
          { description: { search: query } },
          { companyName: { search: query } },
          { tags: { hasSome: [query] } },
        ],
      },
      take: limit,
      skip: offset,
    });

    return opportunities;
  },

  /**
   * Get statistics (admin only)
   */
  async getStatistics() {
    const [total, active, byType, totalApplications, totalBookmarks] =
      await Promise.all([
        prisma.opportunity.count(),
        prisma.opportunity.count({ where: { isActive: true } }),
        prisma.opportunity.groupBy({
          by: ['type'],
          _count: true,
        }),
        prisma.application.count(),
        prisma.bookmark.count(),
      ]);

    return {
      total,
      active,
      byType: byType.reduce(
        (acc, item) => {
          acc[item.type] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      totalApplications,
      totalBookmarks,
    };
  },
};

export default opportunityService;
