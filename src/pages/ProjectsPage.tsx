import { useState } from "react";

import Layout from "../components/layout";
import ProjectList from "../components/projectList";
import Projects from "../components/projects";
import { TProjectSchema } from "../components/projectList";

export default function ProjectsPage() {
  const [editProject, setEditProject] = useState<TProjectSchema | undefined>();

  const handleEditProject = (project: TProjectSchema) => {
    setEditProject(project);
  };

  return (
    <Layout>
      <Projects editProject={editProject} />
      <ProjectList onEditProject={handleEditProject} />
    </Layout>
  );
}
