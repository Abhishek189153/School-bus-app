import mongoose from "mongoose";

const workingDaySchema = new mongoose.Schema(
{
    schoolId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        unique: true,
    },

    monday:
    {
        type: Boolean,
        default: true,
    },

    tuesday:
    {
        type: Boolean,
        default: true,
    },

    wednesday:
    {
        type: Boolean,
        default: true,
    },

    thursday:
    {
        type: Boolean,
        default: true,
    },

    friday:
    {
        type: Boolean,
        default: true,
    },

    saturday:
    {
        type: Boolean,
        default: true,
    },

    sunday:
    {
        type: Boolean,
        default: false,
    },

},
{
    timestamps: true,
});

export default mongoose.model(
    "WorkingDay",
    workingDaySchema
);