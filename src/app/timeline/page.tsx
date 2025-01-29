"use client";
import React, { useState, useEffect } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faEye,
  faDownload,
  faPencil,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";
import Modal from "./component/modal";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BasicTimeline() {
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [monthEvents, setMonthEvents] = useState<
    Record<
      number,
      { dayOne: string; dayTwo: string; title: string; description: string }[]
    >
  >({});
  const [name, setName] = useState("");

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setSelectedMonth(null);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleMonthClick = (index: number) => {
    if (!editing) return;
    setSelectedMonth(index);
  };

  const handleSave = (payload: {
    monthIndex: number;
    dayOne: string;
    dayTwo: string;
    title: string;
    description: string;
  }) => {
    setMonthEvents((prev) => {
      const existing = prev[payload.monthIndex] || [];
      return {
        ...prev,
        [payload.monthIndex]: [
          ...existing,
          {
            dayOne: payload.dayOne,
            dayTwo: payload.dayTwo,
            title: payload.title,
            description: payload.description,
          },
        ],
      };
    });
  };

  return (
    <div className="mx-0 flex flex-col justify-center items-center min-h-screen pb-3">
      <div className="bg-customBg sticky top-0 z-50 h-auto w-full py-3 px-5 border-b-2 border-customBg mb-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center text-white">
            <a
              className="border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer"
              href="/"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="text-xs sm:text-sm md:text-base"
              />
            </a>
            <div className="inline-flex items-center">
              <input
                type="text"
                className="bg-customBg text-white text-xs sm:text-sm md:text-base focus:outline-none p-0 m-0"
                size={Math.max(name.length-3, 10)}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="text-xs sm:text-sm md:text-base p-0 m-0">
                ’s 2025 Roadmap
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center text-white">
            <span
              className={
                editing
                  ? "border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer"
                  : "hidden"
              }
              onClick={openModal}
            >
              <FontAwesomeIcon
                icon={faCheck}
                className="text-xs sm:text-sm md:text-base"
              />
            </span>
            <span
              className="border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer"
              onClick={toggleEditing}
            >
              <FontAwesomeIcon
                icon={editing ? faEye : faPencil}
                className="text-xs sm:text-sm md:text-base"
              />
            </span>
            <span className="border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer">
              <FontAwesomeIcon
                icon={faDownload}
                className="text-xs sm:text-sm md:text-base"
              />
            </span>
          </div>
        </div>
      </div>
      <Timeline position="alternate" className="w-full max-w-xs">
        {months.map((month, index) => (
          <TimelineItem
            key={index}
            onClick={() => handleMonthClick(index)}
            className={
              editing
                ? selectedMonth === index
                  ? "group scale-105 cursor-pointer transition duration-300"
                  : "group hover:scale-105 hover:cursor-pointer transition duration-300"
                : ""
            }
          >
            <TimelineSeparator>
              <TimelineDot color="grey" className="m-0" />
              {index < months.length && (
                <TimelineConnector className="h-60 m-0 p-0" />
              )}
            </TimelineSeparator>
            <TimelineContent className="font-[CabinetGrotesk-Variable]">
              <div
                className={`-mt-2 font-[CabinetGrotesk-Variable] text-lg ${
                  editing && selectedMonth === index
                    ? "text-blue-300 font-semibold"
                    : ""
                }`}
              >
                {month}
              </div>
              
              <div
                className={`absolute flex ${
                  index % 2 === 0 ? "-left-4 sm:-left-14 md:-left-18" : "-right-4 sm:-right-14 md:-right-18"
                }`}
              >
                <div className="space-y-4">
                  {monthEvents[index]?.map((evt, i) => (
                    <div
                      key={i}
                      className={`bg-gray-800 p-3 rounded text-white w-36 sm:w-36 md:w-48 h-auto flex flex-col ${index % 2 === 0 ? "text-right" : "text-left"}`}
                    >
                      <div className="text-xs md:text-sm text-gray-500 italic mb-1">
                        {months[index]} {evt.dayOne} - {months[index]}{" "} {evt.dayTwo}
                      </div>
                      <div className="font-semibold text-sm md:text-base">{evt.title}</div>
                      <div className="text-xs md:text-sm mt-1">{evt.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Modal
        open={modalOpen}
        closeModal={closeModal}
        selectedMonth={selectedMonth}
        onSave={handleSave}
      />
    </div>
  );
}
