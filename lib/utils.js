import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, mappings } from "@/constants";

// Utility to combine and merge Tailwind CSS class names
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Base URL for fetching tech icons
const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// Normalize tech name (e.g., "React.js" => "react")
const normalizeTechName = (tech) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key];
};

// Check if a tech icon exists at the given URL
const checkIconExists = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

// Get an array of tech logos with fallback
export const getTechLogos = async (techArray) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

// Get a random interview cover path
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
