"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  PenLine,
  TextCursorInput,
  MessageSquare,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { MEMORIZE_DATA } from "@/data/vstep-materials";
import { ESSAY_TEMPLATES, ESSAY_VOCABULARY } from "@/data/essay-data";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "speaking" | "writing" | "grammar" | "phrases" | "essay";

export default function MemorizePage() {
  const [activeTab, setActiveTab] = useState<Tab>("speaking");

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: "speaking",
      label: "Speaking Phrases",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-blue-500 text-white",
    },
    {
      id: "writing",
      label: "Writing Templates",
      icon: <PenLine className="w-5 h-5" />,
      color: "bg-purple-500 text-white",
    },
    {
      id: "grammar",
      label: "Grammar Patterns",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-emerald-500 text-white",
    },
    {
      id: "phrases",
      label: "Sentence Builder",
      icon: <TextCursorInput className="w-5 h-5" />,
      color: "bg-orange-500 text-white",
    },
    {
      id: "essay",
      label: "Essay Structures",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "bg-indigo-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pb-24 md:pb-20">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex min-w-0 items-center gap-2 truncate text-base font-black text-[#10B981] md:text-lg">
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">VSTEP Memorizations</span>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-5xl flex-1 mx-auto px-4 pb-6 md:p-8">
        {/* Header section */}
        <div className="mb-6 flex flex-col items-start justify-between gap-5 rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] md:mb-8 md:flex-row md:items-center md:p-10">
          <div>
            <h1 className="mb-2 text-2xl font-black leading-tight text-gray-800 md:text-3xl">
              Build Your Foundation
            </h1>
            <p className="max-w-2xl text-base font-medium text-gray-500 md:text-lg">
              Master these strict VSTEP B1 structures to guarantee basic fluency
              and structure across Speaking and Writing exams.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] text-white p-4 rounded-[16px] shadow-md hidden md:block">
            <BookOpen className="w-10 h-10" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="custom-scrollbar-x mb-6 flex gap-2 overflow-x-auto pb-4 md:mb-8 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 whitespace-nowrap flex items-center gap-2 rounded-[16px] px-4 py-3 text-sm font-black transition-all md:px-6 md:py-4 md:text-base ${
                activeTab === tab.id
                  ? `${tab.color} shadow-[0_10px_25px_rgba(0,0,0,0.08)] -translate-y-1`
                  : "bg-white text-gray-500 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:text-gray-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "speaking" && (
              <div className="space-y-6">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-gray-800 md:mb-6 md:text-2xl">
                  <MessageSquare className="text-[#3B82F6]" /> Part 1 Standard
                  Strategy
                </h2>
                {MEMORIZE_DATA.speaking_templates.map((tpl, i) => (
                  <div
                    key={i}
                    className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0_10px_25px_rgba(0,0,0,0.08)] md:p-8"
                  >
                    <h3 className="mb-5 text-lg font-black text-gray-800 md:mb-6 md:text-xl">
                      {tpl.title}
                    </h3>
                    <div className="mb-6 space-y-3 md:mb-8 md:space-y-4">
                      {tpl.structures.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-[16px] border border-blue-100 bg-blue-50/50 p-4 shadow-sm md:items-center md:gap-4 md:p-5"
                        >
                          <span className="flex-shrink-0 w-8 h-8 bg-[#3B82F6] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-base font-bold text-gray-800 md:text-lg">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[16px] border border-gray-100 border-l-4 border-l-[#3B82F6] bg-gray-50 p-4 md:p-6">
                      <div className="text-xs font-black text-[#3B82F6] uppercase tracking-wider mb-3">
                        Applied Example
                      </div>
                      <div className="font-bold text-gray-600 mb-2">
                        Q: {tpl.example.question}
                      </div>
                      <div className="whitespace-pre-line text-base font-bold leading-relaxed text-gray-800 md:text-[17px]">
                        A: {tpl.example.answer}
                      </div>
                    </div>
                  </div>
                ))}

                <h2 className="text-2xl font-black text-gray-800 mt-12 mb-6 flex items-center gap-2">
                  <MessageSquare className="text-[#3B82F6]" /> Topic Development
                  Tricks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MEMORIZE_DATA.memorization_phrases.idea_development.map(
                    (idea, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 group hover:border-[#3B82F6]/30 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="text-xs font-black text-[#3B82F6] uppercase tracking-wider mb-2">
                          {idea.type}
                        </div>
                        <div className="text-xl font-black text-gray-800 mb-4">
                          {idea.structure}
                        </div>
                        <div className="text-gray-600 font-medium italic bg-gray-50/80 p-4 rounded-[14px] border border-gray-100 leading-relaxed shadow-inner">
                          &quot;{idea.example}&quot;
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {activeTab === "writing" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Informal */}
                <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 px-5 py-2 rounded-bl-[16px] font-bold text-sm">
                    Task 1
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-[#8B5CF6] flex items-center justify-center">
                      <PenLine className="w-4 h-4" />
                    </span>{" "}
                    Informal Letter
                  </h2>

                  <div className="space-y-5">
                    <Block
                      label="Greeting"
                      content={MEMORIZE_DATA.letter_templates.informal.greeting}
                    />
                    <Block
                      label="Opening"
                      content={MEMORIZE_DATA.letter_templates.informal.opening}
                    />
                    <Block
                      label="Body"
                      content={MEMORIZE_DATA.letter_templates.informal.body}
                      highlight
                      theme="purple"
                    />
                    <Block
                      label="Ending"
                      content={MEMORIZE_DATA.letter_templates.informal.ending}
                    />
                    <Block
                      label="Sign Off"
                      content={MEMORIZE_DATA.letter_templates.informal.sign_off}
                    />
                  </div>
                </div>

                {/* Formal */}
                <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 px-5 py-2 rounded-bl-[16px] font-bold text-sm">
                    Task 1
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <PenLine className="w-4 h-4" />
                    </span>{" "}
                    Formal Letter
                  </h2>

                  <div className="space-y-5">
                    <Block
                      label="Greeting"
                      content={MEMORIZE_DATA.letter_templates.formal.greeting}
                    />
                    <Block
                      label="Opening"
                      content={MEMORIZE_DATA.letter_templates.formal.opening}
                    />
                    <Block
                      label="Body"
                      content={MEMORIZE_DATA.letter_templates.formal.body}
                      highlight
                      theme="gray"
                    />
                    <Block
                      label="Ending"
                      content={MEMORIZE_DATA.letter_templates.formal.ending}
                    />
                    <Block
                      label="Sign Off"
                      content={MEMORIZE_DATA.letter_templates.formal.sign_off}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "grammar" && (
              <div className="space-y-6">
                <div className="mb-8 p-6 bg-emerald-50 text-emerald-900 rounded-[20px] border border-emerald-200 shadow-sm flex gap-4 items-start md:items-center">
                  <div className="font-black text-3xl">💡</div>
                  <div>
                    <strong className="block text-lg mb-1">
                      VSTEP B1 Strategy:
                    </strong>
                    <span className="font-medium">
                      Simplicity is better than complexity if it is accurate.
                      Master these 3 structures before trying compound
                      sentences.
                    </span>
                  </div>
                </div>

                {MEMORIZE_DATA.grammar_patterns.map((grammar, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 transition-all hover:-translate-y-1 duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h3 className="text-2xl font-black text-gray-800">
                        {grammar.structure}
                      </h3>
                      <span className="text-sm font-bold bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-[10px] uppercase tracking-wider">
                        {grammar.description}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {grammar.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-5 rounded-[16px] font-bold text-gray-700 flex items-start gap-3 shadow-sm border border-gray-100"
                        >
                          <ChevronRight className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />{" "}
                          <span className="leading-relaxed">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "phrases" && (
              <div className="space-y-8">
                <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center">
                      <TextCursorInput className="w-4 h-4" />
                    </span>{" "}
                    Expressions for Liking
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {MEMORIZE_DATA.memorization_phrases.liking.map(
                      (phrase, i) => (
                        <div key={i} className="group relative">
                          <span className="inline-flex bg-orange-50 text-orange-700 border border-orange-200 font-bold px-5 py-3 rounded-[14px] cursor-help hover:bg-gradient-to-r hover:from-[#F97316] hover:to-[#FB923C] hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md">
                            {phrase.phrase}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-4 py-2 bg-gray-900 shadow-xl text-white text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                            {phrase.context}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center">
                      <TextCursorInput className="w-4 h-4" />
                    </span>{" "}
                    Option Evaluation Adjectives
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MEMORIZE_DATA.memorization_phrases.adjectives.map(
                      (adjGroup, i) => (
                        <div
                          key={i}
                          className={`p-6 rounded-[16px] shadow-sm border ${adjGroup.type.includes("Positive") ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}
                        >
                          <div
                            className={`font-black text-lg mb-4 uppercase tracking-wider ${adjGroup.type.includes("Positive") ? "text-emerald-700" : "text-red-700"}`}
                          >
                            {adjGroup.type}
                          </div>
                          <div className="leading-loose font-bold">
                            {adjGroup.words.split(", ").map((word, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-white text-gray-800 px-3 py-1.5 rounded-[10px] shadow-sm m-1 border border-gray-100"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 group hover:-translate-y-1 transition-transform">
                    <h3 className="text-xl font-black text-gray-800 mb-6">
                      &quot;Alone or with People&quot;
                    </h3>
                    <div className="bg-gray-50 border border-gray-100 p-5 rounded-[16px] mb-6 font-black text-[17px] text-gray-800 shadow-inner">
                      {
                        MEMORIZE_DATA.memorization_phrases
                          .alone_or_with_people[0].answer
                      }
                    </div>
                    <div className="space-y-3">
                      {MEMORIZE_DATA.memorization_phrases.alone_or_with_people[0].reasons.map(
                        (r, i) => (
                          <div
                            key={i}
                            className="flex gap-3 text-gray-600 font-medium"
                          >
                            <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />{" "}
                            <span className="leading-relaxed">{r}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 group hover:-translate-y-1 transition-transform">
                    <h3 className="text-xl font-black text-gray-800 mb-6">
                      &quot;Past vs Present&quot;
                    </h3>
                    <div className="bg-gray-50 border border-gray-100 p-5 rounded-[16px] mb-6 font-black text-[17px] text-gray-800 shadow-inner">
                      {
                        MEMORIZE_DATA.memorization_phrases.past_vs_present[0]
                          .answer
                      }
                    </div>
                    <div className="space-y-3">
                      {MEMORIZE_DATA.memorization_phrases.past_vs_present[0].reasons.map(
                        (r, i) => (
                          <div
                            key={i}
                            className="flex gap-3 text-gray-600 font-medium"
                          >
                            <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />{" "}
                            <span className="leading-relaxed">{r}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "essay" && (
              <div className="space-y-8">
                {/* Essay Templates */}
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                  <GraduationCap className="text-indigo-500" /> Essay Templates
                </h2>
                <div className="space-y-6">
                  {ESSAY_TEMPLATES.map((template, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100 group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h3 className="text-xl md:text-2xl font-black text-gray-800">
                          {template.type}
                        </h3>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-[10px] text-sm font-bold border border-indigo-100">
                          {template.usage}
                        </span>
                      </div>
                      <p className="text-gray-500 font-medium mb-6">
                        {template.description}
                      </p>

                      <div className="space-y-4">
                        {template.structure.map((struct, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-[16px] border border-gray-100 p-5"
                          >
                            <h4 className="text-indigo-600 font-black mb-3 uppercase tracking-wider text-sm">
                              {struct.section}
                            </h4>
                            <div className="space-y-2">
                              {struct.points.map((point, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex gap-3 text-gray-700 font-medium"
                                >
                                  <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    {point}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Essay Vocabulary */}
                <h2 className="text-2xl font-black text-gray-800 mt-12 mb-6 flex items-center gap-2">
                  <TextCursorInput className="text-indigo-500" /> Essential
                  Vocabulary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {ESSAY_VOCABULARY.general_linkers.map((linker, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-indigo-500"
                    >
                      <div className="text-indigo-700 font-black text-sm uppercase tracking-wider mb-3">
                        {linker.type}
                      </div>
                      <div className="leading-relaxed font-bold text-gray-700">
                        {linker.words.split(", ").map((word, wIdx) => (
                          <span
                            key={wIdx}
                            className="inline-block bg-gray-50 text-gray-800 px-3 py-1.5 rounded-[10px] mr-2 mb-2 border border-gray-200"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {ESSAY_VOCABULARY.topics.map((topicData, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100"
                    >
                      <h3 className="text-xl font-black text-gray-800 mb-6 pb-4 border-b border-gray-100">
                        {topicData.topic}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topicData.pros.length > 0 && (
                          <div className="bg-emerald-50/50 p-5 rounded-[16px] border border-emerald-100 h-full">
                            <h4 className="flex items-center gap-2 text-emerald-700 font-black mb-4">
                              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                +
                              </span>{" "}
                              Pros
                            </h4>
                            <ul className="space-y-3">
                              {topicData.pros.map((pro, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="flex gap-2 text-gray-700 font-medium leading-relaxed"
                                >
                                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />{" "}
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {topicData.cons.length > 0 && (
                          <div className="bg-red-50/50 p-5 rounded-[16px] border border-red-100 h-full">
                            <h4 className="flex items-center gap-2 text-red-700 font-black mb-4">
                              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                -
                              </span>{" "}
                              Cons
                            </h4>
                            <ul className="space-y-3">
                              {topicData.cons.map((con, cIdx) => (
                                <li
                                  key={cIdx}
                                  className="flex gap-2 text-gray-700 font-medium leading-relaxed"
                                >
                                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />{" "}
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper component to render writing letter blocks cleanly
function Block({
  label,
  content,
  highlight = false,
  theme = "purple",
}: {
  label: string;
  content: string | string[];
  highlight?: boolean;
  theme?: "purple" | "gray";
}) {
  const contentArray = Array.isArray(content) ? content : [content];

  const bgClass = highlight
    ? theme === "purple"
      ? "bg-purple-50 border-purple-200 text-purple-900 border-dashed"
      : "bg-gray-100 border-gray-300 text-gray-800 border-dashed"
    : "bg-gray-50 border-gray-100 text-gray-700";

  return (
    <div>
      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
        {label}
      </div>
      <div
        className={`p-5 rounded-[16px] border ${bgClass} shadow-sm transition-colors duration-200 hover:bg-opacity-80`}
      >
        {contentArray.map((line, i) => (
          <div
            key={i}
            className={
              i !== 0
                ? "mt-3 font-medium leading-relaxed"
                : "font-medium leading-relaxed"
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
// Temporary CheckCircle icon import since it got missed at top
import { CheckCircle } from "lucide-react";
