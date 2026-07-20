import mongoose from 'mongoose';
import { getNextSequence } from '../utils/sequence.js';



// ── ADMISSION ────────────────────────────────────────
const AdmissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female'] },
  religion: { type: String, default: 'Islam' },
  nationality: { type: String, default: 'Pakistani' },
  address: { type: String, trim: true },
  classApplied: { type: String, required: true },
  prevSchool: { type: String, trim: true },
  prevMarks: { type: String },
  bForm: { type: String, trim: true },
  fatherName: { type: String, required: true, trim: true },
  occupation: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  documents: {
    photo: String,
    resultCard: String,
    cnic: String,
    slc: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  refNo: { type: String, unique: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNote: { type: String }
}, { timestamps: true });


AdmissionSchema.pre('save', async function (next) {
  if (!this.refNo) {
    // countDocuments()+1 let two concurrent public submissions read the
    // same count and generate the same refNo, colliding on the unique
    // index below. An atomic counter can't collide the same way.
    const seq = await getNextSequence('admissionRefNo', this.$session());
    this.refNo = `CSP-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
  }
  next();
});


const Admission =mongoose.models.Admission || mongoose.model('Admission', AdmissionSchema);
export default Admission;