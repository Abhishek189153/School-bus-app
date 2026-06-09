import { useState } from "react";

import StudentAttendance
from "../components/StudentAttendance";

import DriverAttendance
from "../components/DriverAttendance";

export default function AttendanceHistory() {

  const [tab, setTab] =
    useState("student");

  return (

    <div>

      <h2
        style={{
            marginBottom:
            "20px",
        }}
        >
        Attendance Management
        </h2>

      <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>

  <button
    onClick={() =>
      setTab("student")
    }
    style={{
      padding:
        "10px 20px",

      border:
        "none",

      borderRadius:
        "8px",

      cursor:
        "pointer",

      backgroundColor:
        tab ===
        "student"
          ? "#1976d2"
          : "#e0e0e0",

      color:
        tab ===
        "student"
          ? "#fff"
          : "#000",

      fontWeight:
        "bold",
    }}
  >
    Student Attendance
  </button>

  <button
    onClick={() =>
      setTab("driver")
    }
    style={{
      padding:
        "10px 20px",

      border:
        "none",

      borderRadius:
        "8px",

      cursor:
        "pointer",

      backgroundColor:
        tab ===
        "driver"
          ? "#1976d2"
          : "#e0e0e0",

      color:
        tab ===
        "driver"
          ? "#fff"
          : "#000",

      fontWeight:
        "bold",
    }}
  >
    Driver Attendance
  </button>

</div>

      {
        tab === "student"

        ? <StudentAttendance />

        : <DriverAttendance />
      }

    </div>

  );

}