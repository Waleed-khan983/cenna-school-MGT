import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createTemplateApi,
  getTemplatesApi,
  deleteTemplateApi,
  publishTemplateApi,
  archiveTemplateApi,
  addSectionApi,
  deleteSectionApi,
  addQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  addOptionApi,
  deleteOptionApi,
} from "@/services/evaluationTemplateService";

import {
  createAssignmentApi,
  getAssignmentsApi,
  deleteAssignmentApi,
  publishAssignmentApi,
  closeAssignmentApi,
  getMyAssignmentsApi,
} from "@/services/evaluationAssignmentService";

import {
  submitEvaluationApi,
  getMyResponsesApi,
  getResponsesByAssignmentApi,
  getTeacherResponsesApi,
  getEvaluationResponsesApi,
  reviewEvaluationResponseApi,
  deleteEvaluationResponseApi,
  getTeacherReportApi,
} from "@/services/evaluationResponseService";

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error.response?.data?.message ||
    error.message ||
    fallbackMessage
  );
};

// ── Templates ────────────────────────────────────────

export const fetchTemplates = createAsyncThunk(
  "evaluations/fetchTemplates",
  async (_, thunkAPI) => {
    try {
      return await getTemplatesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load templates")
      );
    }
  }
);

export const createTemplate = createAsyncThunk(
  "evaluations/createTemplate",
  async (data, thunkAPI) => {
    try {
      return await createTemplateApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to create template")
      );
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "evaluations/deleteTemplate",
  async (id, thunkAPI) => {
    try {
      await deleteTemplateApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete template")
      );
    }
  }
);

export const publishTemplate = createAsyncThunk(
  "evaluations/publishTemplate",
  async (id, thunkAPI) => {
    try {
      return await publishTemplateApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to publish template")
      );
    }
  }
);

export const archiveTemplate = createAsyncThunk(
  "evaluations/archiveTemplate",
  async (id, thunkAPI) => {
    try {
      return await archiveTemplateApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to archive template")
      );
    }
  }
);

export const addSection = createAsyncThunk(
  "evaluations/addSection",
  async (payload, thunkAPI) => {
    try {
      return await addSectionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to add section")
      );
    }
  }
);

export const deleteSection = createAsyncThunk(
  "evaluations/deleteSection",
  async (payload, thunkAPI) => {
    try {
      return await deleteSectionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete section")
      );
    }
  }
);

export const addQuestion = createAsyncThunk(
  "evaluations/addQuestion",
  async (payload, thunkAPI) => {
    try {
      return await addQuestionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to add question")
      );
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "evaluations/updateQuestion",
  async (payload, thunkAPI) => {
    try {
      return await updateQuestionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to update question")
      );
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "evaluations/deleteQuestion",
  async (payload, thunkAPI) => {
    try {
      return await deleteQuestionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete question")
      );
    }
  }
);

export const addOption = createAsyncThunk(
  "evaluations/addOption",
  async (payload, thunkAPI) => {
    try {
      return await addOptionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to add option")
      );
    }
  }
);

export const deleteOption = createAsyncThunk(
  "evaluations/deleteOption",
  async (payload, thunkAPI) => {
    try {
      return await deleteOptionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete option")
      );
    }
  }
);

// ── Assignments ──────────────────────────────────────

export const fetchAssignments = createAsyncThunk(
  "evaluations/fetchAssignments",
  async (_, thunkAPI) => {
    try {
      return await getAssignmentsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load assignments")
      );
    }
  }
);

export const createAssignment = createAsyncThunk(
  "evaluations/createAssignment",
  async (data, thunkAPI) => {
    try {
      return await createAssignmentApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to create assignment")
      );
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  "evaluations/deleteAssignment",
  async (id, thunkAPI) => {
    try {
      await deleteAssignmentApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete assignment")
      );
    }
  }
);

export const publishAssignment = createAsyncThunk(
  "evaluations/publishAssignment",
  async (id, thunkAPI) => {
    try {
      return await publishAssignmentApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to publish assignment")
      );
    }
  }
);

export const closeAssignment = createAsyncThunk(
  "evaluations/closeAssignment",
  async (id, thunkAPI) => {
    try {
      return await closeAssignmentApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to close assignment")
      );
    }
  }
);

export const fetchMyAssignments = createAsyncThunk(
  "evaluations/fetchMyAssignments",
  async (_, thunkAPI) => {
    try {
      return await getMyAssignmentsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load your evaluations")
      );
    }
  }
);

// ── Responses ────────────────────────────────────────

export const submitEvaluationResponse = createAsyncThunk(
  "evaluations/submitEvaluationResponse",
  async (data, thunkAPI) => {
    try {
      return await submitEvaluationApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to submit evaluation")
      );
    }
  }
);

export const fetchMyResponses = createAsyncThunk(
  "evaluations/fetchMyResponses",
  async (_, thunkAPI) => {
    try {
      return await getMyResponsesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load your submitted evaluations")
      );
    }
  }
);

export const fetchResponses = createAsyncThunk(
  "evaluations/fetchResponses",
  async (_, thunkAPI) => {
    try {
      return await getEvaluationResponsesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load responses")
      );
    }
  }
);

export const fetchResponsesByAssignment = createAsyncThunk(
  "evaluations/fetchResponsesByAssignment",
  async (assignmentId, thunkAPI) => {
    try {
      return await getResponsesByAssignmentApi(assignmentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load responses")
      );
    }
  }
);

export const fetchTeacherResponses = createAsyncThunk(
  "evaluations/fetchTeacherResponses",
  async (teacherId, thunkAPI) => {
    try {
      return await getTeacherResponsesApi(teacherId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load responses")
      );
    }
  }
);

export const reviewResponse = createAsyncThunk(
  "evaluations/reviewResponse",
  async (id, thunkAPI) => {
    try {
      return await reviewEvaluationResponseApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to mark response reviewed")
      );
    }
  }
);

export const deleteResponse = createAsyncThunk(
  "evaluations/deleteResponse",
  async (id, thunkAPI) => {
    try {
      await deleteEvaluationResponseApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete response")
      );
    }
  }
);

export const fetchTeacherReport = createAsyncThunk(
  "evaluations/fetchTeacherReport",
  async (teacherId, thunkAPI) => {
    try {
      return await getTeacherReportApi(teacherId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load teacher report")
      );
    }
  }
);

const initialState = {
  templates: [],
  templateStatus: "idle",
  templateError: null,
  currentTemplate: null,

  assignments: [],
  assignmentStatus: "idle",
  assignmentError: null,

  myAssignments: [],
  myAssignmentsStatus: "idle",
  myAssignmentsError: null,

  responses: [],
  responsesStatus: "idle",
  responsesError: null,

  myResponses: [],
  myResponsesStatus: "idle",
  myResponsesError: null,

  submitStatus: "idle",
  submitError: null,

  teacherReport: null,
  teacherReportStatus: "idle",
  teacherReportError: null,
};

const applyTemplateUpdate = (state, template) => {
  if (!template) return;

  state.templates = state.templates.map((item) =>
    item._id === template._id ? template : item
  );

  if (state.currentTemplate?._id === template._id) {
    state.currentTemplate = template;
  }
};

const evaluationSlice = createSlice({
  name: "evaluations",

  initialState,

  reducers: {
    setCurrentTemplate(state, action) {
      state.currentTemplate = action.payload;
    },

    clearEvaluationErrors(state) {
      state.templateError = null;
      state.assignmentError = null;
      state.myAssignmentsError = null;
      state.responsesError = null;
      state.myResponsesError = null;
      state.submitError = null;
      state.teacherReportError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.templateStatus = "loading";
        state.templateError = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templateStatus = "succeeded";
        state.templates = action.payload?.templates || [];
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.templateStatus = "failed";
        state.templateError = action.payload;
      })

      .addCase(createTemplate.fulfilled, (state, action) => {
        if (action.payload?.template) {
          state.templates.unshift(action.payload.template);
        }
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.templateError = action.payload;
      })

      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(
          (item) => item._id !== action.payload
        );

        if (state.currentTemplate?._id === action.payload) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.templateError = action.payload;
      })

      .addCase(publishTemplate.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(archiveTemplate.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(addSection.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(addOption.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })
      .addCase(deleteOption.fulfilled, (state, action) => {
        applyTemplateUpdate(state, action.payload?.template);
      })

      // Assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.assignmentStatus = "loading";
        state.assignmentError = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignmentStatus = "succeeded";
        state.assignments = action.payload?.assignments || [];
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.assignmentStatus = "failed";
        state.assignmentError = action.payload;
      })

      .addCase(createAssignment.fulfilled, (state, action) => {
        if (action.payload?.assignment) {
          state.assignments.unshift(action.payload.assignment);
        }
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.assignmentError = action.payload;
      })

      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.assignmentError = action.payload;
      })

      .addCase(publishAssignment.fulfilled, (state, action) => {
        const updated = action.payload?.assignment;

        if (updated) {
          state.assignments = state.assignments.map((item) =>
            item._id === updated._id ? updated : item
          );
        }
      })
      .addCase(closeAssignment.fulfilled, (state, action) => {
        const updated = action.payload?.assignment;

        if (updated) {
          state.assignments = state.assignments.map((item) =>
            item._id === updated._id ? updated : item
          );
        }
      })

      // My assignments
      .addCase(fetchMyAssignments.pending, (state) => {
        state.myAssignmentsStatus = "loading";
        state.myAssignmentsError = null;
      })
      .addCase(fetchMyAssignments.fulfilled, (state, action) => {
        state.myAssignmentsStatus = "succeeded";
        state.myAssignments = action.payload?.assignments || [];
      })
      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.myAssignmentsStatus = "failed";
        state.myAssignmentsError = action.payload;
      })

      // Submit
      .addCase(submitEvaluationResponse.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(submitEvaluationResponse.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })
      .addCase(submitEvaluationResponse.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload;
      })

      // My responses
      .addCase(fetchMyResponses.pending, (state) => {
        state.myResponsesStatus = "loading";
        state.myResponsesError = null;
      })
      .addCase(fetchMyResponses.fulfilled, (state, action) => {
        state.myResponsesStatus = "succeeded";
        state.myResponses = action.payload?.responses || [];
      })
      .addCase(fetchMyResponses.rejected, (state, action) => {
        state.myResponsesStatus = "failed";
        state.myResponsesError = action.payload;
      })

      // Admin responses
      .addCase(fetchResponses.pending, (state) => {
        state.responsesStatus = "loading";
        state.responsesError = null;
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.responsesStatus = "succeeded";
        state.responses = action.payload?.responses || [];
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.responsesStatus = "failed";
        state.responsesError = action.payload;
      })

      .addCase(fetchResponsesByAssignment.pending, (state) => {
        state.responsesStatus = "loading";
        state.responsesError = null;
      })
      .addCase(fetchResponsesByAssignment.fulfilled, (state, action) => {
        state.responsesStatus = "succeeded";
        state.responses = action.payload?.responses || [];
      })
      .addCase(fetchResponsesByAssignment.rejected, (state, action) => {
        state.responsesStatus = "failed";
        state.responsesError = action.payload;
      })

      .addCase(fetchTeacherResponses.pending, (state) => {
        state.responsesStatus = "loading";
        state.responsesError = null;
      })
      .addCase(fetchTeacherResponses.fulfilled, (state, action) => {
        state.responsesStatus = "succeeded";
        state.responses = action.payload?.responses || [];
      })
      .addCase(fetchTeacherResponses.rejected, (state, action) => {
        state.responsesStatus = "failed";
        state.responsesError = action.payload;
      })

      .addCase(reviewResponse.fulfilled, (state, action) => {
        const updated = action.payload?.response;

        if (updated) {
          state.responses = state.responses.map((item) =>
            item._id === updated._id ? updated : item
          );
        }
      })
      .addCase(reviewResponse.rejected, (state, action) => {
        state.responsesError = action.payload;
      })

      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.responses = state.responses.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteResponse.rejected, (state, action) => {
        state.responsesError = action.payload;
      })

      // Teacher report
      .addCase(fetchTeacherReport.pending, (state) => {
        state.teacherReportStatus = "loading";
        state.teacherReportError = null;
      })
      .addCase(fetchTeacherReport.fulfilled, (state, action) => {
        state.teacherReportStatus = "succeeded";
        state.teacherReport = action.payload || null;
      })
      .addCase(fetchTeacherReport.rejected, (state, action) => {
        state.teacherReportStatus = "failed";
        state.teacherReportError = action.payload;
      });
  },
});

export const { setCurrentTemplate, clearEvaluationErrors } =
  evaluationSlice.actions;

export default evaluationSlice.reducer;
