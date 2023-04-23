import { request } from './utils/index.js';
import { transformApiData } from './helpers/index.js';
import './lib/DataTable.js';


const $tableContainer = document.querySelector('.table-container');

const rows = [
  {
    dataIndex: 'id',
    value: 'ID',
  },
  {
    dataIndex: 'name',
    value: 'Name',
  },
  {
    dataIndex: 'age',
    value: 'Age',
  },
  {
    dataIndex: 'salary',
    value: 'Salary',
  },
];

let initialData;
let initialRows;

request('https://api.datacite.org/dois?query=created:[2010-01-01%20TO%202012-01-01]&page[number]=1&page[size]=5')
  .then((res) => {
    initialData = transformApiData(res.data);
    initialRows = Object.keys(initialData[0]).map((item) => {
      return {
        dataIndex: item,
        value: item.toUpperCase(),
      };
    });
    $tableContainer.datatable({
      rows: initialRows,
      dataSource: initialData,
      perPage: 5,
      totalPages: 10,
    });
  });

