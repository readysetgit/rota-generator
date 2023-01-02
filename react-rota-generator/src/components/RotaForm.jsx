import * as React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import "./RotaForm.scss";
import _ from "lodash";

const RotaForm = () => {
  const [numDays, setNumDays] = React.useState(30);
  const [numEmployees, setNumEmployees] = React.useState(8);

  const csvData = []; // {dayOffCounter: 8, data: [M,N,E....]}
  let minDutyBag = ["M", "M", "E", "E", "N", "N"];

  let dutyTypes = ["M", "E", "N"];
  let numDayOffs = 8;

  let simulDayOffs;
  let employeeBagForWeekendOff = [];

  const setInitialState = () => {
    simulDayOffs = numEmployees - minDutyBag.length;
    setDayOffCounter();
    // Create the employee bag for weekend offs
    for (let i = 0; i < numEmployees; i++) {
      employeeBagForWeekendOff.push(i);
    }
    // Shuffle the bag
    employeeBagForWeekendOff = employeeBagForWeekendOff
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
  };

  //   const handleEmail = (event) => {
  //     setEmail(event.target.value);
  //   };

  const handleNumEmployees = (event) => {
    setNumEmployees(event.target.value);
    setInitialState()
    generateRotaCSV();
  };

  const handleNumDays = (event) => {

    setNumDays(event.target.value);
    setInitialState()
    // let numDayOffs = (numDays / 7) * 2;
    generateRotaCSV();
  };

  const setDayOffCounter = () => {
    // create "empty" rowData for all employees and set DayOffCounter
    for (let i = 0; i < numEmployees; i++) {
      let counter = numDayOffs;
      let rowData = { dayOffCounter: counter, duties: [] };
      for (let j = 0; j < numDays; j++) {
        rowData.duties.push("X");
      }
      csvData.push(rowData);
    }
  };

  const fillFromBag = () => {
    // If bag is empty, throw err
    if (minDutyBag.length < 1) {
      let index = Math.floor(Math.random() * dutyTypes.length);
      let item = dutyTypes[index];
      return item;
    }

    // otherwise randomly return an item from the bag
    let index = Math.floor(Math.random() * minDutyBag.length);
    // only splice array when item is found
    let item = minDutyBag[index];
    minDutyBag.splice(index, 1); // 2nd parameter means remove one item only

    return item;
  };

  // TODO: Account for day off
  // const generateRotaCSV = () => {
  //   // Enter rows for all Employees
  //   // for (let i = 0; i < numEmployees; i++) {
  //   //   let rowData = [];
  //   //   for (let j = 0; j < numDays; j++) {
  //   //     rowData.push("X");
  //   //   }
  //   //   csvData.push(rowData);
  //   // }

  //   // Iterate over all columns
  //   for (let j = 0; j < numDays; j++) {
  //     // Replenish min duty bag
  //     minDutyBag = ["M", "M", "E", "E", "N", "N"];
  //     // Iterate over all rows
  //     for (let i = 0; i < numEmployees; i++) {
  //       csvData[i].duties[j] = fillFromBag();
  //     }
  //   }

  //   // no night after morning
  //   // for every row:
  //   // check if N,M or N,E exists
  //   for (let j = 0; j < numDays - 1; j++) {
  //     for (let i = 0; i < numEmployees; i++) {
  //       if (
  //         csvData[i].duties[j] === "N" &&
  //         (csvData[i].duties[j + 1] === "M" || csvData[i].duties[j + 1] === "E")
  //       ) {
  //         csvData[i].duties[j] = <span style={{ color: "red" }}>N</span>;
  //       }
  //     }
  //   }
  // };

  const generateRotaCSV = () => {
    fillWeekendDayOffs();
    console.log(csvData)
  };

  const fillWeekendDayOffs = () => {
    // Stage 1 - Fill weekend day offs
    // get index of all fridays within the time frame

    // For each friday
    // Select "simulDayOffs" employees from "employeeBagForWeekendOff"
    // set friday and friday+1 = "D"
    let fridayIndices = getFridayIndices();
    for (let j of fridayIndices) {
      let selectedEmployees = getEmployeesForWeekendOff();
      for (let i of selectedEmployees) {
        debugger
        csvData[i].duties[j] = 'D'
        // If there is no saturday for example
        if (j+1 < numDays) {
          csvData[i].duties[j+1] = 'D'
        }
      }
    }
  };

  const getFridayIndices = () => {
    // TODO: Count from Day 1 on calendar
    let indices = [];
    for (let i = 1; i < numDays; i++) {
      if (i % 6 === 0) indices.push(i);
    }
    return indices;
  };

  const getEmployeesForWeekendOff = () => {
    let employeeIndices = [];
    for (let i = 0; i < simulDayOffs; i++) {
      employeeIndices.push(employeeBagForWeekendOff[i]) 
    }
    console.log(employeeBagForWeekendOff)

    // remove the selected employees from the bag
    employeeBagForWeekendOff.splice(0, simulDayOffs);

    console.log(employeeBagForWeekendOff)
    return employeeIndices
  };

  return (
    <div className="container">
      <form>
        <div className="flex justify-between">
          <label htmlFor="email">Number of employees</label>
          <input
            id="numEmployees"
            type="number"
            value={numEmployees}
            onChange={handleNumEmployees}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="email">Number of days</label>
          <input
            id="numDays"
            type="number"
            value={numDays}
            onChange={handleNumDays}
          />
        </div>
      </form>
      {/* {/* <CSVLink data={csvData}>Download me</CSVLink> */}
      {/* <CSVDownload data={csvData} target="_blank" />  */}
      <div className="table-container">
        This
        {csvData}
        {csvData.map((row, i) => (
          <div key={i} className="employee-row">
            {row.duties.map((x, j) => (
              <span key={j} className="cell">
                {x}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export { RotaForm };
