import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";

interface TagsInputProps {
  value?: string[];
  label?: string;
  placeholder: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({
  placeholder,
  onChange,
  value,
}) => {
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = (tag: string) => {
    if (tag !== "" && !tags?.includes(tag)) {
      setTags([...tags, tag]);
      onChange([...tags, tag]);
      setTagInput("");
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ",") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (value) {
      setTags(value);
    }
  }, [value]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={tagInput}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="input input-bordered w-full"
      />
      <div>
        {tags &&
          tags?.map((tag, index) => (
            <div
              className="m-1 inline-block rounded-lg bg-gray-400 p-1"
              key={index.toString()}
            >
              <span className="bg-gray-400 text-white">{tag}</span>
              <span
                className="mx-3 cursor-pointer font-extrabold text-white text-sm"
                onClick={() => removeTag(tag)}
              >
                X
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TagsInput;
