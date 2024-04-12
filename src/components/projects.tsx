/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { projectSchema } from "../../lib/schemas";
import TagsInput from "./TagsInput";
import UploadDocument from "../UI/UploadDocument";
import { useFileUploadMutation } from "../../store/apis/uploadFileApi";
import {
  useCreateProjectMutation,
  useEditProjectMutation,
} from "../../store/apis/projectsApi";

type TProjectSchema = z.infer<typeof projectSchema> & {
  _id: string;
};

type ProjectsProps = {
  editProject: TProjectSchema | undefined;
};

export default function Projects({ editProject }: ProjectsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<TProjectSchema>({
    resolver: zodResolver(projectSchema),
  });

  const [uploadFiles] = useFileUploadMutation();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isEditLoading }] =
    useEditProjectMutation();

  const [uploadDocumentKey, setUploadDocumentKey] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (editProject?._id) {
      setCollapse(true);
      setValue("_id", editProject?._id);
      setValue("title", editProject?.title);
      setValue("description", editProject?.description);
      setValue("techStack", editProject?.techStack);
      setValue("image", editProject?.image);
      setValue("liveLink", editProject?.liveLink);
      setValue("repoLink", editProject?.repoLink);
    }
  }, [editProject, setValue]);

  const handleFileChange = async (label: any, file: File | null) => {
    if (file !== null) {
      const formData = new FormData();
      formData.append("keys", JSON.stringify([label]));
      formData.append("files", file);

      try {
        const fileResponse: any = await uploadFiles(formData);
        console.log("formData--->", fileResponse);
        setValue(label, fileResponse?.data?.url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.warn("No file selected");
    }
  };

  const handleSubmitProject = async (data: TProjectSchema) => {
    if (editProject?._id) {
      try {
        const projectData = {
          ...data,
        };
        const response: any = await updateProject(projectData);
        if (response?.data?.message) {
          toast.success(response?.data?.message);
          setUploadDocumentKey((prevKey) => prevKey + 1);
          setValue("techStack", []);
          setEditMode(false);
          reset();
        }
        console.log("res--->", response);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const projectData = {
          ...data,
        };
        const response: any = await createProject(projectData);
        if (response?.data?.message) {
          toast.success(response?.data?.message);
          setUploadDocumentKey((prevKey) => prevKey + 1);
          setValue("techStack", []);
          reset();
        }
        console.log("res--->", response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitProject)}
      className={`relative bg-teal-900 max-w-2xl rounded-lg px-6 pt-6 pb-14 mx-auto space-y-4 overflow-hidden ${
        collapse === false ? "h-72" : ""
      }`}
    >
      <h1 className="text-white text-center">Project Form</h1>
      <div className="flex flex-col gap-2 relative">
        <label className="text-teal-400">Title</label>
        <input
          {...register("title")}
          type="text"
          placeholder="Enter Project name..."
          className="input input-bordered w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-[12px] absolute top-20">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 relative">
        <label className="text-teal-400">Description</label>
        <input
          {...register("description")}
          type="text"
          placeholder="Enter Project description..."
          className="input input-bordered w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-[12px] absolute top-20">
            {errors.description.message}
          </p>
        )}
      </div>
      {collapse === false ? (
        <div className="bg-teal-600 absolute bottom-0 left-0 w-full z-30 flex justify-center py-1">
          <button
            onClick={() => setCollapse(true)}
            type="button"
            className="bg-gray-800 text-white rounded-full p-1.5 animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="bg-teal-600 absolute bottom-0 left-0 w-full z-30 flex justify-center py-1">
          <button
            onClick={() => setCollapse(false)}
            type="button"
            className="bg-gray-800 text-white rounded-full p-1.5 animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </div>
      )}
      {collapse && (
        <>
          <div className="flex flex-col gap-2 relative">
            <label className="text-teal-400">Tech Stack</label>
            <TagsInput
              value={getValues("techStack")}
              placeholder="Enter tags, separated by a comma"
              onChange={(tags: string[]) => {
                setValue("techStack", tags);
              }}
            />
            {errors.techStack && (
              <p className="text-red-500 text-[12px] absolute top-20">
                {errors.techStack.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <label className="text-teal-400">Repository Link</label>
            <input
              {...register("repoLink")}
              type="text"
              placeholder="Paste project repository link"
              className="input input-bordered w-full"
            />
            {errors.repoLink && (
              <p className="text-red-500 text-[12px] absolute top-20">
                {errors.repoLink.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <label className="text-teal-400">Live Link</label>
            <input
              {...register("liveLink")}
              type="text"
              placeholder="Paste project live link"
              className="input input-bordered w-full"
            />
            {errors.liveLink && (
              <p className="text-red-500 text-[12px] absolute top-20">
                {errors.liveLink.message}
              </p>
            )}
          </div>
          <div>
            {!editProject?._id || editMode ? (
              <UploadDocument
                key={uploadDocumentKey}
                label="Project Image"
                allowedTypes={["jpg", "png"]}
                required
                width="xxxl"
                height="xl"
                onFileChange={(file) => handleFileChange("image", file)}
              />
            ) : (
              <div className="relative w-96 h-44 space-y-2">
                <MdEdit
                  onClick={() => setEditMode(true)}
                  size={20}
                  className="absolute top-8 right-0 bg-white hover:bg-black hover:text-white cursor-pointer rounded-full"
                />
                <label className="text-cyan-400">Project Image</label>
                <img
                  src={editProject?.image}
                  alt={editProject?.title}
                  className="w-96 h-44 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-info">
              {isLoading || isEditLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
