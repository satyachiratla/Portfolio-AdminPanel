/* eslint-disable no-unused-vars */
import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdCancel } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface UploadDocumentProps {
  key?: number;
  label: string;
  value?: string;
  allowedTypes?: string[];
  setValue?: (label: string, value: string) => void;
  onFileChange?: (file: File | null) => void;
  required?: boolean;
  height?: string;
  width?: string;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  key,
  label,
  value,
  setValue,
  allowedTypes = ["jpg", "png", "pdf"],
  onFileChange,
  required,
  width,
  height,
}) => {
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const widthVariants: Record<string, string> = {
    sm: "w-16",
    md: "w-24",
    lg: "w-36",
    xl: "w-44",
    xxl: "w-56",
    xxxl: "w-80",
  };

  const heightVariants: Record<string, string> = {
    sm: "h-16",
    md: "h-24",
    lg: "h-36",
    xl: "h-44",
    xxl: "h-56",
    xxxl: "h-80",
  };

  const widthClass = width ? widthVariants[width] : "";
  const heightClass = height ? heightVariants[height] : "";

  const maxSizeInBytes = 5 * 1024 * 1024;

  const formattedTypes = allowedTypes
    .map((type) => type.toUpperCase())
    .join(", ");

  let renderedTypes;

  if (allowedTypes.length === 2) {
    renderedTypes = formattedTypes.replace(/,/, " or");
  } else if (allowedTypes.length > 2) {
    const lastCommaIndex = formattedTypes.lastIndexOf(",");
    renderedTypes =
      formattedTypes.substring(0, lastCommaIndex) +
      " or" +
      formattedTypes.substring(lastCommaIndex + 1);
  } else {
    renderedTypes = formattedTypes;
  }

  useEffect(() => {
    setError("");
    setIsDragging(false);
  }, [key]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = (event.target.files ?? [])[0];
    onFileChange!(selectedFile);
    handleFiles(selectedFile);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const selectedFile = event.dataTransfer.files?.[0] || null;
    onFileChange!(selectedFile);
    handleFiles(selectedFile);
  };

  const handleFiles = (file: File | null) => {
    if (file) {
      const fileType = (file.name.split(".").pop() || "").toLowerCase();

      if (file.size > maxSizeInBytes) {
        setError(`File size exceeds the limit of 5 MB.`);
        setPreview(null);
        setFileName(null);
        return;
      }

      if (allowedTypes.includes(fileType)) {
        setError("");
        setFileName(file.name);
        if (fileType === "jpg" || fileType === "png") {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (fileType === "pdf") {
          setPreview(URL.createObjectURL(file));
        } else {
          setPreview(null);
        }
      } else {
        setError(
          `${fileType.toUpperCase()} files are not allowed. Please upload ${allowedTypes.join(
            "/"
          )} files.`
        );
        setPreview(null);
        setFileName(null);
      }
    }
  };

  //   console.log("preview--->", preview);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleResetFile = () => {
    setPreview(null);
    setValue!(value!, "");
  };

  return (
    <div className="space-y-2">
      <label className="font-medium text-teal-400">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {!preview && (
        <div
          className={`border-2 border-gray-300 border-dashed rounded-md p-2 px-4 w-[380px] h-16 2xl:w-[400px] 2xl:h-20 flex items-center justify-between cursor-pointer ${
            isDragging ? "bg-blue-100" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <FiUploadCloud size={30} className="text-gray-500" />
          <div className="space-y-1">
            <p className="text-[12px] text-white">
              Select a file or drag and drop here
            </p>
            <p className="text-[10px] text-white">
              {renderedTypes}, file size no more than 10mb
            </p>
          </div>
          <button
            type="button"
            className="border border-blue-400 text-blue-400 p-2 text-[10px] rounded"
          >
            SELECT FILE
          </button>
          <input
            type="file"
            accept={allowedTypes.map((type) => `.${type}`).join(",")}
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      )}
      {preview && (
        <div className="mt-2">
          {preview.startsWith("data:image") ? (
            <div>
              <div className={`relative ${widthClass} ${heightClass}`}>
                <img
                  src={preview}
                  alt="Document Preview"
                  className={`border border-slate-300 rounded-lg ${widthClass} ${heightClass}`}
                />
                <MdCancel
                  onClick={handleResetFile}
                  size={20}
                  className="absolute -top-1 -right-1 text-red-500 cursor-pointer rounded-full"
                />
              </div>
              <p className="text-[12px]">{fileName}</p>
            </div>
          ) : (
            <div>
              <div className={`relative ${widthClass} ${heightClass}`}>
                <Document
                  file={preview}
                  className="relative"
                  loading="Loading..."
                >
                  <Page
                    pageNumber={1}
                    width={50}
                    height={50}
                    renderMode="canvas"
                  />
                  <MdCancel
                    onClick={handleResetFile}
                    size={20}
                    className="absolute -top-1 -right-1 text-red-500 cursor-pointer rounded-full"
                  />
                </Document>
              </div>
              <p className="text-[12px]">{fileName}</p>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-[11px] w-[250px]">{error}</p>}
    </div>
  );
};

export default UploadDocument;
