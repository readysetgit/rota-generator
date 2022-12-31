import * as React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import "./RotaForm.scss";

const RotaForm = () => {
  const [numDays, setNumDays] = React.useState("");
  const [numEmployees, setNumEmployees] = React.useState("");

  //   const handleEmail = (event) => {
  //     setEmail(event.target.value);
  //   };

  const handleNumEmployees = (event) => {
    setNumEmployees(event.target.value);
  };

  const handleNumDays = (event) => {
    setNumDays(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (numDays && numEmployees) {
      generateRotaCSV();

    }
    // alert(numDays + " " + numEmployees);
  };

  // const csvData = [
  //   ["firstname", "lastname", "email"],
  //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
  //   ["Raed", "Labes", "rl@smthing.co.com"],
  //   ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  // ];

  const csvData = []
  let minDutyBag = ['M', 'M', 'E', 'E', 'N', 'N']
  let dutyTypes = ['M', 'E', 'N']

  const fillFromBag = () => {
    // If bag is empty, throw err
    if (minDutyBag.length < 1) console.error();

    // otherwise randomly return an item from the bag
    let index = Math.floor(Math.random()*minDutyBag.length)
    // only splice array when item is found
    let item =  minDutyBag[index];
    minDutyBag.splice(index, 1); // 2nd parameter means remove one item only
    
    return item;

  }

  // TODO: Account for day off
  const generateRotaCSV = () => {

    // Enter rows for all Employees
    for (let i = 0; i < numEmployees; i++) {
      let rowData = []
      for (let j = 0; j < numDays; j++) {
        rowData.push('D')
      }
      csvData.push(rowData)
    }

    // Iterate over all columns
    for (let j = 0; j < numDays; j++) {
      // Replenish min duty bag
      minDutyBag = ['M', 'M', 'E', 'E', 'N', 'N']
      // Iterate over all rows
      for (let i = 0; i < numEmployees; i++) {
        csvData[i][j] = fillFromBag();
      }
    }

    // no night after morning
    // for every row:
      // check if N,M or N,E exists
    for (let j = 0; j < numDays-1; j++) {
      for (let i = 0; i < numEmployees; i++) {
        if (csvData[i][j] === 'N' && (csvData[i][j+1] === 'M' || csvData[i][j+1] === 'E')) {
          csvData[i][j] = <span style={{color:'red'}}>N</span>
        }
      }
    }
  };

  

  generateRotaCSV();
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Number of employees</label>
          <input
            id="numEmployees"
            type="text"
            value={numEmployees}
            onChange={handleNumEmployees}
          />
        </div>
        <div>
          <label htmlFor="email">Number of days</label>
          <input
            id="numDays"
            type="text"
            value={numDays}
            onChange={handleNumDays}
          />
        </div>
        {/* <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePassword}
        />
      </div> */}
        <button type="submit">Submit</button>
      </form>
      {/* {/* <CSVLink data={csvData}>Download me</CSVLink> */}
      {/* <CSVDownload data={csvData} target="_blank" />  */}
      {csvData.map(row => <div className="employee-row">{row.map(x => <span className="cell">{x}</span>)}</div>)}
    </div>
  );
};

export { RotaForm };
