import { z } from "zod";

export const CustomSectionTemplateSchema = z.enum(["simple", "linkCards", "timeline", "gallery", "stats", "textBox"]);

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subheading: z.string().optional(),
  meta: z.string().optional(),
  link: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  imageUrl: z.string().optional(),
  value: z.string().optional(),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  template: CustomSectionTemplateSchema,
  items: z.array(CustomSectionItemSchema),
});

export const PortfolioThemeIdSchema = z.enum(["terminal", "vercel", "vercelDark", "material", "editorial", "studio"]);

export const SocialSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().optional(),
  tech: z.string().optional(),
});

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  meta: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  period: z.string().optional(),
  description: z.string().optional(),
});

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  meta: z.string().optional(),
});

export const PortfolioSchema = z.object({
  theme: PortfolioThemeIdSchema,
  handle: z.string(),
  showHandle: z.boolean(),
  fullName: z.string(),
  avatarUrl: z.string(),
  tagline: z.string(),
  bio: z.string(),
  enabled: z.record(z.string(), z.boolean()),
  order: z.array(z.string()),
  socials: z.array(SocialSchema),
  projects: z.array(ProjectSchema),
  blogs: z.array(BlogSchema),
  experience: z.array(ExperienceSchema),
  achievements: z.array(AchievementSchema),
  customSections: z.array(CustomSectionSchema),
  sectionColors: z.record(z.string(), z.string()),
});

export type PortfolioSchemaType = z.infer<typeof PortfolioSchema>;
