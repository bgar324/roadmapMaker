"use client";
import React, { useState, useEffect } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  selectedMonth: number | null;
  onSave: (data: {
    monthIndex: number;
    dayOne: string;
    dayTwo: string;
    title: string;
    description: string;
  }) => void;
}

export default function Modal({
  open,
  closeModal,
  selectedMonth,
  onSave,
}: ModalProps) {
  const [dayOne, setDayOne] = useState("");
  const [dayTwo, setDayTwo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    dayOne: false,
    dayTwo: false,
    title: false,
  });

  useEffect(() => {
    if (open) {
      setErrors({ dayOne: false, dayTwo: false, title: false });
    }
  }, [open]);

  const handleSave = () => {
    const newErrors = {
      dayOne: !dayOne.trim(),
      dayTwo: !dayTwo.trim(),
      title: !title.trim(),
    };
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }
    if (selectedMonth === null) return;
    onSave({
      monthIndex: selectedMonth,
      dayOne,
      dayTwo,
      title,
      description,
    });
    closeModal();
    setDayOne("");
    setDayTwo("");
    setTitle("");
    setDescription("");
  };

  if (!open) return null;
  const monthLabel = selectedMonth !== null ? selectedMonth + 1 : "__";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-4/5 sm:w-3/5 md:w-3/5 lg:w-2/5 h-7/20 bg-gray-800 rounded-lg shadow-lg flex flex-col p-5 relative animate-rise items">
        <div className="flex flex-col mb-3 justify-between items-left">
          <div className="text-gray-500 italic flex flex-row gap-2 bg-transparent">
            <span className="flex gap-2 flex-row items-center text-xs sm:text-sm md:text-base">
              {monthLabel} /
              <input
                id="day-one"
                className={`bg-transparent border ${
                  errors.dayOne ? "border-red-500" : "border-gray-500"
                } rounded p-1 focus:outline-none w-10 text-gray-500 italic`}
                value={dayOne}
                onChange={(e) => {
                  // Allow only numbers
                  const sanitizedValue = e.target.value.replace(/\D/g, "");
                  setDayOne(sanitizedValue);
                  setErrors((prev) => ({ ...prev, dayOne: false }));
                }}
                maxLength={2} // Optional: Limit to 2 characters for day numbers
              />
            </span>
            <span className="flex items-center">-</span>
            <span className="flex gap-2 flex-row items-center text-xs sm:text-sm md:text-base">
              {monthLabel} /
              <input
                id="day-two"
                className={`bg-transparent border ${
                  errors.dayTwo ? "border-red-500" : "border-gray-500"
                } rounded p-1 focus:outline-none w-10 text-gray-500 italic`}
                value={dayTwo}
                onChange={(e) => {
                  // Allow only numbers
                  const sanitizedValue = e.target.value.replace(/\D/g, "");
                  setDayTwo(sanitizedValue);
                  setErrors((prev) => ({ ...prev, dayTwo: false }));
                }}
                maxLength={2} // Optional: Limit to 2 characters for day numbers
              />
            </span>
            <button
              className="text-xs sm:text-sm md:text-base absolute top-3 right-3 text-gray-500 hover:text-gray-300 items-center"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          {errors.dayOne || errors.dayTwo ? (
            <p className="text-red-500 text-xs mt-2">
              Please fill in both dates
            </p>
          ) : null}
        </div>
        <div className="relative flex items-center mb-4 gap-5">
          <div className="w-[90%]">
            <label className="text-white mb-2 flex flex-row gap-1 items-center">
              <div className="flex flex-row gap-1 items-center text-xs sm:text-sm md:text-base">
                <span>Title</span>
                <span className="text-gray-500">(required)</span>
              </div>
            </label>
            <input
              className={`text-white bg-transparent border ${
                errors.title ? "border-red-500" : "border-gray-500"
              } rounded p-2 focus:outline-none w-full`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: false }));
              }}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">Please enter a title</p>
            )}
          </div>
        </div>
        <label
          className="text-white mb-2 flex flex-row gap-1 items-center"
          htmlFor="textarea-field"
        >
          <div className="flex flex-row gap-1 items-center text-xs sm:text-sm md:text-base">
            <span>Description</span>
            <span className="text-gray-500">(optional)</span>
          </div>
        </label>
        <textarea
          id="textarea-field"
          className="text-white bg-transparent border border-gray-500 rounded p-2 focus:outline-none h-32 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end text-xs sm:text-sm md:text-base">
          <button
            className="bg-[#647054] hover:bg-[#747e65] transition-all duration-300 text-white rounded p-2 px-3 mt-5 focus:outline-none"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}