import { z } from "zod";

export const projectSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  repoLink: z.string().url(),
  liveLink: z.string().url(),
  image: z.string().url(),
});

export const profileSchema = z.object({
  _id: z.string().optional(),
  profileImage: z.string().url(),
  summary: z.string().min(20, "Summary must be atleast 20 characters long!"),
});
