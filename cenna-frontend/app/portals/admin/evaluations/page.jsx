"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaFilePdf,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

import { fetchTeachers } from "@/store/teacherSlice";
import { fetchClasses } from "@/store/classSlice";
import { fetchUsers } from "@/store/userSlice";

import {
  fetchTemplates,
  createTemplate,
  deleteTemplate,
  publishTemplate,
  archiveTemplate,
  addSection,
  deleteSection,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  deleteOption,
  setCurrentTemplate,
  fetchAssignments,
  createAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment,
  fetchResponses,
  fetchResponsesByAssignment,
  fetchTeacherResponses,
  reviewResponse,
  deleteResponse,
  fetchTeacherReport,
} from "@/store/evaluationSlice";

import {
  downloadBlankTemplatePdf,
} from "@/services/evaluationTemplateService";
import { downloadFilledResponsePdf } from "@/services/evaluationResponseService";

import PageLoader from "@/components/ui/PageLoader";

const templateTypes = [
  { value: "blank", label: "Blank" },
  { value: "teacher-observation", label: "Teacher Observation" },
  { value: "teacher-demo", label: "Teacher Demo" },
  { value: "student-observation", label: "Student Observation" },
];

const targetRoleOptions = ["student", "parent", "teacher", "coordinator"];

const initialTemplateForm = {
  title: "",
  description: "",
  templateType: "blank",
  targetRoles: [],
};

const initialAssignmentForm = {
  title: "",
  template: "",
  targetRole: "student",
  assignedClasses: [],
  assignedTeachers: [],
  assignedUsers: [],
  startDate: "",
  dueDate: "",
  allowMultipleResponses: false,
};

export default function AdminEvaluationsPage() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("templates");
  const [pendingAssignTemplateId, setPendingAssignTemplateId] = useState(null);

  const { teachers } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);
  const { users } = useSelector((state) => state.users);

  const {
    templates,
    templateStatus,
    templateError,
    currentTemplate,
    assignments,
    assignmentStatus,
    assignmentError,
    responses,
    responsesStatus,
    responsesError,
    teacherReport,
    teacherReportStatus,
  } = useSelector((state) => state.evaluations);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchAssignments());
    dispatch(fetchResponses());
    dispatch(fetchTeachers());
    dispatch(fetchClasses());
  }, [dispatch]);

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Evaluations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Build evaluation templates, assign them, and review responses.
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {["templates", "assignments", "responses"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`!cursor-pointer rounded-xl px-5 py-3 font-bold capitalize ${
              tab === key
                ? "bg-black text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {tab === "templates" && (
        <TemplatesTab
          templates={templates}
          status={templateStatus}
          error={templateError}
          currentTemplate={currentTemplate}
          onAssignTemplate={(templateId) => {
            setPendingAssignTemplateId(templateId);
            setTab("assignments");
          }}
        />
      )}

      {tab === "assignments" && (
        <AssignmentsTab
          assignments={assignments}
          status={assignmentStatus}
          error={assignmentError}
          templates={templates}
          teachers={teachers}
          classes={classes}
          users={users}
          pendingAssignTemplateId={pendingAssignTemplateId}
          onConsumePendingAssignTemplate={() =>
            setPendingAssignTemplateId(null)
          }
          onTargetRoleChange={(role) => {
            if (role === "parent" || role === "coordinator") {
              dispatch(fetchUsers(role));
            }
          }}
          onViewResponses={(assignmentId) => {
            dispatch(fetchResponsesByAssignment(assignmentId));
            setTab("responses");
          }}
        />
      )}

      {tab === "responses" && (
        <ResponsesTab
          responses={responses}
          status={responsesStatus}
          error={responsesError}
          assignments={assignments}
          teachers={teachers}
          teacherReport={teacherReport}
          teacherReportStatus={teacherReportStatus}
        />
      )}
    </section>
  );
}

function TemplatesTab({
    templates,
    status,
    error,
    currentTemplate,
    onAssignTemplate,
  }) {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialTemplateForm);

    const filtered = useMemo(() => {
      const value = search.toLowerCase().trim();
      if (!value) return templates;

      return templates.filter((t) => t.title?.toLowerCase().includes(value));
    }, [templates, search]);

    const toggleTargetRole = (role) => {
      setForm((prev) => ({
        ...prev,
        targetRoles: prev.targetRoles.includes(role)
          ? prev.targetRoles.filter((r) => r !== role)
          : [...prev.targetRoles, role],
      }));
    };

    const handleCreate = async (e) => {
      e.preventDefault();

      if (!form.title.trim()) {
        toast.error("Template title is required");
        return;
      }

      try {
        await dispatch(createTemplate(form)).unwrap();
        toast.success("Template created");
        setForm(initialTemplateForm);
        setShowModal(false);
      } catch (err) {
        toast.error(err || "Failed to create template");
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Delete this template?")) return;

      try {
        await dispatch(deleteTemplate(id)).unwrap();
        toast.success("Template deleted");
      } catch (err) {
        toast.error(err || "Failed to delete template");
      }
    };

    const handlePublish = async (id) => {
      try {
        await dispatch(publishTemplate(id)).unwrap();
        toast.success("Template published");
      } catch (err) {
        toast.error(err || "Failed to publish template");
      }
    };

    const handleArchive = async (id) => {
      try {
        await dispatch(archiveTemplate(id)).unwrap();
        toast.success("Template archived");
      } catch (err) {
        toast.error(err || "Failed to archive template");
      }
    };

    const handlePrintBlank = async (id) => {
      try {
        await downloadBlankTemplatePdf(id);
      } catch (err) {
        toast.error("Failed to generate PDF");
      }
    };

    if (status === "loading" && templates.length === 0) {
      return <PageLoader text="Loading templates..." />;
    }

    return (
      <div>
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
          Publishing a template only makes the form usable — it does not send
          it to anyone. Click <span className="font-extrabold">Assign</span>{" "}
          on a published template to target specific coordinators, students
          (by class), or teachers, then publish that assignment. Only
          published assignments show up for the target role.
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black md:max-w-sm"
          />

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex !cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
          >
            <FaPlus /> New Template
          </button>
        </div>

        <div className="mb-8 overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4 text-left">Title</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4 text-left">Target Roles</th>
                <th className="px-4 py-4">Sections</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((template, index) => (
                  <tr key={template._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {template.title}
                    </td>

                    <td className="px-4 py-4 text-center capitalize">
                      {template.templateType}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {(template.targetRoles || []).join(", ") || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {template.sections?.length || 0}
                    </td>

                    <td className="px-4 py-4 text-center font-bold capitalize">
                      {template.status}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              setCurrentTemplate(
                                currentTemplate?._id === template._id
                                  ? null
                                  : template
                              )
                            )
                          }
                          className="!cursor-pointer rounded-lg bg-gray-800 px-3 py-2 text-xs font-bold text-white"
                        >
                          {currentTemplate?._id === template._id
                            ? "Close Builder"
                            : "Edit"}
                        </button>

                        {template.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => handlePublish(template._id)}
                            className="!cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Publish
                          </button>
                        )}

                        {template.status === "published" && (
                          <button
                            type="button"
                            onClick={() => onAssignTemplate(template._id)}
                            className="!cursor-pointer rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Assign
                          </button>
                        )}

                        {template.status !== "archived" && (
                          <button
                            type="button"
                            onClick={() => handleArchive(template._id)}
                            className="!cursor-pointer rounded-lg bg-yellow-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Archive
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handlePrintBlank(template._id)}
                          className="!cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          <FaFilePdf />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(template._id)}
                          className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {currentTemplate && <TemplateBuilder template={currentTemplate} />}

        {showModal && (
          <Modal title="New Template" onClose={() => setShowModal(false)}>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <Select
                label="Template Type"
                value={form.templateType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, templateType: e.target.value }))
                }
              >
                {templateTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Target Roles
                </label>

                <div className="flex flex-wrap gap-2">
                  {targetRoleOptions.map((role) => (
                    <label
                      key={role}
                      className={`!cursor-pointer rounded-xl px-4 py-2 text-sm font-bold capitalize ${
                        form.targetRoles.includes(role)
                          ? "bg-black text-white"
                          : "border bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.targetRoles.includes(role)}
                        onChange={() => toggleTargetRole(role)}
                        className="hidden"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
              >
                Create Template
              </button>
            </form>
          </Modal>
        )}
      </div>
    );
  }

  function TemplateBuilder({ template }) {
    const dispatch = useDispatch();
    const [sectionForm, setSectionForm] = useState({
      title: "",
      description: "",
    });

    const [questionForms, setQuestionForms] = useState({});
    const [optionInputs, setOptionInputs] = useState({});

    const getQuestionForm = (sectionId) =>
      questionForms[sectionId] || {
        question: "",
        type: "mcq",
        required: true,
        options: "",
      };

    const handleAddSection = async (e) => {
      e.preventDefault();

      if (!sectionForm.title.trim()) {
        toast.error("Section title is required");
        return;
      }

      try {
        await dispatch(
          addSection({ templateId: template._id, data: sectionForm })
        ).unwrap();
        setSectionForm({ title: "", description: "" });
      } catch (err) {
        toast.error(err || "Failed to add section");
      }
    };

    const handleDeleteSection = async (sectionId) => {
      if (!window.confirm("Delete this section and all its questions?"))
        return;

      try {
        await dispatch(
          deleteSection({ templateId: template._id, sectionId })
        ).unwrap();
      } catch (err) {
        toast.error(err || "Failed to delete section");
      }
    };

    const handleAddQuestion = async (e, sectionId) => {
      e.preventDefault();

      const form = getQuestionForm(sectionId);

      if (!form.question.trim()) {
        toast.error("Question text is required");
        return;
      }

      try {
        await dispatch(
          addQuestion({
            templateId: template._id,
            sectionId,
            data: {
              question: form.question,
              type: form.type,
              required: form.required,
              options:
                form.type === "mcq"
                  ? form.options
                      .split(",")
                      .map((o) => o.trim())
                      .filter(Boolean)
                  : [],
            },
          })
        ).unwrap();

        setQuestionForms((prev) => ({
          ...prev,
          [sectionId]: { question: "", type: "mcq", required: true, options: "" },
        }));
      } catch (err) {
        toast.error(err || "Failed to add question");
      }
    };

    const handleDeleteQuestion = async (sectionId, questionId) => {
      if (!window.confirm("Delete this question?")) return;

      try {
        await dispatch(
          deleteQuestion({ templateId: template._id, sectionId, questionId })
        ).unwrap();
      } catch (err) {
        toast.error(err || "Failed to delete question");
      }
    };

    const handleToggleRequired = async (sectionId, question) => {
      try {
        await dispatch(
          updateQuestion({
            templateId: template._id,
            sectionId,
            questionId: question._id,
            data: { required: !question.required },
          })
        ).unwrap();
      } catch (err) {
        toast.error(err || "Failed to update question");
      }
    };

    const handleAddOption = async (sectionId, questionId) => {
      const text = (optionInputs[questionId] || "").trim();

      if (!text) return;

      try {
        await dispatch(
          addOption({ templateId: template._id, sectionId, questionId, text })
        ).unwrap();
        setOptionInputs((prev) => ({ ...prev, [questionId]: "" }));
      } catch (err) {
        toast.error(err || "Failed to add option");
      }
    };

    const handleDeleteOption = async (sectionId, questionId, optionIndex) => {
      try {
        await dispatch(
          deleteOption({
            templateId: template._id,
            sectionId,
            questionId,
            optionIndex,
          })
        ).unwrap();
      } catch (err) {
        toast.error(err || "Failed to delete option");
      }
    };

    return (
      <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold">
          Building: {template.title}
        </h2>

        <div className="space-y-5">
          {(template.sections || []).map((section) => (
            <div key={section._id} className="rounded-2xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-black">
                  {section.title}
                </h3>

                <button
                  type="button"
                  onClick={() => handleDeleteSection(section._id)}
                  className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="mb-4 space-y-3">
                {section.questions.map((question) => (
                  <div
                    key={question._id}
                    className="rounded-xl bg-gray-50 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-black">
                        {question.question}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          ({question.type})
                        </span>
                      </p>

                      <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-1 text-xs font-bold text-gray-600">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={() =>
                              handleToggleRequired(section._id, question)
                            }
                          />
                          Required
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteQuestion(section._id, question._id)
                          }
                          className="!cursor-pointer rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {question.type === "mcq" && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {question.options.map((option, optionIndex) => (
                            <span
                              key={option._id || optionIndex}
                              className="flex items-center gap-1 rounded-lg border bg-white px-3 py-1 text-xs font-bold"
                            >
                              {option.text}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteOption(
                                    section._id,
                                    question._id,
                                    optionIndex
                                  )
                                }
                                className="!cursor-pointer text-red-500"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 flex gap-2">
                          <input
                            value={optionInputs[question._id] || ""}
                            onChange={(e) =>
                              setOptionInputs((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                            placeholder="Option value (e.g. 0, 1, 2, 3)"
                            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleAddOption(section._id, question._id)
                            }
                            className="!cursor-pointer rounded-lg bg-black px-3 py-2 text-xs font-bold text-white"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Tip: use numeric option values (0, 1, 2, 3) so
                          scoring works correctly.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => handleAddQuestion(e, section._id)}
                className="grid gap-3 rounded-xl border border-dashed p-3 md:grid-cols-4"
              >
                <input
                  value={getQuestionForm(section._id).question}
                  onChange={(e) =>
                    setQuestionForms((prev) => ({
                      ...prev,
                      [section._id]: {
                        ...getQuestionForm(section._id),
                        question: e.target.value,
                      },
                    }))
                  }
                  placeholder="Question text"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black md:col-span-2"
                />

                <select
                  value={getQuestionForm(section._id).type}
                  onChange={(e) =>
                    setQuestionForms((prev) => ({
                      ...prev,
                      [section._id]: {
                        ...getQuestionForm(section._id),
                        type: e.target.value,
                      },
                    }))
                  }
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                >
                  <option value="mcq">MCQ</option>
                  <option value="short-answer">Short Answer</option>
                </select>

                {getQuestionForm(section._id).type === "mcq" ? (
                  <input
                    value={getQuestionForm(section._id).options}
                    onChange={(e) =>
                      setQuestionForms((prev) => ({
                        ...prev,
                        [section._id]: {
                          ...getQuestionForm(section._id),
                          options: e.target.value,
                        },
                      }))
                    }
                    placeholder="Options, comma separated (0,1,2,3)"
                    className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                  />
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  className="!cursor-pointer rounded-lg bg-black px-3 py-2 text-xs font-bold text-white md:col-span-4"
                >
                  Add Question
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddSection}
          className="mt-5 grid gap-3 rounded-xl border border-dashed p-3 md:grid-cols-3"
        >
          <input
            value={sectionForm.title}
            onChange={(e) =>
              setSectionForm((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="Section title"
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          />

          <input
            value={sectionForm.description}
            onChange={(e) =>
              setSectionForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Section description (optional)"
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          />

          <button
            type="submit"
            className="!cursor-pointer rounded-lg bg-black px-3 py-2 text-xs font-bold text-white"
          >
            Add Section
          </button>
        </form>
      </div>
    );
  }

  function AssignmentsTab({
    assignments,
    status,
    error,
    templates,
    teachers,
    classes,
    users,
    pendingAssignTemplateId,
    onConsumePendingAssignTemplate,
    onTargetRoleChange,
    onViewResponses,
  }) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async (id) => {
      if (!window.confirm("Delete this assignment?")) return;

      try {
        await dispatch(deleteAssignment(id)).unwrap();
        toast.success("Assignment deleted");
      } catch (err) {
        toast.error(err || "Failed to delete assignment");
      }
    };

    const handlePublish = async (id) => {
      try {
        await dispatch(publishAssignment(id)).unwrap();
        toast.success("Assignment published");
      } catch (err) {
        toast.error(err || "Failed to publish assignment");
      }
    };

    const handleClose = async (id) => {
      if (!window.confirm("Close this assignment?")) return;

      try {
        await dispatch(closeAssignment(id)).unwrap();
        toast.success("Assignment closed");
      } catch (err) {
        toast.error(err || "Failed to close assignment");
      }
    };

    if (status === "loading" && assignments.length === 0) {
      return <PageLoader text="Loading assignments..." />;
    }

    return (
      <div>
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
          A new assignment is created as a draft — it stays invisible to
          everyone until you click <span className="font-extrabold">Publish</span>{" "}
          on it below. Also make sure you selected the actual coordinators,
          classes, or teachers it applies to, otherwise no one will match it.
        </div>

        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex !cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
          >
            <FaPlus /> New Assignment
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4 text-left">Title</th>
                <th className="px-4 py-4 text-left">Template</th>
                <th className="px-4 py-4">Target Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Due Date</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <tr
                    key={assignment._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {assignment.title || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      {assignment.template?.title || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center capitalize">
                      {assignment.targetRole}
                    </td>

                    <td className="px-4 py-4 text-center font-bold capitalize">
                      {assignment.status}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {assignment.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => handlePublish(assignment._id)}
                            className="!cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Publish
                          </button>
                        )}

                        {assignment.status !== "closed" && (
                          <button
                            type="button"
                            onClick={() => handleClose(assignment._id)}
                            className="!cursor-pointer rounded-lg bg-yellow-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Close
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onViewResponses(assignment._id)}
                          className="!cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(assignment._id)}
                          className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <AssignmentFormModal
            templates={templates}
            teachers={teachers}
            classes={classes}
            users={users}
            onTargetRoleChange={onTargetRoleChange}
            onClose={() => setShowModal(false)}
            onCreated={() => setShowModal(false)}
          />
        )}

        {pendingAssignTemplateId && (
          <AssignmentFormModal
            key={pendingAssignTemplateId}
            initialTemplateId={pendingAssignTemplateId}
            templates={templates}
            teachers={teachers}
            classes={classes}
            users={users}
            onTargetRoleChange={onTargetRoleChange}
            onClose={onConsumePendingAssignTemplate}
            onCreated={onConsumePendingAssignTemplate}
          />
        )}
      </div>
    );
  }

  function AssignmentFormModal({
    initialTemplateId = "",
    templates,
    teachers,
    classes,
    users,
    onTargetRoleChange,
    onClose,
    onCreated,
  }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState(() => ({
      ...initialAssignmentForm,
      template: initialTemplateId,
    }));

    const toggleArrayValue = (field, value) => {
      setForm((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      }));
    };

    const handleTargetRoleChange = (role) => {
      setForm((prev) => ({
        ...prev,
        targetRole: role,
        assignedClasses: [],
        assignedTeachers: [],
        assignedUsers: [],
      }));
      onTargetRoleChange(role);
    };

    const handleCreate = async (e) => {
      e.preventDefault();

      if (!form.template) {
        toast.error("Please select a template");
        return;
      }

      try {
        await dispatch(createAssignment(form)).unwrap();
        toast.success("Assignment created");
        onCreated();
      } catch (err) {
        toast.error(err || "Failed to create assignment");
      }
    };

    return (
      <Modal title="New Assignment" onClose={onClose}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm((p) => ({ ...p, title: e.target.value }))
            }
          />

          <Select
            label="Template"
            value={form.template}
            onChange={(e) =>
              setForm((p) => ({ ...p, template: e.target.value }))
            }
          >
            <option value="">Select Template</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </Select>

          <Select
            label="Target Role (who submits)"
            value={form.targetRole}
            onChange={(e) => handleTargetRoleChange(e.target.value)}
          >
            {targetRoleOptions.map((role) => (
              <option key={role} value={role} className="capitalize">
                {role}
              </option>
            ))}
          </Select>

          {form.targetRole === "student" && (
            <CheckboxGroup
              label="Assigned Classes"
              options={classes.map((c) => ({
                value: c._id,
                label: c.displayName || `${c.name} - ${c.section}`,
              }))}
              selected={form.assignedClasses}
              onToggle={(value) => toggleArrayValue("assignedClasses", value)}
            />
          )}

          {(form.targetRole === "parent" ||
            form.targetRole === "coordinator") && (
            <CheckboxGroup
              label="Assigned Users"
              options={users.map((u) => ({
                value: u._id,
                label: u.name || u.email,
              }))}
              selected={form.assignedUsers}
              onToggle={(value) => toggleArrayValue("assignedUsers", value)}
            />
          )}

          <CheckboxGroup
            label={
              form.targetRole === "teacher"
                ? "Assigned Teachers (who this is sent to)"
                : "Teachers Being Evaluated (optional, restricts which teacher evaluators can select)"
            }
            options={teachers.map((t) => ({
              value: t._id,
              label: t.user?.name || "Unnamed Teacher",
            }))}
            selected={form.assignedTeachers}
            onToggle={(value) => toggleArrayValue("assignedTeachers", value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, startDate: e.target.value }))
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, dueDate: e.target.value }))
              }
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-700">
            <input
              type="checkbox"
              checked={form.allowMultipleResponses}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  allowMultipleResponses: e.target.checked,
                }))
              }
            />
            Allow multiple responses per user
          </label>

          <button
            type="submit"
            className="w-full !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
          >
            Create Assignment
          </button>
        </form>
      </Modal>
    );
  }

  function ResponsesTab({
    responses,
    status,
    error,
    assignments,
    teachers,
    teacherReport,
    teacherReportStatus,
  }) {
    const dispatch = useDispatch();
    const [filterAssignment, setFilterAssignment] = useState("");
    const [filterTeacher, setFilterTeacher] = useState("");
    const [reportTeacher, setReportTeacher] = useState("");
    const [selectedResponse, setSelectedResponse] = useState(null);

    const handleFilterAssignment = (id) => {
      setFilterAssignment(id);
      setFilterTeacher("");

      if (id) {
        dispatch(fetchResponsesByAssignment(id));
      } else {
        dispatch(fetchResponses());
      }
    };

    const handleFilterTeacher = (id) => {
      setFilterTeacher(id);
      setFilterAssignment("");

      if (id) {
        dispatch(fetchTeacherResponses(id));
      } else {
        dispatch(fetchResponses());
      }
    };

    const handleReview = async (id) => {
      try {
        await dispatch(reviewResponse(id)).unwrap();
        toast.success("Marked as reviewed");
      } catch (err) {
        toast.error(err || "Failed to update response");
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Delete this response?")) return;

      try {
        await dispatch(deleteResponse(id)).unwrap();
        toast.success("Response deleted");
      } catch (err) {
        toast.error(err || "Failed to delete response");
      }
    };

    const handlePrintFilled = async (id) => {
      try {
        await downloadFilledResponsePdf(id);
      } catch (err) {
        toast.error("Failed to generate PDF");
      }
    };

    const handleLoadReport = () => {
      if (!reportTeacher) {
        toast.error("Select a teacher first");
        return;
      }

      dispatch(fetchTeacherReport(reportTeacher));
    };

    return (
      <div>
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold">Teacher Report</h2>

          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={reportTeacher}
              onChange={(e) => setReportTeacher(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-black"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.name || "Unnamed Teacher"}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleLoadReport}
              className="!cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Load Report
            </button>
          </div>

          {teacherReportStatus === "loading" && (
            <p className="mt-4 text-sm text-gray-500">Loading report...</p>
          )}

          {teacherReport && teacherReportStatus === "succeeded" && (
            <div className="mt-5">
              <p className="font-bold text-black">
                {teacherReport.teacher?.user?.name} — Overall:{" "}
                {teacherReport.overallPercentage}% (
                {teacherReport.totalResponses} responses)
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {(teacherReport.sections || []).map((section) => (
                  <div
                    key={section.title}
                    className="rounded-xl bg-gray-50 p-4"
                  >
                    <p className="font-bold text-black">{section.title}</p>
                    <p className="text-sm text-gray-500">
                      {section.obtained}/{section.maximum} (
                      {section.percentage}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <select
            value={filterAssignment}
            onChange={(e) => handleFilterAssignment(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option value="">Filter by Assignment</option>
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.title || a.template?.title}
              </option>
            ))}
          </select>

          <select
            value={filterTeacher}
            onChange={(e) => handleFilterTeacher(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option value="">Filter by Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.user?.name || "Unnamed Teacher"}
              </option>
            ))}
          </select>
        </div>

        {status === "loading" ? (
          <PageLoader text="Loading responses..." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4 text-left">Evaluator</th>
                  <th className="px-4 py-4 text-left">Teacher</th>
                  <th className="px-4 py-4 text-left">Template</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {responses.length > 0 ? (
                  responses.map((response, index) => (
                    <tr
                      key={response._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-center font-bold">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        {response.submittedBy?.name || "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        {response.teacher?.user?.name || "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        {response.template?.title || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {response.percentage}%
                      </td>

                      <td className="px-4 py-4 text-center font-bold capitalize">
                        {response.status}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(response)}
                            className="!cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            <FaEye />
                          </button>

                          {response.status !== "reviewed" && (
                            <button
                              type="button"
                              onClick={() => handleReview(response._id)}
                              className="!cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
                            >
                              <FaCheckCircle />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handlePrintFilled(response._id)}
                            className="!cursor-pointer rounded-lg bg-gray-800 px-3 py-2 text-xs font-bold text-white"
                          >
                            <FaFilePdf />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(response._id)}
                            className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center font-semibold text-gray-500"
                    >
                      No responses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedResponse && (
          <Modal
            title="Response Details"
            onClose={() => setSelectedResponse(null)}
          >
            <Info
              label="Evaluator"
              value={selectedResponse.submittedBy?.name}
            />
            <Info
              label="Teacher"
              value={selectedResponse.teacher?.user?.name}
            />
            <Info label="Template" value={selectedResponse.template?.title} />
            <Info label="Score" value={`${selectedResponse.percentage}%`} />
            <Info label="Remarks" value={selectedResponse.remarks} />

            <div className="mt-4 space-y-2">
              {(selectedResponse.answers || []).map((answer, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-gray-50 p-3 text-sm"
                >
                  <span className="font-bold text-black">Answer: </span>
                  {String(answer.answer)}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    );
  }

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onToggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-xl border p-3">
        {options.length > 0 ? (
          options.map((option) => (
            <label
              key={option.value}
              className={`!cursor-pointer rounded-lg px-3 py-2 text-xs font-bold ${
                selected.includes(option.value)
                  ? "bg-black text-white"
                  : "border bg-white text-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => onToggle(option.value)}
                className="hidden"
              />
              {option.label}
            </label>
          ))
        ) : (
          <p className="text-xs text-gray-400">No options available.</p>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-3 rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="!cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black"
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
