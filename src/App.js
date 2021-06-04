import './App.css';
import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Papa from 'papaparse';
import Table from './components/Table.jsx';
import getShortState from './functions/getStates.js';
import validations from './functions/validations.js';
import transformPhone from './functions/transformPhone.js';

function App() {
  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Full Name',
      accessor: 'name',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
      Cell: ({ value }) => {
        return transformPhone(value);
      },
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Experience',
      accessor: 'experience',
    },
    {
      Header: 'Yearly Income',
      accessor: 'income',
      Cell: ({ value }) => {
        const parsedValue = parseFloat(value);
        if (!parsedValue) {
          return value || '';
        }
        return parsedValue.toFixed(2);
      },
    },
    {
      Header: 'Has children',
      accessor: 'children',
      Cell: ({ value }) => {
        if (value === '') {
          return 'FALSE';
        }
        return value;
      },
    },
    {
      Header: 'License states',
      accessor: 'states',
      Cell: ({ value }) => {
        return getShortState(value);
      },
    },
    {
      Header: 'Expiration date',
      accessor: 'expiration',
    },
    {
      Header: 'License number',
      accessor: 'number',
    },
    {
      Header: 'Duplicate with',
      accessor: 'duplicate',
    },
  ]);
  const file = useRef(null);
  const [data, setData] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  const handleHeader = header => {
    const headerObj = columns.find(
      el => el.Header.trim().toLowerCase() === header.toLowerCase(),
    );

    return headerObj ? headerObj.accessor : 'error header';
  };

  const handleChange = e => {
    e.preventDefault();
    setErrorFile(null);
    const curFile = file.current.files[0];
    Papa.parse(curFile, {
      header: true,
      transformHeader(h) {
        return handleHeader(h);
      },
      complete(results) {
        const tableData = results.data;
        if (results.errors.length > 0) {
          return setErrorFile('File format is not correct');
        }
        const { fields } = results.meta;
        if (
          !fields.includes('name') ||
          !fields.includes('phone') ||
          !fields.includes('email')
        ) {
          return setErrorFile('File is not correct');
        }
        tableData.forEach((el, i) => {
          el.id = i + 1;
        });
        tableData.map((el, ind) => {
          const duplicate = tableData.find((client, i) => {
            const isEmailDuplicate =
              client.email.trim().toLowerCase() ===
                el.email.trim().toLowerCase() && i !== ind;
            const isPhoneDuplicate =
              transformPhone(client.phone.trim()) ===
                transformPhone(el.phone.trim()) && i !== ind;
            return isEmailDuplicate || isPhoneDuplicate;
          });
          if (duplicate) {
            el.duplicate = duplicate.id;
          }
        });
        setData(tableData);
      },
    });
  };

  return (
    <div className="App">
      <input
        className="File"
        id="file"
        ref={file}
        type="file"
        onChange={handleChange}
      />
      <label className="customFile" htmlFor="file">
        <span className="filename">
          {file && file.current
            ? file.current.files[0].name
            : 'Choose your csv to parse'}
        </span>
        <span className="browseButton">Browse</span>
      </label>

      {errorFile && <p className="error">{errorFile}</p>}
      {data && !errorFile && (
        <Table
          columns={columns}
          data={data}
          getCellProps={cellInfo => {
            console.log(cellInfo.value);
            const value = '' + cellInfo.value;
            if (
              validations[cellInfo.column.id] &&
              !validations[cellInfo.column.id](value.trim(), cellInfo.row.cells)
            ) {
              return {
                style: {
                  backgroundColor: '#f79494',
                },
              };
            }
            return {
              style: {},
            };
          }}
        />
      )}
    </div>
  );
}

export default App;
