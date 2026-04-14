import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface ApplyInput {
  opportunityId: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  notes?: string;
}

export const applicationService = {
  /**
   * Apply for opportunity
   */
  async applyForOpportunity(
    studentId: string,
    input: ApplyInput
  ) {
    // Check if opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: input.opportunityId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId: input.opportunityId,
        },
      },
    });

    if (existingApplication) {
      throw new Error('You have already applied for this opportunity');
    }

    // Check deadline
    if (new Date() > opportunity.deadline) {
      throw new Error('Application deadline has passed');
    }

    // Get student profile for resume
    let resumeUrl = input.resumeUrl;
    if (!resumeUrl) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: studentId },
      });
      resumeUrl = profile?.resumeUrl || undefined;
    }

    if (!resumeUrl) {
      throw new Error('Resume URL is required to apply');
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        student: { connect: { id: studentId } },
        opportunity: { connect: { id: input.opportunityId } },
        resumeUrl,
        coverLetter: input.coverLetter,
        status: 'PENDING',
      },
      include: {
        opportunity: {
          select: {
            title: true,
            companyName: true,
            deadline: true,
          },
        },
      },
    });

    return application;
  },

  /**
   * Get application by ID
   */
  async getApplication(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: true,
        student: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  },

  /**
   * Update application status (admin only)
   */
  async updateApplicationStatus(
    applicationId: string,
    input: UpdateApplicationInput
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: input.status || application.status,
        notes: input.notes || application.notes,
        updatedAt: new Date(),
      },
      include: {
        opportunity: {
          select: {
            title: true,
            companyName: true,
          },
        },
        student: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return updated;
  },

  /**
   * Withdraw application
   */
  async withdrawApplication(studentId: string, applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.student_id !== studentId) {
      throw new Error('You can only withdraw your own applications');
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'WITHDRAWN' },
    });

    return updated;
  },

  /**
   * Get application statistics (admin only)
   */
  async getApplicationStatistics() {
    const [total, byStatus, byType, applicationsPerDay] = await Promise.all([
      prisma.application.count(),
      prisma.application.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.application.groupBy({
        by: ['status'],
        where: {},
        _count: true,
      }),
      prisma.application.groupBy({
        by: ['appliedAt'],
        _count: true,
        orderBy: { appliedAt: 'desc' },
        take: 7,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      recentApplications: applicationsPerDay,
    };
  },

  /**
   * Get applications for student by status
   */
  async getApplicationsByStatus(studentId: string, status: ApplicationStatus) {
    const applications = await prisma.application.findMany({
      where: {
        student: { id: studentId },
        status,
      },
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
    });

    return applications;
  },

  /**
   * Bulk update application statuses (admin only)
   */
  async bulkUpdateApplicationStatus(
    applicationIds: string[],
    status: ApplicationStatus
  ) {
    const result = await prisma.application.updateMany({
      where: {
        id: { in: applicationIds },
      },
      data: { status },
    });

    return result;
  },

  /**
   * Check if student applied for opportunity
   */
  async hasApplied(studentId: string, opportunityId: string): Promise<boolean> {
    const application = await prisma.application.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId,
        },
      },
    });

    return !!application;
  },

  /**
   * Get application count per opportunity
   */
  async getApplicationCount(opportunityId: string): Promise<number> {
    return prisma.application.count({
      where: { opportunityId },
    });
  },
};

export default applicationService;
