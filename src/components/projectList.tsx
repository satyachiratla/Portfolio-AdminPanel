import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "../../store/apis/projectsApi";

import { projectSchema } from "../../lib/schemas";
import { z } from "zod";

export type TProjectSchema = z.infer<typeof projectSchema> & {
  _id: string;
};

type ProjectListProps = {
  onEditProject: (project: TProjectSchema) => void;
};

export default function ProjectList({ onEditProject }: ProjectListProps) {
  const { data } = useGetProjectsQuery({});
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const handleClickEditProject = (project: TProjectSchema) => {
    onEditProject(project);
  };

  return (
    <ul className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
      {data?.map((project: TProjectSchema) => (
        <li key={project?.liveLink} className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img
              src={project?.image}
              alt={project?.title}
              className="w-96 h-44 object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {project?.title}
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p className=" text-cyan-700 text-sm">{project?.description}</p>
            <ul className="card-actions justify-end">
              {project?.techStack?.map((stack) => (
                <li className="badge badge-outline">{stack}</li>
              ))}
            </ul>
            <div>
              <p className="link link-hover link-info">{project?.liveLink}</p>
              <p className="link link-hover link-primary">
                {project?.repoLink}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4 mb-4 mr-4">
            <button
              className="btn btn-success"
              onClick={() => handleClickEditProject(project)}
            >
              Edit
            </button>
            <button
              className="btn btn-error"
              onClick={() => deleteProject(project?._id)}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
