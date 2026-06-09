import {
  useEffect,
  useState,
} from "react";

import {
  getAttendanceHistory,
} from "../services/attendance.service";

import {
  getBuses
} from "../services/bus.service";

import {
  getRoutes
} from "../services/route.service";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

export default function
AttendanceHistory() {


const [date, setDate] =
  useState(
    new Date()
      .toLocaleDateString(
        "en-CA"
      )
  );

const [busId, setBusId] =
  useState("");

const [search, setSearch] =
  useState("");

const [routeId, setRouteId] =
  useState("");

const [buses, setBuses] =
  useState([]);

const [routes, setRoutes] =
  useState([]);

const [
  tripType,
  setTripType
] = useState("");

  const [
    attendance,
    setAttendance
  ] = useState([]);

  const [currentPage, setCurrentPage] =
  useState(1);

const recordsPerPage = 15;

  const [
    summary,
    setSummary
  ] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  useEffect(() => {

    loadAttendance();

    loadFilters();

  }, []);

  const loadAttendance =
    async () => {

     const data =
        await getAttendanceHistory(
        date,
        busId,
        routeId,
        search,
        tripType
        );

        console.log(data);

      if (data.success) {

        setAttendance(
          data.attendance
        );

        setCurrentPage(1);

        setSummary({
          total:
            data.total,

          present:
            data.present,

          absent:
            data.absent,
        });

      }

    };

    const loadFilters =
        async () => {

        const busData =
            await getBuses();

        const routeData =
            await getRoutes();

        setBuses(
            busData.buses || []
        );

        setRoutes(
            routeData.routes || []
        );

        };

        const exportToExcel =
() => {

  const excelData =
    attendance.map(
      (item) => ({

        Student:
          item.studentId?.name,

        AdmissionNumber:
          item.studentId
            ?.admissionNumber,

        Bus:
          item.busId
            ?.busNumber,

        Route:
          item.routeId
            ?.routeName,

        Status:
          item.status,

        Date:
          new Date(
            item.attendanceDate
          ).toLocaleDateString(),

      })
    );

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Attendance"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType:
          "xlsx",

        type:
          "array",
      }
    );

  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  saveAs(
    fileData,
    `Attendance_Report_${
      new Date()
        .toLocaleDateString()
        .replaceAll(
          "/",
          "-"
        )
    }.xlsx`
  );

};


    const indexOfLastRecord =
  currentPage * recordsPerPage;

const indexOfFirstRecord =
  indexOfLastRecord -
  recordsPerPage;

const currentRecords =
  attendance.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

const totalPages =
  Math.ceil(
    attendance.length /
    recordsPerPage
  );

  return (

   <div
  style={{
    padding: "25px",
    background: "#F8FAFC",
    minHeight: "100vh",
  }}
>
  <div
    style={{
      marginBottom: "25px",
    }}
  >
   <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
      }}
    >
      Student Attendance
    </h2>

    <p
      style={{
        marginTop: "5px",
        color: "#666",
      }}
    >
      View, filter and export student attendance records.
    </p>
  </div>

  <div
    style={{
      display: "flex",
      gap: "15px",
    }}
  >
    <div
      style={{
        padding: "15px",
        background: "#fff",
        borderRadius: "10px",
        minWidth: "120px",
      }}
    >
      <strong>Total</strong>
      <br />
      {summary.total}
    </div>

    <div
      style={{
        padding: "15px",
        background: "#ECFDF5",
        borderRadius: "10px",
        minWidth: "120px",
      }}
    >
      <strong>Present</strong>
      <br />
      {summary.present}
    </div>

    <div
      style={{
        padding: "15px",
        background: "#FEF2F2",
        borderRadius: "10px",
        minWidth: "120px",
      }}
    >
      <strong>Absent</strong>
      <br />
      {summary.absent}
    </div>
  </div>
</div>
</div>


  

  

     <div
  style={{
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "16px",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "25px",
  }}
>

  <input
    type="date"
    value={date}
    onChange={(e) =>
      setDate(
        e.target.value
      )
    }
  />

  <select
    value={busId}
    onChange={(e) =>
      setBusId(
        e.target.value
      )
    }
  >

    <option value="">
      All Buses
    </option>

    {buses.map(
      (bus) => (

        <option
          key={bus._id}
          value={bus._id}
        >
          {bus.busNumber}
        </option>

      )
    )}

  </select>

  <select
    value={routeId}
    onChange={(e) =>
      setRouteId(
        e.target.value
      )
    }
  >

    <option value="">
      All Routes
    </option>

    {routes.map(
      (route) => (

        <option
          key={route._id}
          value={route._id}
        >
          {route.routeName}
        </option>

      )
    )}

  </select>


  <select
  value={tripType}
  onChange={(e) =>
    setTripType(
      e.target.value
    )
  }
>

  <option value="">
    All Trips
  </option>

  <option value="PICKUP">
    Pickup
  </option>

  <option value="DROP">
    Drop
  </option>

</select>

  <input
  type="text"
  placeholder="Name / Admission No."
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
/>

  <button
  onClick={loadAttendance}
  style={{
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Search
</button>

  <button
  onClick={exportToExcel}
  style={{
    background: "#16A34A",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Export Excel
</button>

</div>

      {/* <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
  }}
>
  <div
    style={{
      flex: 1,
      background: "#FFFFFF",
      padding: "20px",
      borderRadius: "16px",
      boxShadow:
        "0 2px 12px rgba(0,0,0,0.08)",
    }}
  >
    <div
      style={{
        color: "#64748B",
      }}
    >
      Total Attendance
    </div>

    <h1
      style={{
        margin: "10px 0 0",
      }}
    >
      {summary.total}
    </h1>
  </div>

  <div
    style={{
      flex: 1,
      background: "#ECFDF5",
      padding: "20px",
      borderRadius: "16px",
    }}
  >
    <div
      style={{
        color: "#15803D",
      }}
    >
      Present
    </div>

    <h1
      style={{
        margin: "10px 0 0",
        color: "#15803D",
      }}
    >
      {summary.present}
    </h1>
  </div>

  <div
    style={{
      flex: 1,
      background: "#FEF2F2",
      padding: "20px",
      borderRadius: "16px",
    }}
  >
    <div
      style={{
        color: "#DC2626",
      }}
    >
      Absent
    </div>

    <h1
      style={{
        margin: "10px 0 0",
        color: "#DC2626",
      }}
    >
      {summary.absent}
    </h1>
  </div>
</div> */}

      <table
        border="1"
        width="100%"
      >

        <thead>

          <tr>

            <th>
              Student
            </th>

            <th>
              Admission
            </th>

            <th>
              Bus
            </th>

            <th>
              Route
            </th>

            <th>
              Trip Type
            </th>

            <th>
              Status
            </th>

            <th>
            Date (MM/DD/YYYY)
            </th>

          </tr>

        </thead>

        <tbody>

          {currentRecords.map(
            (item) => (

              <tr
                key={item._id}
              >

                <td>
                  {
                    item.studentId
                      ?.name
                  }
                </td>

                <td>
                  {
                    item.studentId
                      ?.admissionNumber
                  }
                </td>

                <td>
                  {
                    item.busId
                      ?.busNumber
                  }
                </td>

                <td>
                  {
                    item.routeId
                      ?.routeName
                  }
                </td>


                <td>
                    {
                        item.tripType
                    }
                    </td>

                <td
  style={{
    color:
      item.status ===
      "PRESENT"
        ? "green"
        : "red",

    fontWeight:
      "bold",
  }}
>
  {
    item.status
  }
</td>

<td>
  {
    new Date(
      item.attendanceDate
    ).toLocaleDateString()
  }
</td>

              </tr>

            )
          )}

        </tbody>

      </table>

      <div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
  }}
>

  <button
    disabled={
      currentPage === 1
    }
    onClick={() =>
      setCurrentPage(
        currentPage - 1
      )
    }
  >
    Previous
  </button>

  <span>
    Page {currentPage}
    {" "}of{" "}
    {totalPages || 1}
  </span>

  <button
    disabled={
      currentPage === totalPages ||
      totalPages === 0
    }
    onClick={() =>
      setCurrentPage(
        currentPage + 1
      )
    }
  >
    Next
  </button>

</div>

    </div>

  );

}