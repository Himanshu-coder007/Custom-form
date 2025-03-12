import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Question from "./Question";
import { FaGripVertical } from "react-icons/fa"; // Import a drag handle icon

const SortableQuestion = ({ question, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 text-gray-400 hover:text-gray-600"
      >
        <FaGripVertical />
      </div>

      {/* Question Component */}
      <Question question={question} {...props} />
    </div>
  );
};

export default SortableQuestion;