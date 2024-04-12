/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useFileUploadMutation } from "../../store/apis/uploadFileApi";
import UploadDocument from "../UI/UploadDocument";
import { profileSchema } from "../../lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProfileMutation } from "../../store/apis/profileApi";
import toast from "react-hot-toast";

type TProfileSchema = z.infer<typeof profileSchema>;

export default function Profile() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  const [uploadFiles] = useFileUploadMutation();
  const [updateProfile, { isLoading }] = useEditProfileMutation();
  const [uploadDocumentKey, setUploadDocumentKey] = useState(0);

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

  const handleSubmitProfile = async (data: TProfileSchema) => {
    try {
      const profileData = {
        _id: "661910c721b44d77a96d6442",
        ...data,
      };

      const response: any = await updateProfile(profileData);
      if (response?.data?.message) {
        toast.success(response?.data?.message);
        setUploadDocumentKey((prevKey) => prevKey + 1);
        reset();
      }
      console.log("res---?", response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-20 max-w-lg mx-auto">
      <form onSubmit={handleSubmit(handleSubmitProfile)} className="space-y-4">
        <UploadDocument
          key={uploadDocumentKey}
          label="Update Profile Picture"
          width="lg"
          height="lg"
          allowedTypes={["jpg", "png"]}
          onFileChange={(file) => handleFileChange("profileImage", file)}
        />
        <div className="relative flex flex-col gap-2">
          <label className="text-teal-400">Update Profile Summary</label>
          <textarea
            {...register("summary")}
            rows={5}
            cols={5}
            className="input input-bordered h-40 p-2"
          />
          {errors.summary && (
            <p className="text-red-500 text-[12px] absolute bottom-[50px]">
              {errors.summary.message}
            </p>
          )}
          <button type="submit" className="btn btn-info mt-4">
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
