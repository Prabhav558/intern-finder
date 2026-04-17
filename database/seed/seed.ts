import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@opportunest.com' },
    update: {},
    create: {
      email: 'admin@opportunest.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo student users
  const students = [];
  for (let i = 1; i <= 3; i++) {
    const password = await bcrypt.hash('Student@123', 10);
    const student = await prisma.user.upsert({
      where: { email: `student${i}@example.com` },
      update: {},
      create: {
        email: `student${i}@example.com`,
        name: `Student ${i}`,
        passwordHash: password,
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
      },
    });
    students.push(student);
    console.log('✅ Student user created:', student.email);
  }

  // Create student profiles
  for (let i = 0; i < students.length; i++) {
    await prisma.studentProfile.upsert({
      where: { userId: students[i].id },
      update: {},
      create: {
        userId: students[i].id,
        rollNo: `20CS${100 + i}`,
        branch: i % 2 === 0 ? 'Computer Science' : 'Information Technology',
        graduationYear: 2024,
        cgpa: 3.5 + i * 0.1,
        skills: ['Python', 'JavaScript', 'React', 'SQL'],
        interests: ['Web Development', 'AI/ML', 'Cloud'],
        bio: `Student ${i + 1} at OpportuNest`,
        location: 'India',
        profileScore: 70,
      },
    });
    console.log(`✅ Profile created for Student ${i + 1}`);
  }

  // Create demo opportunities
  const opportunities = [
    {
      title: 'Summer Intern - Web Development',
      description: 'Join our team for an exciting summer internship in web development.',
      companyName: 'TechCorp',
      type: 'INTERNSHIP',
      domains: ['Technology', 'Web'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stipendPrize: '₹50,000/month',
      location: 'Bangalore',
      mode: 'HYBRID',
      requiredSkills: ['React', 'Node.js', 'MongoDB'],
      minCgpa: 3.0,
      allowedBranches: ['CSE', 'IT'],
      allowedYears: [3, 4],
      tags: ['frontend', 'fullstack', 'internship'],
      isVerified: true,
      isActive: true,
    },
    {
      title: 'Hackathon 2024 - Innovation Challenge',
      description: 'Build innovative solutions in 48 hours.',
      companyName: 'DevFest',
      type: 'HACKATHON',
      domains: ['Innovation'],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      stipendPrize: '₹1,00,000 prize pool',
      location: 'Virtual',
      mode: 'REMOTE',
      requiredSkills: ['Problem Solving', 'Coding'],
      minCgpa: 2.5,
      allowedBranches: [],
      allowedYears: [],
      tags: ['hackathon', 'innovation'],
      isVerified: true,
      isActive: true,
    },
    {
      title: 'Scholarship - Merit Based',
      description: 'Prestigious scholarship for high-performing students.',
      companyName: 'Education Trust',
      type: 'SCHOLARSHIP',
      domains: ['Education'],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      stipendPrize: 'Full tuition coverage',
      location: 'Pan-India',
      mode: 'REMOTE',
      requiredSkills: [],
      minCgpa: 3.5,
      allowedBranches: [],
      allowedYears: [2, 3, 4],
      tags: ['scholarship', 'merit'],
      isVerified: true,
      isActive: true,
    },
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: {
        ...opp,
        eligibilityCriteria: {
          minCgpa: opp.minCgpa,
          allowedBranches: opp.allowedBranches,
          allowedYears: opp.allowedYears,
        },
      },
    });
  }
  console.log(`✅ ${opportunities.length} opportunities created`);

  // Create demo badges
  const badges = [
    {
      name: 'First Application',
      description: 'Applied for your first opportunity',
      tier: 1,
    },
    {
      name: 'Go Getter',
      description: 'Applied for 5+ opportunities',
      tier: 1,
    },
    {
      name: 'Resume Ace',
      description: 'ATS Score above 80',
      tier: 2,
    },
    {
      name: 'Early Bird',
      description: 'Applied 7+ days before deadline',
      tier: 1,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log(`✅ ${badges.length} badges created`);

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
