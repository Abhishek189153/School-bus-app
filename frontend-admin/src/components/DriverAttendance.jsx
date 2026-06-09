import {
  useEffect,
  useState,
} from "react";

import * as XLSX from "xlsx";

import {
  getBuses,
} from "../services/bus.service";

import {
  saveAs,
} from "file-saver";

import {
  getDriverAttendanceHistory,
} from "../services/driverAttendance.service";

export default function DriverAttendance() {

  const [date, setDate] =
    useState(
      new Date()
        .toLocaleDateString(
          "en-CA"
        )
    );

  const [busId,
  setBusId] =
  useState("");

const [search,
  setSearch] =
  useState("");

const [buses,
  setBuses] =
  useState([]);

  const [drivers, setDrivers] =
    useState([]);

  const [summary, setSummary] =
    useState({
      total: 0,
      present: 0,
      absent: 0,
    });

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const recordsPerPage =
    10;

  useEffect(() => {

    loadData();
    loadBuses();

  }, []);

  const loadData =
    async () => {

      const data =
        await getDriverAttendanceHistory(
          date,
          busId,
          search
        );

      if (data.success) {

        setDrivers(
          data.drivers
        );

        setSummary({

          total:
            data.total,

          present:
            data.present,

          absent:
            data.absent,

        });

        setCurrentPage(1);

      }

    };

    const loadBuses =
        async () => {

        const data =
            await getBuses();

        setBuses(
            data.buses || []
        );

        };

  const exportToExcel =
    () => {

      const excelData =
        drivers.map(
          (driver) => ({

            Driver:
              driver.name,

            Phone:
              driver.phone,

            DutyOn:
              driver.dutyOnTime
                ? new Date(
                    driver.dutyOnTime
                  ).toLocaleTimeString()
                : "-",

            DutyOff:
              driver.dutyOffTime
                ? new Date(
                    driver.dutyOffTime
                  ).toLocaleTimeString()
                : "-",

            Trips:
              driver.completedTrips,

            Status:
              driver.status,

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
        "DriverAttendance"
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
        "Driver_Attendance.xlsx"
      );

    };

  const indexOfLastRecord =
    currentPage *
    recordsPerPage;

  const indexOfFirstRecord =
    indexOfLastRecord -
    recordsPerPage;

  const currentRecords =
    drivers.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

  const totalPages =
    Math.ceil(
      drivers.length /
      recordsPerPage
    );

  return (

    <div>

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
        fontSize: "30px",
        color: "#1E293B",
      }}
    >
      Driver Attendance
    </h2>

    <p
      style={{
        marginTop: "6px",
        color: "#64748B",
      }}
    >
      View, filter and export driver attendance records.
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
        background: "#FFFFFF",
        padding: "15px 25px",
        borderRadius: "12px",
        minWidth: "120px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <strong>Total</strong>
      <br />
      {summary.total}
    </div>

    <div
      style={{
        background: "#ECFDF5",
        padding: "15px 25px",
        borderRadius: "12px",
        minWidth: "120px",
      }}
    >
      <strong>Present</strong>
      <br />
      {summary.present}
    </div>

    <div
      style={{
        background: "#FEF2F2",
        padding: "15px 25px",
        borderRadius: "12px",
        minWidth: "120px",
      }}
    >
      <strong>Absent</strong>
      <br />
      {summary.absent}
    </div>
  </div>
</div>

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    background: "#FFFFFF",
    padding: "16px",
    borderRadius: "16px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  }}
>

        <input
  type="date"
  value={date}
  onChange={(e) =>
    setDate(e.target.value)
  }
  style={{
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
  }}
/>


       <select
            value={busId}
            onChange={(e) =>
                setBusId(e.target.value)
            }
            style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "14px",
            }}
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


       <input
            type="text"
            placeholder="Search Driver Name / Phone"
            value={search}
            onChange={(e) =>
                setSearch(
                e.target.value
                )
            }
            style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                width: "220px",
                fontSize: "14px",
            }}
            />

       <button
            onClick={loadData}
            style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                cursor: "pointer",
                fontWeight: "600",
            }}
            >
            Search
            </button>

       <button
            onClick={exportToExcel}
            style={{
                backgroundColor: "#16A34A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                cursor: "pointer",
                fontWeight: "600",
            }}
            >
            Export Excel
            </button>

      </div>

      

      <table
        border="1"
        width="100%"
      >

        <thead>

          <tr>

            <th>
              Driver
            </th>

            <th>
              Phone
            </th>

            <th>
              Bus
            </th>

            <th>
              Duty On
            </th>

            <th>
              Duty Off
            </th>

            <th>
              Trips
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {currentRecords.map(
            (driver) => (

              <tr
                key={
                  driver._id
                }
              >

                <td>
                  {
                    driver.name
                  }
                </td>

                <td>
                  {
                    driver.phone
                  }
                </td>

                <td>
                    {
                        driver.busNumber
                    }
                    </td>

                <td>
                  {
                    driver.dutyOnTime
                      ? new Date(
                          driver.dutyOnTime
                        ).toLocaleTimeString()
                      : "-"
                  }
                </td>

                <td>
                  {
                    driver.dutyOffTime
                      ? new Date(
                          driver.dutyOffTime
                        ).toLocaleTimeString()
                      : "-"
                  }
                </td>

                <td>
                  {
                    driver.completedTrips
                  }
                </td>

                <td
                  style={{
                    color:
                      driver.status ===
                      "PRESENT"
                        ? "green"
                        : "red",

                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    driver.status
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
          justifyContent:
            "center",
          gap: "10px",
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
          Page
          {" "}
          {
            currentPage
          }
          {" "}
          of
          {" "}
          {
            totalPages || 1
          }
        </span>

        <button
          disabled={
            currentPage ===
              totalPages ||
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