"use client";
import React, { useState, useEffect, useRef } from "react";
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
import Modal from "./modal";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs;

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
  function handleDownloadPDF() {
    // 1. Build an array of text blocks that will go into the PDF content.
    //    We will loop through *all* months from 0 to months.length - 1.
    const timelineBlocks: any[] = [];
  
    for (let i = 0; i < months.length; i++) {
      const monthName = months[i];
  
      // Always push the "month header"
      timelineBlocks.push({
        text: monthName,
        style: "monthHeader",
        margin: [0, 10, 0, 5],
      });
  
      // Safely retrieve this month's events (if none, default to empty array).
      const events = monthEvents[i] || [];
  
      if (events.length === 0) {
        // If there are NO events for this month, show "No events."
        timelineBlocks.push({
          text: "No events",
          italics: true,
          margin: [0, 0, 0, 10],
        });
      } else {
        // If there ARE events, list them out:
        events.forEach((evt: any) => {
          const dateRange = `${monthName} ${evt.dayOne} - ${monthName} ${evt.dayTwo}`;
  
          timelineBlocks.push({
            text: [
              // Date range in italics
              { text: `\n${dateRange}\n`, style: "dateRange" },
              // Title in bold
              { text: `Title: ${evt.title}\n`, bold: true },
              // Description in normal text
              { text: `Description: ${evt.description}\n` },
            ],
            margin: [0, 0, 0, 10],
          });
        });
      }
    }
  
    // 2. Create the pdfmake docDefinition
    const docDefinition: TDocumentDefinitions = {
      // Optional styling references
      styles: {
        title: {
          fontSize: 16,
          bold: true,
        },
        monthHeader: {
          fontSize: 14,
          bold: true,
        },
        dateRange: {
          italics: true,
        },
      },
      content: [
        // Top-level title includes user name
        {
          text: `${name || "Your"} 2025 Roadmap`,
          style: "title",
          margin: [0, 0, 0, 10],
        },
        ...timelineBlocks,
        // Add a line at the bottom
        {
          text: "\nMade with love, Ben",
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
      ],
    };
  
    // 3. Generate and download the PDF
    pdfMake.createPdf(docDefinition).download("timeline.pdf");
  }
  
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
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hiddenSpanRef.current && inputRef.current) {
      // Get the width of the hidden span content
      const width = hiddenSpanRef.current.offsetWidth;
      // Apply the width to the input, with a minimum width
      inputRef.current.style.width = `${Math.max(width, 80)}px`;
    }
  }, [name]);

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
            {/* <a
              className="border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer"
              href="/"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="text-xs sm:text-sm md:text-base"
              />
            </a> */}

            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                className="bg-customBg text-white text-xs sm:text-sm md:text-base border-collapse focus:outline-none p-0 m-0 inline-block"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ minWidth: "80px" }} // Minimum width when empty
              />
              {/* Hidden span for measuring text width */}
              <span
                ref={hiddenSpanRef}
                className="text-xs sm:text-sm md:text-base absolute left-[-9999px] invisible whitespace-pre"
              >
                {name || "Your Name"}
              </span>
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
            <span className="border rounded-full py-0 px-1.5 sm:py-1 sm:px-2 md:py-2 md:px-3 hover:bg-zinc-800 hover:cursor-pointer"
              onClick={handleDownloadPDF} // <--- ADD THIS
              >
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
                  index % 2 === 0
                    ? "-left-4 sm:-left-14 md:-left-18"
                    : "-right-4 sm:-right-14 md:-right-18"
                }`}
              >
                <div className="space-y-4">
                  {monthEvents[index]?.map((evt, i) => (
                    <div
                      key={i}
                      className={`bg-gray-800 p-3 rounded text-white w-36 sm:w-36 md:w-48 h-auto flex flex-col ${
                        index % 2 === 0 ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="text-xs md:text-sm text-gray-500 italic mb-1">
                        {months[index]} {evt.dayOne} - {months[index]}{" "}
                        {evt.dayTwo}
                      </div>
                      <div className="font-semibold text-sm md:text-base">
                        {evt.title}
                      </div>
                      <div className="text-xs md:text-sm mt-1">
                        {evt.description}
                      </div>
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
